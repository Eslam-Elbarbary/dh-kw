// Notifications page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #ORD-2025-001 has been shipped and is on the way.',
      time: '2 hours ago',
      read: false,
      link: '/track-order?orderId=ORD-2025-001'
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on all electronics. Limited time offer!',
      time: '5 hours ago',
      read: false,
      link: '/search?category=electronics'
    },
    {
      id: 3,
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #ORD-2024-120 has been delivered successfully.',
      time: '1 day ago',
      read: true,
      link: '/track-order?orderId=ORD-2024-120'
    },
    {
      id: 4,
      type: 'account',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      time: '2 days ago',
      read: true,
      link: '/my-profile'
    },
    {
      id: 5,
      type: 'promotion',
      title: 'New Arrivals',
      message: 'Check out our latest collection of PC components.',
      time: '3 days ago',
      read: true,
      link: '/pc-components'
    },
    {
      id: 6,
      type: 'order',
      title: 'Payment Received',
      message: 'Payment for order #ORD-2025-002 has been confirmed.',
      time: '4 days ago',
      read: true,
      link: '/my-orders'
    }
  ];

  const filters = ['All', 'Order', 'Promotion', 'Account'];

  const filteredNotifications = selectedFilter === 'All'
    ? notifications
    : notifications.filter(notif => notif.type === selectedFilter.toLowerCase());

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'account':
        return '👤';
      default:
        return '🔔';
    }
  };

  const markAsRead = (id) => {
    // In a real app, this would update the notification state
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log('Mark all as read');
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
            Notifications
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-[20px] sm:gap-[24px]">
          <div>
            <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47] mb-[8px]">
              Notifications
            </h1>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666]">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#eea137] hover:text-[#d8902f] transition-colors"
            >
              Mark all as read
            </button>
          )}
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

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
              <div className="flex flex-col gap-[12px] sm:gap-[16px]">
                {filteredNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link}
                    onClick={() => markAsRead(notification.id)}
                    className={`bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[16px] sm:p-[20px] hover:border-[#eea137] hover:shadow-md transition-all ${
                      !notification.read ? 'bg-[#fff4e6] border-[#eea137]' : ''
                    }`}
                  >
                    <div className="flex gap-[12px] sm:gap-[16px]">
                      <div className="text-[32px] sm:text-[40px] shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-[12px] mb-[4px]">
                          <h3 className={`font-['Poppins'] font-semibold text-[16px] sm:text-[18px] ${
                            !notification.read ? 'text-[#0e1c47]' : 'text-[#666]'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="bg-[#eea137] rounded-full size-[8px] shrink-0 mt-[6px]"></div>
                          )}
                        </div>
                        <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mb-[8px]">
                          {notification.message}
                        </p>
                        <p className="font-['Poppins'] font-normal text-[12px] sm:text-[14px] text-[#999]">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center">
                <div className="text-[64px] mb-[16px]">🔔</div>
                <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[8px]">
                  No notifications
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  You're all caught up! We'll notify you when there's something new.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
            <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
              Please Sign In
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
              You need to be signed in to view your notifications. Sign in to stay updated with your orders and special offers.
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

