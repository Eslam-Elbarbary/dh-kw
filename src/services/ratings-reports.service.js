import api from './api';

const toNumber = (value, fallback = 5) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const rateProduct = async ({ productId, rating, comment }) => {
  if (!productId) throw new Error('Product id is required.');
  const normalizedRating = Math.max(1, Math.min(5, toNumber(rating, 5)));
  const payload = {
    rating: normalizedRating,
    comment: String(comment || '').trim(),
  };
  const res = await api.post(`/api/products/${productId}/rate`, payload);
  return res.data;
};

export const rateVendor = async ({ vendorId, rating, comment }) => {
  if (!vendorId) throw new Error('Vendor id is required.');
  const normalizedRating = Math.max(1, Math.min(5, toNumber(rating, 5)));
  const payload = {
    rating: normalizedRating,
    comment: String(comment || '').trim(),
  };
  const res = await api.post(`/api/vendors/${vendorId}/rate`, payload);
  return res.data;
};

export const reportProduct = async ({ productId, reason }) => {
  if (!productId) throw new Error('Product id is required.');
  const payload = {
    reason: String(reason || '').trim(),
  };
  const res = await api.post(`/api/products/${productId}/report`, payload);
  return res.data;
};

export const reportVendor = async ({ vendorId, reason }) => {
  if (!vendorId) throw new Error('Vendor id is required.');
  const payload = {
    reason: String(reason || '').trim(),
  };
  const res = await api.post(`/api/vendors/${vendorId}/report`, payload);
  return res.data;
};

