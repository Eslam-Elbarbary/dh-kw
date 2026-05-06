import api from './api';

const PAYMENT_RETURN_NOTIFY_ENDPOINT =
  import.meta.env.VITE_PAYMENT_RETURN_NOTIFY_ENDPOINT || '/api/payments/notify-return';

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

const inferPaymentStatusLabel = (order) => {
  const direct = order?.payment_status
    ?? order?.paymentStatus
    ?? order?.payment_state
    ?? order?.paymentState
    ?? '';
  const trimmed = toTrimmedString(direct);
  if (trimmed) return trimmed;

  const paidFlag = order?.is_paid ?? order?.paid;
  if (paidFlag === true) return 'Paid';
  if (paidFlag === false) return 'Unpaid';

  const paidAt = order?.paid_at ?? order?.paidAt;
  if (paidAt) return 'Paid';

  return '';
};

const normalizeOrder = (order) => {
  const id =
    order?.id
    ?? order?.order_id
    ?? order?.order?.id
    ?? order?.order?.order_id
    ?? order?.number
    ?? order?.order_number
    ?? 'N/A';
  const statusRaw = order?.status ?? order?.order_status ?? 'Processing';
  const totalRaw = order?.total ?? order?.total_amount ?? order?.grand_total ?? 0;
  const createdAt = order?.created_at ?? order?.date ?? new Date().toISOString();
  const rawItems = Array.isArray(order?.items) ? order.items : [];
  const itemsCount = Number(
    order?.items_count
    ?? order?.itemsCount
    ?? order?.order_items_count
    ?? order?.orderItemsCount
    ?? order?.total_items
    ?? order?.totalItems
    ?? order?.total_quantity
    ?? order?.totalQuantity
    ?? order?.quantity
    ?? order?.products_count
    ?? order?.productsCount
    ?? (rawItems.length > 0 ? rawItems.length : 0)
    ?? order?.qty
    ?? 0
  ) || 0;
  const firstImage = order?.items?.[0]?.product?.image || order?.items?.[0]?.image || '';

  return {
    id: String(id),
    date: createdAt,
    status: statusRaw,
    total: Number(totalRaw) || 0,
    items: Number(itemsCount) || 0,
    image: firstImage,
    paymentStatus: inferPaymentStatusLabel(order),
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

/** Gateway checkout URL from POST /api/orders/:id/pay (Sadad, Tabby, etc.) */
export const extractOrderPaymentUrl = (payload) => {
  if (!payload || typeof payload !== 'object') return '';
  const url =
    payload.payment_url
    ?? payload.paymentUrl
    ?? payload.data?.payment_url
    ?? payload.data?.paymentUrl;
  const s = url != null ? String(url).trim() : '';
  return /^https?:\/\//i.test(s) ? s : '';
};

/**
 * Call synchronously from a click handler before `await payOrder` so popup blockers allow the new tab.
 * Do not pass `noopener` here: many browsers return `null` but still open `about:blank`, so we lose the
 * handle, the blank tab stays empty, and the fallback navigates the *current* tab instead.
 */
export const openPaymentGatewayPlaceholderTab = () => {
  try {
    return window.open('about:blank', '_blank');
  } catch {
    return null;
  }
};

/** Open gateway URL in a new tab; uses `preOpenedTab` when provided (see openPaymentGatewayPlaceholderTab). */
export const navigateToPaymentGateway = (paymentUrl, preOpenedTab = null) => {
  const url = String(paymentUrl || '').trim();
  if (!/^https?:\/\//i.test(url)) return false;

  if (preOpenedTab && !preOpenedTab.closed) {
    try {
      preOpenedTab.location.href = url;
      return true;
    } catch {
      // Cross-window restrictions; fall through to window.open / same-tab fallback.
    }
  }

  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (!opened) {
    window.location.assign(url);
  }
  return true;
};

export const payOrder = async ({ orderId, paymentMethod = 'sadad' } = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  if (!normalizedOrderId) {
    throw new Error('Order id is required.');
  }

  const normalizedPaymentMethod = toTrimmedString(paymentMethod) || 'sadad';
  const returnBase = `${window.location.origin}/payment`;
  const qs = `orderId=${encodeURIComponent(normalizedOrderId)}&scope=store&paymentMethod=${encodeURIComponent(normalizedPaymentMethod)}`;
  const successUrl = `${returnBase}/success?${qs}`;
  const failedUrl = `${returnBase}/failed?${qs}`;
  const logicUrl = `${returnBase}/logic?${qs}`;

  const res = await api.post(`/api/orders/${encodeURIComponent(normalizedOrderId)}/pay`, {
    payment_method: normalizedPaymentMethod,
    success_url: successUrl,
    failed_url: failedUrl,
    return_url: logicUrl,
    callback_url: logicUrl,
    successUrl,
    failedUrl,
    returnUrl: logicUrl,
    callbackUrl: logicUrl,
  });
  return res.data;
};

export const notifyPaymentReturnUrl = async ({
  orderId,
  status = '',
  paymentMethod = '',
  returnUrl = '',
  params = {},
} = {}) => {
  const normalizedOrderId = toTrimmedString(orderId);
  const normalizedStatus = toTrimmedString(status);
  const normalizedMethod = toTrimmedString(paymentMethod);
  const normalizedReturnUrl = toTrimmedString(returnUrl);

  if (!normalizedReturnUrl) {
    throw new Error('Return url is required.');
  }

  const payload = {
    order_id: normalizedOrderId || null,
    status: normalizedStatus || null,
    payment_method: normalizedMethod || null,
    return_url: normalizedReturnUrl,
    params,
  };

  const res = await api.post(PAYMENT_RETURN_NOTIFY_ENDPOINT, payload);
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

const normalizeOrderStatusForUi = (order) =>
  String(order?.status ?? order?.order_status ?? '').trim().toLowerCase();

const normalizePaymentStatusForUi = (order) =>
  String(order?.payment_status ?? order?.paymentStatus ?? '').trim().toLowerCase();

/** Payment captured/successful; excludes refunded strings that still contain "paid". */
export const isPaidOrderByApiFields = (order) => {
  if (!order || typeof order !== 'object') return false;
  const p = normalizePaymentStatusForUi(order);
  if (p.includes('refund')) return false;
  if (order.is_paid === true || order.paid === true) return true;
  if (order.paid_at || order.paidAt) return true;
  if (!p) return false;
  if (p.includes('unpaid') || p.includes('not paid') || p.includes('fail') || p.includes('declin')) return false;
  if (p.includes('paid')) return true;
  if (p.includes('success')) return true;
  if (p.includes('captur') || p.includes('settl')) return true;
  if (p.includes('complete') && (p.includes('pay') || p === 'completed')) return true;
  return false;
};

/**
 * Whether to show rating UI: delivered-style status, or paid (even when fulfillment status is still "pending").
 */
export const isOrderRateable = (order) => {
  if (!order || typeof order !== 'object') return false;
  const s = normalizeOrderStatusForUi(order);
  const p = normalizePaymentStatusForUi(order);
  if (s.includes('cancel')) return false;
  if (p.includes('refund') || s.includes('refund')) return false;
  if (isPaidOrderByApiFields(order)) return true;
  if (!s) return false;
  return (
    s.includes('deliver')
    || s.includes('completed')
    || s === 'complete'
    || s.includes('received')
  );
};

export const getRawOrders = async () => {
  const res = await api.get('/api/orders');
  return toArray(extractOrderList(res.data));
};
