/** ISO2 for `X-Country` header (e.g. eg, kw). */
export const normalizeCountryHeader = (countryCode) => {
  const raw = String(countryCode || '').trim();
  if (!raw) return '';
  return raw.toLowerCase();
};

export const withCountryHeader = (countryCode, config = {}) => {
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
