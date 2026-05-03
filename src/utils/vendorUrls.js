const base = String(import.meta.env.VITE_API_BASE_URL || 'https://dh.backendpro.site').replace(/\/$/, '');

/** External vendor signup (Laravel app), not an in-app route. */
export const VENDOR_REGISTER_URL = `${base}/vendor/register`;
