import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);
const toTrimmedString = (value) => String(value ?? '').trim();
const toOptionalCoordinate = (value) => {
  const raw = toTrimmedString(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
};

/** Capital-area defaults when the user has no map pin (DB requires lat/lng). */
const COUNTRY_DEFAULT_COORDINATES = {
  EG: { latitude: 30.0444, longitude: 31.2357 },
  KW: { latitude: 29.3759, longitude: 47.9774 },
  AE: { latitude: 25.2048, longitude: 55.2708 },
  SA: { latitude: 24.7136, longitude: 46.6753 },
};

const FALLBACK_COORDINATES = { latitude: 29.3759, longitude: 47.9774 };

export const resolveAddressCoordinates = ({ latitude, longitude, countryCode } = {}) => {
  const lat = toOptionalCoordinate(latitude);
  const lng = toOptionalCoordinate(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { latitude: lat, longitude: lng };
  }
  const code = String(countryCode || '').trim().toUpperCase();
  return { ...(COUNTRY_DEFAULT_COORDINATES[code] || FALLBACK_COORDINATES) };
};
/** Parse stored address line: `[Label] street | Governorate: X | Area: Y` */
export const parseSavedAddressLine = (raw) => {
  const s = String(raw || '').trim();
  const labelMatch = s.match(/^\[([^\]]+)\]\s*/);
  const nameFromBracket = labelMatch?.[1]?.trim() || '';
  const withoutLabel = labelMatch ? s.slice(labelMatch[0].length) : s;
  const segments = withoutLabel.split('|').map((part) => part.trim());
  let governorate = '';
  let area = '';
  for (let i = 1; i < segments.length; i += 1) {
    const seg = segments[i];
    if (/^Governorate:/i.test(seg)) {
      governorate = seg.replace(/^Governorate:\s*/i, '').trim();
    } else if (/^Area:/i.test(seg)) {
      area = seg.replace(/^Area:\s*/i, '').trim();
    }
  }
  const street = sanitizeStreetForForm(segments[0] || withoutLabel, governorate, area);
  return { nameFromBracket, street, governorate, area };
};

/** Keep only the street/building line — drop region/country text often pasted into legacy rows. */
export const sanitizeStreetForForm = (street, governorate = '', area = '') => {
  let line = String(street || '').trim();
  if (!line) return '';
  line = line.split('|')[0].trim();

  const chunks = line.split(',').map((chunk) => chunk.trim()).filter(Boolean);
  if (chunks.length <= 1) return line;

  const gov = String(governorate || '').trim().toLowerCase();
  const city = String(area || '').trim().toLowerCase();
  const filtered = chunks.filter((chunk) => {
    const lower = chunk.toLowerCase();
    if (gov && (lower === gov || lower.endsWith(gov) || lower.includes(`governorate: ${gov}`))) {
      return false;
    }
    if (city && (lower === city || lower.endsWith(city))) return false;
    if (/governorate$/i.test(lower)) return false;
    if (/^(kuwait|egypt|uae|saudi arabia|saudi)$/i.test(lower)) return false;
    return true;
  });

  return filtered.length > 0 ? filtered.join(', ') : chunks[0];
};

export const formatAddressPreview = ({ label, phone, street, stateName, cityName, countryName }) => {
  const lines = [];
  const title = String(label || 'Address').trim();
  if (title) lines.push(title);
  if (phone) lines.push(phone);
  const streetLine = String(street || '').trim();
  if (streetLine) lines.push(streetLine);
  const region = [stateName, cityName, countryName].filter(Boolean).join(', ');
  if (region) lines.push(region);
  return lines;
};

export const buildSavedAddressLine = ({ name, street, stateName, cityName }) => {
  const typeLabel = String(name || 'Home').trim() || 'Home';
  const streetLine = String(street || '').trim();
  if (!streetLine) return '';
  const regionParts = [];
  if (stateName) regionParts.push(`Governorate: ${stateName}`);
  if (cityName) regionParts.push(`Area: ${cityName}`);
  const regionSuffix = regionParts.length ? ` | ${regionParts.join(' | ')}` : '';
  return `[${typeLabel}] ${streetLine}${regionSuffix}`;
};

const extractAddressList = (payload) => {
  const candidates = [
    payload?.data?.addresses,
    payload?.data?.data,
    payload?.data?.items,
    payload?.addresses,
    payload?.items,
    payload?.data,
    payload,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }
  return [];
};

export const getAddresses = async () => {
  const res = await api.get('/api/addresses');
  const payload = res.data;
  const list = extractAddressList(payload);
  return toArray(list).map((item, index) => {
    const backendId = item?.id ?? item?.address_id ?? null;
    const rawAddress = item?.address || '';
    const parsed = parseSavedAddressLine(rawAddress);
    return {
      id: backendId ?? item?.uuid ?? `address-${index}`,
      backendId,
      name: item?.name || item?.title || parsed.nameFromBracket || 'Address',
      title: item?.name || item?.title || parsed.nameFromBracket || 'Address',
      phone: toTrimmedString(item?.phone || item?.mobile || item?.phone_number || ''),
      address: rawAddress,
      street: parsed.street,
      governorateLabel: parsed.governorate,
      areaLabel: parsed.area,
      latitude: toOptionalCoordinate(item?.latitude ?? item?.lat) ?? null,
      longitude: toOptionalCoordinate(item?.longitude ?? item?.lng) ?? null,
    };
  });
};

export const createAddress = async ({
  name,
  title,
  phone,
  address,
  latitude,
  longitude,
  countryCode,
} = {}) => {
  const normalizedName = toTrimmedString(name || title) || 'Home';
  const normalizedPhone = toTrimmedString(phone);
  const normalizedAddress = toTrimmedString(address);
  const { latitude: resolvedLatitude, longitude: resolvedLongitude } = resolveAddressCoordinates({
    latitude,
    longitude,
    countryCode,
  });

  const payload = {
    name: normalizedName,
    phone: normalizedPhone,
    address: normalizedAddress,
    latitude: resolvedLatitude,
    longitude: resolvedLongitude,
  };

  try {
    const res = await api.post('/api/addresses', payload, {
      retryOnTooManyRequests: true,
      maxRetries: 2,
    });
    return res.data;
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 422) {
      throw error;
    }

    // Backend compatibility fallback:
    // some API deployments validate different key names for the same endpoint.
    const fallbackPayload = {
      name: normalizedName,
      title: normalizedName,
      phone: normalizedPhone,
      mobile: normalizedPhone,
      phone_number: normalizedPhone,
      address: normalizedAddress,
      latitude: resolvedLatitude,
      longitude: resolvedLongitude,
      lat: resolvedLatitude,
      lng: resolvedLongitude,
    };

    const fallbackRes = await api.post('/api/addresses', fallbackPayload, {
      retryOnTooManyRequests: true,
      maxRetries: 2,
    });
    return fallbackRes.data;
  }
};

export const deleteAddress = async ({ addressId }) => {
  const res = await api.delete(`/api/addresses/${addressId}`);
  return res.data;
};
