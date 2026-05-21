import { CART_ITEM_TYPE } from '../constants/cart';

export const CART_TYPE_CONFLICT_CODE = 'cart_type_conflict';

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeCartItemType = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === CART_ITEM_TYPE.DIGITAL || raw === 'digital') return CART_ITEM_TYPE.DIGITAL;
  if (raw === CART_ITEM_TYPE.PHYSICAL || raw === 'physical' || raw === 'normal') {
    return CART_ITEM_TYPE.PHYSICAL;
  }
  return null;
};

const oppositeCartType = (type) => (
  type === CART_ITEM_TYPE.DIGITAL ? CART_ITEM_TYPE.PHYSICAL : CART_ITEM_TYPE.DIGITAL
);

const extractErrorCodes = (data) => {
  if (!data || typeof data !== 'object') return [];
  const raw = data.code ?? data.errors?.code ?? data.error_code;
  return toArray(raw).map((c) => String(c || '').trim().toLowerCase()).filter(Boolean);
};

const getConflictTextBlob = (data) => {
  if (!data || typeof data !== 'object') return '';
  const cartMsgs = toArray(data?.errors?.cart).join(' ');
  const message = String(data?.message || '');
  let errorsJson = '';
  try {
    errorsJson = JSON.stringify(data.errors || {});
  } catch {
    errorsJson = '';
  }
  return `${message} ${cartMsgs} ${errorsJson}`.toLowerCase();
};

/**
 * Parse API wording without mixing "contains X" with "cannot add Y".
 * e.g. "Cart contains normal products. You cannot add digital products."
 */
const parseTypesFromApiMessage = (text) => {
  const lower = String(text || '').toLowerCase();
  let cartHasType = null;
  let attemptedType = null;

  const inCartMatch = lower.match(/contains\s+(digital|normal|physical)(?:\s+products?)?/);
  if (inCartMatch) {
    cartHasType = inCartMatch[1] === 'digital'
      ? CART_ITEM_TYPE.DIGITAL
      : CART_ITEM_TYPE.PHYSICAL;
  }

  const addingMatch = lower.match(/cannot\s+add\s+(digital|normal|physical)(?:\s+products?)?/);
  if (addingMatch) {
    attemptedType = addingMatch[1] === 'digital'
      ? CART_ITEM_TYPE.DIGITAL
      : CART_ITEM_TYPE.PHYSICAL;
  }

  return { cartHasType, attemptedType };
};

/**
 * Backend returns 422 with code cart_type_conflict when mixing digital and physical carts.
 */
export const isCartTypeConflictError = (error) => {
  if (!error) return false;
  if (error?.isCartTypeConflict === true) return true;

  const status = error?.response?.status;
  if (status !== 422 && status !== 409) return false;

  const data = error?.response?.data;
  const codes = extractErrorCodes(data);
  if (codes.includes(CART_TYPE_CONFLICT_CODE)) return true;

  const combined = getConflictTextBlob(data);
  return (
    combined.includes('cart_type_conflict')
    || /cannot\s+add\s+(digital|normal|physical)/.test(combined)
    || /contains\s+(digital|normal|physical)/.test(combined)
  );
};

const buildConflictDisplayMessage = (cartHasType, attemptedType) => {
  const inCartLabel = cartHasType === CART_ITEM_TYPE.DIGITAL ? 'digital' : 'physical';
  const addingLabel = attemptedType === CART_ITEM_TYPE.DIGITAL ? 'digital' : 'physical';
  return `Your cart contains ${inCartLabel} products. You cannot add ${addingLabel} products to the same cart. Complete your current order or clear the cart first.`;
};

/**
 * Resolve cart vs attempted product types using live cart state, pending add, then API text.
 */
export const resolveCartTypeConflict = (error, context = {}) => {
  if (!isCartTypeConflictError(error)) return null;

  const data = error?.response?.data || {};
  const cartMessages = toArray(data?.errors?.cart);
  const apiMessage = String(
    cartMessages[0] || data?.message || '',
  ).trim();

  const fromMessage = parseTypesFromApiMessage(apiMessage);
  const fromCart = normalizeCartItemType(context.cartItemType);
  const fromPending = normalizeCartItemType(context.pendingAdd?.itemType);
  const cartHasItems = Boolean(context.cartHasItems);

  let cartHasType = fromCart;
  let attemptedType = fromPending;

  if (!cartHasType && cartHasItems) {
    cartHasType = fromCart;
  }
  if (!cartHasType) {
    cartHasType = fromMessage.cartHasType;
  }
  if (!attemptedType) {
    attemptedType = fromMessage.attemptedType;
  }

  if (fromPending) {
    attemptedType = fromPending;
  }
  if (fromCart && cartHasItems) {
    cartHasType = fromCart;
  } else if (!cartHasType && fromMessage.cartHasType) {
    cartHasType = fromMessage.cartHasType;
  }

  if (!cartHasType) {
    cartHasType = CART_ITEM_TYPE.PHYSICAL;
  }
  if (!attemptedType) {
    attemptedType = oppositeCartType(cartHasType);
  }

  if (cartHasType === attemptedType) {
    if (fromPending) {
      cartHasType = oppositeCartType(fromPending);
    } else {
      attemptedType = oppositeCartType(cartHasType);
    }
  }

  const message = apiMessage && !apiMessage.toLowerCase().includes('cart_type_conflict')
    ? apiMessage
    : buildConflictDisplayMessage(cartHasType, attemptedType);

  return {
    message,
    cartHasType,
    attemptedType,
  };
};

/** @deprecated Use resolveCartTypeConflict — kept for imports that still reference parse. */
export const parseCartTypeConflict = (error, context) => resolveCartTypeConflict(error, context);

export const markCartTypeConflictError = (error) => {
  if (error && typeof error === 'object') {
    error.isCartTypeConflict = true;
  }
  return error;
};

/** Cart type conflicts are handled by CartTypeConflictModal in CartProvider. */
export const shouldShowInlineCartError = (error) => !isCartTypeConflictError(error);
