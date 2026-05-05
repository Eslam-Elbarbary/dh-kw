import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);

const resolveNotificationCategory = (rawType = '', meta = {}) => {
  const loweredType = String(rawType || '').toLowerCase();
  const title = String(meta?.title || '').toLowerCase();
  const message = String(meta?.message || '').toLowerCase();

  if (loweredType.includes('order') || title.includes('order') || message.includes('order')) {
    return 'order';
  }
  if (
    loweredType.includes('promo')
    || loweredType.includes('offer')
    || title.includes('offer')
    || title.includes('discount')
  ) {
    return 'promotion';
  }
  if (loweredType.includes('account') || title.includes('account') || message.includes('profile')) {
    return 'account';
  }
  return 'general';
};

const normalizeNotification = (item) => {
  const meta = item?.data || {};
  const id = item?.id || item?.uuid || null;
  const category = resolveNotificationCategory(item?.type, meta);
  const orderId = meta?.order_id ?? meta?.orderId;

  return {
    id,
    type: category,
    rawType: item?.type || '',
    title: meta?.title || 'Notification',
    message: meta?.message || '',
    status: meta?.status || '',
    orderId: orderId ?? null,
    readAt: item?.read_at || null,
    createdAt: item?.created_at || null,
    read: Boolean(item?.read_at),
    link: orderId ? `/track-order?orderId=${orderId}` : '/notifications',
  };
};

export const getNotifications = async () => {
  const res = await api.get('/api/notifications');
  const payload = res.data;
  const list = payload?.data?.notifications || payload?.data || payload?.notifications || [];
  return toArray(list).map(normalizeNotification);
};

export const markNotificationAsRead = async ({ notificationId }) => {
  if (!notificationId) throw new Error('Missing notification id.');
  const res = await api.post(`/api/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.post('/api/notifications/read-all');
  return res.data;
};

