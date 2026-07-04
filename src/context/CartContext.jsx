import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import CartTypeConflictModal from '../components/CartTypeConflictModal';
import { CART_ITEM_TYPE } from '../constants/cart';
import { useCountry } from './CountryContext';
import {
  addToCartSafe,
  applyCartCoupon as applyCartCouponRequest,
  clearAllCarts as clearAllCartsRequest,
  clearCartThoroughly as clearCartRequest,
  getCart,
  removeCartItem as removeCartItemRequest,
  updateCartItemQuantity as updateCartItemQuantityRequest,
} from '../services/cart.service';
import { isCartTypeConflictError, resolveCartTypeConflict } from '../utils/cartErrors';
import { CartContext } from './cartContextState';

const EMPTY_CART = {
  id: null,
  itemType: CART_ITEM_TYPE.PHYSICAL,
  items: [],
  summary: { subtotal: 0, shipping: 0, discount: 0, tax: 0, total: 0 },
  coupon: null,
};

const hasAuthSession = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return Boolean(token) || isAuthenticated === 'true';
};

const hasUsableItemsPayload = (payload) => Array.isArray(payload?.items) && payload.items.length > 0;

const ensureCartShape = (payload) => {
  if (!payload || typeof payload !== 'object') return { ...EMPTY_CART };
  const items = Array.isArray(payload.items) ? payload.items : [];
  return {
    ...EMPTY_CART,
    ...payload,
    itemType: payload.itemType === CART_ITEM_TYPE.DIGITAL
      ? CART_ITEM_TYPE.DIGITAL
      : CART_ITEM_TYPE.PHYSICAL,
    items,
    summary: {
      ...EMPTY_CART.summary,
      ...(payload.summary && typeof payload.summary === 'object' ? payload.summary : {}),
    },
    coupon: payload.coupon ?? null,
  };
};

const withRecalculatedSummary = (cartState) => {
  const items = Array.isArray(cartState?.items) ? cartState.items : [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  const shipping = Number(cartState?.summary?.shipping || 0);
  const discount = Number(cartState?.summary?.discount || 0);
  const tax = Number(cartState?.summary?.tax || 0);
  return {
    ...cartState,
    summary: {
      subtotal,
      shipping,
      discount,
      tax,
      total: subtotal + shipping + tax - discount,
    },
  };
};

export function CartProvider({ children }) {
  const location = useLocation();
  const { countryCode } = useCountry();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState('');
  const [cartTypeConflict, setCartTypeConflict] = useState(null);
  const [clearingConflictCart, setClearingConflictCart] = useState(false);
  const cartTypeConflictRef = useRef(null);

  useEffect(() => {
    cartTypeConflictRef.current = cartTypeConflict;
  }, [cartTypeConflict]);

  const dismissCartTypeConflict = useCallback(() => {
    setCartTypeConflict(null);
  }, []);

  const buildConflictState = useCallback((error, pendingAdd) => {
    const resolved = resolveCartTypeConflict(error, {
      cartItemType: cart.itemType,
      cartHasItems: (Array.isArray(cart.items) ? cart.items : []).length > 0,
      pendingAdd,
    });
    return {
      message: resolved?.message || 'Your cart cannot mix digital and physical products.',
      cartHasType: resolved?.cartHasType || CART_ITEM_TYPE.PHYSICAL,
      attemptedType: resolved?.attemptedType || CART_ITEM_TYPE.DIGITAL,
      pendingAdd,
      returnPath: `${location.pathname}${location.search}`,
    };
  }, [cart.itemType, cart.items, location.pathname, location.search]);

  const scheduleCartTypeConflict = useCallback((error, pendingAdd) => {
    const next = buildConflictState(error, pendingAdd);
    queueMicrotask(() => {
      setCartTypeConflict(next);
    });
  }, [buildConflictState]);

  const loadCart = useCallback(async ({ force = false } = {}) => {
    if (!force && !hasAuthSession()) {
      setCartError('');
      setCart(EMPTY_CART);
      return EMPTY_CART;
    }

    try {
      setLoadingCart(true);
      setCartError('');
      const payload = await getCart({ countryCode });
      const nextCart = ensureCartShape(payload);
      setCart(nextCart.items.length ? nextCart : EMPTY_CART);
      return nextCart;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        setCart(EMPTY_CART);
        setCartError('');
        return EMPTY_CART;
      }
      setCartError(error?.response?.data?.message || 'Failed to load cart.');
      throw error;
    } finally {
      setLoadingCart(false);
    }
  }, [countryCode]);

  useEffect(() => {
    loadCart().catch(() => {
      // Error state is already handled in loadCart.
    });
  }, [loadCart]);

  useEffect(() => {
    if (!cartTypeConflict) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [cartTypeConflict]);

  const runAddToCart = useCallback(async (params) => {
    const safeResult = await addToCartSafe({ ...params, countryCode });
    if (safeResult.conflict) {
      return { ok: false, conflict: true, error: safeResult.error };
    }

    const normalizedAdd = ensureCartShape(safeResult.cart);
    if (hasUsableItemsPayload(normalizedAdd)) {
      setCart(normalizedAdd);
      return { ok: true, cart: normalizedAdd };
    }

    const refreshedCart = ensureCartShape(await loadCart({ force: true }));
    return { ok: Boolean(refreshedCart.items.length), cart: refreshedCart };
  }, [loadCart, countryCode]);

  const addToCart = useCallback(async (params = {}) => {
    try {
      const result = await runAddToCart(params);
      if (result.conflict) {
        scheduleCartTypeConflict(result.error, params);
        return { ok: false, conflict: true };
      }
      return result;
    } catch (error) {
      if (isCartTypeConflictError(error)) {
        scheduleCartTypeConflict(error, params);
        return { ok: false, conflict: true };
      }
      throw error;
    }
  }, [runAddToCart, scheduleCartTypeConflict]);

  const handleClearConflictAndContinue = useCallback(async () => {
    const conflict = cartTypeConflictRef.current;
    const pendingAdd = conflict?.pendingAdd;
    const productId = pendingAdd?.productId;

    if (!productId) {
      setCartTypeConflict((prev) => prev ? {
        ...prev,
        actionError: 'Product details were lost. Close this dialog and tap Add to cart again.',
      } : prev);
      return;
    }

    const addParams = {
      ...pendingAdd,
      productId,
      itemType: pendingAdd.itemType || conflict.attemptedType || CART_ITEM_TYPE.PHYSICAL,
    };

    try {
      setClearingConflictCart(true);
      setCartError('');
      setCartTypeConflict((prev) => (prev ? { ...prev, actionError: '' } : prev));

      await clearAllCartsRequest({ countryCode });
      setCart(EMPTY_CART);

      const result = await runAddToCart(addParams);
      if (result?.conflict) {
        scheduleCartTypeConflict(result.error, addParams);
        return;
      }
      if (!result?.ok) {
        setCartTypeConflict((prev) => (prev ? {
          ...prev,
          actionError: 'Could not add the product after clearing the cart. Please try again.',
        } : prev));
        return;
      }

      setCartTypeConflict(null);
    } catch (error) {
      if (isCartTypeConflictError(error)) {
        scheduleCartTypeConflict(error, addParams);
        return;
      }
      const message = error?.response?.data?.message
        || error?.message
        || 'Could not update your cart.';
      setCartTypeConflict((prev) => (prev ? { ...prev, actionError: message } : prev));
      setCartError(message);
    } finally {
      setClearingConflictCart(false);
    }
  }, [runAddToCart, scheduleCartTypeConflict, countryCode]);

  const updateCartItemQuantity = useCallback(async ({
    cartItemId,
    productId,
    quantity,
    variantId,
    itemType,
  }) => {
    const previousCart = cart;
    const resolvedItemType = itemType || cart.itemType || CART_ITEM_TYPE.PHYSICAL;
    const updatedPayload = await updateCartItemQuantityRequest({
      cartItemId,
      productId,
      quantity,
      variantId,
      itemType: resolvedItemType,
      countryCode,
    });
    const normalizedUpdate = ensureCartShape(updatedPayload);
    if (hasUsableItemsPayload(normalizedUpdate)) {
      setCart(normalizedUpdate);
      return normalizedUpdate;
    }
    const targetId = String(cartItemId || productId || '');
    const optimistic = withRecalculatedSummary({
      ...previousCart,
      items: (Array.isArray(previousCart.items) ? previousCart.items : []).map((item) => (
        String(item.id) === targetId || String(item.productId) === targetId
          ? {
            ...item,
            quantity: Number(quantity || item.quantity || 1),
            subtotal: Number(item.unitPrice || 0) * Number(quantity || item.quantity || 1),
          }
          : item
      )),
    });
    setCart(optimistic);
    return optimistic;
  }, [cart, countryCode]);

  const removeCartItem = useCallback(async ({
    cartItemId,
    productId,
    variantId,
    itemType,
  }) => {
    const previousCart = cart;
    const resolvedItemType = itemType || cart.itemType || CART_ITEM_TYPE.PHYSICAL;
    const removedPayload = await removeCartItemRequest({
      cartItemId,
      productId,
      variantId,
      itemType: resolvedItemType,
      countryCode,
    });
    const normalizedRemove = ensureCartShape(removedPayload);
    if (hasUsableItemsPayload(normalizedRemove)) {
      setCart(normalizedRemove);
      return normalizedRemove;
    }
    const removeKey = String(cartItemId || productId || '');
    const normalizedVariantId = variantId === undefined || variantId === null ? null : String(variantId);
    const optimistic = withRecalculatedSummary({
      ...previousCart,
      items: (Array.isArray(previousCart.items) ? previousCart.items : []).filter((item) => {
        const idMatch = String(item.id) === removeKey || String(item.productId) === removeKey;
        if (!idMatch) return true;
        if (!normalizedVariantId) return false;
        return String(item.variantId || '') !== normalizedVariantId;
      }),
    });
    setCart(optimistic.items.length ? optimistic : EMPTY_CART);
    return optimistic;
  }, [cart, countryCode]);

  const clearCart = useCallback(async () => {
    const payload = await clearCartRequest({ itemType: cart.itemType, countryCode });
    const nextCart = ensureCartShape(payload);
    setCart(nextCart.items.length ? nextCart : EMPTY_CART);
    return nextCart;
  }, [cart.itemType, countryCode]);

  const applyCartCoupon = useCallback(async ({ code }) => {
    const payload = await applyCartCouponRequest({ code, countryCode });
    const nextCart = ensureCartShape(payload);
    setCart(nextCart);
    return nextCart;
  }, [countryCode]);

  const cartItemsCount = useMemo(
    () => (Array.isArray(cart.items) ? cart.items : []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    ),
    [cart.items],
  );

  const isDigitalCart = cart.itemType === CART_ITEM_TYPE.DIGITAL;

  const value = useMemo(
    () => ({
      cart,
      cartItemsCount,
      isDigitalCart,
      loadingCart,
      cartError,
      cartTypeConflict,
      loadCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
      applyCartCoupon,
      dismissCartTypeConflict,
    }),
    [
      cart,
      cartItemsCount,
      isDigitalCart,
      loadingCart,
      cartError,
      cartTypeConflict,
      loadCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
      applyCartCoupon,
      dismissCartTypeConflict,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartTypeConflictModal
        open={Boolean(cartTypeConflict)}
        conflict={cartTypeConflict}
        clearing={clearingConflictCart}
        onClose={dismissCartTypeConflict}
        onClearAndContinue={handleClearConflictAndContinue}
      />
    </CartContext.Provider>
  );
}
