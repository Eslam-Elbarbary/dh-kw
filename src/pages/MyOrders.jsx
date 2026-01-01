// My Orders page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Sample orders data
  const orders = [
    {
      id: 'ORD-2025-001',
      date: '2025-01-15',
      status: 'Delivered',
      total: 1299.99,
      items: 3,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-2025-002',
      date: '2025-01-10',
      status: 'On The Road',
      total: 599.99,
      items: 2,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-2025-003',
      date: '2025-01-05',
      status: 'Processing',
      total: 2499.99,
      items: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
    },
    {
      id: 'ORD-2024-120',
      date: '2024-12-20',
      status: 'Delivered',
      total: 899.99,
      items: 4,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop'
    }
  ];

  const filters = ['All', 'Delivered', 'On The Road', 'Processing', 'Cancelled'];

  const filteredOrders = selectedFilter === 'All' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'On The Road':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
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

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="flex flex-col gap-[16px] sm:gap-[20px]">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[20px] sm:p-[24px] md:p-[28px] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-[16px] sm:gap-[20px]">
                      {/* Order Image */}
                      <div className="w-full lg:w-[120px] h-[120px] rounded-[4px] overflow-hidden bg-[#f8f9fa] shrink-0">
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/120x120?text=No+Image';
                          }}
                        />
                      </div>

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
                              to={`/product/1`}
                              className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] hover:text-[#eea137] transition-colors"
                            >
                              View Details
                            </Link>
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

