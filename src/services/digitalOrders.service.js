import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);

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
