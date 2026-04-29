import api from './api';

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
    name: country?.name || country?.title || `Country ${country?.id}`,
  }));
};
