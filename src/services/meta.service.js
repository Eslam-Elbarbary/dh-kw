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

export const getCountries = async () => {
  const res = await api.get('/api/countries');
  const payload = res.data;

  const countries = payload?.data?.countries
    || payload?.data
    || payload?.countries
    || [];

  if (!Array.isArray(countries)) {
    return [];
  }

  return countries.map((country) => ({
    id: country?.id,
    name: country?.name || country?.title || country?.country_name || `Country ${country?.id}`,
    dialCode: normalizeDialCode(country),
    flagUrl: normalizeFlagUrl(country),
  }));
};
