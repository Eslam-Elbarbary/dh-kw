// Notifications page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notifications.service';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const toTitleCase = (value) => {
    const text = String(value || '').trim();
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const filters = useMemo(() => {
    const orderStatusFilters = [...new Set(
      notifications
        .filter((item) => item.type === 'order' && item.status)
        .map((item) => toTitleCase(item.status))
    )];
    return ['All', 'Orders', ...orderStatusFilters];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'All') return notifications;
    if (selectedFilter === 'Orders') {
      return notifications.filter((notif) => notif.type === 'order');
    }
    return notifications.filter(
      (notif) => notif.type === 'order' && toTitleCase(notif.status) === selectedFilter
    );
  }, [notifications, selectedFilter]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    if (!filters.includes(selectedFilter)) {
      setSelectedFilter('All');
    }
  }, [filters, selectedFilter]);

  const formatRelativeTime = (isoDate) => {
    if (!isoDate) return 'Just now';
    const ts = new Date(isoDate).getTime();
    if (Number.isNaN(ts)) return 'Just now';
    const diffMs = Date.now() - ts;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setNotifications([]);
      setError('');
      return;
    }

    let cancelled = false;
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError('');
        const list = await getNotifications();
        if (!cancelled) setNotifications(list);
      } catch (err) {
        if (!cancelled) {
          setNotifications([]);
          setError(err?.response?.data?.message || 'Could not load notifications right now.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNotifications();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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

  const markAsRead = async (id) => {
    if (!id) return;
    setNotifications((prev) => prev.map((item) => (
      item.id === id ? { ...item, read: true, readAt: item.readAt || new Date().toISOString() } : item
    )));
    try {
      await markNotificationAsRead({ notificationId: id });
    } catch {
      // Keep optimistic update to avoid blocking user flow.
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0 || actionLoading) return;
    setActionLoading(true);
    const nowIso = new Date().toISOString();
    setNotifications((prev) => prev.map((item) => (
      item.read ? item : { ...item, read: true, readAt: nowIso }
    )));
    try {
      await markAllNotificationsAsRead();
    } catch {
      // Keep optimistic state. User can refresh if backend fails.
    } finally {
      setActionLoading(false);
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
              disabled={actionLoading}
              className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#eea137] hover:text-[#d8902f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Marking…' : 'Mark all as read'}
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
            {loading ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[32px] text-center">
                <p className="font-['Poppins'] font-normal text-[15px] text-[#666]">Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[32px] text-center">
                <p className="font-['Poppins'] font-normal text-[15px] text-[#8e0909]">{error}</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
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
                          {formatRelativeTime(notification.createdAt)}
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

