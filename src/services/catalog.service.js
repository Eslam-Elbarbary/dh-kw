import api from './api';
import { collectProductVariants, productHasVariantsFlag } from '../utils/productVariants';

const toArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

  const basePrice = Number(
    product?.price
      ?? product?.final_price
      ?? product?.original_price
      ?? product?.old_price
      ?? 0
  ) || 0;
  const discountValue = Number(product?.discount ?? 0) || 0;
  const computedDiscountedPrice = product?.discount_type === 'percentage'
    ? basePrice - (basePrice * discountValue) / 100
    : basePrice - discountValue;
  const priceValue = Number(
    product?.sale_price
      ?? (computedDiscountedPrice > 0 ? computedDiscountedPrice : basePrice)
      ?? 0
  ) || 0;

  const originalValue = Number(
    product?.original_price
      ?? product?.old_price
      ?? basePrice
      ?? priceValue
  ) || priceValue;

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
    originalPrice: `$${originalValue.toLocaleString()}`,
    salePrice: `$${priceValue.toLocaleString()}`,
    priceValue,
    image: uniqueImages[0] || '',
    images: uniqueImages,
    badges: [],
    popularity: Number(product?.popularity ?? 0),
    rating: ratingAverage,
    ratingCount,
    description: product?.description || '',
    sku: product?.sku || '',
    stock: Number(product?.stock ?? product?.quantity ?? 0),
    variants: collectProductVariants(product),
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

export const getSliders = async () => {
  const res = await api.get('/api/sliders');
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

export const getProducts = async ({
  countryId = resolveCountryId(1),
  perPage = 15,
  page = 1,
  categoryId,
  vendorId,
} = {}) => {
  const params = { country_id: countryId, per_page: perPage, page };
  if (categoryId) params.category_id = categoryId;
  if (vendorId) params.vendor_id = vendorId;

  const res = await api.get('/api/products', {
    params,
  });

  const payload = res.data;
  const list = payload?.data?.products
    || payload?.data?.data
    || payload?.data
    || payload?.products
    || [];

  return toArray(list).map(normalizeProduct);
};

export const getProduct = async ({ id, countryId = resolveCountryId(1) }) => {
  const res = await api.get(`/api/products/${id}`, {
    params: { country_id: countryId },
  });

  const payload = res.data;
  const item = payload?.data?.product || payload?.data || payload?.product || payload;
  return normalizeProduct(item);
};

export const getFavoriteList = async ({ countryId = resolveCountryId(1), perPage = 50, page = 1 } = {}) => {
  const res = await api.get('/api/favorite-list', {
    params: {
      country_id: countryId,
      per_page: perPage,
      page,
    },
  });

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
