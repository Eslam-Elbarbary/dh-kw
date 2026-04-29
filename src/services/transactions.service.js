import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const shouldTryAnotherEndpoint = (error) => {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.message || '').toLowerCase();
  return (
    status === 404
    || status === 405
    || message.includes('not found')
    || message.includes('not supported')
    || message.includes('method not allowed')
    || message.includes('route')
  );
};

const tryRequestsSequentially = async (attempts) => {
  let lastError;
  for (const attempt of attempts) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await attempt();
    } catch (error) {
      lastError = error;
      if (!shouldTryAnotherEndpoint(error)) {
        throw error;
      }
    }
  }
  throw lastError;
};

const normalizeTransaction = (item) => ({
  id: String(item?.id ?? item?.transaction_id ?? item?.reference ?? item?.uuid ?? ''),
  type: String(item?.type ?? item?.transaction_type ?? item?.action ?? 'Transaction'),
  status: String(item?.status ?? item?.state ?? item?.result ?? ''),
  amount: toNumber(item?.amount ?? item?.value ?? item?.points ?? 0),
  balance: toNumber(item?.balance ?? item?.wallet_balance ?? item?.current_balance ?? 0, null),
  description: String(item?.description ?? item?.note ?? item?.title ?? ''),
  createdAt: item?.created_at ?? item?.date ?? item?.createdAt ?? '',
});

const extractList = (payload) => {
  const dataNode = payload?.data;
  const candidates = [
    dataNode?.transactions,
    dataNode?.wallet_history,
    dataNode?.points_history,
    dataNode?.history,
    dataNode?.items,
    dataNode,
    payload?.transactions,
    payload?.wallet_history,
    payload?.points_history,
    payload?.history,
    payload?.items,
    payload,
  ];

  const list = candidates.find((entry) => Array.isArray(entry));
  return toArray(list);
};

export const getWalletHistory = async () => {
  const response = await tryRequestsSequentially([
    () => api.get('/api/wallet/history'),
    () => api.get('/api/wallet-history'),
    () => api.get('/api/wallet/transactions'),
  ]);

  return extractList(response.data).map(normalizeTransaction);
};

export const getPointsHistory = async () => {
  const response = await tryRequestsSequentially([
    () => api.get('/api/points/history'),
    () => api.get('/api/points-history'),
    () => api.get('/api/points/transactions'),
  ]);

  return extractList(response.data).map(normalizeTransaction);
};

