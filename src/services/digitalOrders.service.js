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
  const orderItems = toArray(order.items);

  const providerHint = String(
    order?.company_name
    ?? orderItems[0]?.digital_product?.company_name
    ?? orderItems[0]?.digital_product?.merchant?.company_name
    ?? ''
  ).trim().toLowerCase();

  const providerKey = (() => {
    if (deliveredType.includes('eezee') || providerHint.includes('eezee')) return 'eezee';
    if (deliveredType.includes('one_card') || deliveredType.includes('onecard') || providerHint.includes('one_card') || providerHint.includes('onecard')) return 'one_card';
    if (deliveredType.includes('like_card') || deliveredType.includes('likecard') || providerHint.includes('like_card') || providerHint.includes('likecard')) return 'like_card';
    return deliveredType || providerHint || 'unknown';
  })();

  const providerLabel = (() => {
    if (providerKey === 'eezee') return 'Eezee Pay';
    if (providerKey === 'one_card') return 'One Card';
    if (providerKey === 'like_card') return 'Like Card';
    if (providerKey && providerKey !== 'unknown') return providerKey.replace(/_/g, ' ');
    return 'Digital code';
  })();

  const rows = [];

  const pushCandidate = (candidate, fallbackLabel) => {
    if (!candidate || typeof candidate !== 'object') return;
    const serial = pickNonEmptyString(
      candidate.serial,
      candidate.card_serial,
      candidate.voucher_serial,
      candidate.voucher_code,
      candidate.card_number,
      candidate.number,
      candidate.code,
    );
    const pin = pickNonEmptyString(
      candidate.pin,
      candidate.password,
      candidate.secret,
      candidate.activation_code,
      candidate.activationCode,
    );
    if (!serial && !pin) return;

    rows.push({
      providerKey,
      providerLabel,
      label:
        pickNonEmptyString(
          candidate.product_name_en,
          candidate.product_name,
          candidate.product_name_ar,
          candidate.name,
          candidate.title,
          candidate.product_title,
          fallbackLabel,
        ) || 'Digital code',
      serial,
      pin,
      image: pickNonEmptyString(candidate.image, candidate.image_url),
      providerRef: pickNonEmptyString(candidate.provider_ref, candidate.bbTrxRefNumber, candidate.resellerRefNumber),
    });
  };

  // First priority: item-scoped sources (works for One Card + Like Card + Eezee variations).
  orderItems.forEach((item, itemIndex) => {
    if (!item || typeof item !== 'object') return;
    const fallbackLabel =
      pickNonEmptyString(
        item?.digital_product?.name,
        item?.product_name,
        item?.name,
        item?.title,
      ) || `Item ${itemIndex + 1}`;

    toArrayLike(item?.delivered_data ?? item?.deliveredData).forEach((entry) => pushCandidate(entry, fallbackLabel));

    getProviderResponseEntries(item?.provider_response ?? item?.providerResponse).forEach((entry) => {
      const payload = (entry?.data && typeof entry.data === 'object') ? entry.data : entry;
      const nestedItems = toArrayLike(payload?.items);
      if (nestedItems.length) nestedItems.forEach((nested) => pushCandidate(nested, fallbackLabel));
      else pushCandidate(payload, fallbackLabel);
    });
  });

  // Fallback: order-level sources.
  if (!rows.length) {
    toArrayLike(order?.delivered_data ?? order?.deliveredData).forEach((entry, idx) => {
      pushCandidate(entry, `Item ${idx + 1}`);
    });
  }

  if (!rows.length) {
    getProviderResponseEntries(order.provider_response ?? order.providerResponse).forEach((entry, idx) => {
      const payload = (entry?.data && typeof entry.data === 'object') ? entry.data : entry;
      const nestedItems = toArrayLike(payload?.items);
      if (nestedItems.length) nestedItems.forEach((nested) => pushCandidate(nested, `Item ${idx + 1}`));
      else pushCandidate(payload, `Item ${idx + 1}`);
    });
  }

  // One Card can return the same credential in delivered_data and provider_response.
  // Keep unique cards by serial/pin/reference to avoid duplicate UI cards.
  const seen = new Set();
  return rows.filter((row) => {
    const key = [
      String(row?.serial || '').trim(),
      String(row?.pin || '').trim(),
      String(row?.providerRef || '').trim(),
      String(row?.label || '').trim(),
    ].join('|');
    if (!key.replace(/\|/g, '')) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
  const itemPreviews = items
    .map((item, idx) => {
      if (!item || typeof item !== 'object') return null;
      const productNode = item.digital_product ?? item.product ?? {};
      const productId = item.digital_product_id ?? item.product_id ?? productNode?.id ?? null;
      const name = String(
        item.name
        ?? item.title
        ?? item.product_name
        ?? productNode?.name
        ?? productNode?.title
        ?? `Item ${idx + 1}`
      ).trim();
      const image = String(
        item.image
        ?? item.image_url
        ?? productNode?.image
        ?? productNode?.image_url
        ?? ''
      ).trim();
      const quantity = Number(item.quantity ?? item.qty ?? 1) || 1;
      const unitPrice = Number(
        item.price
        ?? item.unit_price
        ?? item.unitPrice
        ?? item.digital_product_price
        ?? item.subtotal
        ?? 0
      ) || 0;
      const subtotal = Number(item.total ?? item.total_price ?? item.subtotal ?? unitPrice * quantity) || 0;
      return {
        id: item.id ?? `${id}-${idx}`,
        productId: productId != null ? String(productId) : '',
        name,
        image,
        quantity,
        unitPrice,
        subtotal,
      };
    })
    .filter(Boolean);

  return {
    id: String(id),
    date: row.created_at ?? row.updated_at ?? row.date ?? new Date().toISOString(),
    status: String(row.status ?? 'pending'),
    paymentStatus: inferPaymentLabel(row),
    total,
    items: items.length,
    itemPreviews,
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
  const returnBase = `${window.location.origin}/payment`;
  const qs = `orderId=${encodeURIComponent(id)}&scope=digital&paymentMethod=${encodeURIComponent(method)}`;
  const successUrl = `${returnBase}/success?${qs}`;
  const failedUrl = `${returnBase}/failed?${qs}`;
  const logicUrl = `${returnBase}/logic?${qs}`;
  const res = await api.post(`/api/digital-orders/${encodeURIComponent(id)}/pay`, {
    payment_method: method,
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

export const launchDigitalOrderPayment = ({ payload, preOpenedTab = null }) => {
  const url = extractDigitalOrderPaymentUrl(payload);
  if (!url) return false;
  return navigateToPaymentGateway(url, preOpenedTab);
};

export { openPaymentGatewayPlaceholderTab };
