import api from './api';
import { navigateToPaymentGateway, openPaymentGatewayPlaceholderTab } from './orders.service';

const toArray = (value) => (Array.isArray(value) ? value : []);

const toArrayLike = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return [value];
  return [];
};

const parseJsonIfString = (value) => {
  if (value == null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const pickNonEmptyString = (...candidates) => {
  for (const v of candidates) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return null;
};

const normalizeDeliveredType = (order) => {
  if (!order || typeof order !== 'object') return '';
  const delivered =
    parseJsonIfString(order.delivered_data)
    ?? parseJsonIfString(order.deliveredData)
    ?? order.delivered_data
    ?? order.deliveredData;
  const raw =
    delivered?.type
    ?? order?.delivered_type
    ?? order?.deliveredType
    ?? '';
  return String(raw || '').trim().toLowerCase();
};

const getProviderResponseEntries = (value) => {
  const parsed = parseJsonIfString(value) ?? value;
  if (Array.isArray(parsed)) return parsed.filter((item) => item && typeof item === 'object');
  if (parsed && typeof parsed === 'object') return [parsed];
  return [];
};

/**
 * Extract redeemable serials / PINs from GET /api/digital-orders/:id once the provider has fulfilled the order.
 * Shapes differ by card provider; Eezee Pay is implemented per backend (provider_response.data.items[].serial).
 * One Card / Like Card: same helper tries common field names when those providers go live.
 */
export const extractDigitalOrderDeliveryItems = (order) => {
  if (!order || typeof order !== 'object') return [];

  const deliveredType = normalizeDeliveredType(order);
  const providerResponses = [
    ...getProviderResponseEntries(order.provider_response ?? order.providerResponse),
    ...toArray(order.items).flatMap((item) => getProviderResponseEntries(item?.provider_response ?? item?.providerResponse)),
  ];
  if (!providerResponses.length) return [];

  const payloads = providerResponses
    .map((response) => (response?.data && typeof response.data === 'object' ? response.data : response))
    .filter((data) => data && typeof data === 'object');

  const looksLikeEezeePayload = payloads.some(
    (data) => toArrayLike(data.items).some((it) => it && typeof it === 'object' && 'product_name_en' in it),
  );

  const isEezee =
    deliveredType === 'eezee'
    || deliveredType.includes('eezee')
    || (!deliveredType && looksLikeEezeePayload);

  const isOneCard =
    deliveredType === 'one_card'
    || deliveredType === 'onecard'
    || deliveredType.includes('one_card')
    || deliveredType.includes('onecard');

  const isLikeCard =
    deliveredType === 'like_card'
    || deliveredType === 'likecard'
    || deliveredType.includes('like_card')
    || deliveredType.includes('likecard');

  const providerLabel = (() => {
    if (isEezee) return 'Eezee Pay';
    if (isOneCard) return 'One Card';
    if (isLikeCard) return 'Like Card';
    if (deliveredType) return deliveredType.replace(/_/g, ' ');
    return 'Digital code';
  })();

  if (!isEezee && !isOneCard && !isLikeCard) return [];

  return payloads
    .flatMap((data) => toArrayLike(data.items))
    .map((it, idx) => {
      if (!it || typeof it !== 'object') return null;
      const label =
        pickNonEmptyString(
          it.product_name_en,
          it.product_name,
          it.product_name_ar,
          it.name,
          it.title,
          it.product_title,
        ) || `Item ${idx + 1}`;
      const serial = pickNonEmptyString(
        it.serial,
        it.card_serial,
        it.voucher_serial,
        it.voucher_code,
        it.card_number,
        it.number,
        it.code,
      );
      const pin = pickNonEmptyString(
        it.pin,
        it.password,
        it.secret,
        it.activation_code,
        it.activationCode,
      );
      if (!serial && !pin) return null;
      return {
        providerKey: deliveredType || 'unknown',
        providerLabel,
        label,
        serial,
        pin,
      };
    })
    .filter(Boolean);
};

const extractDigitalOrderList = (payload) => {
  const p = payload && typeof payload === 'object' ? payload : {};
  const root = p.data;
  const candidates = [
    root?.data,
    root?.orders,
    root?.digital_orders,
    root?.items,
    Array.isArray(root) ? root : null,
    p.orders,
    p.digital_orders,
    p.data,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
};

const inferPaymentLabel = (row) => {
  const direct = row?.payment_status ?? row?.paymentStatus ?? '';
  const s = String(direct || '').trim();
  if (s) return s;
  if (row?.is_paid === true || row?.paid === true) return 'Paid';
  if (row?.is_paid === false || row?.paid === false) return 'Unpaid';
  return '';
};

/**
 * Normalized row for list cards (GET /api/digital-orders).
 */
export const normalizeDigitalOrderListItem = (row) => {
  if (!row || typeof row !== 'object') return null;
  const id = row.id ?? row.digital_order_id;
  if (id == null || id === '') return null;
  const items = toArray(row.items);
  const total =
    Number(row.total_cost ?? row.total ?? row.grand_total ?? 0) || 0;
  return {
    id: String(id),
    date: row.created_at ?? row.updated_at ?? row.date ?? new Date().toISOString(),
    status: String(row.status ?? 'pending'),
    paymentStatus: inferPaymentLabel(row),
    total,
    items: items.length,
    notes: String(row.notes ?? '').trim(),
  };
};

export const getMyDigitalOrders = async () => {
  const res = await api.get('/api/digital-orders', {
    retryOnTooManyRequests: true,
    maxRetries: 2,
  });
  const list = extractDigitalOrderList(res.data);
  return list.map(normalizeDigitalOrderListItem).filter(Boolean);
};

/**
 * Full order payload from GET /api/digital-orders/:id (shape may include user_*, items[], totals).
 */
export const getDigitalOrderById = async ({ orderId } = {}) => {
  const id = String(orderId ?? '').trim();
  if (!id) throw new Error('Digital order id is required.');
  const res = await api.get(`/api/digital-orders/${encodeURIComponent(id)}`, {
    retryOnTooManyRequests: true,
    maxRetries: 2,
  });
  const payload = res.data;
  return payload?.data ?? payload ?? null;
};

/** Gateway checkout URL from POST /api/digital-orders/:id/pay */
export const extractDigitalOrderPaymentUrl = (payload) => {
  if (!payload || typeof payload !== 'object') return '';
  const url =
    payload.payment_url
    ?? payload.paymentUrl
    ?? payload.payment_link
    ?? payload.paymentLink
    ?? payload.data?.payment_url
    ?? payload.data?.paymentUrl
    ?? payload.data?.payment_link
    ?? payload.data?.paymentLink;
  const s = url != null ? String(url).trim() : '';
  return /^https?:\/\//i.test(s) ? s : '';
};

export const payDigitalOrder = async ({ orderId, paymentMethod = 'sadad' } = {}) => {
  const id = String(orderId ?? '').trim();
  if (!id) throw new Error('Digital order id is required.');
  const method = String(paymentMethod || '').trim() || 'sadad';
  const res = await api.post(`/api/digital-orders/${encodeURIComponent(id)}/pay`, {
    payment_method: method,
  });
  return res.data;
};

export const launchDigitalOrderPayment = ({ payload, preOpenedTab = null }) => {
  const url = extractDigitalOrderPaymentUrl(payload);
  if (!url) return false;
  return navigateToPaymentGateway(url, preOpenedTab);
};

export { openPaymentGatewayPlaceholderTab };
