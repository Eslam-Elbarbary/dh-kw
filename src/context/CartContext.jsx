import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addToCart as addToCartRequest,
  applyCartCoupon as applyCartCouponRequest,
  clearCart as clearCartRequest,
  getCart,
  removeCartItem as removeCartItemRequest,
  updateCartItemQuantity as updateCartItemQuantityRequest,
} from '../services/cart.service';

const CartContext = createContext(null);
const EMPTY_CART = {
  id: null,
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
  const [cart, setCart] = useState(EMPTY_CART);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState('');

  const loadCart = useCallback(async ({ force = false } = {}) => {
    if (!force && !hasAuthSession()) {
      setCartError('');
      setCart(EMPTY_CART);
      return EMPTY_CART;
    }

    try {
      setLoadingCart(true);
      setCartError('');
      const payload = await getCart();
      setCart(payload);
      return payload;
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
  }, []);

  useEffect(() => {
    loadCart().catch(() => {
      // Error state is already handled in loadCart.
    });
  }, [loadCart]);

  const addToCart = useCallback(async ({ productId, quantity = 1, variantId } = {}) => {
    const addedPayload = await addToCartRequest({ productId, quantity, variantId });
    if (hasUsableItemsPayload(addedPayload)) {
      setCart(addedPayload);
      return addedPayload;
    }

    // Some backend responses acknowledge add-to-cart without returning full items.
    // Force a refresh so cart UI updates immediately without full page reload.
    const refreshedCart = await loadCart({ force: true });
    if (hasUsableItemsPayload(refreshedCart)) {
      setCart(refreshedCart);
      return refreshedCart;
    }

    return refreshedCart;
  }, [loadCart]);

  const updateCartItemQuantity = useCallback(async ({ cartItemId, productId, quantity, variantId }) => {
    const previousCart = cart;
    const updatedPayload = await updateCartItemQuantityRequest({ cartItemId, productId, quantity, variantId });
    if (hasUsableItemsPayload(updatedPayload)) {
      setCart(updatedPayload);
      return updatedPayload;
    }
    const targetId = String(cartItemId || productId || '');
    const optimistic = withRecalculatedSummary({
      ...previousCart,
      items: previousCart.items.map((item) => (
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
  }, [cart]);

  const removeCartItem = useCallback(async ({ cartItemId, productId, variantId }) => {
    const previousCart = cart;
    const removedPayload = await removeCartItemRequest({ cartItemId, productId, variantId });
    if (hasUsableItemsPayload(removedPayload)) {
      setCart(removedPayload);
      return removedPayload;
    }
    const removeKey = String(cartItemId || productId || '');
    const normalizedVariantId = variantId === undefined || variantId === null ? null : String(variantId);
    const optimistic = withRecalculatedSummary({
      ...previousCart,
      items: previousCart.items.filter((item) => {
        const idMatch = String(item.id) === removeKey || String(item.productId) === removeKey;
        if (!idMatch) return true;
        if (!normalizedVariantId) return false;
        return String(item.variantId || '') !== normalizedVariantId;
      }),
    });
    setCart(optimistic);
    return optimistic;
  }, [cart]);

  const clearCart = useCallback(async () => {
    const payload = await clearCartRequest();
    setCart(payload);
    return payload;
  }, []);

  const applyCartCoupon = useCallback(async ({ code }) => {
    const payload = await applyCartCouponRequest({ code });
    setCart(payload);
    return payload;
  }, []);

  const cartItemsCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      cartItemsCount,
      loadingCart,
      cartError,
      loadCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
      applyCartCoupon,
    }),
    [
      cart,
      cartItemsCount,
      loadingCart,
      cartError,
      loadCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      clearCart,
      applyCartCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
