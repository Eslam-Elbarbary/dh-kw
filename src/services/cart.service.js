import api from './api';
import { CART_ITEM_TYPE } from '../constants/cart';
import { isCartTypeConflictError, markCartTypeConflictError } from '../utils/cartErrors';
import { withCountryHeader } from '../utils/countryHeaders';

export { CART_ITEM_TYPE };

const toArray = (value) => (Array.isArray(value) ? value : []);

const isCartLineObject = (node) => {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false;
  return Boolean(
    node.item_type
    || node.itemType
    || node.digital_product
    || node.digitalProduct
    || node.product
    || node.cart_item_id
    || (node.id != null && (node.quantity != null || node.qty != null)),
  );
};

/** Turn API payloads into a list of cart line objects. */
const coerceCartItems = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];
  if (isCartLineObject(raw)) return [raw];
  const values = Object.values(raw);
  if (values.length > 0 && values.every((entry) => entry && typeof entry === 'object')) {
    return values;
  }
  return [];
};
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeItemType = (value, fallback = CART_ITEM_TYPE.PHYSICAL) => {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === CART_ITEM_TYPE.DIGITAL) return CART_ITEM_TYPE.DIGITAL;
  if (raw === CART_ITEM_TYPE.PHYSICAL || raw === 'normal') return CART_ITEM_TYPE.PHYSICAL;
  return fallback;
};

const extractSerials = (item) => {
  const candidates = [
    item?.serials,
    item?.serial_numbers,
    item?.serialNumbers,
    item?.pins,
    item?.codes,
    item?.delivery_credentials,
    item?.credentials,
  ];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    const list = candidate
      .map((entry) => {
        if (entry == null) return '';
        if (typeof entry === 'string' || typeof entry === 'number') return String(entry).trim();
        return String(
          entry?.serial
          ?? entry?.serial_number
          ?? entry?.pin
          ?? entry?.code
          ?? entry?.value
          ?? '',
        ).trim();
      })
      .filter(Boolean);
    if (list.length) return list;
  }
  return [];
};

const normalizeCartItem = (item, fallbackItemType = CART_ITEM_TYPE.PHYSICAL) => {
  const itemType = normalizeItemType(item?.item_type ?? item?.itemType, fallbackItemType);
  const isDigital = itemType === CART_ITEM_TYPE.DIGITAL;
  const digitalProduct = item?.digital_product || item?.digitalProduct || {};
  const product = isDigital
    ? digitalProduct
    : (item?.product || item?.item || item?.variant?.product || {});

  const unitPrice = toNumber(
    item?.final_price
      ?? item?.price
      ?? item?.unit_price
      ?? item?.unitPrice
      ?? item?.sale_price
      ?? product?.final_price
      ?? product?.price
      ?? product?.cost_after_vat
      ?? product?.sale_price
      ?? 0,
  );
  const quantity = Math.max(1, toNumber(item?.quantity ?? item?.qty ?? 1, 1));
  const subtotal = toNumber(item?.subtotal ?? item?.total ?? unitPrice * quantity);
  const image = product?.thumb_image || product?.image || product?.thumbnail || item?.image || '';

  return {
    id: item?.id ?? item?.cart_item_id ?? null,
    productId:
      item?.digital_product_id
      ?? digitalProduct?.id
      ?? item?.product_id
      ?? product?.id
      ?? null,
    variantId: isDigital
      ? null
      : (
        item?.variant_id
        ?? item?.variant?.id
        ?? item?.variant?.variant_id
        ?? item?.product_variant_id
        ?? product?.variant_id
        ?? product?.selected_variant_id
        ?? product?.selectedVariantId
        ?? product?.variant?.id
        ?? product?.variant?.variant_id
        ?? product?.variants?.[0]?.id
        ?? product?.variants?.[0]?.variant_id
        ?? null
      ),
    itemType,
    name: product?.name || item?.name || (isDigital ? 'Digital product' : 'Product'),
    image,
    quantity,
    unitPrice,
    subtotal,
    currency: item?.currency_code || item?.currency || product?.currency_code || product?.currency || '',
    currencyCode: item?.currency_code || product?.currency_code || item?.currency || product?.currency || '',
    companyName: isDigital ? (product?.company_name || product?.companyName || '') : '',
    serials: isDigital ? extractSerials(item) : [],
  };
};

const normalizeCartResponse = (payload, { defaultItemType = CART_ITEM_TYPE.PHYSICAL } = {}) => {
  const payloadData = payload?.data;
  const isDataArray = Array.isArray(payloadData);
  const cartNode = payloadData?.cart || payload?.cart || (isDataArray ? {} : (payloadData || payload || {}));
  let rawItems = coerceCartItems(
    (isDataArray ? payloadData : null)
    || payloadData?.items
    || payloadData?.cart_items
    || payloadData?.cartItems
    || payloadData?.cart?.items
    || payloadData?.cart?.products
    || payloadData?.cart?.cart_items
    || payloadData?.cart?.cartItems
    || cartNode?.items
    || cartNode?.products
    || cartNode?.cart_items
    || cartNode?.cartItems
    || cartNode?.data?.items
    || payload?.data?.items
    || payload?.data?.products
    || payload?.data?.cart_items
    || payload?.items
    || payload?.products
    || payload?.cart_items,
  );

  if (!rawItems.length && isCartLineObject(cartNode)) {
    rawItems = [cartNode];
  }
  if (!rawItems.length && isCartLineObject(payloadData) && !payloadData?.cart) {
    rawItems = [payloadData];
  }

  const cartLevelType = normalizeItemType(
    cartNode?.item_type
    ?? cartNode?.itemType
    ?? payload?.item_type
    ?? payload?.order_type
    ?? payloadData?.item_type,
    defaultItemType,
  );

  const items = rawItems
    .map((item) => normalizeCartItem(item, cartLevelType))
    .filter((item) => item.productId != null || item.id != null);

  const resolvedItemType = items.length
    ? normalizeItemType(items[0]?.itemType, cartLevelType)
    : cartLevelType;

  const subtotal = toNumber(
    cartNode?.subtotal
      ?? cartNode?.sub_total
      ?? cartNode?.subTotal
      ?? cartNode?.total_before_discount
      ?? cartNode?.totalBeforeDiscount
      ?? payload?.data?.subtotal
      ?? payload?.data?.sub_total
      ?? items.reduce((sum, item) => sum + item.subtotal, 0),
  );
  const shipping = toNumber(
    cartNode?.shipping
    ?? cartNode?.shipping_cost
    ?? cartNode?.shippingCost
    ?? payload?.data?.shipping
    ?? payload?.data?.shipping_cost
    ?? 0,
  );
  const discount = toNumber(
    cartNode?.discount
    ?? cartNode?.discount_amount
    ?? cartNode?.discountAmount
    ?? payload?.data?.discount
    ?? payload?.data?.discount_amount
    ?? 0,
  );
  const tax = toNumber(
    cartNode?.tax
    ?? cartNode?.vat
    ?? payload?.data?.tax
    ?? payload?.data?.vat
    ?? 0,
  );
  const total = toNumber(
    cartNode?.total
      ?? cartNode?.grand_total
      ?? cartNode?.grandTotal
      ?? cartNode?.total_cost
      ?? payload?.data?.total
      ?? payload?.data?.grand_total
      ?? payload?.data?.total_cost
      ?? subtotal + shipping + tax - discount,
  );

  return {
    id: cartNode?.id ?? null,
    itemType: resolvedItemType,
    items,
    currency: cartNode?.currency_code
      ?? cartNode?.currencyCode
      ?? cartNode?.currency
      ?? payload?.data?.currency_code
      ?? payload?.data?.currency
      ?? items[0]?.currencyCode
      ?? items[0]?.currency
      ?? '',
    summary: {
      subtotal,
      shipping,
      discount,
      tax,
      total,
    },
    coupon: cartNode?.coupon || payload?.data?.coupon || null,
  };
};

const shouldTryAnotherEndpoint = (error) => {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.message || '').toLowerCase();
  return (
    status === 404 ||
    status === 405 ||
    message.includes('not supported') ||
    message.includes('method not allowed') ||
    message.includes('route')
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
      if (isCartTypeConflictError(error)) throw markCartTypeConflictError(error);
      if (!shouldTryAnotherEndpoint(error)) {
        throw error;
      }
    }
  }
  throw lastError;
};

const buildCartFormData = ({
  quantity,
  variantId,
  includeQtyAlias = false,
  includeCompatibilityVariantKeys = false,
}) => {
  const formData = new FormData();
  if (variantId !== null && variantId !== undefined && variantId !== '') {
    formData.append('variant_id', String(variantId));
    if (includeCompatibilityVariantKeys) {
      formData.append('variant.id', String(variantId));
      formData.append('variant[id]', String(variantId));
      formData.append('variantId', String(variantId));
    }
  }
  if (quantity !== null && quantity !== undefined) {
    formData.append('quantity', String(quantity));
    if (includeQtyAlias) {
      formData.append('qty', String(quantity));
    }
  }
  return formData;
};

const postCartFormData = (url, formDataPayload, config) => api.post(url, formDataPayload, config);

const buildPhysicalCartProductUrl = ({ productId, variantId } = {}) => {
  const baseUrl = `/api/cart/${encodeURIComponent(productId)}`;
  if (variantId === null || variantId === undefined || variantId === '') {
    return baseUrl;
  }
  return `${baseUrl}?variant_id=${encodeURIComponent(String(variantId))}`;
};

const buildDigitalCartProductUrl = (digitalProductId) => (
  `/api/cart/digital/${encodeURIComponent(digitalProductId)}`
);

const resolveItemType = (itemType) => normalizeItemType(itemType, CART_ITEM_TYPE.PHYSICAL);

const fetchPhysicalCart = async ({ countryCode } = {}) => {
  const res = await tryRequestsSequentially([
    () => api.get('/api/cart', withCountryHeader(countryCode)),
    () => api.get('/api/cart/index', withCountryHeader(countryCode)),
    () => api.get('/api/cart/list', withCountryHeader(countryCode)),
  ]);
  return normalizeCartResponse(res.data, { defaultItemType: CART_ITEM_TYPE.PHYSICAL });
};

const fetchDigitalCart = async ({ countryCode } = {}) => {
  const res = await tryRequestsSequentially([
    () => api.get('/api/cart', withCountryHeader(countryCode)),
    () => api.get('/api/cart/digital', withCountryHeader(countryCode)),
    () => api.get('/api/cart/digital/index', withCountryHeader(countryCode)),
    () => api.get('/api/cart/digital/list', withCountryHeader(countryCode)),
  ]);
  return normalizeCartResponse(res.data, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
};

export const getCart = async ({ countryCode } = {}) => {
  const [physicalResult, digitalResult] = await Promise.allSettled([
    fetchPhysicalCart({ countryCode }),
    fetchDigitalCart({ countryCode }),
  ]);

  const physical = physicalResult.status === 'fulfilled' ? physicalResult.value : null;
  const digital = digitalResult.status === 'fulfilled' ? digitalResult.value : null;

  if (digital?.items?.length) return digital;
  if (physical?.items?.length) return physical;
  return digital || physical || normalizeCartResponse({});
};

export const addToCart = async ({ productId, quantity = 1, variantId, itemType, countryCode } = {}) => {
  if (!productId) throw new Error('Product id is required.');

  const normalizedItemType = resolveItemType(itemType);
  if (normalizedItemType === CART_ITEM_TYPE.DIGITAL) {
    return addDigitalToCart({ digitalProductId: productId, quantity, countryCode });
  }

  const normalizedProductId = String(productId).trim();
  const normalizedQuantity = Math.max(1, toNumber(quantity, 1));
  const normalizedVariantId = variantId === undefined || variantId === null || variantId === ''
    ? null
    : String(variantId).trim();
  const basePayload = {
    product_id: normalizedProductId,
    quantity: normalizedQuantity,
  };
  const variantPayload = normalizedVariantId
    ? {
      ...basePayload,
      variant: normalizedVariantId,
      variant_id: normalizedVariantId,
      variantId: normalizedVariantId,
    }
    : basePayload;
  const simplePayload = basePayload;
  const cartByProductUrl = `/api/cart/${encodeURIComponent(normalizedProductId)}`;
  const cartByProductUrlWithVariant = buildPhysicalCartProductUrl({
    productId: normalizedProductId,
    variantId: normalizedVariantId,
  });
  const requestConfig = withCountryHeader(countryCode);

  const variantAttempts = normalizedVariantId
    ? [
      () => api.post(cartByProductUrlWithVariant, undefined, requestConfig),
      () => api.post(cartByProductUrlWithVariant, { quantity: normalizedQuantity }, requestConfig),
      () => api.post(cartByProductUrlWithVariant, variantPayload, requestConfig),
      () => postCartFormData(
        cartByProductUrlWithVariant,
        buildCartFormData({
          quantity: normalizedQuantity,
          variantId: normalizedVariantId,
          includeQtyAlias: true,
        }),
        requestConfig,
      ),
      () => postCartFormData(
        cartByProductUrl,
        buildCartFormData({
          quantity: normalizedQuantity,
          variantId: normalizedVariantId,
          includeQtyAlias: true,
          includeCompatibilityVariantKeys: true,
        }),
        requestConfig,
      ),
      () => api.post(cartByProductUrl, variantPayload, requestConfig),
      () => api.post('/api/cart/add-product', variantPayload, requestConfig),
    ]
    : [];

  const simpleAttempts = [
    () => api.post(cartByProductUrl, undefined, requestConfig),
    () => api.post(cartByProductUrl, simplePayload, requestConfig),
    () => postCartFormData(
      cartByProductUrl,
      buildCartFormData({
        quantity: normalizedQuantity,
        variantId: null,
        includeQtyAlias: true,
      }),
      requestConfig,
    ),
    () => api.post('/api/cart/add-product', simplePayload, requestConfig),
  ];

  const attempts = normalizedVariantId
    ? [...variantAttempts, ...simpleAttempts]
    : simpleAttempts;

  let response;
  const errors = [];
  for (const attempt of attempts) {
    try {
      // eslint-disable-next-line no-await-in-loop
      response = await attempt();
      break;
    } catch (error) {
      errors.push(error);
      if (isCartTypeConflictError(error)) {
        throw markCartTypeConflictError(error);
      }
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || '').toLowerCase();
      const hasValidationErrors = Boolean(error?.response?.data?.errors);
      const isRecoverable =
        (status === 422 && !isCartTypeConflictError(error))
        || status === 404
        || status === 405
        || (hasValidationErrors && !isCartTypeConflictError(error))
        || message.includes('variant')
        || message.includes('quantity')
        || message.includes('method not allowed')
        || message.includes('route');
      if (!isRecoverable) {
        throw error;
      }
    }
  }
  if (!response) {
    const conflictErr = errors.find((error) => isCartTypeConflictError(error));
    if (conflictErr) throw conflictErr;
    const preferred = errors.find((error) => {
      const message = String(error?.response?.data?.message || '').toLowerCase();
      return !message.includes('post method is not supported for route api/cart');
    });
    throw preferred || errors[errors.length - 1];
  }

  return normalizeCartResponse(response.data);
};

export const addDigitalToCart = async ({ digitalProductId, quantity = 1, countryCode } = {}) => {
  const id = String(digitalProductId || '').trim();
  if (!id) throw new Error('Digital product id is required.');
  const normalizedQuantity = Math.max(1, toNumber(quantity, 1));
  const url = buildDigitalCartProductUrl(id);
  const requestConfig = withCountryHeader(countryCode);

  const response = await tryRequestsSequentially([
    () => api.post(url, undefined, requestConfig),
    () => api.post(url, { quantity: normalizedQuantity }, requestConfig),
    () => api.post(url, { qty: normalizedQuantity }, requestConfig),
    () => api.post(url, buildCartFormData({ quantity: normalizedQuantity, variantId: null, includeQtyAlias: true }), requestConfig),
  ]);

  return normalizeCartResponse(response.data, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
};

export const updateCartItemQuantity = async ({
  cartItemId,
  productId,
  quantity,
  variantId,
  itemType,
  countryCode,
} = {}) => {
  const normalizedItemType = resolveItemType(itemType);
  if (normalizedItemType === CART_ITEM_TYPE.DIGITAL) {
    return updateDigitalCartItemQuantity({ digitalProductId: productId || cartItemId, quantity, countryCode });
  }

  const nextQuantity = Math.max(1, toNumber(quantity, 1));
  const itemId = productId || cartItemId;
  if (!itemId) throw new Error('Cart item id is required.');
  const resolvedProductId = productId || itemId;
  const resolvedVariantId = variantId === undefined || variantId === null || variantId === ''
    ? null
    : String(variantId).trim();
  const updatePayload = {
    quantity: nextQuantity,
    ...(resolvedVariantId ? {
      variant: resolvedVariantId,
      variant_id: resolvedVariantId,
      variantId: resolvedVariantId,
    } : {}),
  };
  const updatePayloadQtyAlias = {
    qty: nextQuantity,
    ...(resolvedVariantId ? {
      variant: resolvedVariantId,
      variant_id: resolvedVariantId,
      variantId: resolvedVariantId,
    } : {}),
  };
  const requestConfig = withCountryHeader(countryCode, {
    headers: {
      'Content-Type': 'application/json',
      ...(resolvedVariantId ? { variant: resolvedVariantId } : {}),
    },
  });
  const updateUrl = buildPhysicalCartProductUrl({ productId: resolvedProductId, variantId: resolvedVariantId });
  const updateUrlWithoutVariant = buildPhysicalCartProductUrl({ productId: resolvedProductId, variantId: null });

  const attempts = [
    () => api.put(updateUrl, { quantity: nextQuantity }, requestConfig),
    () => api.put(updateUrl, { qty: nextQuantity }, requestConfig),
    () => api.put(updateUrl, updatePayload, requestConfig),
    () => api.put(updateUrl, updatePayloadQtyAlias, requestConfig),
    () => api.put(updateUrlWithoutVariant, { quantity: nextQuantity }, requestConfig),
    () => api.put(updateUrlWithoutVariant, { qty: nextQuantity }, requestConfig),
    () => api.put('/api/cart/update-quantity', { cart_item_id: itemId, quantity: nextQuantity }, requestConfig),
    () => api.put('/api/cart/update-quantity', { cart_item_id: itemId, qty: nextQuantity }, requestConfig),
    () => api.put('/api/cart/update-quantity', { item_id: itemId, quantity: nextQuantity }, requestConfig),
    () => api.put('/api/cart/update-quantity', { id: itemId, quantity: nextQuantity }, requestConfig),
    () => api.put('/api/cart/update-quantity', { product_id: resolvedProductId, quantity: nextQuantity }, requestConfig),
    () => api.put('/api/cart/update-quantity', { product_id: resolvedProductId, qty: nextQuantity }, requestConfig),
    () => api.post('/api/cart/update-quantity', { cart_item_id: itemId, quantity: nextQuantity }, requestConfig),
    () => api.post('/api/cart/update-quantity', { product_id: resolvedProductId, quantity: nextQuantity }, requestConfig),
    () => api.put(`/api/cart/${itemId}`, { quantity: nextQuantity }, requestConfig),
    () => api.put(`/api/cart/${itemId}`, { qty: nextQuantity }, requestConfig),
  ];

  let response;
  let lastError;
  for (const attempt of attempts) {
    try {
      // eslint-disable-next-line no-await-in-loop
      response = await attempt();
      break;
    } catch (error) {
      lastError = error;
      if (isCartTypeConflictError(error)) throw markCartTypeConflictError(error);
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || '').toLowerCase();
      const hasValidationErrors = Boolean(error?.response?.data?.errors);
      const isRecoverable =
        status === 422 ||
        status === 404 ||
        status === 405 ||
        hasValidationErrors ||
        message.includes('product not found') ||
        message.includes('cart item') ||
        message.includes('item not found') ||
        message.includes('method not allowed') ||
        message.includes('route');
      if (!isRecoverable) {
        throw error;
      }
    }
  }
  if (!response) {
    throw lastError;
  }

  return normalizeCartResponse(response.data);
};

export const updateDigitalCartItemQuantity = async ({ digitalProductId, quantity, countryCode } = {}) => {
  const id = String(digitalProductId || '').trim();
  if (!id) throw new Error('Digital product id is required.');
  const nextQuantity = Math.max(1, toNumber(quantity, 1));
  const url = buildDigitalCartProductUrl(id);
  const requestConfig = withCountryHeader(countryCode);

  const response = await tryRequestsSequentially([
    () => api.put(url, { quantity: nextQuantity }, requestConfig),
    () => api.put(url, { qty: nextQuantity }, requestConfig),
    () => api.post(url, { quantity: nextQuantity }, requestConfig),
    () => api.post(url, { qty: nextQuantity }, requestConfig),
  ]);

  return normalizeCartResponse(response.data, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
};

export const removeCartItem = async ({ cartItemId, productId, variantId, itemType, countryCode } = {}) => {
  const normalizedItemType = resolveItemType(itemType);
  if (normalizedItemType === CART_ITEM_TYPE.DIGITAL) {
    return removeDigitalCartItem({ digitalProductId: productId || cartItemId, countryCode });
  }

  const itemId = cartItemId || productId;
  if (!itemId) throw new Error('Cart item id is required.');
  const resolvedProductId = productId || itemId;
  const resolvedVariantId = variantId === undefined || variantId === null || variantId === ''
    ? null
    : String(variantId).trim();
  const deleteConfig = resolvedVariantId
    ? { headers: { variant: resolvedVariantId } }
    : undefined;
  const deleteUrl = buildPhysicalCartProductUrl({ productId: resolvedProductId, variantId: resolvedVariantId });
  const deleteUrlWithoutVariant = buildPhysicalCartProductUrl({ productId: resolvedProductId, variantId: null });
  const attempts = [
    () => api.delete(deleteUrl, deleteConfig),
    () => api.delete(deleteUrlWithoutVariant, deleteConfig),
    () => api.delete(`/api/cart/remove-product/${encodeURIComponent(resolvedProductId)}`, deleteConfig),
    () => api.delete('/api/cart/remove-product', { data: { product_id: resolvedProductId } }),
    () => api.delete(`/api/cart/remove-product/${encodeURIComponent(itemId)}`),
    () => api.delete(`/api/cart/${encodeURIComponent(itemId)}`),
    () => api.delete('/api/cart/remove-product', { data: { cart_item_id: itemId } }),
  ];
  if (resolvedVariantId) {
    attempts.unshift(
      () => api.delete(deleteUrl),
      () => api.delete(`/api/cart/${encodeURIComponent(resolvedProductId)}?variant_id=${encodeURIComponent(resolvedVariantId)}`),
      () => api.delete(`/api/cart/remove-product/${encodeURIComponent(resolvedProductId)}?variant=${encodeURIComponent(resolvedVariantId)}`),
    );
  }
  const response = await tryRequestsSequentially(attempts);
  return normalizeCartResponse(response.data);
};

export const removeDigitalCartItem = async ({ digitalProductId, countryCode } = {}) => {
  const id = String(digitalProductId || '').trim();
  if (!id) throw new Error('Digital product id is required.');
  const url = buildDigitalCartProductUrl(id);
  const requestConfig = withCountryHeader(countryCode);
  const response = await tryRequestsSequentially([
    () => api.delete(url, requestConfig),
    () => api.delete('/api/cart/digital/remove-product', withCountryHeader(countryCode, { data: { digital_product_id: id } })),
  ]);
  return normalizeCartResponse(response.data, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
};

export const clearCart = async ({ itemType, countryCode } = {}) => {
  const normalizedItemType = itemType ? resolveItemType(itemType) : null;

  if (normalizedItemType === CART_ITEM_TYPE.DIGITAL) {
    try {
      const response = await tryRequestsSequentially([
        () => api.delete('/api/cart/digital/clear'),
        () => api.post('/api/cart/digital/clear'),
      ]);
      return normalizeCartResponse(response.data, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
    } catch {
      // Never DELETE /api/cart/digital — the router treats "digital" as a product id.
      await emptyCartByRemovingItems(CART_ITEM_TYPE.DIGITAL, countryCode);
      return normalizeCartResponse({}, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
    }
  }

  if (normalizedItemType === CART_ITEM_TYPE.PHYSICAL) {
    const response = await tryRequestsSequentially([
      () => api.post('/api/cart/clear'),
      () => api.delete('/api/cart/clear'),
      () => api.delete('/api/cart'),
    ]);
    return normalizeCartResponse(response.data);
  }

  // Unknown cart type: clear both sides so the session is fully reset.
  const [physicalResult, digitalResult] = await Promise.allSettled([
    tryRequestsSequentially([
      () => api.delete('/api/cart/clear'),
      () => api.delete('/api/cart'),
    ]),
    tryRequestsSequentially([
      () => api.delete('/api/cart/digital/clear'),
      () => api.post('/api/cart/digital/clear'),
    ]),
  ]);

  if (physicalResult.status === 'fulfilled') {
    return normalizeCartResponse(physicalResult.value.data);
  }
  if (digitalResult.status === 'fulfilled') {
    return normalizeCartResponse(digitalResult.value.data, { defaultItemType: CART_ITEM_TYPE.DIGITAL });
  }
  throw physicalResult.reason || digitalResult.reason;
};

/** Remove every line item when bulk-clear endpoints are unavailable. */
const emptyCartByRemovingItems = async (itemType, countryCode) => {
  const normalizedItemType = resolveItemType(itemType);
  let cartPayload;
  try {
    cartPayload = normalizedItemType === CART_ITEM_TYPE.DIGITAL
      ? await fetchDigitalCart({ countryCode })
      : await fetchPhysicalCart({ countryCode });
  } catch {
    return;
  }

  const items = Array.isArray(cartPayload?.items) ? cartPayload.items : [];
  for (const item of items) {
    const productId = item?.productId
      ?? item?.digital_product_id
      ?? item?.digitalProductId
      ?? item?.digital_product?.id
      ?? item?.digitalProduct?.id;
    if (!productId) continue;
    try {
      // eslint-disable-next-line no-await-in-loop
      if (normalizedItemType === CART_ITEM_TYPE.DIGITAL) {
        await removeDigitalCartItem({ digitalProductId: productId, countryCode });
      } else {
        await removeCartItem({
          cartItemId: item.id,
          productId,
          variantId: item.variantId,
          itemType: normalizedItemType,
          countryCode,
        });
      }
    } catch {
      // Keep removing remaining items even if one delete fails.
    }
  }
};

/** Clear one cart type via API, then verify by deleting any remaining lines. */
export const clearCartThoroughly = async ({ itemType, countryCode } = {}) => {
  const normalizedItemType = itemType ? resolveItemType(itemType) : null;

  if (normalizedItemType) {
    try {
      await clearCart({ itemType: normalizedItemType, countryCode });
    } catch {
      // Fall through to per-item removal.
    }
    await emptyCartByRemovingItems(normalizedItemType, countryCode);
    return normalizeCartResponse({});
  }

  await Promise.allSettled([
    clearCartThoroughly({ itemType: CART_ITEM_TYPE.DIGITAL, countryCode }),
    clearCartThoroughly({ itemType: CART_ITEM_TYPE.PHYSICAL, countryCode }),
  ]);
  return normalizeCartResponse({});
};

/** Clear digital and physical carts (used when switching product types). */
export const clearAllCarts = async ({ countryCode } = {}) => clearCartThoroughly({ countryCode });

export const applyCartCoupon = async ({ code, countryCode } = {}) => {
  const couponCode = String(code || '').trim();
  if (!couponCode) throw new Error('Coupon code is required.');
  const res = await api.post(
    '/api/cart/apply-coupon',
    { code: couponCode },
    withCountryHeader(countryCode),
  );
  return normalizeCartResponse(res.data);
};

/** Never throws on cart type conflict — returns `{ ok, conflict, error?, cart? }`. */
export const addToCartSafe = async (params) => {
  try {
    const cart = await addToCart(params);
    return { ok: true, cart };
  } catch (error) {
    if (isCartTypeConflictError(error)) {
      return { ok: false, conflict: true, error: markCartTypeConflictError(error) };
    }
    throw error;
  }
};

export { isCartTypeConflictError };
