// Track Order page - exact Figma implementation
// Based on Figma design - Track Order Page

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOrderDetails } from '../services/orders.service';
import { rateOrder } from '../services/orders.service';

// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';
import truckIcon from '../assets/Truck.svg';
import packageIcon from '../assets/Package.svg';
import handshakeIcon from '../assets/Handshake.svg';
import checkCircleIcon from '../assets/CheckCircle.svg';
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

const getProgressIndex = (status) => {
  const normalizedStatus = normalizeStatus(status);
  if (!normalizedStatus) return 0;
  if (normalizedStatus.includes('cancel')) return 0;
  if (normalizedStatus.includes('deliver')) return 4;
  if (normalizedStatus.includes('road') || normalizedStatus.includes('ship')) return 3;
  if (normalizedStatus.includes('pack')) return 2;
  return 1;
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
  const orderIdParam = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [orderDraft, setOrderDraft] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  const loadOrder = useCallback(async ({ withLoader = false } = {}) => {
    if (!orderIdParam) {
      setError('Missing order id in URL. Use /track-order?orderId={id}.');
      setOrder(null);
      setLoading(false);
      return;
    }

    try {
      if (withLoader) setLoading(true);
      setError('');
      const response = await getOrderDetails({ orderId: orderIdParam });
      setOrder(response);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load order details.');
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

  const handleLeaveRating = async () => {
    const resolvedOrderId = String(order?.id ?? orderIdParam ?? '').trim();
    if (!resolvedOrderId) {
      setRatingMessage('Order id is missing. Open track page from My Orders.');
      return;
    }
    const ratingInput = window.prompt('Rating (1-5):', '5');
    if (!ratingInput) return;
    const rating = Number(ratingInput);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setRatingMessage('Rating must be a number between 1 and 5.');
      return;
    }
    const comment = window.prompt('Comment (optional):', '') || '';
    try {
      setRatingLoading(true);
      setRatingMessage('');
      await rateOrder({ orderId: resolvedOrderId, rating, comment });
      setRatingMessage('Thank you! Your rating was submitted.');
    } catch (err) {
      setRatingMessage(err?.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  const orderStatus = normalizeStatus(order?.status || order?.order_status);
  const progressIndex = getProgressIndex(orderStatus);
  const progressWidth = `${Math.max(0, progressIndex * 25)}%`;

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
    paymentStatus: order?.payment_status ?? '-',
  };

  const progressStages = [
    { id: 1, name: 'Order Placed', icon: imgDocumentIcon, active: progressIndex >= 1 },
    { id: 2, name: 'Packaging', icon: imgBoxIcon, active: progressIndex >= 2 },
    { id: 3, name: 'On The Road', icon: imgTruckIcon, active: progressIndex >= 3 },
    { id: 4, name: 'Delivered', icon: imgHandshakeIcon, active: progressIndex >= 4 },
  ];

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

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
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

        {loading ? (
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">
              Loading order details...
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[32px] w-full shadow-sm transition-colors duration-300">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#b91c1c]">
              {error}
            </p>
          </div>
        ) : null}

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
                onClick={handleLeaveRating}
                disabled={ratingLoading}
                className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#eea137] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {ratingLoading ? 'Submitting...' : 'Leave a Rating +'}
              </button>
            </div>
          </div>

          {ratingMessage ? (
            <p className="font-['Poppins'] font-normal text-[13px] text-[#0e1c47] mb-[12px]">
              {ratingMessage}
            </p>
          ) : null}

          {/* Order Progress */}
          <div className="mb-[24px] sm:mb-[32px]">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] mb-[16px] sm:mb-[20px]">
              Order expected arrival {orderData.expectedArrival}
            </p>
            
            {/* Progress Bar */}
            <div className="relative w-full">
              {/* Progress Line */}
              <div className="absolute top-[24px] left-0 right-0 h-[2px] bg-[#e6e6e6] dark:bg-[#334155] z-0 transition-colors duration-300">
                <div className="h-full bg-[#eea137] transition-all" style={{ width: progressWidth }}></div>
              </div>
              
              {/* Progress Stages */}
              <div className="relative flex justify-between items-start z-10">
                {progressStages.map((stage, index) => (
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
      </div>
    </div>
  );
}

