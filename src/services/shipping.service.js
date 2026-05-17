import api from './api';

const toArray = (payload) => {
  const data = payload?.data ?? payload;
  return Array.isArray(data) ? data : [];
};

const pickLocalizedName = (nameNode, prefer = 'en') => {
  if (nameNode == null) return '';
  if (typeof nameNode === 'string') return String(nameNode).trim();
  const pref = nameNode[prefer] || nameNode.en || nameNode.ar;
  return pref != null ? String(pref).trim() : '';
};

const normalizeCountryHeader = (countryCode) => {
  const raw = String(countryCode || '').trim();
  if (!raw) return '';
  return raw.length === 2 ? raw.toLowerCase() : raw.toLowerCase();
};

/**
 * @param {string} countryCode ISO2 from /api/countries (any casing)
 * @returns {Promise<Array<{ id: number|string, countryId: string, code: string, name: string }>>}
 */
export const getShippingStates = async (countryCode) => {
  const xCountry = normalizeCountryHeader(countryCode);
  if (!xCountry) return [];

  const res = await api.get('/api/shipping/states', {
    headers: { 'X-Country': xCountry },
  });

  return toArray(res.data).map((row) => ({
    id: row?.id,
    countryId: row?.country_id != null ? String(row.country_id) : '',
    code: row?.code != null ? String(row.code) : '',
    name: pickLocalizedName(row?.name),
  }));
};

/**
 * @param {{ countryCode: string, stateId: number|string }} params
 * @returns {Promise<Array<{ id: number|string, countryId: string, stateId: string, name: string, shippingCost?: string }>>}
 */
export const getShippingCities = async ({ countryCode, stateId }) => {
  const xCountry = normalizeCountryHeader(countryCode);
  const sid = stateId != null && String(stateId).trim() !== '' ? String(stateId).trim() : '';
  if (!xCountry || !sid) return [];

  const res = await api.get('/api/shipping/cities', {
    headers: { 'X-Country': xCountry },
    params: { state_id: sid },
  });

  return toArray(res.data).map((row) => ({
    id: row?.id,
    countryId: row?.country_id != null ? String(row.country_id) : '',
    stateId: row?.state_id != null ? String(row.state_id) : '',
    name: pickLocalizedName(row?.name),
    shippingCost: row?.shipping_cost != null ? String(row.shipping_cost) : undefined,
  }));
};

/**
 * GET /api/shipping/cities/{cityId} — full city row including zone shipping_cost.
 * @param {{ countryCode: string, cityId: number|string }} params
 * @returns {Promise<{ id: number|string, countryId: string, stateId: string, name: string, shippingCost: number } | null>}
 */
export const getShippingCityDetails = async ({ countryCode, cityId }) => {
  const xCountry = normalizeCountryHeader(countryCode);
  const cid = cityId != null && String(cityId).trim() !== '' ? String(cityId).trim() : '';
  if (!xCountry || !cid) return null;

  const res = await api.get(`/api/shipping/cities/${encodeURIComponent(cid)}`, {
    headers: { 'X-Country': xCountry },
  });

  const row = res.data?.data ?? res.data;
  if (!row || typeof row !== 'object') return null;

  const rawCost = row?.shipping_cost ?? row?.shippingCost;
  const shippingCost = Number(rawCost);
  const normalizedCost = Number.isFinite(shippingCost) ? shippingCost : 0;

  return {
    id: row?.id,
    countryId: row?.country_id != null ? String(row.country_id) : '',
    stateId: row?.state_id != null ? String(row.state_id) : '',
    name: pickLocalizedName(row?.name),
    shippingCost: normalizedCost,
  };
};
