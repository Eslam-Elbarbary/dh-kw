import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails } from '../services/orders.service';
import { useCountry } from '../context/CountryContext';
import { formatMoney as formatCurrency, resolveCurrencyFromSource } from '../utils/formatMoney';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const getOrderItems = (order) => {
  const candidates = [
    order?.items,
    order?.order_items,
    order?.orderItems,
    order?.products,
    order?.order_products,
    order?.orderProducts,
    order?.line_items,
    order?.lines,
  ];
  const rows = candidates.find((entry) => Array.isArray(entry)) || [];
  return rows.map((item, index) => {
    const product = item?.product || item?.variant?.product || item || {};
    const quantity = Number(item?.quantity ?? item?.qty ?? 1) || 1;
    const rawUnitPrice = Number(item?.unit_price ?? item?.price ?? product?.price ?? 0) || 0;
    const subtotal = Number(item?.subtotal ?? item?.total ?? item?.total_price ?? rawUnitPrice * quantity) || 0;
    const unitPrice = rawUnitPrice > 0 ? rawUnitPrice : (quantity > 0 ? subtotal / quantity : 0);
    return {
      id: item?.id ?? `${product?.id ?? 'item'}-${index}`,
      name: product?.name ?? item?.product_name ?? item?.name ?? item?.title ?? `Item ${index + 1}`,
      image: product?.image ?? item?.image ?? '',
      quantity,
      unitPrice,
      subtotal,
    };
  });
};

export default function StoreOrderDetail() {
  const { id } = useParams();
  const { countryCurrencyCode } = useCountry();
  const [order, setOrder] = useState(null);
  const [draftItems, setDraftItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!id) {
        setError('Missing order id.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const data = await getOrderDetails({ orderId: id });
        if (!active) return;
        if (!data || typeof data !== 'object') {
          setError('Order not found.');
          setOrder(null);
          return;
        }
        setOrder(data);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load order details.');
        setOrder(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) {
      setDraftItems([]);
      return;
    }
    try {
      const raw = sessionStorage.getItem(`orderDraft:${String(id).trim()}`);
      if (!raw) {
        setDraftItems([]);
        return;
      }
      const parsed = JSON.parse(raw);
      const rows = Array.isArray(parsed?.items) ? parsed.items : [];
      setDraftItems(rows);
    } catch {
      setDraftItems([]);
    }
  }, [id]);

  const orderCurrency = useMemo(
    () => resolveCurrencyFromSource(order, countryCurrencyCode),
    [order, countryCurrencyCode],
  );
  const formatMoney = (value) => formatCurrency(value, orderCurrency, countryCurrencyCode);

  const items = useMemo(() => {
    const fromApi = getOrderItems(order);
    if (fromApi.length) return fromApi;
    return getOrderItems({ items: draftItems });
  }, [order, draftItems]);
  const status = String(order?.status ?? order?.order_status ?? 'Pending');
  const paymentStatus = String(order?.payment_status ?? order?.paymentStatus ?? '-');
  const total = Number(order?.total ?? order?.grand_total ?? order?.total_amount ?? 0) || 0;
  const subtotal = Number(order?.sub_total ?? order?.subtotal ?? total) || 0;
  const shipping = Number(order?.total_shipping ?? order?.shipping ?? order?.shipping_cost ?? 0) || 0;
  const discount = Number(order?.order_discount ?? 0)
    + Number(order?.coupon_discount ?? 0)
    + Number(order?.points_discount ?? 0)
    + Number(order?.wallet_used ?? 0);

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-[1240px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="flex items-center gap-[10px] mb-[20px]">
          <Link to="/my-orders" className="font-['Poppins'] text-[14px] text-[#666] hover:text-[#eea137] transition-colors">
            My Orders
          </Link>
          <span className="font-['Poppins'] text-[14px] text-[#999]">/</span>
          <span className="font-['Poppins'] text-[14px] text-[#eea137]">Order #{id}</span>
        </div>

        {loading ? (
          <div className="border border-[#e6e6e6] rounded-[8px] p-[24px] font-['Poppins'] text-[#666]">Loading order details...</div>
        ) : error ? (
          <div className="border border-[#fecaca] bg-[#fef2f2] rounded-[8px] p-[24px] font-['Poppins'] text-[#991b1b]">{error}</div>
        ) : (
          <div className="flex flex-col gap-[20px]">
            <div className="border border-[#e6e6e6] rounded-[8px] p-[20px] sm:p-[24px]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[14px]">
                <div>
                  <h1 className="font-['Poppins'] font-bold text-[28px] text-[#0e1c47]">Order #{id}</h1>
                  <p className="font-['Poppins'] text-[14px] text-[#666] mt-[4px]">
                    Placed on {formatDate(order?.created_at ?? order?.date)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-['Poppins'] text-[13px] text-[#666]">Status: <span className="font-semibold text-[#0e1c47]">{status}</span></p>
                  <p className="font-['Poppins'] text-[13px] text-[#666]">Payment: <span className="font-semibold text-[#0e1c47]">{paymentStatus}</span></p>
                  <p className="font-['Poppins'] font-bold text-[24px] text-[#0e1c47] mt-[4px]">{formatMoney(total)}</p>
                </div>
              </div>
              <div className="mt-[14px]">
                <Link
                  to={`/track-order?orderId=${encodeURIComponent(String(id))}`}
                  className="inline-flex items-center justify-center rounded-[6px] bg-[#0e1c47] px-4 py-2 font-['Poppins'] text-[14px] font-medium text-white hover:bg-[#1a2f5c] transition-colors"
                >
                  Track this order
                </Link>
              </div>
            </div>

            <div className="border border-[#e6e6e6] rounded-[8px] p-[20px] sm:p-[24px]">
              <h2 className="font-['Poppins'] font-semibold text-[28px] text-[#0e1c47] mb-[16px]">Order Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[14px]">
                <div>
                  <p className="font-['Poppins'] text-[12px] text-[#666]">Subtotal</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47]">{formatMoney(subtotal)}</p>
                </div>
                <div>
                  <p className="font-['Poppins'] text-[12px] text-[#666]">Shipping</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47]">{formatMoney(shipping)}</p>
                </div>
                <div>
                  <p className="font-['Poppins'] text-[12px] text-[#666]">Discount</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47]">{formatMoney(discount)}</p>
                </div>
                <div>
                  <p className="font-['Poppins'] text-[12px] text-[#666]">Total</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47]">{formatMoney(total)}</p>
                </div>
                <div>
                  <p className="font-['Poppins'] text-[12px] text-[#666]">Payment Status</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47]">{paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="border border-[#e6e6e6] rounded-[8px] overflow-hidden">
              <div className="px-[20px] py-[14px] border-b border-[#eef2f6]">
                <h2 className="font-['Poppins'] font-semibold text-[18px] text-[#0e1c47]">Order items ({items.length})</h2>
              </div>
              {items.length === 0 ? (
                <p className="px-[20px] py-[18px] font-['Poppins'] text-[14px] text-[#666]">No products found for this order.</p>
              ) : (
                <ul className="divide-y divide-[#eef2f6]">
                  {items.map((item) => (
                    <li key={item.id} className="px-[20px] py-[14px] flex items-start gap-[12px]">
                      <div className="size-[52px] rounded-[6px] bg-[#f1f5f9] overflow-hidden shrink-0">
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] truncate">{item.name}</p>
                        <p className="font-['Poppins'] text-[13px] text-[#64748b] mt-[2px]">
                          Qty {item.quantity} · Unit {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47]">{formatMoney(item.subtotal)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
