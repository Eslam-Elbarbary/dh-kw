import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeCartItem = (item) => {
  const product = item?.product || item?.item || item?.variant?.product || {};
  const unitPrice = toNumber(
    item?.price
      ?? item?.unit_price
      ?? item?.unitPrice
      ?? item?.sale_price
      ?? item?.final_price
      ?? product?.sale_price
      ?? product?.price
      ?? product?.final_price
      ?? 0
  );
  const quantity = Math.max(1, toNumber(item?.quantity ?? item?.qty ?? 1, 1));
  const subtotal = toNumber(item?.subtotal ?? item?.total ?? unitPrice * quantity);
  const image = product?.thumb_image || product?.image || product?.thumbnail || item?.image || '';

  return {
    id: item?.id ?? item?.cart_item_id ?? product?.id ?? null,
    productId: item?.product_id ?? product?.id ?? null,
    variantId:
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
      ?? null,
    name: product?.name || item?.name || 'Product',
    image,
    quantity,
    unitPrice,
    subtotal,
    currency: item?.currency || 'USD',
  };
};

const normalizeCartResponse = (payload) => {
  const payloadData = payload?.data;
  const isDataArray = Array.isArray(payloadData);
  const cartNode = payloadData?.cart || payload?.cart || (isDataArray ? {} : (payloadData || payload || {}));
  const rawItems =
    (isDataArray ? payloadData : null)
    || payloadData?.cart?.items
    || payloadData?.cart?.products
    || payloadData?.cart?.cart_items
    || payloadData?.cart?.cartItems
    cartNode?.items
    || cartNode?.products
    || cartNode?.cart_items
    || cartNode?.cartItems
    || cartNode?.data?.items
    || payload?.data?.items
    || payload?.data?.products
    || payload?.data?.cart_items
    || payload?.items
    || payload?.products
    || payload?.cart_items
    || [];
  const items = toArray(rawItems).map(normalizeCartItem).filter((item) => item.productId || item.id);

  const subtotal = toNumber(
    cartNode?.subtotal
      ?? cartNode?.sub_total
      ?? cartNode?.subTotal
      ?? cartNode?.total_before_discount
      ?? cartNode?.totalBeforeDiscount
      ?? payload?.data?.subtotal
      ?? payload?.data?.sub_total
      ?? items.reduce((sum, item) => sum + item.subtotal, 0)
  );
  const shipping = toNumber(
    cartNode?.shipping
    ?? cartNode?.shipping_cost
    ?? cartNode?.shippingCost
    ?? payload?.data?.shipping
    ?? payload?.data?.shipping_cost
    ?? 0
  );
  const discount = toNumber(
    cartNode?.discount
    ?? cartNode?.discount_amount
    ?? cartNode?.discountAmount
    ?? payload?.data?.discount
    ?? payload?.data?.discount_amount
    ?? 0
  );
  const tax = toNumber(
    cartNode?.tax
    ?? cartNode?.vat
    ?? payload?.data?.tax
    ?? payload?.data?.vat
    ?? 0
  );
  const total = toNumber(
    cartNode?.total
      ?? cartNode?.grand_total
      ?? cartNode?.grandTotal
      ?? payload?.data?.total
      ?? payload?.data?.grand_total
      ?? subtotal + shipping + tax - discount
  );

  return {
    id: cartNode?.id ?? null,
    items,
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
    // Strict key from API docs and provided screenshot.
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

const postCartFormData = (url, formDataPayload) => api.post(url, formDataPayload);
const buildCartProductUrl = ({ productId, variantId } = {}) => {
  const baseUrl = `/api/cart/${encodeURIComponent(productId)}`;
  if (variantId === null || variantId === undefined || variantId === '') {
    return baseUrl;
  }
  return `${baseUrl}?variant_id=${encodeURIComponent(String(variantId))}`;
};

export const getCart = async () => {
  const res = await tryRequestsSequentially([
    () => api.get('/api/cart'),
    () => api.get('/api/cart/index'),
    () => api.get('/api/cart/list'),
  ]);
  return normalizeCartResponse(res.data);
};

export const addToCart = async ({ productId, quantity = 1, variantId } = {}) => {
  if (!productId) throw new Error('Product id is required.');

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
  const cartByProductUrlWithVariant = buildCartProductUrl({
    productId: normalizedProductId,
    variantId: normalizedVariantId,
  });

  // Live API: POST /api/cart/{product_id} (optional ?variant_id=). POST /api/cart is not supported.
  const variantAttempts = normalizedVariantId
    ? [
      () => api.post(cartByProductUrlWithVariant),
      () => api.post(cartByProductUrlWithVariant, { quantity: normalizedQuantity }),
      () => api.post(cartByProductUrlWithVariant, variantPayload),
      () => postCartFormData(
        cartByProductUrlWithVariant,
        buildCartFormData({
          quantity: normalizedQuantity,
          variantId: normalizedVariantId,
          includeQtyAlias: true,
        })
      ),
      () => postCartFormData(
        cartByProductUrl,
        buildCartFormData({
          quantity: normalizedQuantity,
          variantId: normalizedVariantId,
          includeQtyAlias: true,
          includeCompatibilityVariantKeys: true,
        })
      ),
      () => api.post(cartByProductUrl, variantPayload),
      () => api.post('/api/cart/add-product', variantPayload),
    ]
    : [];

  const simpleAttempts = [
    () => api.post(cartByProductUrl),
    () => api.post(cartByProductUrl, simplePayload),
    () => postCartFormData(
      cartByProductUrl,
      buildCartFormData({
        quantity: normalizedQuantity,
        variantId: null,
        includeQtyAlias: true,
      })
    ),
    () => api.post('/api/cart/add-product', simplePayload),
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
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || '').toLowerCase();
      const hasValidationErrors = Boolean(error?.response?.data?.errors);
      const isRecoverable =
        status === 422 ||
        status === 404 ||
        status === 405 ||
        hasValidationErrors ||
        message.includes('variant') ||
        message.includes('quantity') ||
        message.includes('method not allowed') ||
        message.includes('route');
      if (!isRecoverable) {
        throw error;
      }
    }
  }
  if (!response) {
    const preferred = errors.find((error) => {
      const message = String(error?.response?.data?.message || '').toLowerCase();
      return !message.includes('post method is not supported for route api/cart');
    });
    throw preferred || errors[errors.length - 1];
  }

  return normalizeCartResponse(response.data);
};

export const updateCartItemQuantity = async ({ cartItemId, productId, quantity, variantId } = {}) => {
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
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...(resolvedVariantId ? { variant: resolvedVariantId } : {}),
    },
  };
  const updateUrl = buildCartProductUrl({ productId: resolvedProductId, variantId: resolvedVariantId });
  const updateUrlWithoutVariant = buildCartProductUrl({ productId: resolvedProductId, variantId: null });

  const attempts = [
    // Exact API contract from screenshots: PUT /api/cart/{product_id}?variant_id={id}
    () => api.put(updateUrl, { quantity: nextQuantity }, requestConfig),
    () => api.put(updateUrl, { qty: nextQuantity }, requestConfig),
    // Compatibility payload variants for mixed backends.
    () => api.put(updateUrl, updatePayload, requestConfig),
    () => api.put(updateUrl, updatePayloadQtyAlias, requestConfig),
    // Simple product fallback (no variant in query).
    () => api.put(updateUrlWithoutVariant, { quantity: nextQuantity }, requestConfig),
    () => api.put(updateUrlWithoutVariant, { qty: nextQuantity }, requestConfig),
    // Most common API variants for quantity updates.
    () => api.put('/api/cart/update-quantity', { cart_item_id: itemId, quantity: nextQuantity }),
    () => api.put('/api/cart/update-quantity', { cart_item_id: itemId, qty: nextQuantity }),
    () => api.put('/api/cart/update-quantity', { item_id: itemId, quantity: nextQuantity }),
    () => api.put('/api/cart/update-quantity', { id: itemId, quantity: nextQuantity }),
    () => api.put('/api/cart/update-quantity', { product_id: resolvedProductId, quantity: nextQuantity }),
    () => api.put('/api/cart/update-quantity', { product_id: resolvedProductId, qty: nextQuantity }),
    // Some backends use POST for this action.
    () => api.post('/api/cart/update-quantity', { cart_item_id: itemId, quantity: nextQuantity }),
    () => api.post('/api/cart/update-quantity', { product_id: resolvedProductId, quantity: nextQuantity }),
    // Resource-style fallback.
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

export const removeCartItem = async ({ cartItemId, productId, variantId } = {}) => {
  const itemId = cartItemId || productId;
  if (!itemId) throw new Error('Cart item id is required.');
  const resolvedProductId = productId || itemId;
  const resolvedVariantId = variantId === undefined || variantId === null || variantId === ''
    ? null
    : String(variantId).trim();
  const deleteConfig = resolvedVariantId
    ? { headers: { variant: resolvedVariantId } }
    : undefined;
  const deleteUrl = buildCartProductUrl({ productId: resolvedProductId, variantId: resolvedVariantId });
  const deleteUrlWithoutVariant = buildCartProductUrl({ productId: resolvedProductId, variantId: null });
  const attempts = [
    // Exact API contract from screenshots: DELETE /api/cart/{product_id}?variant_id={id}
    () => api.delete(deleteUrl, deleteConfig),
    // Simple product fallback (no variant in query).
    () => api.delete(deleteUrlWithoutVariant, deleteConfig),
    // Compatibility routes.
    () => api.delete(`/api/cart/remove-product/${encodeURIComponent(resolvedProductId)}`, deleteConfig),
    () => api.delete('/api/cart/remove-product', { data: { product_id: resolvedProductId } }),
    // Compatibility fallbacks for cart-item-id based backends.
    () => api.delete(`/api/cart/remove-product/${encodeURIComponent(itemId)}`),
    () => api.delete(`/api/cart/${encodeURIComponent(itemId)}`),
    () => api.delete('/api/cart/remove-product', { data: { cart_item_id: itemId } }),
  ];
  if (resolvedVariantId) {
    attempts.unshift(
      () => api.delete(deleteUrl),
      () => api.delete(`/api/cart/${encodeURIComponent(resolvedProductId)}?variant_id=${encodeURIComponent(resolvedVariantId)}`),
      () => api.delete(`/api/cart/remove-product/${encodeURIComponent(resolvedProductId)}?variant=${encodeURIComponent(resolvedVariantId)}`)
    );
  }
  const response = await tryRequestsSequentially(attempts);
  return normalizeCartResponse(response.data);
};

export const clearCart = async () => {
  const response = await tryRequestsSequentially([
    () => api.delete('/api/cart/clear'),
    () => api.delete('/api/cart'),
  ]);
  return normalizeCartResponse(response.data);
};

export const applyCartCoupon = async ({ code } = {}) => {
  const couponCode = String(code || '').trim();
  if (!couponCode) throw new Error('Coupon code is required.');
  const res = await api.post('/api/cart/apply-coupon', { code: couponCode });
  return normalizeCartResponse(res.data);
};
