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
    return {
    id: backendId ?? item?.uuid ?? `address-${index}`,
    backendId,
    name: item?.name || item?.title || 'Address',
    title: item?.name || item?.title || 'Address',
    phone: toTrimmedString(item?.phone || item?.mobile || item?.phone_number || ''),
    address: item?.address || '',
    latitude: toOptionalCoordinate(item?.latitude ?? item?.lat) ?? null,
    longitude: toOptionalCoordinate(item?.longitude ?? item?.lng) ?? null,
  };
  });
};

export const createAddress = async ({ name, title, phone, address, latitude, longitude }) => {
  const normalizedName = toTrimmedString(name || title) || 'Home';
  const normalizedPhone = toTrimmedString(phone);
  const normalizedAddress = toTrimmedString(address);
  const parsedLatitude = toOptionalCoordinate(latitude);
  const parsedLongitude = toOptionalCoordinate(longitude);

  const payload = {
    name: normalizedName,
    phone: normalizedPhone,
    address: normalizedAddress,
  };

  if (Number.isFinite(parsedLatitude)) {
    payload.latitude = parsedLatitude;
  }
  if (Number.isFinite(parsedLongitude)) {
    payload.longitude = parsedLongitude;
  }

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
    };

    if (Number.isFinite(parsedLatitude)) {
      fallbackPayload.latitude = parsedLatitude;
      fallbackPayload.lat = parsedLatitude;
    }
    if (Number.isFinite(parsedLongitude)) {
      fallbackPayload.longitude = parsedLongitude;
      fallbackPayload.lng = parsedLongitude;
    }

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
