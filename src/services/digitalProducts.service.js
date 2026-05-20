import api from './api';
import { resolveCountryId } from './catalog.service';

const toArray = (value) => (Array.isArray(value) ? value : []);

const pickNum = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Supports Laravel paginator shapes:
 * - { data: [...] }
 * - { data: { data: [...], current_page, last_page, total, ... } }
 * - { data: [...], meta: { current_page, last_page, total, ... } }
 * - next_page_url / prev_page_url for navigation when last_page is missing
 */
const extractDigitalListAndMeta = (payload, page, perPage) => {
  const p = payload && typeof payload === 'object' ? payload : {};
  const root = p.data;

  const topMeta = p.meta && typeof p.meta === 'object' ? p.meta : null;

  let list = [];
  let pageRoot = null;

  if (Array.isArray(root)) {
    list = root;
    pageRoot = null;
  } else if (root && typeof root === 'object') {
    pageRoot = root;
    list = toArray(
      root.data
        ?? root.digital_products
        ?? root.products
        ?? root.items,
    );
  } else {
    list = [];
    pageRoot = null;
  }

  const paginationSibling =
    (p.pagination && typeof p.pagination === 'object' ? p.pagination : null)
    ?? (pageRoot?.pagination && typeof pageRoot.pagination === 'object' ? pageRoot.pagination : null);

  const metaBlock = topMeta
    ?? (pageRoot && pageRoot.meta && typeof pageRoot.meta === 'object' ? pageRoot.meta : null)
    ?? paginationSibling;

  const currentPage = pickNum(
    metaBlock?.current_page
      ?? metaBlock?.currentPage
      ?? pageRoot?.current_page
      ?? p.current_page
      ?? p.currentPage
      ?? pickNum(paginationSibling?.page, NaN),
    page,
  );

  let total = pickNum(
    metaBlock?.total
      ?? pageRoot?.total
      ?? p.total,
    NaN,
  );
  if (!Number.isFinite(total)) {
    total = list.length;
  }

  let resolvedPerPage = pickNum(
    metaBlock?.per_page
      ?? metaBlock?.perPage
      ?? pageRoot?.per_page
      ?? pickNum(paginationSibling?.per_page ?? paginationSibling?.limit, NaN),
    perPage,
  );
  if (!resolvedPerPage || resolvedPerPage < 1) resolvedPerPage = perPage;

  let lastPage = pickNum(
    metaBlock?.last_page
      ?? metaBlock?.lastPage
      ?? pageRoot?.last_page
      ?? pickNum(
        paginationSibling?.last_page
          ?? paginationSibling?.lastPage
          ?? paginationSibling?.total_pages
          ?? paginationSibling?.pages,
        NaN,
      ),
    NaN,
  );

  if (!Number.isFinite(lastPage) && Number.isFinite(total) && total > 0 && resolvedPerPage > 0) {
    lastPage = Math.max(1, Math.ceil(total / resolvedPerPage));
  }
  if (!Number.isFinite(lastPage) || lastPage < 1) {
    lastPage = 1;
  }

  const nextUrl = metaBlock?.next_page_url
    ?? pageRoot?.next_page_url
    ?? p.next_page_url
    ?? p.links?.next;
  const prevUrl = metaBlock?.prev_page_url
    ?? pageRoot?.prev_page_url
    ?? p.prev_page_url
    ?? p.links?.prev;

  const hasNextPage = nextUrl != null && String(nextUrl).length > 0 && String(nextUrl) !== 'null';
  const hasPrevPage = prevUrl != null && String(prevUrl).length > 0 && String(prevUrl) !== 'null';

  if (lastPage <= 1 && hasNextPage) {
    lastPage = Math.max(lastPage, currentPage + 1);
  }

  return {
    list,
    meta: {
      currentPage,
      lastPage,
      perPage: resolvedPerPage,
      total,
      hasNextPage,
      hasPrevPage,
    },
  };
};

export const normalizeDigitalProduct = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return {
      id: null,
      productId: null,
      name: 'Digital product',
      slug: '',
      description: '',
      howToUse: '',
      image: '',
      price: 0,
      priceFormatted: '—',
      currency: '',
      isActive: true,
      isAvailable: true,
      companyName: '',
      merchantName: '',
      merchant: null,
    };
  }

  const price = Number(raw.price ?? raw.cost_after_vat ?? raw.sale_price ?? 0) || 0;

  return {
    id: raw.id ?? raw.digital_product_id ?? null,
    productId: raw.product_id != null ? String(raw.product_id) : null,
    name: raw.name || raw.title || 'Digital product',
    slug: raw.slug || '',
    description: raw.description || '',
    howToUse: raw.how_to_use || '',
    image: raw.image || raw.thumb_image || '',
    price,
    priceFormatted: price > 0 ? `$${price.toFixed(2)}` : '—',
    currency: raw.currency || '',
    isActive: Boolean(raw.is_active ?? true),
    isAvailable: Boolean(raw.is_available ?? true),
    companyName: raw.company_name || raw.merchant?.company_name || '',
    merchantName: raw.merchant?.name || '',
    merchant: raw.merchant || null,
  };
};

/**
 * @param {{ countryId?: number, page?: number, perPage?: number }} params
 * @returns {Promise<{ items: ReturnType<typeof normalizeDigitalProduct>[], meta: { currentPage: number, lastPage: number, perPage: number, total: number } }>}
 */
export const getDigitalProducts = async ({
  countryId = resolveCountryId(1),
  page = 1,
  perPage = 15,
} = {}) => {
  const res = await api.get('/api/digital-products', {
    params: {
      country_id: countryId,
      page,
      per_page: perPage,
    },
  });

  const { list, meta } = extractDigitalListAndMeta(res.data, page, perPage);

  return {
    items: list.map(normalizeDigitalProduct).filter((p) => p.id != null),
    meta,
  };
};

export const getDigitalProduct = async ({ id, countryId = resolveCountryId(1) }) => {
  const res = await api.get(`/api/digital-products/${id}`, {
    params: { country_id: countryId },
  });

  const payload = res.data;
  const item = payload?.data?.digital_product
    ?? payload?.data?.product
    ?? payload?.data
    ?? payload?.digital_product
    ?? payload;

  return normalizeDigitalProduct(item);
};

export const normalizeDigitalCategory = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return {
      id: null,
      name: 'Category',
      slug: '',
      image: '',
      isActive: true,
      productsCount: null,
    };
  }
  const products = raw.products ?? raw.digital_products;
  const count = Array.isArray(products)
    ? products.length
    : Number(raw.products_count ?? raw.digital_products_count ?? NaN);
  return {
    id: raw.id ?? null,
    name: raw.name || raw.title || 'Category',
    slug: raw.slug || '',
    image: raw.image || raw.thumb_image || '',
    isActive: Boolean(raw.is_active ?? true),
    productsCount: Number.isFinite(count) ? count : null,
  };
};

/**
 * @returns {Promise<ReturnType<typeof normalizeDigitalCategory>[]>}
 */
export const getDigitalCategories = async ({ countryId = resolveCountryId(1) } = {}) => {
  const res = await api.get('/api/digital-categories', {
    params: { country_id: countryId },
  });
  const payload = res.data;
  const root = payload?.data ?? payload;
  const list = Array.isArray(root)
    ? root
    : toArray(
        root?.digital_categories
          ?? root?.categories
          ?? root?.data
          ?? payload?.digital_categories,
      );
  return list
    .map((item) => normalizeDigitalCategory(item))
    .filter((c) => c.id != null && c.isActive);
};

/**
 * @returns {Promise<{ category: ReturnType<typeof normalizeDigitalCategory>, products: ReturnType<typeof normalizeDigitalProduct>[] }>}
 */
export const getDigitalCategory = async ({ id, countryId = resolveCountryId(1) }) => {
  const res = await api.get(`/api/digital-categories/${id}`, {
    params: { country_id: countryId },
  });
  const payload = res.data;
  const raw = payload?.data?.digital_category
    ?? payload?.data?.category
    ?? payload?.data
    ?? payload?.digital_category
    ?? payload;

  const productRows = toArray(raw?.products ?? raw?.digital_products);
  const products = productRows.map(normalizeDigitalProduct).filter((p) => p.id != null);
  const category = normalizeDigitalCategory({ ...raw, products: undefined, products_count: products.length });

  return { category, products };
};

/** Human labels for Laravel validation keys returned when digital order creation requires profile data. */
export const DIGITAL_ORDER_PROFILE_FIELD_LABELS = {
  gender: 'Gender',
  birth_date: 'Date of birth',
  national_number: 'National ID number',
  national_cart_front_image: 'National ID — front (image)',
  national_cart_back_image: 'National ID — back (image)',
  national_card_front_image: 'National ID — front (image)',
  national_card_back_image: 'National ID — back (image)',
  national_id_expire_date: 'National ID expiry date',
  home_address: 'Home address',
};

/**
 * @param {unknown} error - axios error from POST /api/digital-orders
 * @returns {{ message: string, fields: { key: string, label: string, messages: string[] }[] } | null}
 */
export const parseDigitalOrderProfileGate = (error) => {
  const status = error?.response?.status;
  if (status !== 422) return null;
  const data = error?.response?.data;
  if (!data || typeof data !== 'object') return null;

  const message = String(data.message || 'Please complete your profile before ordering.').trim();
  const lowerMsg = message.toLowerCase();
  const errs = data.errors;
  const keys = errs && typeof errs === 'object' ? Object.keys(errs) : [];

  const looksLikeProfileGate =
    lowerMsg.includes('profile')
    || lowerMsg.includes('complete your')
    || keys.some((k) => Object.prototype.hasOwnProperty.call(DIGITAL_ORDER_PROFILE_FIELD_LABELS, k));

  if (!looksLikeProfileGate && keys.length === 0) return null;

  const fields = keys.map((key) => {
    const raw = errs[key];
    const messages = Array.isArray(raw)
      ? raw.map((m) => String(m || '').trim()).filter(Boolean)
      : [String(raw || '').trim()].filter(Boolean);
    return {
      key,
      label: DIGITAL_ORDER_PROFILE_FIELD_LABELS[key]
        || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      messages,
    };
  });

  return { message: message || 'Please complete your profile before ordering.', fields };
};

/**
 * When POST /api/digital-orders fails, Laravel may return raw provider errors (e.g. Eezee Pay
 * `/login` 403). That is a server/credentials issue, not the storefront app.
 */
export const formatDigitalOrderErrorMessage = (raw) => {
  const s = String(raw || '').trim();
  if (!s) return 'Could not create the order. Please try again.';
  const lower = s.toLowerCase();
  if (
    lower.includes('eezee pay')
    || lower.includes('eezee_pay')
    || (lower.includes('403') && lower.includes('login') && lower.includes('post'))
  ) {
    return 'The payment partner denied access (403). Try again later, or ask support to verify Eezee Pay API credentials and server configuration.';
  }
  return s;
};

/**
 * @param {{ digitalProductId: number|string }} params
 */
export const createDigitalOrder = async ({ digitalProductId, countryCode, countryId } = {}) => {
  const id = Number(digitalProductId);
  if (!Number.isFinite(id) || id < 1) {
    throw new Error('Invalid digital product.');
  }
  const normalizeCountryHeader = (countryCode) => {
    const raw = String(countryCode || '').trim();
    if (!raw) return '';
    return raw.toLowerCase();
  };

  const resolvedCountryId = Number(countryId);
  const resolvedCountryCode = normalizeCountryHeader(countryCode);
  const headers = {};
  if (resolvedCountryCode) headers['X-Country'] = resolvedCountryCode;
  if (Number.isFinite(resolvedCountryId) && resolvedCountryId > 0) headers['X-Country-Id'] = String(resolvedCountryId);

  const res = await api.post(
    '/api/digital-orders',
    {
      digital_product_id: id,
      ...(Number.isFinite(resolvedCountryId) && resolvedCountryId > 0 ? { country_id: resolvedCountryId } : {}),
    },
    {
      ...(Object.keys(headers).length ? { headers } : {}),
    },
  );
  return res.data;
};
