// Single digital order — GET /api/digital-orders/:id (separate from /track-order /api/orders).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import {
  extractDigitalOrderDeliveryItems,
  getDigitalOrderById,
  launchDigitalOrderPayment,
  openPaymentGatewayPlaceholderTab,
  payDigitalOrder,
} from '../services/digitalOrders.service';
import arrowDownIcon from '../assets/ArrowRight.svg';
import { formatMoney as formatCurrency, resolveCurrencyFromSource } from '../utils/formatMoney';

const imgArrowDown = arrowDownIcon;

const toArray = (v) => (Array.isArray(v) ? v : []);

const toItemPrice = (line) => {
  const value = Number(
    line?.price
    ?? line?.unit_price
    ?? line?.unitPrice
    ?? line?.digital_product_price
    ?? 0
  );
  return Number.isFinite(value) ? value : 0;
};

const statusPill = (label, variant) => {
  const base = 'font-[\'Poppins\'] font-medium text-[12px] px-[12px] py-[4px] rounded-full';
  const styles =
    variant === 'pay'
      ? 'bg-amber-100 text-amber-900'
      : variant === 'ok'
        ? 'bg-emerald-100 text-emerald-900'
        : 'bg-slate-100 text-slate-800';
  return <span className={`${base} ${styles}`}>{label}</span>;
};

export default function DigitalOrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { countryId, countryCode, countryCurrencyCode } = useCountry();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [clipboardError, setClipboardError] = useState('');

  const orderCurrency = useMemo(
    () => resolveCurrencyFromSource(order, countryCurrencyCode),
    [order, countryCurrencyCode],
  );
  const formatMoney = useCallback(
    (value) => formatCurrency(value, orderCurrency, countryCurrencyCode),
    [orderCurrency, countryCurrencyCode],
  );

  const loadOrder = useCallback(async ({ silent = false } = {}) => {
    if (!isAuthenticated) {
      setLoading(false);
      setOrder(null);
      return;
    }
    if (!id) {
      setError('Missing order id.');
      setLoading(false);
      return;
    }
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getDigitalOrderById({ orderId: id });
      if (!data || typeof data !== 'object') {
        setOrder(null);
        setError('Order not found.');
      } else {
        setOrder(data);
      }
    } catch (e) {
      setOrder(null);
      setError(e?.response?.data?.message || e?.message || 'Failed to load digital order.');
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const items = toArray(order?.items);
  const deliveryCredentials = useMemo(
    () => (order ? extractDigitalOrderDeliveryItems(order) : []),
    [order],
  );
  const placed = order?.created_at ?? order?.date;
  const paymentStatusText = String(order?.payment_status ?? order?.paymentStatus ?? '').toLowerCase();
  const orderStatusText = String(order?.status || '').toLowerCase();
  const isPendingSync =
    paymentStatusText.includes('pending')
    || paymentStatusText.includes('unpaid')
    || orderStatusText.includes('pending');
  const canPay =
    !paying
    && !paymentStatusText.includes('paid')
    && !paymentStatusText.includes('success')
    && !String(order?.status || '').toLowerCase().includes('cancel');

  const handlePayDigitalOrder = async () => {
    if (!order?.id || !canPay) return;
    setActionError('');
    setPaying(true);
    const paymentTab = openPaymentGatewayPlaceholderTab();
    try {
      const result = await payDigitalOrder({ orderId: order.id, countryCode, countryId });
      const ok = launchDigitalOrderPayment({ payload: result, preOpenedTab: paymentTab });
      if (!ok) {
        paymentTab?.close();
        setActionError('Payment started but no redirect link was returned. Please try again.');
      } else {
        // Gateway status sync can be asynchronous, so refresh soon after handoff.
        window.setTimeout(() => {
          loadOrder({ silent: true });
        }, 4000);
      }
    } catch (e) {
      paymentTab?.close();
      setActionError(e?.response?.data?.message || 'Failed to start payment. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !id || !isPendingSync) return undefined;
    const interval = window.setInterval(() => {
      loadOrder({ silent: true });
    }, 15000);
    return () => window.clearInterval(interval);
  }, [id, isAuthenticated, isPendingSync, loadOrder]);

  useEffect(() => {
    if (!isAuthenticated || !id) return undefined;
    const handleFocus = () => {
      loadOrder({ silent: true });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadOrder({ silent: true });
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, isAuthenticated, loadOrder]);

  const copyToClipboard = async (text, key) => {
    const value = String(text || '').trim();
    if (!value) return;
    setClipboardError('');
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 2000);
    } catch {
      setClipboardError('Could not copy automatically. Select the code and copy manually.');
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="max-w-[960px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] py-[24px] sm:py-[32px] md:py-[40px] flex flex-col gap-[24px] sm:gap-[32px]">
        <div className="flex gap-[8px] items-center flex-wrap" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] text-[14px] text-[#666] hover:text-[#eea137] transition-colors">
            Home
          </Link>
          <div className="flex items-center justify-center size-[18px] rotate-[270deg]">
            <img alt="" className="size-[18px]" src={imgArrowDown} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <Link to="/my-orders?tab=digital" className="font-['Poppins'] text-[14px] text-[#666] hover:text-[#eea137] transition-colors">
            My orders
          </Link>
          <div className="flex items-center justify-center size-[18px] rotate-[270deg]">
            <img alt="" className="size-[18px]" src={imgArrowDown} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <span className="font-['Poppins'] text-[14px] text-[#eea137]">Digital order #{id}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[16px]">
          <div>
            <h1 className="font-['Poppins'] font-bold text-[28px] sm:text-[36px] md:text-[40px] text-[#0e1c47] mb-[8px]">
              Digital order #{id}
            </h1>
            <p className="font-['Poppins'] text-[15px] text-[#666] max-w-[640px] leading-relaxed">
              Gift cards and digital codes — no shipping. These orders are separate from regular store deliveries.
            </p>
          </div>
          <Link
            to="/my-orders?tab=digital"
            className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] border border-[#e6e6e6] px-[20px] py-[10px] rounded-[4px] hover:border-[#eea137] transition-colors text-center"
          >
            ← All digital orders
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-[4px] border border-[#e6e6e6] p-[32px] text-center">
            <p className="font-['Poppins'] text-[#0e1c47] mb-[16px]">Sign in to view this order.</p>
            <Link to="/sign-in" className="inline-block bg-[#eea137] text-white font-semibold px-[28px] py-[12px] rounded-[4px] hover:bg-[#d8902f]">
              Sign in
            </Link>
          </div>
        ) : null}

        {isAuthenticated && loading ? (
          <div className="border border-[#e6e6e6] rounded-[4px] p-[40px] text-center font-['Poppins'] text-[#666]">
            Loading order…
          </div>
        ) : null}

        {isAuthenticated && !loading && error ? (
          <div className="border border-[#fecaca] bg-[#fef2f2] rounded-[4px] p-[24px] font-['Poppins'] text-[#991b1b]">
            {error}
          </div>
        ) : null}

        {isAuthenticated && !loading && order && !error ? (
          <div className="flex flex-col gap-[20px]">
            {deliveryCredentials.length > 0 ? (
              <div
                className="rounded-[4px] border-2 border-emerald-200 bg-emerald-50/80 p-[20px] sm:p-[24px] shadow-sm"
                role="region"
                aria-label="Your digital codes"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[12px] mb-[16px]">
                  <div>
                    <h2 className="font-['Poppins'] font-semibold text-[17px] text-[#065f46] mb-[4px]">
                      Your digital code{deliveryCredentials.length > 1 ? 's' : ''}
                    </h2>
                    <p className="font-['Poppins'] text-[13px] text-[#047857] leading-relaxed max-w-[640px]">
                      Save these details — you will need them to redeem your purchase. We also recommend storing them somewhere safe outside this page.
                    </p>
                    {deliveryCredentials[0]?.providerLabel ? (
                      <p className="font-['Poppins'] text-[12px] text-[#059669] mt-[8px]">
                        Provider:{' '}
                        <span className="font-semibold">{deliveryCredentials[0].providerLabel}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
                {clipboardError ? (
                  <p className="font-['Poppins'] text-[13px] text-[#991b1b] mb-[12px]">{clipboardError}</p>
                ) : null}
                <ul className="flex flex-col gap-[14px]">
                  {deliveryCredentials.map((row, idx) => {
                    const serialKey = `serial-${idx}`;
                    return (
                      <li
                        key={`${row.label}-${idx}`}
                        className="rounded-[4px] border border-emerald-100 bg-white p-[16px] sm:p-[18px]"
                      >
                        <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] mb-[12px]">
                          {row.label}
                        </p>
                        <dl className="space-y-[10px] font-['Poppins'] text-[14px]">
                          {row.serial ? (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[10px]">
                              <dt className="text-[#666] shrink-0">Serial / code</dt>
                              <dd className="flex flex-wrap items-center gap-[8px] justify-end min-w-0 w-full sm:w-auto">
                                <code className="text-[13px] sm:text-[14px] font-semibold text-[#0e1c47] bg-[#f1f5f9] px-[12px] py-[8px] rounded-[4px] break-all tabular-nums tracking-wide">
                                  {row.serial}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(row.serial, serialKey)}
                                  className="font-['Poppins'] text-[12px] font-semibold px-[12px] py-[8px] rounded-[4px] border border-[#0e1c47] text-[#0e1c47] hover:bg-[#0e1c47] hover:text-white transition-colors shrink-0"
                                >
                                  {copiedKey === serialKey ? 'Copied' : 'Copy'}
                                </button>
                              </dd>
                            </div>
                          ) : null}
                        </dl>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] shadow-sm">
                <h2 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[14px]">Status</h2>
                <div className="flex flex-wrap gap-[8px] items-center mb-[12px]">
                  {order.status != null ? statusPill(String(order.status), 'neutral') : null}
                  {order.payment_status != null || order.paymentStatus != null
                    ? statusPill(String(order.payment_status ?? order.paymentStatus), 'pay')
                    : null}
                </div>
                {placed ? (
                  <p className="font-['Poppins'] text-[13px] text-[#666]">
                    Placed{' '}
                    {new Date(placed).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                ) : null}
                {order.notes ? (
                  <p className="font-['Poppins'] text-[13px] text-[#57534e] mt-[12px] pt-[12px] border-t border-[#f1f5f9]">
                    <span className="font-medium text-[#0e1c47]">Notes: </span>
                    {order.notes}
                  </p>
                ) : null}
                <div className="mt-[14px] pt-[12px] border-t border-[#f1f5f9] flex flex-col gap-[10px]">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={handlePayDigitalOrder}
                      disabled={!canPay}
                      className={`font-['Poppins'] text-[13px] sm:text-[14px] font-semibold px-[14px] py-[10px] rounded-[4px] border transition-colors ${
                        canPay
                          ? 'bg-[#0e1c47] text-white border-[#0e1c47] hover:bg-[#152a5c]'
                          : 'bg-[#e2e8f0] text-[#64748b] border-[#cbd5e1] cursor-not-allowed'
                      }`}
                    >
                      {paying ? 'Starting payment…' : 'Pay digital order'}
                    </button>
                    <button
                      type="button"
                      onClick={() => loadOrder({ silent: true })}
                      disabled={refreshing || loading}
                      className="font-['Poppins'] text-[13px] sm:text-[14px] font-semibold px-[14px] py-[10px] rounded-[4px] border border-[#e2e8f0] text-[#0e1c47] hover:border-[#eea137] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {refreshing ? 'Refreshing…' : 'Refresh status'}
                    </button>
                  </div>
                  {actionError ? (
                    <p className="font-['Poppins'] text-[13px] text-[#8e0909]">{actionError}</p>
                  ) : null}
                </div>
              </div>

              <div className="border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] shadow-sm">
                <h2 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[14px]">Totals</h2>
                <dl className="space-y-[8px] font-['Poppins'] text-[14px]">
                  <div className="flex justify-between gap-[12px]">
                    <dt className="text-[#666]">Subtotal</dt>
                    <dd className="text-[#0e1c47] font-medium tabular-nums">{formatMoney(order.total)}</dd>
                  </div>
                  <div className="flex justify-between gap-[12px]">
                    <dt className="text-[#666]">Discount</dt>
                    <dd className="text-[#0e1c47] font-medium tabular-nums">{formatMoney(order.discount)}</dd>
                  </div>
                  <div className="flex justify-between gap-[12px]">
                    <dt className="text-[#666]">Shipping</dt>
                    <dd className="text-[#0e1c47] font-medium tabular-nums">{formatMoney(order.shipping_cost ?? 0)}</dd>
                  </div>
                  <div className="flex justify-between gap-[12px] pt-[8px] border-t border-[#e6e6e6]">
                    <dt className="text-[#0e1c47] font-semibold">Total</dt>
                    <dd className="text-[#0e1c47] font-bold tabular-nums text-[18px]">
                      {formatMoney(order.total_cost ?? order.total)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {(order.user_name || order.user_email || order.user_phone || order.user_country) ? (
              <div className="border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] shadow-sm">
                <h2 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[14px]">Account on order</h2>
                <ul className="font-['Poppins'] text-[14px] text-[#444] space-y-[6px]">
                  {order.user_name ? (
                    <li>
                      <span className="text-[#666]">Name: </span>
                      {order.user_name}
                    </li>
                  ) : null}
                  {order.user_email ? (
                    <li>
                      <span className="text-[#666]">Email: </span>
                      {order.user_email}
                    </li>
                  ) : null}
                  {order.user_phone ? (
                    <li>
                      <span className="text-[#666]">Phone: </span>
                      {order.user_phone}
                    </li>
                  ) : null}
                  {order.user_country ? (
                    <li>
                      <span className="text-[#666]">Country: </span>
                      {order.user_country}
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <div className="border border-[#e6e6e6] rounded-[4px] overflow-hidden shadow-sm">
              <div className="px-[20px] pt-[20px] sm:px-[24px] sm:pt-[24px] pb-[14px] border-b border-[#eef2f6]">
                <h2 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47]">
                  Order items ({items.length})
                </h2>
                <p className="font-['Poppins'] text-[13px] text-[#64748b] mt-[4px]">
                  Product details, quantity, and item totals.
                </p>
              </div>
              {items.length === 0 ? (
                <p className="px-[20px] py-[20px] font-['Poppins'] text-[14px] text-[#666]">No line items in the response.</p>
              ) : (
                <ul className="divide-y divide-[#eef2f6]">
                  {items.map((line, idx) => {
                    const pid =
                      line.digital_product_id
                      ?? line.digital_product?.id
                      ?? line.product_id;
                    const label =
                      line.name
                      ?? line.title
                      ?? line.product_name
                      ?? line.digital_product?.name
                      ?? line.product?.name
                      ?? (pid != null ? `Product #${pid}` : `Line ${idx + 1}`);
                    const qty = Number(line.quantity ?? line.qty ?? 1) || 1;
                    const unitPrice = toItemPrice(line);
                    const itemTotal = Number(line.total ?? line.total_price ?? line.subtotal ?? unitPrice * qty) || 0;
                    const image = String(
                      line.image
                      ?? line.image_url
                      ?? line.digital_product?.image
                      ?? line.product?.image
                      ?? ''
                    ).trim();

                    return (
                      <li key={line.id ?? idx} className="p-[20px] sm:p-[24px]">
                        <div className="flex items-start gap-[14px]">
                          <div className="size-[58px] rounded-[6px] overflow-hidden bg-[#f1f5f9] border border-[#e2e8f0] shrink-0">
                            {image ? (
                              <img src={image} alt={label} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[10px]">
                              <div className="min-w-0">
                                <p className="font-['Poppins'] text-[12px] text-[#94a3b8] mb-[2px]">Item {idx + 1}</p>
                                {pid != null && String(pid).length > 0 ? (
                                  <Link
                                    to={`/digital-product/${pid}`}
                                    className="font-['Poppins'] font-semibold text-[15px] text-[#0e1c47] hover:text-[#eea137] transition-colors block truncate"
                                  >
                                    {label}
                                  </Link>
                                ) : (
                                  <p className="font-['Poppins'] font-semibold text-[15px] text-[#0e1c47] truncate">{label}</p>
                                )}
                              </div>
                              <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] tabular-nums">
                                {formatMoney(itemTotal)}
                              </p>
                            </div>
                            <div className="mt-[8px] flex flex-wrap gap-x-[16px] gap-y-[6px]">
                              <p className="font-['Poppins'] text-[13px] text-[#64748b]">
                                Qty: <span className="font-medium text-[#0e1c47]">{qty}</span>
                              </p>
                              <p className="font-['Poppins'] text-[13px] text-[#64748b]">
                                Unit: <span className="font-medium text-[#0e1c47]">{formatMoney(unitPrice)}</span>
                              </p>
                              {pid != null && String(pid).length > 0 ? (
                                <Link
                                  to={`/digital-product/${pid}`}
                                  className="font-['Poppins'] text-[13px] font-medium text-[#eea137] hover:underline"
                                >
                                  View product
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
