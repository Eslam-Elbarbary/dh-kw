// My Orders page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getMyOrders,
  cancelOrder,
  reorderOrder,
  payOrder,
  extractOrderPaymentUrl,
  navigateToPaymentGateway,
  openPaymentGatewayPlaceholderTab,
  requestOrderRefund,
  rateOrder,
  isOrderRateable,
} from '../services/orders.service';
import { getMyDigitalOrders } from '../services/digitalOrders.service';
import {
  extractDigitalOrderPaymentUrl,
  openPaymentGatewayPlaceholderTab as openDigitalPaymentPlaceholderTab,
  payDigitalOrder,
} from '../services/digitalOrders.service';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

/** Refund requests are usually rejected for cancelled / settled orders; backend returns generic errors. */
const isOrderEligibleForRefundRequest = (status) => {
  const s = String(status || '').trim().toLowerCase();
  if (!s) return false;
  if (s.includes('cancel')) return false;
  return true;
};

const isOrderCancellableByStatus = (status) => {
  const s = String(status || '').trim().toLowerCase();
  if (!s) return true;
  return !s.includes('cancel');
};

/**
 * Order list `status` is usually fulfillment (pending/processing/shipped). Payment is often a separate API field
 * (`payment_status`), so "pending" does not mean unpaid — see `paymentStatus` on each order.
 */
const isPaymentCompleteByLabel = (paymentStatus) => {
  const s = String(paymentStatus || '').trim().toLowerCase();
  if (!s) return false;
  if (s.includes('unpaid') || s.includes('not paid') || s.includes('fail') || s.includes('declin')) return false;
  if (s.includes('paid')) return true;
  if (s.includes('success')) return true;
  if (s.includes('captured') || s.includes('settled')) return true;
  if (s.includes('complete') && (s.includes('pay') || s === 'completed')) return true;
  return false;
};

/** Payment is only meaningful for orders that are still open and not already paid. */
const isOrderPayableByStatus = (status, paymentStatus) => {
  const s = String(status || '').trim().toLowerCase();
  if (!s) return false;
  if (s.includes('cancel')) return false;
  if (isPaymentCompleteByLabel(paymentStatus)) return false;
  return true;
};

const payButtonsTitle = (status, paymentStatus) => {
  if (isOrderPayableByStatus(status, paymentStatus)) return undefined;
  if (isPaymentCompleteByLabel(paymentStatus)) return 'This order is already marked as paid.';
  return 'Payment is not available for cancelled orders.';
};

const resolveOrderActionErrorMessage = (err) => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const parts = Object.values(data.errors).flat().filter(Boolean);
    if (parts.length) return parts.join(' ');
  }
  const msg = data?.message;
  if (msg && String(msg).trim()) return String(msg).trim();
  return 'Something went wrong. Please try again.';
};

const formatRefundServerAlert = (rawMessage) => {
  const text = String(rawMessage || '').trim();
  const lower = text.toLowerCase();

  if (
    lower.includes('unable to create refund')
    || lower.includes('cannot create refund')
    || lower.includes('could not create refund')
    || lower.includes('refund request')
    || lower.includes('not eligible')
    || lower.includes('not available for refund')
  ) {
    return {
      title: "We couldn't start a refund request",
      detail:
        'This often happens if the order was cancelled, already refunded, or is outside the return window. If you still need help, contact support and include your order number.',
    };
  }

  if (lower.includes('order not found')) {
    return {
      title: 'Order not found',
      detail: "We couldn't match this order. Refresh the page or sign in again, then try once more.",
    };
  }

  if (lower.includes('not allowed') && lower.includes('refund')) {
    return {
      title: 'Refund not available for this order',
      detail:
        'Your account may not have permission to refund this order, or the order status does not allow refunds (for example it may need to be delivered first, or may already be closed). Contact support with your order number if you need help.',
    };
  }

  return {
    title: 'Something went wrong',
    detail: text || 'Please try again in a moment or contact support.',
  };
};

export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderScope = searchParams.get('tab') === 'digital' ? 'digital' : 'store';

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [digitalOrders, setDigitalOrders] = useState([]);
  const [digitalLoading, setDigitalLoading] = useState(false);
  const [digitalError, setDigitalError] = useState('');
  const [actionLoadingByOrderId, setActionLoadingByOrderId] = useState({});
  const [actionBanner, setActionBanner] = useState(null);
  const [modal, setModal] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundFieldError, setRefundFieldError] = useState('');
  const [refundServerAlert, setRefundServerAlert] = useState(null);
  const [refundModalPhase, setRefundModalPhase] = useState('form');
  const [rateRating, setRateRating] = useState(5);
  const [rateComment, setRateComment] = useState('');
  const [rateModalError, setRateModalError] = useState('');
  const refundTextareaRef = useRef(null);
  const refundDoneRef = useRef(null);
  const rateFirstFocusRef = useRef(null);

  const closeModal = useCallback(() => {
    setModal(null);
    setRefundModalPhase('form');
  }, []);

  useEffect(() => {
    if (!modal) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    const t = window.setTimeout(() => {
      if (modal.type === 'refund') {
        if (refundModalPhase === 'success') refundDoneRef.current?.focus();
        else refundTextareaRef.current?.focus();
      } else {
        rateFirstFocusRef.current?.focus();
      }
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modal, refundModalPhase, closeModal]);

  const normalizeOrderFromActionResponse = (payload) => {
    const orderNode = payload?.data?.order
      || payload?.order
      || payload?.data
      || null;
    if (!orderNode || typeof orderNode !== 'object') {
      return null;
    }

    const id = String(orderNode?.id ?? orderNode?.order_id ?? '');
    if (!id) return null;

    const status = orderNode?.status ?? orderNode?.order_status ?? 'pending';
    const total = Number(orderNode?.total ?? orderNode?.total_amount ?? orderNode?.grand_total ?? 0) || 0;
    const date = orderNode?.created_at ?? orderNode?.date ?? new Date().toISOString();
    const items = Array.isArray(orderNode?.items)
      ? orderNode.items.length
      : Number(orderNode?.items_count ?? orderNode?.qty ?? 0) || 0;
    const paymentStatus = orderNode?.payment_status
      ?? orderNode?.paymentStatus
      ?? (orderNode?.is_paid === true || orderNode?.paid === true ? 'Paid'
        : orderNode?.is_paid === false || orderNode?.paid === false ? 'Unpaid'
        : '');

    return { id, status, total, date, items, paymentStatus: String(paymentStatus || '').trim() };
  };

  const loadOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getMyOrders();
      setOrders(response);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load orders.';
      setError(message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDigitalOrders = async () => {
    if (!isAuthenticated) {
      setDigitalOrders([]);
      return;
    }
    try {
      setDigitalLoading(true);
      setDigitalError('');
      const rows = await getMyDigitalOrders();
      setDigitalOrders(rows);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load digital orders.';
      setDigitalError(message);
      setDigitalOrders([]);
    } finally {
      setDigitalLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || orderScope !== 'digital') return;
    loadDigitalOrders();
  }, [isAuthenticated, orderScope]);

  const runOrderAction = async (orderId, action, { suppressErrorBanner = false } = {}) => {
    try {
      setActionBanner(null);
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: true }));
      const result = await action();
      await loadOrders();
      return { ok: true, result };
    } catch (err) {
      const message = resolveOrderActionErrorMessage(err);
      if (!suppressErrorBanner) {
        setActionBanner({ message, variant: 'error' });
      }
      return { ok: false, message };
    } finally {
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleCancelOrder = async (orderId, orderStatus) => {
    if (!isOrderCancellableByStatus(orderStatus)) return;
    await runOrderAction(orderId, async () => {
      await cancelOrder({ orderId });
      setActionBanner({ message: `Order #${orderId} cancelled successfully.`, variant: 'success' });
    });
  };

  const handleReorder = async (orderId) => {
    const outcome = await runOrderAction(orderId, async () => {
      const reorderResponse = await reorderOrder({ orderId });
      setActionBanner({ message: `Order #${orderId} reordered successfully.`, variant: 'success' });
      return reorderResponse;
    });
    if (!outcome?.ok) return;
    const createdOrder = normalizeOrderFromActionResponse(outcome.result);
    if (createdOrder) {
      setOrders((prev) => {
        const exists = prev.some((item) => String(item.id) === String(createdOrder.id));
        if (exists) return prev;
        return [createdOrder, ...prev];
      });
    }
  };

  const handlePayOrder = async (orderId, paymentMethod = 'sadad', orderStatus, paymentStatus) => {
    if (!isOrderPayableByStatus(orderStatus, paymentStatus)) return;
    const paymentTab = openPaymentGatewayPlaceholderTab();
    try {
      setActionBanner(null);
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: true }));
      const result = await payOrder({ orderId, paymentMethod });
      const paymentUrl = extractOrderPaymentUrl(result);
      if (paymentUrl) {
        navigateToPaymentGateway(paymentUrl, paymentTab);
        return;
      }
      paymentTab?.close();
      setActionBanner({
        message: 'Payment started but no redirect link was returned. Try again or contact support.',
        variant: 'error',
      });
    } catch (err) {
      paymentTab?.close();
      setActionBanner({ message: resolveOrderActionErrorMessage(err), variant: 'error' });
    } finally {
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handlePayDigitalOrder = async (orderId, orderStatus, paymentStatus) => {
    if (!isOrderPayableByStatus(orderStatus, paymentStatus)) return;
    const paymentTab = openDigitalPaymentPlaceholderTab();
    try {
      setActionBanner(null);
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: true }));
      const result = await payDigitalOrder({ orderId });
      const paymentUrl = extractDigitalOrderPaymentUrl(result);
      if (paymentUrl) {
        navigateToPaymentGateway(paymentUrl, paymentTab);
        return;
      }
      paymentTab?.close();
      setActionBanner({
        message: 'Payment started but no redirect link was returned. Try again or contact support.',
        variant: 'error',
      });
    } catch (err) {
      paymentTab?.close();
      setActionBanner({ message: resolveOrderActionErrorMessage(err), variant: 'error' });
    } finally {
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const openRefundModal = (orderId, orderStatus) => {
    if (!isOrderEligibleForRefundRequest(orderStatus)) return;
    setRefundReason('');
    setRefundFieldError('');
    setRefundServerAlert(null);
    setRefundModalPhase('form');
    setModal({ type: 'refund', orderId });
  };

  const submitRefundModal = async () => {
    if (modal?.type !== 'refund' || refundModalPhase !== 'form') return;
    const reason = refundReason.trim();
    if (!reason) {
      setRefundFieldError('Please enter a refund reason.');
      setRefundServerAlert(null);
      return;
    }
    setRefundFieldError('');
    setRefundServerAlert(null);
    const { orderId } = modal;
    const outcome = await runOrderAction(orderId, async () => {
      await requestOrderRefund({ orderId, reason });
    }, { suppressErrorBanner: true });
    if (outcome.ok) setRefundModalPhase('success');
    else setRefundServerAlert(formatRefundServerAlert(outcome.message));
  };

  const openRateModal = (order) => {
    if (!isOrderRateable(order)) return;
    setRateRating(5);
    setRateComment('');
    setRateModalError('');
    setModal({ type: 'rate', orderId: order.id });
  };

  const submitRateModal = async () => {
    if (modal?.type !== 'rate') return;
    const rating = Number(rateRating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return;
    }
    const { orderId } = modal;
    const comment = rateComment.trim();
    setRateModalError('');
    const outcome = await runOrderAction(orderId, async () => {
      await rateOrder({ orderId, rating, comment });
      setActionBanner({ message: `Order #${orderId} rated successfully.`, variant: 'success' });
    }, { suppressErrorBanner: true });
    if (outcome.ok) setModal(null);
    else setRateModalError(outcome.message);
  };

  /** All, unpaid (**Pending**), **Paid**, **Delivered** (fulfillment), **Cancelled**. */
  const filters = ['All', 'Pending', 'Paid', 'Delivered', 'Cancelled'];
  const activeFilter = filters.includes(selectedFilter) ? selectedFilter : 'All';

  const matchesFilter = (order, filter) => {
    if (filter === 'All') return true;
    const normalizedStatus = String(order.status || '').trim().toLowerCase();
    const cancelled = normalizedStatus.includes('cancel');

    if (filter === 'Cancelled') return cancelled;

    if (cancelled) return false;

    if (filter === 'Delivered') {
      return normalizedStatus.includes('deliver');
    }

    if (filter === 'Paid') {
      return isPaymentCompleteByLabel(order.paymentStatus);
    }

    if (filter === 'Pending') {
      return !isPaymentCompleteByLabel(order.paymentStatus);
    }

    return false;
  };

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter((order) => matchesFilter(order, activeFilter));

  const filteredDigitalOrders = activeFilter === 'All'
    ? digitalOrders
    : digitalOrders.filter((order) => matchesFilter(order, activeFilter));

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'on the road':
      case 'shipping':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const bannerStyles =
    actionBanner?.variant === 'error'
      ? 'border-[#fecaca] bg-[#fef2f2]'
      : actionBanner?.variant === 'success'
        ? 'border-[#a7f3d0] bg-[#ecfdf5]'
        : 'border-[#e6e6e6] bg-white';

  return (
    <div className="bg-white relative w-full min-h-screen">
      {modal?.type === 'refund' ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={refundModalPhase === 'success' ? 'refund-success-title' : 'refund-modal-title'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0e1c47]/45 backdrop-blur-[2px] cursor-default"
            aria-label="Close dialog"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-[8px] shadow-[0_20px_50px_rgba(14,28,71,0.18)] border border-[#e6e6e6] p-[24px] sm:p-[28px]">
            {refundModalPhase === 'success' ? (
              <div className="flex flex-col items-center text-center pt-[8px] pb-[4px]">
                <div className="mb-[18px] flex size-[56px] items-center justify-center rounded-full bg-[#ecfdf5] border border-[#a7f3d0]" aria-hidden>
                  <svg className="size-[28px] text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 id="refund-success-title" className="font-['Poppins'] font-semibold text-[20px] sm:text-[22px] text-[#0e1c47] mb-[10px]">
                  Refund request submitted
                </h2>
                <p className="font-['Poppins'] text-[14px] text-[#666] leading-relaxed max-w-[380px] mb-[8px]">
                  Thank you. We&apos;ve received your request for <span className="font-semibold text-[#0e1c47]">order #{modal.orderId}</span>.
                </p>
                <p className="font-['Poppins'] text-[13px] text-[#666] leading-relaxed max-w-[380px] mb-[26px]">
                  Our team will review it and contact you by email if we need anything else. You can close this window when you&apos;re done.
                </p>
                <button
                  ref={refundDoneRef}
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto min-w-[200px] font-['Poppins'] font-semibold px-[28px] py-[12px] rounded-[4px] bg-[#0e1c47] text-white hover:bg-[#152a5c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eea137] focus-visible:ring-offset-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 id="refund-modal-title" className="font-['Poppins'] font-semibold text-[20px] sm:text-[22px] text-[#0e1c47] mb-[8px]">
                  Request a refund
                </h2>
                <p className="font-['Poppins'] text-[14px] text-[#666] mb-[20px]">
                  Order #{modal.orderId}. Tell us why you need a refund. Our team will review your request.
                </p>
                {refundServerAlert ? (
                  <div
                    className="mb-[20px] rounded-[6px] border border-[#fecaca] bg-[#fef2f2] p-[14px] sm:p-[16px] flex gap-[12px] items-start"
                    role="alert"
                  >
                    <span className="shrink-0 mt-[2px] flex size-[24px] items-center justify-center rounded-full bg-[#b91c1c]/12 text-[#b91c1c]" aria-hidden>
                      <svg className="size-[12px]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] mb-[6px]">
                        {refundServerAlert.title}
                      </p>
                      <p className="font-['Poppins'] text-[13px] text-[#57534e] leading-relaxed">
                        {refundServerAlert.detail}
                      </p>
                    </div>
                  </div>
                ) : null}
                <label htmlFor="refund-reason" className="block font-['Poppins'] font-medium text-[13px] text-[#0e1c47] mb-[8px]">
                  Refund reason
                </label>
                <div className="mb-[20px]">
                  <textarea
                    ref={refundTextareaRef}
                    id="refund-reason"
                    rows={4}
                    value={refundReason}
                    onChange={(e) => {
                      setRefundReason(e.target.value);
                      setRefundFieldError('');
                      setRefundServerAlert(null);
                    }}
                    placeholder="Describe the issue…"
                    aria-invalid={Boolean(refundFieldError)}
                    className={`w-full px-[14px] py-[12px] border rounded-[6px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] resize-y min-h-[100px] ${
                      refundFieldError ? 'border-[#f87171]' : 'border-[#e6e6e6]'
                    }`}
                  />
                  {refundFieldError ? (
                    <p className="font-['Poppins'] text-[13px] text-[#b91c1c] mt-[10px]" role="alert">
                      {refundFieldError}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-[10px]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] border border-[#e6e6e6] text-[#0e1c47] hover:border-[#eea137] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => submitRefundModal()}
                    disabled={Boolean(actionLoadingByOrderId[modal.orderId])}
                    className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] bg-[#0e1c47] text-white hover:bg-[#152a5c] disabled:opacity-50 transition-colors"
                  >
                    {actionLoadingByOrderId[modal.orderId] ? 'Submitting…' : 'Submit request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {modal?.type === 'rate' ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rate-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0e1c47]/45 backdrop-blur-[2px] cursor-default"
            aria-label="Close dialog"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-[8px] shadow-[0_20px_50px_rgba(14,28,71,0.18)] border border-[#e6e6e6] p-[24px] sm:p-[28px]">
            <h2 id="rate-modal-title" className="font-['Poppins'] font-semibold text-[20px] sm:text-[22px] text-[#0e1c47] mb-[8px]">
              Rate your order
            </h2>
            <p className="font-['Poppins'] text-[14px] text-[#666] mb-[20px]">
              Order #{modal.orderId}. How was your experience?
            </p>
            <p className="font-['Poppins'] font-medium text-[13px] text-[#0e1c47] mb-[10px]">Your rating</p>
            <div className="flex flex-wrap gap-[8px] mb-[20px]" role="group" aria-label="Rating 1 to 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  ref={n === 5 ? rateFirstFocusRef : undefined}
                  type="button"
                  onClick={() => {
                    setRateRating(n);
                    if (rateModalError) setRateModalError('');
                  }}
                  className={`min-w-[44px] h-[44px] rounded-[6px] font-['Poppins'] font-semibold text-[15px] transition-colors ${
                    rateRating === n
                      ? 'bg-[#eea137] text-white border-2 border-[#eea137]'
                      : 'bg-white text-[#0e1c47] border-2 border-[#e6e6e6] hover:border-[#eea137]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <label htmlFor="rate-comment" className="block font-['Poppins'] font-medium text-[13px] text-[#0e1c47] mb-[8px]">
              Comment <span className="font-normal text-[#666]">(optional)</span>
            </label>
            <div className="mb-[20px]">
              <textarea
                id="rate-comment"
                rows={3}
                value={rateComment}
                onChange={(e) => {
                  setRateComment(e.target.value);
                  if (rateModalError) setRateModalError('');
                }}
                placeholder="Share any feedback…"
                className={`w-full px-[14px] py-[12px] border rounded-[6px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] resize-y min-h-[88px] ${
                  rateModalError ? 'border-[#f87171]' : 'border-[#e6e6e6]'
                }`}
              />
              {rateModalError ? (
                <p className="font-['Poppins'] text-[13px] text-[#b91c1c] mt-[10px]" role="alert">
                  {rateModalError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-[10px]">
              <button
                type="button"
                onClick={closeModal}
                className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] border border-[#e6e6e6] text-[#0e1c47] hover:border-[#eea137] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => submitRateModal()}
                disabled={Boolean(actionLoadingByOrderId[modal.orderId])}
                className="font-['Poppins'] font-semibold px-[20px] py-[11px] rounded-[4px] bg-[#0e1c47] text-white hover:bg-[#152a5c] disabled:opacity-50 transition-colors"
              >
                {actionLoadingByOrderId[modal.orderId] ? 'Submitting…' : 'Submit rating'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors cursor-pointer">
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
          <p className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]">
            My Orders
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-[20px] sm:gap-[24px]">
          <div>
            <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47] mb-[8px]">
              My Orders
            </h1>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666]">
              {orderScope === 'digital'
                ? 'Digital gift cards and codes — billed separately from store deliveries.'
                : 'Parcels and deliveries from your cart and checkout.'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        {isAuthenticated ? (
          <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
            <div className="flex flex-col gap-[12px] sm:gap-[14px]">
              <p className="font-['Poppins'] font-medium text-[13px] text-[#64748b] uppercase tracking-wide">
                Order type
              </p>
              <div
                className="flex flex-wrap gap-[10px] p-[5px] bg-[#f1f5f9] rounded-[10px] w-full sm:w-fit border border-[#e2e8f0]"
                role="tablist"
                aria-label="Order type"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={orderScope === 'store'}
                  onClick={() => {
                    setSearchParams({}, { replace: true });
                    setSelectedFilter('All');
                  }}
                  className={`font-['Poppins'] font-semibold px-[22px] py-[11px] rounded-[8px] text-[14px] sm:text-[15px] transition-colors ${
                    orderScope === 'store'
                      ? 'bg-white text-[#0e1c47] shadow-sm border border-[#e6e6e6]'
                      : 'text-[#64748b] hover:text-[#0e1c47]'
                  }`}
                >
                  Store orders
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={orderScope === 'digital'}
                  onClick={() => {
                    setSearchParams({ tab: 'digital' }, { replace: true });
                    setSelectedFilter('All');
                  }}
                  className={`font-['Poppins'] font-semibold px-[22px] py-[11px] rounded-[8px] text-[14px] sm:text-[15px] transition-colors ${
                    orderScope === 'digital'
                      ? 'bg-white text-[#0e1c47] shadow-sm border border-[#e6e6e6]'
                      : 'text-[#64748b] hover:text-[#0e1c47]'
                  }`}
                >
                  Digital orders
                </button>
              </div>
            </div>

            {/* Status filters (same rules for payment / cancelled — both order types expose payment_status + status) */}
            <div className="flex flex-wrap gap-[12px] sm:gap-[16px]">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`font-['Poppins'] font-medium px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] transition-colors text-[14px] sm:text-[16px] ${
                    activeFilter === filter
                      ? 'bg-[#eea137] text-white'
                      : 'bg-white border border-[#e6e6e6] text-[#0e1c47] hover:border-[#eea137]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {orderScope === 'store' && loading ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Loading your orders...
                </p>
              </div>
            ) : null}

            {orderScope === 'store' && error ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#8e0909]">
                  {error}
                </p>
              </div>
            ) : null}

            {orderScope === 'digital' && digitalLoading ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Loading digital orders...
                </p>
              </div>
            ) : null}

            {orderScope === 'digital' && digitalError ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#8e0909]">
                  {digitalError}
                </p>
              </div>
            ) : null}

            {actionBanner?.message ? (
              <div
                className={`rounded-[6px] border border-solid p-[14px] sm:p-[16px] flex gap-[12px] items-start ${bannerStyles}`}
                role={actionBanner.variant === 'error' ? 'alert' : 'status'}
              >
                {actionBanner.variant === 'success' ? (
                  <span className="shrink-0 mt-[2px] flex size-[22px] items-center justify-center rounded-full bg-[#059669]/15 text-[#059669]" aria-hidden>
                    <svg className="size-[12px]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : actionBanner.variant === 'error' ? (
                  <span className="shrink-0 mt-[2px] flex size-[22px] items-center justify-center rounded-full bg-[#b91c1c]/12 text-[#b91c1c]" aria-hidden>
                    <svg className="size-[12px]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
                    </svg>
                  </span>
                ) : null}
                <p
                  className={`flex-1 font-['Poppins'] text-[14px] leading-relaxed ${
                    actionBanner.variant === 'error' ? 'text-[#991b1b]' : 'text-[#0e1c47]'
                  }`}
                >
                  {actionBanner.message}
                </p>
                <button
                  type="button"
                  onClick={() => setActionBanner(null)}
                  className="shrink-0 font-['Poppins'] text-[12px] font-semibold text-[#666] hover:text-[#0e1c47] px-[4px] py-[2px]"
                  aria-label="Dismiss message"
                >
                  Dismiss
                </button>
              </div>
            ) : null}

            {/* Store orders list */}
            {orderScope === 'store' && !loading && !error && (
              filteredOrders.length > 0 ? (
                <div className="flex flex-col gap-[16px] sm:gap-[20px]">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[28px] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-[16px] sm:gap-[20px]">
                        {/* Order Details */}
                        <div className="flex-1 flex flex-col gap-[12px] sm:gap-[16px]">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[12px]">
                            <div className="flex items-start gap-[12px] min-w-0">
                              <div className="size-[52px] rounded-[6px] bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden shrink-0">
                                {order.image ? (
                                  <img src={order.image} alt={`Order ${order.id}`} className="w-full h-full object-cover" />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                              <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[4px]">
                                Order #{order.id}
                              </h3>
                              <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                                Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-[8px]">
                              <span className={`font-['Poppins'] font-medium text-[12px] sm:text-[14px] px-[12px] py-[4px] rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              {order.paymentStatus ? (
                                <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13px] text-[#666] sm:text-right max-w-[280px]">
                                  Payment:{' '}
                                  <span className="font-medium text-[#0e1c47]">{order.paymentStatus}</span>
                                </p>
                              ) : null}
                              <p className="font-['Poppins'] font-bold text-[18px] sm:text-[20px] text-[#0e1c47]">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] pt-[12px] border-t border-[#e6e6e6]">
                            <div className="flex gap-[12px]">
                              <Link
                                to={`/track-order?orderId=${order.id}`}
                                className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#eea137] hover:text-[#d8902f] transition-colors"
                              >
                                Track Order
                              </Link>
                              <Link
                                to={`/order/${encodeURIComponent(String(order.id))}`}
                                className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] hover:text-[#eea137] transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                            <div className="flex flex-wrap gap-[8px]">
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order.id, order.status)}
                                disabled={
                                  Boolean(actionLoadingByOrderId[order.id])
                                  || !isOrderCancellableByStatus(order.status)
                                }
                                title={
                                  isOrderCancellableByStatus(order.status)
                                    ? undefined
                                    : 'This order is already cancelled.'
                                }
                                className={`font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] transition-colors ${
                                  isOrderCancellableByStatus(order.status)
                                    ? 'hover:border-[#eea137]'
                                    : 'opacity-50 cursor-not-allowed'
                                } disabled:opacity-50`}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReorder(order.id)}
                                disabled={Boolean(actionLoadingByOrderId[order.id])}
                                className="font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] hover:border-[#eea137] disabled:opacity-50"
                              >
                                Reorder
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePayOrder(order.id, 'sadad', order.status, order.paymentStatus)}
                                disabled={
                                  Boolean(actionLoadingByOrderId[order.id])
                                  || !isOrderPayableByStatus(order.status, order.paymentStatus)
                                }
                                title={payButtonsTitle(order.status, order.paymentStatus)}
                                className={`font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] transition-colors ${
                                  isOrderPayableByStatus(order.status, order.paymentStatus)
                                    ? 'hover:border-[#eea137]'
                                    : 'opacity-50 cursor-not-allowed'
                                } disabled:opacity-50`}
                              >
                                Pay · Sadad
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePayOrder(order.id, 'tabby', order.status, order.paymentStatus)}
                                disabled={
                                  Boolean(actionLoadingByOrderId[order.id])
                                  || !isOrderPayableByStatus(order.status, order.paymentStatus)
                                }
                                title={payButtonsTitle(order.status, order.paymentStatus)}
                                className={`font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] transition-colors ${
                                  isOrderPayableByStatus(order.status, order.paymentStatus)
                                    ? 'hover:border-[#eea137]'
                                    : 'opacity-50 cursor-not-allowed'
                                } disabled:opacity-50`}
                              >
                                Pay · Tabby
                              </button>
                              <button
                                type="button"
                                onClick={() => openRefundModal(order.id, order.status)}
                                disabled={
                                  Boolean(actionLoadingByOrderId[order.id])
                                  || !isOrderEligibleForRefundRequest(order.status)
                                }
                                title={
                                  isOrderEligibleForRefundRequest(order.status)
                                    ? undefined
                                    : 'Refund requests are not available for cancelled orders. Contact support if you need help.'
                                }
                                className={`font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] transition-colors ${
                                  isOrderEligibleForRefundRequest(order.status)
                                    ? 'hover:border-[#eea137]'
                                    : 'opacity-50 cursor-not-allowed'
                                } disabled:opacity-50`}
                              >
                                Refund
                              </button>
                              <button
                                type="button"
                                onClick={() => openRateModal(order)}
                                disabled={
                                  Boolean(actionLoadingByOrderId[order.id])
                                  || !isOrderRateable(order)
                                }
                                title={
                                  isOrderRateable(order)
                                    ? undefined
                                    : 'You can rate after the order is paid or delivered.'
                                }
                                className={`font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] transition-colors ${
                                  isOrderRateable(order)
                                    ? 'hover:border-[#eea137]'
                                    : 'opacity-50 cursor-not-allowed'
                                } disabled:opacity-50`}
                              >
                                Rate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                  <div className="text-[64px] mb-[16px]">📦</div>
                  <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[8px]">
                    No store orders found
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mb-[24px]">
                    You haven&apos;t placed any store orders yet, or none match this filter.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
                  >
                    Start shopping
                  </Link>
                </div>
              )
            )}

            {/* Digital orders list — GET /api/digital-orders; detail: /digital-order/:id */}
            {orderScope === 'digital' && !digitalLoading && !digitalError && (
              filteredDigitalOrders.length > 0 ? (
                <div className="flex flex-col gap-[16px] sm:gap-[20px]">
                  {filteredDigitalOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[28px] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col gap-[16px] sm:gap-[20px]">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[12px]">
                          <div>
                            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[4px]">
                              Digital order #{order.id}
                            </h3>
                            <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                              Placed on{' '}
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-start sm:items-end gap-[8px]">
                            <span
                              className={`font-['Poppins'] font-medium text-[12px] sm:text-[14px] px-[12px] py-[4px] rounded-full ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                            {order.paymentStatus ? (
                              <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13px] text-[#666] sm:text-right max-w-[280px]">
                                Payment:{' '}
                                <span className="font-medium text-[#0e1c47]">{order.paymentStatus}</span>
                              </p>
                            ) : null}
                            <p className="font-['Poppins'] font-bold text-[18px] sm:text-[20px] text-[#0e1c47]">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] pt-[12px] border-t border-[#e6e6e6]">
                          <Link
                            to={`/digital-order/${order.id}`}
                            className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#eea137] hover:text-[#d8902f] transition-colors"
                          >
                            View order details
                          </Link>
                          <button
                            type="button"
                            onClick={() => handlePayDigitalOrder(order.id, order.status, order.paymentStatus)}
                            disabled={
                              Boolean(actionLoadingByOrderId[order.id])
                              || !isOrderPayableByStatus(order.status, order.paymentStatus)
                            }
                            title={payButtonsTitle(order.status, order.paymentStatus)}
                            className={`font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] transition-colors ${
                              isOrderPayableByStatus(order.status, order.paymentStatus)
                                ? 'hover:border-[#eea137]'
                                : 'opacity-50 cursor-not-allowed'
                            } disabled:opacity-50`}
                          >
                            Pay now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                  <div className="text-[64px] mb-[16px]" aria-hidden>
                    🎟️
                  </div>
                  <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[8px]">
                    No digital orders found
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mb-[24px] max-w-[480px] mx-auto">
                    You don&apos;t have digital orders yet, or none match this filter. Browse gift cards and digital products to place an order.
                  </p>
                  <div className="flex flex-wrap gap-[12px] justify-center">
                    <Link
                      to="/digital-products"
                      className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
                    >
                      Digital products
                    </Link>
                    <Link
                      to="/digital-categories"
                      className="inline-block border border-[#e6e6e6] text-[#0e1c47] font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:border-[#eea137] transition-colors"
                    >
                      Categories
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
            <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
              Please Sign In
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
              You need to be signed in to view your orders. Sign in to see your order history and track your deliveries.
            </p>
            <Link
              to="/sign-in"
              className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

