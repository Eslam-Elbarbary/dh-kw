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

export const formatAddressPreview = ({
  label,
  phone,
  town,
  street,
  flatNum,
  stateName,
  cityName,
  countryName,
  fullAddress,
}) => {
  const lines = [];
  const title = String(label || 'Address').trim();
  if (title) lines.push(title);
  if (phone) lines.push(phone);
  const regionLine = [stateName, cityName || town, countryName].filter(Boolean).join(', ');
  const streetLine = String(street || '').trim();
  const flatLine = String(flatNum || '').trim();
  if (streetLine) {
    lines.push(flatLine ? `${streetLine} (Flat ${flatLine})` : streetLine);
  } else if (flatLine) {
    lines.push(`Flat ${flatLine}`);
  }
  if (regionLine) lines.push(regionLine);
  const summary = String(fullAddress || '').trim();
  if (summary && !lines.length) lines.push(summary);
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

const appendFormField = (form, key, value) => {
  const raw = value == null ? '' : String(value).trim();
  if (!raw) return;
  form.append(key, raw);
};

/** ISO2 for `X-Country` header (e.g. eg, kw) — required by /api/addresses. */
export const normalizeCountryHeader = (countryCode) => {
  const raw = String(countryCode || '').trim();
  if (!raw) return '';
  return raw.length === 2 ? raw.toLowerCase() : raw.toLowerCase();
};

const withCountryHeader = (countryCode, config = {}) => {
  const xCountry = normalizeCountryHeader(countryCode);
  if (!xCountry) return config;
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      'X-Country': xCountry,
    },
  };
};

/** POST /api/addresses — multipart form-data per backend contract. */
export const buildAddressFormData = ({
  name,
  title,
  phone,
  stateId,
  cityId,
  town,
  street,
  flatNum,
  address,
  latitude,
  longitude,
  countryCode,
} = {}) => {
  const normalizedName = toTrimmedString(name || title).toLowerCase() || 'home';
  const normalizedPhone = toTrimmedString(phone);
  const normalizedStreet = toTrimmedString(street);
  const normalizedTown = toTrimmedString(town);
  const normalizedFlat = toTrimmedString(flatNum);
  const normalizedAddress = toTrimmedString(address)
    || buildSavedAddressLine({
      name: normalizedName,
      street: normalizedStreet,
      stateName: '',
      cityName: normalizedTown,
    })
    || normalizedStreet;
  const { latitude: resolvedLatitude, longitude: resolvedLongitude } = resolveAddressCoordinates({
    latitude,
    longitude,
    countryCode,
  });

  const form = new FormData();
  form.append('name', normalizedName);
  form.append('phone', normalizedPhone);
  appendFormField(form, 'state_id', stateId);
  appendFormField(form, 'city_id', cityId);
  appendFormField(form, 'town', normalizedTown);
  appendFormField(form, 'street', normalizedStreet);
  appendFormField(form, 'flat_num', normalizedFlat);
  form.append('address', normalizedAddress);
  form.append('latitude', String(resolvedLatitude));
  form.append('longitude', String(resolvedLongitude));
  return form;
};

export const getAddresses = async ({ countryCode } = {}) => {
  const res = await api.get('/api/addresses', withCountryHeader(countryCode));
  const payload = res.data;
  const list = extractAddressList(payload);
  return toArray(list).map((item, index) => {
    const backendId = item?.id ?? item?.address_id ?? null;
    const rawAddress = item?.address || '';
    const parsed = parseSavedAddressLine(rawAddress);
    const stateName = toTrimmedString(
      item?.state?.name || item?.governorate?.name || item?.state_name || parsed.governorate,
    );
    const cityName = toTrimmedString(
      item?.city?.name || item?.town || item?.city_name || parsed.area,
    );
    return {
      id: backendId ?? item?.uuid ?? `address-${index}`,
      backendId,
      name: item?.name || item?.title || parsed.nameFromBracket || 'Address',
      title: item?.name || item?.title || parsed.nameFromBracket || 'Address',
      phone: toTrimmedString(item?.phone || item?.mobile || item?.phone_number || ''),
      address: rawAddress,
      street: toTrimmedString(item?.street) || parsed.street,
      town: toTrimmedString(item?.town) || cityName,
      flatNum: toTrimmedString(item?.flat_num ?? item?.flatNum ?? ''),
      stateId: item?.state_id != null ? String(item.state_id) : '',
      cityId: item?.city_id != null ? String(item.city_id) : '',
      governorateLabel: stateName,
      areaLabel: cityName,
      latitude: toOptionalCoordinate(item?.latitude ?? item?.lat) ?? null,
      longitude: toOptionalCoordinate(item?.longitude ?? item?.lng) ?? null,
    };
  });
};

export const createAddress = async (params = {}) => {
  const { countryCode, ...rest } = params;
  const form = buildAddressFormData({ ...rest, countryCode });
  const res = await api.post(
    '/api/addresses',
    form,
    withCountryHeader(countryCode, {
      retryOnTooManyRequests: true,
      maxRetries: 2,
    }),
  );
  return res.data;
};

export const deleteAddress = async ({ addressId, countryCode }) => {
  const res = await api.delete(
    `/api/addresses/${addressId}`,
    withCountryHeader(countryCode),
  );
  return res.data;
};
