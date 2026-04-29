// My Orders page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getMyOrders,
  cancelOrder,
  reorderOrder,
  payOrder,
  requestOrderRefund,
  rateOrder,
} from '../services/orders.service';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingByOrderId, setActionLoadingByOrderId] = useState({});
  const [actionMessage, setActionMessage] = useState('');

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

    return { id, status, total, date, items };
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

  useEffect(() => {
    loadOrders();
  }, [isAuthenticated]);

  const runOrderAction = async (orderId, action) => {
    try {
      setActionMessage('');
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: true }));
      const result = await action();
      await loadOrders();
      return result;
    } catch (err) {
      const message = err?.response?.data?.message || 'Order action failed.';
      setActionMessage(message);
      return null;
    } finally {
      setActionLoadingByOrderId((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleCancelOrder = async (orderId) => {
    await runOrderAction(orderId, async () => {
      await cancelOrder({ orderId });
      setActionMessage(`Order #${orderId} cancelled successfully.`);
    });
  };

  const handleReorder = async (orderId) => {
    const response = await runOrderAction(orderId, async () => {
      const reorderResponse = await reorderOrder({ orderId });
      setActionMessage(`Order #${orderId} reordered successfully.`);
      return reorderResponse;
    });
    const createdOrder = normalizeOrderFromActionResponse(response);
    if (createdOrder) {
      setOrders((prev) => {
        const exists = prev.some((item) => String(item.id) === String(createdOrder.id));
        if (exists) return prev;
        return [createdOrder, ...prev];
      });
    }
  };

  const handlePayOrder = async (orderId) => {
    await runOrderAction(orderId, async () => {
      await payOrder({ orderId, paymentMethod: 'sadad' });
      setActionMessage(`Payment request submitted for order #${orderId}.`);
    });
  };

  const handleRefundRequest = async (orderId) => {
    const reason = window.prompt('Refund reason:');
    if (!reason || !reason.trim()) {
      return;
    }
    await runOrderAction(orderId, async () => {
      await requestOrderRefund({ orderId, reason });
      setActionMessage(`Refund request submitted for order #${orderId}.`);
    });
  };

  const handleRateOrder = async (orderId) => {
    const ratingInput = window.prompt('Rating (1-5):', '5');
    if (!ratingInput) {
      return;
    }
    const rating = Number(ratingInput);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setActionMessage('Rating must be a number between 1 and 5.');
      return;
    }
    const comment = window.prompt('Comment (optional):', '') || '';
    await runOrderAction(orderId, async () => {
      await rateOrder({ orderId, rating, comment });
      setActionMessage(`Order #${orderId} rated successfully.`);
    });
  };

  const filters = ['All', 'Delivered', 'On The Road', 'Processing', 'Cancelled'];

  const matchesFilter = (orderStatus, filter) => {
    if (filter === 'All') return true;
    const normalizedStatus = String(orderStatus || '').trim().toLowerCase();
    if (filter === 'Delivered') {
      return normalizedStatus.includes('deliver');
    }
    if (filter === 'On The Road') {
      return (
        normalizedStatus.includes('road')
        || normalizedStatus.includes('ship')
        || normalizedStatus.includes('transit')
      );
    }
    if (filter === 'Processing') {
      return (
        normalizedStatus.includes('process')
        || normalizedStatus.includes('pending')
        || normalizedStatus.includes('confirm')
        || normalizedStatus.includes('pack')
      );
    }
    if (filter === 'Cancelled') {
      return normalizedStatus.includes('cancel');
    }
    return false;
  };

  const filteredOrders = selectedFilter === 'All' 
    ? orders 
    : orders.filter((order) => matchesFilter(order.status, selectedFilter));

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

  return (
    <div className="bg-white relative w-full min-h-screen">
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
              View and manage all your orders
            </p>
          </div>
        </div>

        {/* Main Content */}
        {isAuthenticated ? (
          <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-[12px] sm:gap-[16px]">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`font-['Poppins'] font-medium px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] transition-colors text-[14px] sm:text-[16px] ${
                    selectedFilter === filter
                      ? 'bg-[#eea137] text-white'
                      : 'bg-white border border-[#e6e6e6] text-[#0e1c47] hover:border-[#eea137]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Loading your orders...
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#8e0909]">
                  {error}
                </p>
              </div>
            ) : null}

            {actionMessage ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[16px]">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#0e1c47]">
                  {actionMessage}
                </p>
              </div>
            ) : null}

            {/* Orders List */}
            {!loading && !error && (
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
                            <div>
                              <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[4px]">
                                Order #{order.id}
                              </h3>
                              <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                                Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-[8px]">
                              <span className={`font-['Poppins'] font-medium text-[12px] sm:text-[14px] px-[12px] py-[4px] rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <p className="font-['Poppins'] font-bold text-[18px] sm:text-[20px] text-[#0e1c47]">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] pt-[12px] border-t border-[#e6e6e6]">
                            <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                              {order.items} {order.items === 1 ? 'item' : 'items'}
                            </p>
                            <div className="flex gap-[12px]">
                              <Link
                                to={`/track-order?orderId=${order.id}`}
                                className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#eea137] hover:text-[#d8902f] transition-colors"
                              >
                                Track Order
                              </Link>
                              <Link
                                to={`/track-order?orderId=${order.id}`}
                                className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] hover:text-[#eea137] transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                            <div className="flex flex-wrap gap-[8px]">
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={Boolean(actionLoadingByOrderId[order.id])}
                                className="font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] hover:border-[#eea137] disabled:opacity-50"
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
                                onClick={() => handlePayOrder(order.id)}
                                disabled={Boolean(actionLoadingByOrderId[order.id])}
                                className="font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] hover:border-[#eea137] disabled:opacity-50"
                              >
                                Pay
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRefundRequest(order.id)}
                                disabled={Boolean(actionLoadingByOrderId[order.id])}
                                className="font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] hover:border-[#eea137] disabled:opacity-50"
                              >
                                Refund
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRateOrder(order.id)}
                                disabled={Boolean(actionLoadingByOrderId[order.id])}
                                className="font-['Poppins'] text-[12px] sm:text-[13px] px-[10px] py-[6px] rounded-[4px] border border-[#e6e6e6] hover:border-[#eea137] disabled:opacity-50"
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
                    No orders found
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mb-[24px]">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
                  >
                    Start Shopping
                  </Link>
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

