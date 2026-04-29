import api from './api';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value) => Boolean(value);
const toTrimmedString = (value) => String(value ?? '').trim();
const toArray = (value) => (Array.isArray(value) ? value : []);

const extractOrderList = (payload) => {
  const candidates = [
    payload?.data?.orders,
    payload?.data?.items,
    payload?.data?.data,
    payload?.orders,
    payload?.items,
    payload?.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

const normalizeOrder = (order) => {
  const id = order?.id ?? order?.order_id ?? order?.number ?? 'N/A';
  const statusRaw = order?.status ?? order?.order_status ?? 'Processing';
  const totalRaw = order?.total ?? order?.total_amount ?? order?.grand_total ?? 0;
  const createdAt = order?.created_at ?? order?.date ?? new Date().toISOString();
  const itemsCount = Array.isArray(order?.items) ? order.items.length : (order?.items_count ?? order?.qty ?? 0);
  const firstImage = order?.items?.[0]?.product?.image || order?.items?.[0]?.image || '';

  return {
    id: String(id),
    date: createdAt,
    status: statusRaw,
    total: Number(totalRaw) || 0,
    items: Number(itemsCount) || 0,
    image: firstImage,
  };
};

export const getMyOrders = async () => {
  const res = await api.get('/api/orders');
  return extractOrderList(res.data).map(normalizeOrder);
};

export const getOrderById = async ({ orderId } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const res = await api.get(`/api/orders/${encodeURIComponent(normalizedOrderId)}`);
  const orderNode = res.data?.data?.order || res.data?.data || res.data?.order || res.data;
  return normalizeOrder(orderNode);
};

export const getOrderDetails = async ({ orderId } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const res = await api.get(`/api/orders/${encodeURIComponent(normalizedOrderId)}`);
  return res.data?.data?.order || res.data?.data || res.data?.order || null;
};

export const createOrder = async ({
  addressId,
  couponId = null,
  useWallet = false,
  usePoints = false,
  notes = '',
} = {}) => {
  const normalizedAddressId = toTrimmedString(addressId);
  if (!normalizedAddressId) {
    throw new Error('Address id is required.');
  }

  const payload = {
    address_id: toNumber(normalizedAddressId, normalizedAddressId),
    coupon_id: couponId ?? null,
    use_wallet: toBoolean(useWallet),
    use_points: toBoolean(usePoints),
    notes: toTrimmedString(notes),
  };
  try {
    const res = await api.post('/api/orders', payload);
    return res.data;
  } catch (error) {
    if (error?.response?.status !== 422) {
      throw error;
    }

    const fallbackPayload = {
      address_id: Number(normalizedAddressId),
      coupon_id: couponId ?? null,
      use_wallet: toBoolean(useWallet) ? 1 : 0,
      use_points: toBoolean(usePoints) ? 1 : 0,
      notes: toTrimmedString(notes) || null,
    };
    const res = await api.post('/api/orders', fallbackPayload);
    return res.data;
  }
};

export const calculateOrderShipping = async ({ addressId } = {}) => {
  const normalizedAddressId = toTrimmedString(addressId);
  if (!normalizedAddressId) {
    throw new Error('Address id is required.');
  }

  const res = await api.post('/api/orders/calculate-shipping', {
    address_id: toNumber(normalizedAddressId, normalizedAddressId),
  });
  return res.data;
};

export const cancelOrder = async ({ orderId } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const res = await api.post(`/api/orders/${encodeURIComponent(normalizedOrderId)}/cancel`);
  return res.data;
};

export const reorderOrder = async ({ orderId } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const res = await api.post(`/api/orders/${encodeURIComponent(normalizedOrderId)}/reorder`);
  return res.data;
};

export const payOrder = async ({ orderId, paymentMethod = 'sadad' } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const normalizedPaymentMethod = toTrimmedString(paymentMethod) || 'sadad';
  const res = await api.post(`/api/orders/${encodeURIComponent(normalizedOrderId)}/pay`, {
    payment_method: normalizedPaymentMethod,
  });
  return res.data;
};

export const requestOrderRefund = async ({ orderId, reason } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const normalizedReason = toTrimmedString(reason);
  if (!normalizedReason) {
    throw new Error('Refund reason is required.');
  }

  const res = await api.post(`/api/orders/${encodeURIComponent(normalizedOrderId)}/refund-request`, {
    reason: normalizedReason,
  });
  return res.data;
};

export const rateOrder = async ({ orderId, rating, comment = '' } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const normalizedRating = Math.max(1, Math.min(5, toNumber(rating, 5)));
  const res = await api.post(`/api/orders/${encodeURIComponent(normalizedOrderId)}/rate`, {
    rating: normalizedRating,
    comment: toTrimmedString(comment),
  });
  return res.data;
};

export const getRawOrders = async () => {
  const res = await api.get('/api/orders');
  return toArray(extractOrderList(res.data));
};
