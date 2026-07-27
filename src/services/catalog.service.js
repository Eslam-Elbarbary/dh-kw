import api from './api';
import { productMatchesSearch } from '../utils/productSearch';
import { collectProductVariants, productHasVariantsFlag } from '../utils/productVariants';
import { normalizeCountryHeader, withCountryHeader } from '../utils/countryHeaders';
import { formatMoney, resolveCurrencyFromSource } from '../utils/formatMoney';

const toArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** Safe numeric money from number, numeric string, null, or missing. */
const toMoneyNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Backend price contract:
 * - base_price: default before country override
 * - price: country-specific (or default)
 * - final_price: after product discount (customer-facing)
 */
const resolveDisplayPrices = (source, currencyCode = '') => {
  const code = resolveCurrencyFromSource(source, currencyCode);
  const basePrice = toMoneyNumber(source?.base_price) ?? 0;
  const listPrice = toMoneyNumber(source?.price)
    ?? toMoneyNumber(source?.base_price)
    ?? toMoneyNumber(source?.original_price)
    ?? toMoneyNumber(source?.old_price)
    ?? 0;

  let finalPrice = toMoneyNumber(source?.final_price)
    ?? toMoneyNumber(source?.sale_price);

  // Legacy responses without final_price: keep previous discount computation as last resort.
  if (finalPrice == null) {
    const discountValue = Number(source?.discount ?? 0) || 0;
    if (discountValue > 0 && listPrice > 0) {
      const computed = source?.discount_type === 'percentage'
        ? listPrice - (listPrice * discountValue) / 100
        : listPrice - discountValue;
      finalPrice = computed > 0 ? computed : listPrice;
    } else {
      finalPrice = listPrice
        || toMoneyNumber(source?.price)
        || toMoneyNumber(source?.base_price)
        || 0;
    }
  }

  const priceValue = Number(finalPrice) || 0;
  const originalValue = Number(listPrice) || priceValue;
  const showStrike = originalValue > 0 && priceValue < originalValue - 0.001;

  return {
    basePrice: Number(basePrice) || 0,
    listPrice: originalValue,
    priceValue,
    showStrike,
    originalPrice: showStrike ? formatMoney(originalValue, code) : '',
    salePrice: formatMoney(priceValue, code),
    currency: code,
    currencyCode: code,
  };
};

const normalizeVariant = (variant, currencyCode = '') => {
  if (!variant || typeof variant !== 'object') return variant;
  const pricing = resolveDisplayPrices(variant, currencyCode);
  return {
    ...variant,
    id: variant?.id ?? variant?.variant_id ?? variant?.product_variant_id ?? null,
    basePrice: pricing.basePrice,
    listPrice: pricing.listPrice,
    priceValue: pricing.priceValue,
    showStrike: pricing.showStrike,
    originalPrice: pricing.originalPrice,
    salePrice: pricing.salePrice,
    currency: pricing.currency,
    currencyCode: pricing.currencyCode,
  };
};

export const resolveCountryId = (fallback = 1) => {
  const storedCountryId = localStorage.getItem('selectedCountryId');
  const storedUser = localStorage.getItem('user');

  if (storedCountryId) {
    const parsed = toNumber(storedCountryId);
    if (parsed) return parsed;
  }

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const userCountryId = toNumber(user?.country_id ?? user?.countryId);
      if (userCountryId) return userCountryId;
    } catch {
      // Ignore malformed user JSON and use fallback.
    }
  }

  return fallback;
};

/** Prefer explicit code; fall back to profile country code (same pattern as orders). */
export const resolveCountryCode = (countryCode) => {
  const fromArg = normalizeCountryHeader(countryCode);
  if (fromArg) return fromArg;
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return normalizeCountryHeader(
      user?.country_code
      ?? user?.countryCode
      ?? user?.country?.code
      ?? '',
    );
  } catch {
    return '';
  }
};

const normalizeProduct = (product) => {
  const rawImages = toArray(product?.images)
    .map((item) => item?.image || item?.url || item?.path)
    .filter(Boolean);
  const thumbImage = product?.thumb_image || product?.thumbnail || product?.image || product?.main_image || '';
  const imageGallery = [thumbImage, ...rawImages].filter(Boolean);
  const uniqueImages = [...new Set(imageGallery)];
  const categoriesList = toArray(product?.categories || product?.category).filter(Boolean);
  const firstCategory = categoriesList[0] || product?.category || {};
  const ratingAverage = Number(
    product?.rating?.average
      ?? product?.ratings?.average
      ?? product?.rating
      ?? 0
  ) || 0;
  const ratingCount = Number(
    product?.rating?.count
      ?? product?.ratings?.count
      ?? 0
  ) || 0;

  const currencyCode = resolveCurrencyFromSource(product);
  const pricing = resolveDisplayPrices(product, currencyCode);

  return {
    id: product?.id ?? product?.product_id ?? product?.pivot?.product_id ?? null,
    name: product?.name || product?.title || 'Product',
    brand: product?.brand?.name || product?.vendor?.name || product?.brand_name || 'Brand',
    vendorName: product?.vendor?.name || product?.brand?.name || product?.brand_name || 'Brand',
    vendorId: product?.vendor?.id ?? product?.vendor_id ?? null,
    category: firstCategory?.name || product?.category_name || 'Category',
    categoryId: firstCategory?.id ?? product?.category_id ?? null,
    categories: categoriesList.map((item) => ({
      id: item?.id,
      name: item?.name || item?.title || 'Category',
      image: item?.image || '',
    })),
    tag: product?.tag || product?.type || '',
    basePrice: pricing.basePrice,
    listPrice: pricing.listPrice,
    originalPrice: pricing.originalPrice,
    salePrice: pricing.salePrice,
    priceValue: pricing.priceValue,
    showStrike: pricing.showStrike,
    currency: pricing.currency,
    currencyCode: pricing.currencyCode,
    image: uniqueImages[0] || '',
    images: uniqueImages,
    badges: [],
    popularity: Number(product?.popularity ?? 0),
    rating: ratingAverage,
    ratingCount,
    description: product?.description || '',
    sku: product?.sku || '',
    stock: Number(product?.stock ?? product?.quantity ?? 0),
    variants: collectProductVariants(product).map((variant) => normalizeVariant(variant, currencyCode)),
    hasVariants: productHasVariantsFlag(product),
    discount: Number(product?.discount ?? 0) || 0,
    discountType: product?.discount_type || '',
    isFavorite: Boolean(product?.is_favorite),
    slug: product?.slug || '',
  };
};

const normalizeCategoryChild = (item) => ({
  id: item?.id,
  name: item?.name || item?.title || `Category ${item?.id}`,
  slug: item?.slug || '',
  image: item?.image || item?.icon || '',
  isActive: Boolean(item?.is_active ?? true),
  isFeatured: Boolean(item?.is_featured ?? false),
});

const normalizeCategory = (item) => {
  const parent = item?.parent;
  const parentId = parent?.id ?? item?.parent_id ?? null;

  return {
    id: item?.id,
    name: item?.name || item?.title || `Category ${item?.id}`,
    slug: item?.slug || '',
    image: item?.image || item?.icon || '',
    isActive: Boolean(item?.is_active ?? true),
    isFeatured: Boolean(item?.is_featured ?? false),
    parentId: parentId != null ? Number(parentId) : null,
    children: toArray(item?.children)
      .map(normalizeCategoryChild)
      .filter((child) => child.id != null && child.isActive),
  };
};

export const getCategories = async () => {
  const res = await api.get('/api/categories');
  const payload = res.data;
  const list = payload?.data?.categories || payload?.data || payload?.categories || [];

  return toArray(list).map(normalizeCategory).filter((item) => item.id != null);
};

/** Top-level categories only (no parent), active, with optional featured-first sort. */
export const getTopLevelCategories = async () => {
  const all = await getCategories();
  return all
    .filter((item) => item.isActive && (item.parentId == null || item.parentId === 0))
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name));
};

export const getCategory = async ({ id }) => {
  const res = await api.get(`/api/categories/${id}`);
  const payload = res.data;
  const item = payload?.data?.category || payload?.data || payload?.category || payload;

  const normalized = normalizeCategory(item);
  return {
    ...normalized,
    description: item?.description || '',
  };
};

export const getVendors = async () => {
  const res = await api.get('/api/vendors');
  const payload = res.data;
  const list = payload?.data?.vendors || payload?.data || payload?.vendors || [];

  return toArray(list).map((item) => ({
    id: item?.id,
    name: item?.name || item?.title || `Vendor ${item?.id}`,
    image: item?.image || item?.logo || '',
    rating: Number(item?.rating ?? 0),
  }));
};

export const getVendor = async ({ id }) => {
  const res = await api.get(`/api/vendors/${id}`);
  const payload = res.data;
  const item = payload?.data?.vendor || payload?.data || payload?.vendor || payload;

  return {
    id: item?.id,
    name: item?.name || item?.title || `Vendor ${id}`,
    image: item?.image || item?.logo || '',
    rating: Number(item?.rating ?? 0),
    description: item?.description || '',
  };
};

export const getSliders = async ({ countryCode } = {}) => {
  const resolvedCountryCode = resolveCountryCode(countryCode);
  const res = await api.get('/api/sliders', withCountryHeader(resolvedCountryCode));
  const payload = res.data;
  const list = payload?.data?.sliders || payload?.data || payload?.sliders || payload;
  return toArray(list).map((item) => ({
    id: item?.id ?? item?.slider_id ?? item?.uuid ?? null,
    image: item?.image || item?.banner || item?.photo || item?.thumbnail || item?.image_url || '',
    title: item?.title || item?.name || '',
    subtitle: item?.subtitle || item?.description || '',
    link: item?.link || item?.url || '',
  }));
};

const fetchProductsPage = async ({
  countryId = resolveCountryId(1),
  countryCode,
  perPage = 15,
  page = 1,
  categoryId,
  vendorId,
  search,
} = {}) => {
  const params = { country_id: countryId, per_page: perPage, page };
  if (categoryId) params.category_id = categoryId;
  if (vendorId) params.vendor_id = vendorId;
  if (search) params.search = String(search).trim();

  const resolvedCountryCode = resolveCountryCode(countryCode);
  const res = await api.get('/api/products', withCountryHeader(resolvedCountryCode, { params }));
  const payload = res.data;
  const list = payload?.data?.products
    || payload?.data?.data
    || payload?.data
    || payload?.products
    || [];
  const meta = payload?.meta || payload?.data?.meta || {};

  return {
    items: toArray(list).map(normalizeProduct),
    meta: {
      currentPage: Number(meta.current_page ?? page) || page,
      lastPage: Number(meta.last_page ?? 1) || 1,
    },
  };
};

export const getProducts = async (options = {}) => {
  const { items } = await fetchProductsPage(options);
  return items;
};

/** Physical catalog search — backend `search` misses partial terms, so load pages and filter locally. */
export const searchPhysicalProducts = async ({
  countryId = resolveCountryId(1),
  countryCode,
  search,
  categoryId,
  vendorId,
  perPage = 100,
} = {}) => {
  const query = String(search || '').trim();
  if (!query) {
    return getProducts({ countryId, countryCode, perPage, page: 1, categoryId, vendorId });
  }

  const all = [];
  let page = 1;
  let lastPage = 1;

  do {
    // eslint-disable-next-line no-await-in-loop
    const { items, meta } = await fetchProductsPage({
      countryId,
      countryCode,
      perPage,
      page,
      categoryId,
      vendorId,
    });
    all.push(...items);
    lastPage = meta.lastPage;
    page += 1;
  } while (page <= lastPage);

  return all.filter((product) => productMatchesSearch(product, query));
};

export const getProduct = async ({ id, countryId = resolveCountryId(1), countryCode } = {}) => {
  const resolvedCountryCode = resolveCountryCode(countryCode);
  const res = await api.get(
    `/api/products/${id}`,
    withCountryHeader(resolvedCountryCode, {
      params: { country_id: countryId },
    }),
  );

  const payload = res.data;
  const item = payload?.data?.product || payload?.data || payload?.product || payload;
  return normalizeProduct(item);
};

export const getFavoriteList = async ({
  countryId = resolveCountryId(1),
  countryCode,
  perPage = 50,
  page = 1,
} = {}) => {
  const resolvedCountryCode = resolveCountryCode(countryCode);
  const res = await api.get(
    '/api/favorite-list',
    withCountryHeader(resolvedCountryCode, {
      params: {
        country_id: countryId,
        per_page: perPage,
        page,
      },
    }),
  );

  const payload = res.data;
  const list = payload?.data?.products
    || payload?.data?.favorites
    || payload?.data
    || payload?.favorites
    || [];

  return toArray(list).map(normalizeProduct);
};

export const toggleFavoriteProduct = async ({ productId }) => {
  if (!productId) {
    throw new Error('Missing product id for favorite toggle.');
  }
  const res = await api.post(`/api/products/${productId}/toggle-favorite`);
  return res.data;
};
