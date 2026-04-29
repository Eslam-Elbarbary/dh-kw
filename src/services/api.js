import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let isRedirectingToSignIn = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set multipart boundaries for FormData requests.
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(  
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const message = String(error.response?.data?.message || '').toLowerCase();
    const isTooManyAttempts = status === 429 || message.includes('too many attempts');
    const method = String(originalRequest.method || 'get').toLowerCase();

    const retryOnTooManyRequests = method === 'get' || Boolean(originalRequest.retryOnTooManyRequests);
    const maxRetries = Number(originalRequest.maxRetries ?? 2);

    // Retry GET by default, and allow explicit opt-in for non-GET requests.
    if (isTooManyAttempts && retryOnTooManyRequests) {
      originalRequest.__retryCount = originalRequest.__retryCount || 0;
      if (originalRequest.__retryCount < maxRetries) {
        originalRequest.__retryCount += 1;
        const retryAfterHeader = Number(error.response?.headers?.['retry-after'] || 0);
        const retryAfterMs = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
          ? retryAfterHeader * 1000
          : 0;
        const retryDelayMs = retryAfterMs || (2000 * originalRequest.__retryCount); // 2s, 4s, 6s
        await sleep(retryDelayMs);
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      const currentPath = window.location?.pathname || '';
      if (!isRedirectingToSignIn && currentPath !== '/sign-in') {
        isRedirectingToSignIn = true;
        window.location.assign('/sign-in');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
