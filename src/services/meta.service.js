import api from './api';

const normalizeDialCode = (country) => {
  const raw =
    country?.phone_code
    ?? country?.phoneCode
    ?? country?.dial_code
    ?? country?.dialCode
    ?? country?.calling_code
    ?? country?.callingCode
    ?? country?.country_phone_code
    ?? country?.countryPhoneCode
    ?? '';

  const s = String(raw ?? '').trim();
  if (!s) return '';

  const cleaned = s.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    const rest = cleaned.slice(1).replace(/\D/g, '');
    return rest ? `+${rest}` : '';
  }
  const digits = cleaned.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
};

const normalizeFlagUrl = (country) => {
  const raw =
    country?.flag
    ?? country?.flag_url
    ?? country?.flagUrl
    ?? country?.image
    ?? country?.icon
    ?? country?.icon_url
    ?? null;
  if (raw == null || raw === '') return null;
  const s = String(raw).trim();
  return s || null;
};

const extractCountriesArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.countries)) return payload.data.countries;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.countries)) return payload.countries;
  if (Array.isArray(payload?.result)) return payload.result;
  const inner = payload?.data;
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    for (const key of ['countries', 'items', 'records', 'rows']) {
      if (Array.isArray(inner[key])) return inner[key];
    }
  }
  return [];
};

export const getCountries = async () => {
  const res = await api.get('/api/countries');
  const payload = res.data;

  const countries = extractCountriesArray(payload);

  if (!Array.isArray(countries)) {
    return [];
  }

  return countries
    .map((country) => ({
      id: country?.id ?? country?.country_id ?? null,
      name: country?.name || country?.title || country?.country_name || `Country ${country?.id ?? ''}`,
      /** ISO 3166-1 alpha-2 from API (e.g. KW, EG); used for shipping X-Country header */
      code: String(country?.code || country?.iso_code || country?.iso2 || '').trim().toUpperCase() || null,
      dialCode: normalizeDialCode(country),
      flagUrl: normalizeFlagUrl(country),
    }))
    .filter((c) => c.id != null && c.id !== '');
};
