// Track Order page - exact Figma implementation
// Based on Figma design - Track Order Page

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getOrderDetails, isOrderRateable, isPaidOrderByApiFields, rateOrder } from '../services/orders.service';

// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';
import truckIcon from '../assets/Truck.svg';
import packageIcon from '../assets/Package.svg';
import handshakeIcon from '../assets/Handshake.svg';
import notebookIcon from '../assets/Notebook.svg';

// Icon Assets
const imgArrowDown = arrowDownIcon;

// Order Progress Icons
const imgDocumentIcon = notebookIcon;
const imgBoxIcon = packageIcon;
const imgTruckIcon = truckIcon;
const imgHandshakeIcon = handshakeIcon;

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const normalizeStatus = (value) => String(value || '').toLowerCase();

const normalizePaymentStr = (order) =>
  normalizeStatus(order?.payment_status ?? order?.paymentStatus ?? '');

const isRefundedLike = (order) => {
  if (!order) return false;
  const p = normalizePaymentStr(order);
  const o = normalizeStatus(order?.status ?? order?.order_status ?? '');
  return p.includes('refund') || o.includes('refund');
};

/** Progress steps 1–4 for the payment journey (not shipping). */
const getPaymentProgressIndex = (order) => {
  if (!order) return 0;
  const ord = normalizeStatus(order?.status ?? order?.order_status ?? '');
  const cancelled = ord.includes('cancel');

  if (isRefundedLike(order)) return 4;
  if (isPaidOrderByApiFields(order)) return 4;
  if (cancelled) return 1;
  return 2;
};

const extractOrderItems = (order) => {
  const orderId = String(order?.id ?? order?.order_id ?? '');
  const candidates = [
    order?.order_items,
    order?.orderItems,
    order?.order_details,
    order?.orderDetails,
    order?.items,
    order?.products,
    order?.details,
    order?.data?.items,
    order?.data?.products,
  ];

  const isOrderLine = (item) => {
    if (!item || typeof item !== 'object') return false;
    const productNode = item.product || item.variant?.product || {};
    const hasCoreFields = Boolean(
      item.product_id
      || productNode.id
      || productNode.name
      || item.product_name
      || item.name
      || item.title
      || item.quantity
      || item.qty
    );
    if (!hasCoreFields) return false;

    if (!orderId) return true;
    const itemOrderId = String(item.order_id ?? item.orderId ?? item.parent_order_id ?? '');
    if (!itemOrderId) return true;
    return itemOrderId === orderId;
  };

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length) {
      const filtered = candidate.filter(isOrderLine);
      if (filtered.length) {
        return filtered;
      }
    }
  }

  return [];
};

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderIdParamRaw = searchParams.get('orderId');
  const orderIdParam = orderIdParamRaw?.trim() ? orderIdParamRaw.trim() : '';
  const [loading, setLoading] = useState(() => Boolean(orderIdParam));
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [orderDraft, setOrderDraft] = useState(null);
  const [orderLookupInput, setOrderLookupInput] = useState(orderIdParam);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateModalRating, setRateModalRating] = useState(5);
  const [rateModalComment, setRateModalComment] = useState('');
  const [rateModalError, setRateModalError] = useState('');
  const rateModalFocusRef = useRef(null);

  const closeRateModal = useCallback(() => {
    setRateModalOpen(false);
    setRateModalError('');
  }, []);

  useEffect(() => {
    setOrderLookupInput(orderIdParam);
  }, [orderIdParam]);

  const loadOrder = useCallback(async ({ withLoader = false } = {}) => {
    if (!orderIdParam) {
      setError('');
      setOrder(null);
      setLoading(false);
      return;
    }

    try {
      if (withLoader) setLoading(true);
      setError('');
      const response = await getOrderDetails({ orderId: orderIdParam });
      if (response == null || typeof response !== 'object') {
        setOrder(null);
        setError('We could not find an order with that number. Check your order ID and try again.');
        return;
      }
      setOrder(response);
    } catch (err) {
      setOrder(null);
      setError(err?.response?.data?.message || 'We could not load this order. Please try again in a moment.');
    } finally {
      if (withLoader) setLoading(false);
    }
  }, [orderIdParam]);

  useEffect(() => {
    loadOrder({ withLoader: true });
  }, [loadOrder]);

  useEffect(() => {
    if (!orderIdParam) return undefined;
    const handleFocus = () => {
      loadOrder({ withLoader: false });
    };
    window.addEventListener('focus', handleFocus);
    const intervalId = window.setInterval(() => {
      loadOrder({ withLoader: false });
    }, 15000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.clearInterval(intervalId);
    };
  }, [orderIdParam, loadOrder]);

  useEffect(() => {
    if (!orderIdParam) return;
    try {
      const raw = sessionStorage.getItem(`orderDraft:${orderIdParam}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setOrderDraft(parsed);
    } catch {
      setOrderDraft(null);
    }
  }, [orderIdParam]);

  useEffect(() => {
    if (!rateModalOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeRateModal();
    };
    window.addEventListener('keydown', onKeyDown);
    const t = window.setTimeout(() => rateModalFocusRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [rateModalOpen, closeRateModal]);

  const orderItems = useMemo(() => {
    const apiItems = extractOrderItems(order);
    const draftItems = Array.isArray(orderDraft?.items) ? orderDraft.items : [];
    const items = apiItems.length ? apiItems : draftItems;
    if (!items.length) {
      return [];
    }

    return items.map((item, index) => {
      const product = item?.product || item?.variant?.product || item;
      const quantity = Number(item?.quantity ?? item?.qty ?? item?.count ?? 1);
      const fallbackSubtotal = Number(item?.subtotal ?? item?.total ?? 0);
      const directPrice = Number(
        item?.unit_price
        ?? item?.price
        ?? item?.unit_price
        ?? item?.sale_price
        ?? product?.sale_price
        ?? product?.price
        ?? 0
      );
      const subtotal = Number(item?.subtotal ?? item?.total ?? directPrice * quantity);
      const price = directPrice > 0
        ? directPrice
        : (quantity > 0 && fallbackSubtotal > 0 ? fallbackSubtotal / quantity : 0);
      return {
        id: item?.id ?? product?.id ?? index + 1,
        name: product?.name || item?.product_name || item?.name || item?.title || `Item #${index + 1}`,
        image: product?.image || product?.thumb_image || '',
        price: formatMoney(price),
        quantity,
        subtotal: formatMoney(subtotal),
      };
    });
  }, [order, orderDraft]);

  const handleOrderLookupSubmit = (e) => {
    e.preventDefault();
    const id = String(orderLookupInput || '').trim();
    if (!id) return;
    navigate(`/track-order?orderId=${encodeURIComponent(id)}`);
  };

  const openRateModal = () => {
    const resolvedOrderId = String(order?.id ?? orderIdParam ?? '').trim();
    if (!resolvedOrderId) {
      setRatingMessage('Order id is missing. Open track page from My Orders.');
      return;
    }
    if (!isOrderRateable(order)) {
      setRatingMessage('You can rate after the order is paid or delivered.');
      return;
    }
    setRateModalRating(5);
    setRateModalComment('');
    setRateModalError('');
    setRatingMessage('');
    setRateModalOpen(true);
  };

  const submitRateModal = async () => {
    const resolvedOrderId = String(order?.id ?? orderIdParam ?? '').trim();
    if (!resolvedOrderId) return;
    const rating = Number(rateModalRating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return;
    try {
      setRatingLoading(true);
      setRateModalError('');
      await rateOrder({
        orderId: resolvedOrderId,
        rating,
        comment: rateModalComment.trim(),
      });
      closeRateModal();
      setRatingMessage('Thank you! Your rating was submitted.');
      await loadOrder({ withLoader: false });
    } catch (err) {
      const data = err?.response?.data;
      let msg = 'Failed to submit rating.';
      if (data?.errors && typeof data.errors === 'object') {
        const parts = Object.values(data.errors).flat().filter(Boolean);
        if (parts.length) msg = parts.join(' ');
      } else if (typeof data?.message === 'string' && data.message.trim()) {
        msg = data.message.trim();
      }
      setRateModalError(msg);
    } finally {
      setRatingLoading(false);
    }
  };

  const orderData = {
    orderId: `#${order?.id ?? orderIdParam ?? '-'}`,
    orderDate: formatDate(order?.created_at || order?.date),
    productCount: orderItems.length,
    totalPrice: formatMoney(order?.total ?? order?.total_amount ?? order?.grand_total ?? 0),
    expectedArrival: formatDate(order?.expected_arrival || order?.delivery_date || order?.updated_at),
    products: orderItems,
    billingAddress: {
      name: order?.billing_address?.name || order?.user?.name || '-',
      address: order?.billing_address?.address || order?.address?.address || '-',
      phone: order?.billing_address?.phone || order?.user?.phone || '-',
      email: order?.billing_address?.email || order?.user?.email || '-',
    },
    shippingAddress: {
      name: order?.shipping_address?.name || order?.user?.name || '-',
      address: order?.shipping_address?.address || order?.address?.address || '-',
      phone: order?.shipping_address?.phone || order?.user?.phone || '-',
      email: order?.shipping_address?.email || order?.user?.email || '-',
    },
    orderNotes: order?.notes || '-',
  };

  const orderFinancials = {
    subtotal: formatMoney(order?.sub_total ?? order?.subtotal ?? 0),
    shipping: formatMoney(order?.total_shipping ?? order?.shipping ?? 0),
    discount: formatMoney(
      (Number(order?.order_discount ?? 0) || 0)
      + (Number(order?.coupon_discount ?? 0) || 0)
      + (Number(order?.points_discount ?? 0) || 0)
      + (Number(order?.wallet_used ?? 0) || 0)
    ),
    total: formatMoney(order?.total ?? order?.grand_total ?? order?.total_amount ?? 0),
    paymentStatus: order?.payment_status ?? order?.paymentStatus ?? '-',
  };

  const paymentProgress = useMemo(() => {
    if (!order) {
      return { width: '0%', stages: [] };
    }
    const idx = getPaymentProgressIndex(order);
    const refunded = isRefundedLike(order);
    const stages = [
      { id: 1, name: 'Order placed', icon: imgDocumentIcon, active: idx >= 1 },
      { id: 2, name: 'Awaiting payment', icon: imgBoxIcon, active: idx >= 2 },
      { id: 3, name: 'Payment received', icon: imgTruckIcon, active: idx >= 3 },
      {
        id: 4,
        name: refunded ? 'Refunded' : 'Complete',
        icon: imgHandshakeIcon,
        active: idx >= 4,
      },
    ];
    return {
      width: `${Math.max(0, Math.min(4, idx)) * 25}%`,
      stages,
    };
  }, [order]);

  const showOrderTracking = Boolean(orderIdParam) && Boolean(order) && !loading && !error;

  const activityLog = useMemo(() => {
    const rawActivity = order?.activity_log || order?.activities || order?.timeline || [];
    if (Array.isArray(rawActivity) && rawActivity.length) {
      return rawActivity.map((entry, index) => ({
        id: entry?.id ?? index + 1,
        description: entry?.description || entry?.message || `Status: ${entry?.status || '-'}`,
        date: formatDate(entry?.created_at || entry?.date || entry?.timestamp),
      }));
    }

    const updates = [];
    if (order?.created_at) {
      updates.push({
        id: 1,
        description: 'Order created.',
        date: formatDate(order.created_at),
      });
    }
    if (order?.updated_at && order?.updated_at !== order?.created_at) {
      updates.push({
        id: 2,
        description: `Order updated (${order?.status || 'pending'}).`,
        date: formatDate(order.updated_at),
      });
    }
    return updates;
  }, [order]);

  const resolvedOrderIdForModal = String(order?.id ?? orderIdParam ?? '').trim();

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      {rateModalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="track-rate-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0e1c47]/45 dark:bg-black/55 backdrop-blur-[2px] cursor-default"
            aria-label="Close dialog"
            onClick={closeRateModal}
          />
          <div className="relative w-full max-w-[480px] bg-white dark:bg-[#1e293b] rounded-[8px] shadow-[0_20px_50px_rgba(14,28,71,0.18)] border border-[#e6e6e6] dark:border-[#334155] p-[24px] sm:p-[28px]">
            <h2
              id="track-rate-modal-title"
              className="font-['Poppins'] font-semibold text-[20px] sm:text-[22px] text-[#0e1c47] dark:text-white mb-[8px]"
            >
              Rate your order
            </h2>
            <p className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#e5e7eb] mb-[20px]">
              Order #{resolvedOrderIdForModal || '—'}. How was your experience?
            </p>
            <p className="font-['Poppins'] font-medium text-[13px] text-[#0e1c47] dark:text-white mb-[10px]">Your rating</p>
            <div className="flex flex-wrap gap-[8px] mb-[20px]" role="group" aria-label="Rating 1 to 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  ref={n === 5 ? rateModalFocusRef : undefined}
                  type="button"
                  onClick={() => {
                    setRateModalRating(n);
                    if (rateModalError) setRateModalError('');
                  }}
                  className={`min-w-[44px] h-[44px] rounded-[6px] font-['Poppins'] font-semibold text-[15px] transition-colors ${
                    rateModalRating === n
                      ? 'bg-[#eea137] text-white border-2 border-[#eea137]'
                      : 'bg-white dark:bg-[#0f172a] text-[#0e1c47] dark:text-white border-2 border-[#e6e6e6] dark:border-[#334155] hover:border-[#eea137]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <label htmlFor="track-rate-comment" className="block font-['Poppins'] font-medium text-[13px] text-[#0e1c47] dark:text-white mb-[8px]">
              Comment <span className="font-normal text-[#666] dark:text-[#94a3b8]">(optional)</span>
            </label>
            <div className="mb-[20px]">
              <textarea
                id="track-rate-comment"
                rows={3}
                value={rateModalComment}
                onChange={(e) => {
                  setRateModalComment(e.target.value);
                  if (rateModalError) setRateModalError('');
                }}
                placeholder="Share any feedback…"
                className={`w-full px-[14px] py-[12px] border rounded-[6px] font-['Poppins'] text-[14px] text-[#0e1c47] dark:text-white dark:bg-[#0f172a] placeholder:text-[#999] dark:placeholder:text-[#64748b] focus:outline-none focus:border-[#eea137] resize-y min-h-[88px] ${
                  rateModalError ? 'border-[#f87171]' : 'border-[#e6e6e6] dark:border-[#334155]'
                }`}
              />
              {rateModalError ? (
                <p className="font-['Poppins'] text-[13px] text-[#b91c1c] dark:text-[#fca5a5] mt-[10px]" role="alert">
                  {rateModalError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-[10px]">
              <button
                type="button"
                onClick={closeRateModal}
                className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] border border-[#e6e6e6] dark:border-[#334155] text-[#0e1c47] dark:text-white hover:border-[#eea137] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => submitRateModal()}
                disabled={ratingLoading}
                className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] bg-[#0e1c47] dark:bg-[#eea137] text-white disabled:opacity-50 transition-colors"
              >
                {ratingLoading ? 'Submitting…' : 'Submit rating'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-[24px] sm:gap-[32px] md:gap-[40px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] dark:text-white text-[14px] hover:text-[#eea137] transition-colors cursor-pointer">
            Home
          </Link>
          <div className="flex items-center justify-center relative size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]" data-name="arrow-down">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
          <p className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px] lowercase">
            track order
          </p>
        </div>

        {!orderIdParam && !loading ? (
          <div className="w-full bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm transition-colors duration-300">
            <h1 className="font-['Poppins'] font-bold text-[26px] sm:text-[32px] md:text-[36px] text-[#0e1c47] dark:text-white mb-[10px]">
              Track your order
            </h1>
            <p className="font-['Poppins'] text-[15px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] max-w-[560px] mb-[24px] leading-relaxed">
              Enter the order number from your confirmation email or your account to see delivery status and details.
            </p>
            <form onSubmit={handleOrderLookupSubmit} className="flex flex-col sm:flex-row gap-[12px] sm:items-end max-w-[520px]">
              <div className="flex-1 w-full">
                <label htmlFor="track-order-id" className="block font-['Poppins'] font-medium text-[13px] text-[#0e1c47] dark:text-white mb-[6px]">
                  Order number
                </label>
                <input
                  id="track-order-id"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="e.g. 12345"
                  value={orderLookupInput}
                  onChange={(e) => setOrderLookupInput(e.target.value)}
                  className="w-full border border-[#d0d7de] dark:border-[#334155] dark:bg-[#0f172a] rounded-[6px] px-[12px] py-[10px] font-['Poppins'] text-[14px] text-[#0e1c47] dark:text-white placeholder:text-[#999]"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 bg-[#0e1c47] dark:bg-[#eea137] text-white font-['Poppins'] font-semibold px-[24px] py-[10px] rounded-[4px] text-[14px] hover:opacity-90 transition-opacity"
              >
                View order
              </button>
            </form>
            <p className="font-['Poppins'] text-[14px] text-[#666] dark:text-[#e5e7eb] mt-[20px]">
              <span className="text-[#666] dark:text-[#e5e7eb]">Signed in? </span>
              <Link to="/my-orders" className="text-[#eea137] font-semibold hover:underline">
                Go to My Orders
              </Link>
            </p>
          </div>
        ) : null}

        {orderIdParam && loading ? (
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
              Loading order details...
            </p>
          </div>
        ) : null}

        {orderIdParam && !loading && error ? (
          <div
            className="bg-white dark:bg-[#1e293b] border border-[#fecaca] dark:border-[#7f1d1d] border-solid rounded-[4px] p-[24px] sm:p-[28px] w-full shadow-sm transition-colors duration-300"
            role="alert"
          >
            <h2 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[8px]">
              We couldn&apos;t show this order
            </h2>
            <p className="font-['Poppins'] text-[14px] sm:text-[15px] text-[#991b1b] dark:text-[#fecaca] mb-[20px] leading-relaxed">
              {error}
            </p>
            <div className="flex flex-wrap gap-[12px] items-center">
              <button
                type="button"
                onClick={() => loadOrder({ withLoader: true })}
                className="bg-[#0e1c47] dark:bg-[#eea137] text-white font-['Poppins'] font-semibold px-[18px] py-[8px] rounded-[4px] text-[13px] hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
              <Link
                to="/my-orders"
                className="font-['Poppins'] font-semibold text-[14px] text-[#eea137] hover:underline"
              >
                View all my orders
              </Link>
              <button
                type="button"
                onClick={() => navigate('/track-order')}
                className="font-['Poppins'] font-medium text-[14px] text-[#666] dark:text-[#e5e7eb] hover:text-[#0e1c47] dark:hover:text-white"
              >
                Track a different order
              </button>
            </div>
          </div>
        ) : null}

        {showOrderTracking ? (
        <>
        {/* Order Summary Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[16px] sm:gap-[24px] mb-[24px] sm:mb-[32px]">
            <div className="flex flex-col gap-[8px]">
              <h1 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] dark:text-white">
                {orderData.orderId}
              </h1>
              <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
                {orderData.productCount} Products • Order Placed in {orderData.orderDate}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-[8px]">
              <p className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] dark:text-white">
                {orderData.totalPrice}
              </p>
              <button
                type="button"
                onClick={openRateModal}
                disabled={ratingLoading || !isOrderRateable(order)}
                title={
                  isOrderRateable(order)
                    ? undefined
                    : 'You can rate after the order is paid or delivered.'
                }
                className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#eea137] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Leave a rating
              </button>
            </div>
          </div>

          {ratingMessage ? (
            <p className="font-['Poppins'] font-normal text-[13px] text-[#0e1c47] mb-[12px]">
              {ratingMessage}
            </p>
          ) : null}

          {/* Payment progress (steps follow payment_status / is_paid, not shipping) */}
          <div className="mb-[24px] sm:mb-[32px]">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] mb-[16px] sm:mb-[20px]">
              Payment status:{' '}
              <span className="font-semibold text-[#0e1c47] dark:text-white">{orderFinancials.paymentStatus}</span>
              {orderData.expectedArrival && orderData.expectedArrival !== '-' ? (
                <>
                  {' '}
                  · Expected arrival {orderData.expectedArrival}
                </>
              ) : null}
            </p>
            
            {/* Progress Bar */}
            <div className="relative w-full">
              {/* Progress Line */}
              <div className="absolute top-[24px] left-0 right-0 h-[2px] bg-[#e6e6e6] dark:bg-[#334155] z-0 transition-colors duration-300">
                <div className="h-full bg-[#eea137] transition-all" style={{ width: paymentProgress.width }}></div>
              </div>
              
              {/* Progress Stages */}
              <div className="relative flex justify-between items-start z-10">
                {paymentProgress.stages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center gap-[8px] sm:gap-[12px] flex-1 max-w-[25%]">
                    <div className={`relative z-10 size-[48px] rounded-full flex items-center justify-center transition-all ${stage.active ? 'bg-[#eea137]' : 'bg-white dark:bg-[#0f172a] border-2 border-[#e6e6e6] dark:border-[#334155]'}`}>
                      {stage.active ? (
                        <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <img 
                          alt={stage.name} 
                          className="w-[20px] h-[20px] opacity-30 dark:opacity-50 dark:brightness-0 dark:invert" 
                          src={stage.icon}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <p className={`font-['Poppins'] font-medium text-[14px] text-center whitespace-nowrap ${stage.active ? 'text-[#eea137]' : 'text-[#666] dark:text-white'}`}>
                      {stage.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Financial Summary */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <h2 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] md:text-[28px] text-[#0e1c47] dark:text-white mb-[20px] sm:mb-[24px]">
            Order Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[12px] sm:gap-[16px]">
            <div>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#e5e7eb]">Subtotal</p>
              <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] dark:text-white">{orderFinancials.subtotal}</p>
            </div>
            <div>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#e5e7eb]">Shipping</p>
              <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] dark:text-white">{orderFinancials.shipping}</p>
            </div>
            <div>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#e5e7eb]">Discount</p>
              <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] dark:text-white">{orderFinancials.discount}</p>
            </div>
            <div>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#e5e7eb]">Total</p>
              <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] dark:text-white">{orderFinancials.total}</p>
            </div>
            <div>
              <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#e5e7eb]">Payment Status</p>
              <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] dark:text-white">{orderFinancials.paymentStatus}</p>
            </div>
          </div>
        </div>

        {/* Order Activity Log */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <h2 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] md:text-[28px] text-[#0e1c47] dark:text-white mb-[20px] sm:mb-[24px]">
            Order Activity
          </h2>
          
          <div className="flex flex-col gap-[16px] sm:gap-[20px]">
            {activityLog.length ? activityLog.map((activity) => (
              <div key={activity.id} className="flex gap-[12px] sm:gap-[16px] items-start">
                <div className="relative shrink-0 size-[24px] sm:size-[28px] mt-[2px]">
                  <div className="w-full h-full rounded-full bg-[#eea137] flex items-center justify-center">
                    <svg className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white mb-[4px] leading-relaxed">
                    {activity.description}
                  </p>
                  <p className="font-['Poppins'] font-normal text-[12px] sm:text-[14px] text-[#666] dark:text-[#e5e7eb]">
                    {activity.date}
                  </p>
                </div>
              </div>
            )) : (
              <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
                No activity available for this order yet.
              </p>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
          <h2 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] md:text-[28px] text-[#0e1c47] dark:text-white mb-[20px] sm:mb-[24px]">
            Product ({orderData.products.length})
          </h2>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            {orderData.products.length ? (
              <table className="w-full">
              <thead>
                <tr className="border-b border-[#e6e6e6] dark:border-[#334155] transition-colors duration-300">
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">PRODUCTS</th>
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">PRICE</th>
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">QUANTITY</th>
                  <th className="text-left py-[12px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">SUB-TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderData.products.map((product) => (
                  <tr key={product.id} className="border-b border-[#e6e6e6] dark:border-[#334155] last:border-b-0 transition-colors duration-300">
                    <td className="py-[16px] px-[16px]">
                      <div className="flex items-center gap-[12px] sm:gap-[16px]">
                        <img 
                          alt={product.name} 
                          className="w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] object-cover rounded-[4px]" 
                          src={product.image}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-[16px] px-[16px] font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                      {product.price}
                    </td>
                    <td className="py-[16px] px-[16px] font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                      x{product.quantity}
                    </td>
                    <td className="py-[16px] px-[16px] font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white">
                      {product.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            ) : (
              <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
                No products are available for this order.
              </p>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-[16px]">
            {orderData.products.length ? orderData.products.map((product) => (
              <div key={product.id} className="border border-[#e6e6e6] dark:border-[#334155] rounded-[4px] p-[16px] transition-colors duration-300">
                <div className="flex gap-[12px] mb-[12px]">
                  <img 
                    alt={product.name} 
                    className="w-[80px] h-[80px] object-cover rounded-[4px] shrink-0" 
                    src={product.image}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-['Poppins'] font-normal text-[14px] text-[#0e1c47] dark:text-white mb-[8px]">
                      {product.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] dark:text-white">
                        {product.price}
                      </span>
                      <span className="font-['Poppins'] font-medium text-[14px] text-[#666] dark:text-[#e5e7eb]">
                        Qty: {product.quantity}
                      </span>
                    </div>
                    <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] dark:text-white mt-[8px]">
                      Sub-total: {product.subtotal}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
                No products are available for this order.
              </p>
            )}
          </div>
        </div>

        {/* Address and Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] sm:gap-[24px] w-full">
          {/* Billing Address */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] shadow-sm transition-colors duration-300">
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[16px] sm:mb-[20px]">
              Billing Address
            </h3>
            <div className="flex flex-col gap-[8px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
              <p className="text-[#0e1c47] dark:text-white font-medium">{orderData.billingAddress.name}</p>
              <p>{orderData.billingAddress.address}</p>
              <p>{orderData.billingAddress.phone}</p>
              <p>{orderData.billingAddress.email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] shadow-sm transition-colors duration-300">
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[16px] sm:mb-[20px]">
              Shipping Address
            </h3>
            <div className="flex flex-col gap-[8px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
              <p className="text-[#0e1c47] dark:text-white font-medium">{orderData.shippingAddress.name}</p>
              <p>{orderData.shippingAddress.address}</p>
              <p>{orderData.shippingAddress.phone}</p>
              <p>{orderData.shippingAddress.email}</p>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] shadow-sm transition-colors duration-300">
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] dark:text-white mb-[16px] sm:mb-[20px]">
              Order Notes
            </h3>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] leading-relaxed">
              {orderData.orderNotes}
            </p>
          </div>
        </div>
        </>
        ) : null}
      </div>
    </div>
  );
}

