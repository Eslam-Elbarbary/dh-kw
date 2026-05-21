// Single digital product (API) — separate from physical /product/:id flow.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createDigitalOrder,
  formatDigitalOrderErrorMessage,
  getDigitalProduct,
  parseDigitalOrderProfileGate,
} from '../services/digitalProducts.service';
import { getCountries } from '../services/meta.service';
import { useCountry } from '../context/CountryContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/useCart';
import { CART_ITEM_TYPE } from '../services/cart.service';
import { shouldShowInlineCartError } from '../utils/cartErrors';
import { isCartAddConflict } from '../utils/cartAdd';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

const extractCreatedDigitalOrderId = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  const id =
    payload?.data?.digital_order?.id
    ?? payload?.data?.order?.id
    ?? payload?.digital_order?.id
    ?? payload?.order?.id
    ?? payload?.data?.id
    ?? payload?.id;
  return id != null ? String(id) : null;
};

export default function DigitalProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { countryId } = useCountry();
  const { addToCart, cartItemsCount } = useCart();
  const [countries, setCountries] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartBusy, setCartBusy] = useState(false);
  const [cartSuccess, setCartSuccess] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [profileGate, setProfileGate] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const closeProfileGate = useCallback(() => setProfileGate(null), []);
  const closeSuccess = useCallback(() => setSuccessInfo(null), []);
  const selectedCountryCode = useMemo(
    () => countries.find((c) => String(c.id) === String(countryId))?.code || '',
    [countries, countryId],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getCountries();
        if (!cancelled) setCountries(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setCountries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setError('Missing product.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const item = await getDigitalProduct({ id, countryId });
        if (cancelled) return;
        if (!item?.id) {
          setError('Digital product not found.');
          setProduct(null);
        } else {
          setProduct(item);
        }
      } catch (e) {
        if (cancelled) return;
        setProduct(null);
        setError(e?.response?.data?.message || e?.message || 'Failed to load digital product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, countryId]);

  useEffect(() => {
    if (!profileGate && !successInfo) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (profileGate) closeProfileGate();
        if (successInfo) closeSuccess();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [profileGate, successInfo, closeProfileGate, closeSuccess]);

  const handleAddToCart = async () => {
    if (!product?.id || !product.isAvailable || cartBusy) return;
    setOrderError('');
    setCartSuccess('');
    if (!isAuthenticated) {
      sessionStorage.setItem('signInRedirect', `/digital-product/${id}`);
      navigate('/sign-in');
      return;
    }
    try {
      setCartBusy(true);
      const result = await addToCart({
        productId: product.id,
        quantity,
        itemType: CART_ITEM_TYPE.DIGITAL,
      });
      if (isCartAddConflict(result)) return;
      if (!result?.ok) {
        setOrderError('Could not add to cart. Please refresh and try again.');
        return;
      }
      setCartSuccess(
        quantity > 1
          ? `Added ${quantity} units to your digital cart. Each unit gets its own code after purchase.`
          : 'Added to your digital cart.',
      );
    } catch (e) {
      if (!shouldShowInlineCartError(e)) return;
      setOrderError(e?.response?.data?.message || e?.message || 'Could not add to cart.');
    } finally {
      setCartBusy(false);
    }
  };

  const handleOrderNow = async () => {
    if (!product?.id || !product.isAvailable) return;
    setOrderError('');
    if (!isAuthenticated) {
      sessionStorage.setItem('signInRedirect', `/digital-product/${id}`);
      navigate('/sign-in');
      return;
    }
    try {
      setOrderSubmitting(true);
      const data = await createDigitalOrder({
        digitalProductId: product.id,
        countryId,
        countryCode: selectedCountryCode,
      });
      const orderId = extractCreatedDigitalOrderId(data);
      setSuccessInfo({
        orderId,
        message: String(data?.message || '').trim() || 'Your digital order was created.',
      });
    } catch (e) {
      const gate = parseDigitalOrderProfileGate(e);
      if (gate) {
        setProfileGate(gate);
        return;
      }
      const raw =
        e?.response?.data?.message
        || e?.message
        || 'Could not create the order. Please try again.';
      setOrderError(formatDigitalOrderErrorMessage(raw));
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      {profileGate ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-profile-gate-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0e1c47]/45 dark:bg-black/55 backdrop-blur-[2px] cursor-default"
            aria-label="Close"
            onClick={closeProfileGate}
          />
          <div className="relative w-full max-w-[520px] bg-white dark:bg-[#1e293b] rounded-[8px] shadow-[0_20px_50px_rgba(14,28,71,0.18)] border border-[#e6e6e6] dark:border-[#334155] p-[24px] sm:p-[28px] max-h-[90vh] overflow-y-auto">
            <div className="flex gap-[12px] items-start mb-[16px]">
              <span className="shrink-0 flex size-[40px] items-center justify-center rounded-full bg-[#fff7ed] dark:bg-[#431407]/50 text-[#c2410c]" aria-hidden>
                <svg className="size-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="digital-profile-gate-title" className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white leading-snug">
                  Complete your profile first
                </h2>
                <p className="font-['Poppins'] text-[14px] text-[#57534e] dark:text-[#cbd5e1] mt-[8px] leading-relaxed">
                  {profileGate.message}
                </p>
              </div>
            </div>
            {profileGate.fields.length ? (
              <div className="rounded-[6px] border border-[#e7e5e4] dark:border-[#334155] bg-[#fafaf9] dark:bg-[#0f172a] px-[14px] py-[12px] mb-[20px]">
                <p className="font-['Poppins'] font-medium text-[12px] text-[#78716c] dark:text-[#94a3b8] uppercase tracking-wide mb-[10px]">
                  Required on your account
                </p>
                <ul className="space-y-[10px] list-none m-0 p-0">
                  {profileGate.fields.map((f) => (
                    <li key={f.key} className="font-['Poppins'] text-[13px] sm:text-[14px] text-[#0e1c47] dark:text-[#e2e8f0]">
                      <span className="font-semibold">{f.label}</span>
                      {f.messages?.length ? (
                        <span className="text-[#b45309] dark:text-[#fdba74]"> — {f.messages.join(' ')}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-[10px]">
              <button
                type="button"
                onClick={closeProfileGate}
                className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] border border-[#e6e6e6] dark:border-[#334155] text-[#0e1c47] dark:text-white hover:border-[#eea137] transition-colors"
              >
                Not now
              </button>
              <Link
                to="/my-profile?focus=digital-order"
                onClick={closeProfileGate}
                className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] bg-[#eea137] text-white text-center hover:bg-[#d8902f] transition-colors"
              >
                Complete profile
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {successInfo ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-order-success-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0e1c47]/45 dark:bg-black/55 backdrop-blur-[2px] cursor-default"
            aria-label="Close"
            onClick={closeSuccess}
          />
          <div className="relative w-full max-w-[480px] bg-white dark:bg-[#1e293b] rounded-[8px] shadow-[0_20px_50px_rgba(14,28,71,0.18)] border border-[#e6e6e6] dark:border-[#334155] p-[24px] sm:p-[28px] text-center">
            <div className="mx-auto mb-[16px] flex size-[56px] items-center justify-center rounded-full bg-[#ecfdf5] dark:bg-[#14532d]/40 border border-[#a7f3d0] dark:border-[#166534]" aria-hidden>
              <svg className="size-[28px] text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="digital-order-success-title" className="font-['Poppins'] font-semibold text-[20px] text-[#0e1c47] dark:text-white mb-[8px]">
              Order placed
            </h2>
            <p className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#cbd5e1] mb-[10px] leading-relaxed">
              {successInfo.message}
            </p>
            {successInfo.orderId ? (
              <p className="font-['Poppins'] text-[14px] text-[#0e1c47] dark:text-white font-medium mb-[20px]">
                Order #{successInfo.orderId}
              </p>
            ) : (
              <div className="mb-[20px]" />
            )}
            <div className="flex flex-col gap-[10px] justify-center">
              <div className="flex flex-col sm:flex-row gap-[10px] justify-center">
                {successInfo.orderId ? (
                  <Link
                    to={`/digital-order/${successInfo.orderId}`}
                    onClick={closeSuccess}
                    className="font-['Poppins'] font-semibold px-[22px] py-[11px] rounded-[4px] bg-[#eea137] text-white text-center hover:bg-[#d8902f] transition-colors"
                  >
                    View this order
                  </Link>
                ) : null}
                <Link
                  to="/my-orders?tab=digital"
                  onClick={closeSuccess}
                  className="font-['Poppins'] font-semibold px-[22px] py-[11px] rounded-[4px] bg-[#0e1c47] dark:bg-[#334155] text-white text-center hover:opacity-90 transition-opacity"
                >
                  All digital orders
                </Link>
              </div>
              <button
                type="button"
                onClick={closeSuccess}
                className="font-['Poppins'] font-semibold px-[22px] py-[11px] rounded-[4px] border border-[#e6e6e6] dark:border-[#334155] text-[#0e1c47] dark:text-white hover:border-[#eea137] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-w-[900px] mx-auto px-[12px] sm:px-[20px] md:px-[32px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="flex gap-[8px] items-center mb-[24px] flex-wrap">
          <Link to="/" className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#e5e7eb] hover:text-[#eea137]">
            Home
          </Link>
          <div className="flex items-center justify-center size-[18px] rotate-[270deg]">
            <img alt="" className="size-full" src={imgArrowDown} />
          </div>
          <Link to="/digital-products" className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#e5e7eb] hover:text-[#eea137]">
            Digital products
          </Link>
          <div className="flex items-center justify-center size-[18px] rotate-[270deg]">
            <img alt="" className="size-full" src={imgArrowDown} />
          </div>
          <Link to="/digital-categories" className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#e5e7eb] hover:text-[#eea137]">
            Categories
          </Link>
          <div className="flex items-center justify-center size-[18px] rotate-[270deg]">
            <img alt="" className="size-full" src={imgArrowDown} />
          </div>
          <span className="font-['Poppins'] text-[14px] text-[#eea137] line-clamp-1">Details</span>
        </div>

        {loading ? (
          <p className="font-['Poppins'] text-[#666] dark:text-[#94a3b8]">Loading…</p>
        ) : error ? (
          <div className="rounded-[6px] border border-[#fecaca] dark:border-[#7f1d1d] bg-[#fef2f2] dark:bg-[#450a0a]/40 px-[16px] py-[12px]" role="alert">
            <p className="font-['Poppins'] text-[14px] text-[#991b1b] dark:text-[#fecaca]">{error}</p>
            <Link to="/digital-products" className="inline-block mt-[12px] font-['Poppins'] font-semibold text-[#0e1c47] dark:text-[#eea137] text-[14px] hover:underline">
              Back to digital products
            </Link>
          </div>
        ) : product ? (
          <div className="flex flex-col md:flex-row gap-[24px] md:gap-[32px]">
            <div className="w-full md:w-[320px] shrink-0 aspect-square bg-[#f5f5f5] dark:bg-[#1e293b] rounded-[8px] overflow-hidden flex items-center justify-center border border-[#e4e7e9] dark:border-[#334155]">
              {product.image ? (
                <img src={product.image} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="font-['Poppins'] text-[#999]">No image</span>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-[16px]">
              <h1 className="font-['Poppins'] font-bold text-[#0e1c47] dark:text-white text-[24px] sm:text-[30px] leading-tight">
                {product.name}
              </h1>
              {product.merchantName ? (
                <p className="font-['Poppins'] text-[14px] text-[#64748b] dark:text-[#94a3b8]">
                  {product.merchantName}
                  {product.companyName && product.companyName !== product.merchantName ? ` · ${product.companyName}` : ''}
                </p>
              ) : null}
              <p className="font-['Poppins'] font-bold text-[#00a651] dark:text-[#4ade80] text-[22px] sm:text-[26px]">
                {product.priceFormatted}
              </p>

              <div className="rounded-[8px] border border-[#bfdbfe] dark:border-[#1e3a5f] bg-[#eff6ff] dark:bg-[#172554]/50 px-[16px] py-[14px]">
                <p className="font-['Poppins'] font-semibold text-[14px] text-[#1e3a8a] dark:text-[#93c5fd] mb-[6px]">
                  Digital cart
                </p>
                <p className="font-['Poppins'] text-[13px] sm:text-[14px] text-[#1e40af] dark:text-[#bfdbfe] leading-relaxed">
                  Add one or more digital products to your cart, then check out together. Digital and physical items cannot be mixed — complete one cart type before starting the other. Profile verification (national ID, address, etc.) is required at checkout.
                </p>
                <Link
                  to="/my-profile?focus=digital-order"
                  className="inline-flex mt-[12px] font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] dark:text-[#eea137] hover:underline"
                >
                  Open verification section
                </Link>
              </div>

              {cartSuccess ? (
                <div className="rounded-[6px] border border-[#a7f3d0] bg-[#ecfdf5] px-[14px] py-[10px]" role="status">
                  <p className="font-['Poppins'] text-[13px] text-[#047857]">{cartSuccess}</p>
                </div>
              ) : null}

              {orderError ? (
                <div className="rounded-[6px] border border-[#fecaca] dark:border-[#7f1d1d] bg-[#fef2f2] dark:bg-[#450a0a]/30 px-[14px] py-[10px]" role="alert">
                  <p className="font-['Poppins'] text-[13px] text-[#991b1b] dark:text-[#fecaca]">{orderError}</p>
                </div>
              ) : null}

              <div className="flex items-center gap-[12px]">
                <span className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] dark:text-white">Quantity</span>
                <button
                  type="button"
                  disabled={quantity <= 1 || cartBusy}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-[32px] h-[32px] border rounded-[4px] disabled:opacity-50"
                >
                  −
                </button>
                <span className="font-['Poppins'] text-[15px] w-[32px] text-center">{quantity}</span>
                <button
                  type="button"
                  disabled={cartBusy}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-[32px] h-[32px] border rounded-[4px] disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {product.description ? (
                <div>
                  <h2 className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-white text-[16px] mb-[8px]">Description</h2>
                  <p className="font-['Poppins'] text-[14px] text-[#444] dark:text-[#cbd5e1] whitespace-pre-wrap">{product.description}</p>
                </div>
              ) : null}
              {product.howToUse ? (
                <div>
                  <h2 className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-white text-[16px] mb-[8px]">How to use</h2>
                  <p className="font-['Poppins'] text-[14px] text-[#444] dark:text-[#cbd5e1] whitespace-pre-wrap">{product.howToUse}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-[12px] pt-[8px]">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || cartBusy || orderSubmitting}
                  className="font-['Poppins'] font-semibold text-[14px] px-[24px] py-[12px] rounded-[4px] bg-[#eea137] text-white hover:bg-[#d8902f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {cartBusy ? 'Adding…' : 'Add to cart'}
                </button>
                {cartItemsCount > 0 ? (
                  <Link
                    to="/shopping-cart"
                    className="font-['Poppins'] font-semibold text-[14px] px-[24px] py-[12px] rounded-[4px] bg-[#0e1c47] text-white hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                  >
                    View cart ({cartItemsCount})
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleOrderNow}
                  disabled={!product.isAvailable || orderSubmitting || cartBusy}
                  className="font-['Poppins'] font-semibold text-[14px] px-[24px] py-[12px] rounded-[4px] border border-[#e4e7e9] dark:border-[#334155] text-[#0e1c47] dark:text-white hover:border-[#eea137] disabled:opacity-50 transition-colors"
                >
                  {orderSubmitting ? 'Placing order…' : 'Buy this item only'}
                </button>
                <Link
                  to="/digital-products"
                  className="font-['Poppins'] font-semibold text-[14px] px-[24px] py-[12px] rounded-[4px] border border-[#e4e7e9] dark:border-[#334155] text-[#0e1c47] dark:text-white hover:border-[#eea137] transition-colors inline-flex items-center justify-center"
                >
                  All digital products
                </Link>
              </div>
              {!product.isAvailable ? (
                <p className="font-['Poppins'] text-[13px] text-[#b45309] dark:text-[#fbbf24]">This item is not available right now.</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
