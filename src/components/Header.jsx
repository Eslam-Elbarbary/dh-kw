// Shared Header Component used across pages
// This will be a reusable component based on the Figma design

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { getCategories, resolveCountryId } from '../services/catalog.service';
import { getNotifications } from '../services/notifications.service';
import { VENDOR_REGISTER_URL } from '../utils/vendorUrls';

// Import assets
import logoImage from '../assets/websiteLogo.png';
import egyptFlag from '../assets/Egypt.png';
import phoneIcon from '../assets/call.svg';
import customerSupportIcon from '../assets/customer-support.svg';
import deliveryIcon from '../assets/delivery-return-01.svg';
import handshakeIcon from '../assets/Handshake.svg';
import notificationIcon from '../assets/notification-bing.svg';
import userIcon from '../assets/User.svg';
import shoppingCartIcon from '../assets/shopping-basket-01.svg';
import wishlistIcon from '../assets/wishlist.svg';
import compareIcon from '../assets/arrow-swap-horizontal.svg';
import arrowDownIcon from '../assets/ArrowRight.svg';

// Logo - 3D gold "dh" logo
const imgUntitled111 = logoImage;
// Phone/Call icon
const img = phoneIcon;
// Divider line - using a simple SVG inline or CSS border instead
const imgLine1 = "data:image/svg+xml,%3Csvg width='1' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='0' y2='24' stroke='%23ffffff' stroke-opacity='0.3'/%3E%3C/svg%3E";
// Track Order icon
const img1 = deliveryIcon;
// Report Fraud icon - using customer support as placeholder
const img2 = customerSupportIcon;
// Become a Seller icon
const img3 = handshakeIcon;
// Egypt flag for country selector
const imgFlat = egyptFlag;
// Dropdown arrow
const img4 = arrowDownIcon;
// Category dropdown arrow
const img5 = arrowDownIcon;
// Notification icon
const img6 = notificationIcon;
// User icon
const imgVuesaxLinearUser = userIcon;
// Shopping cart icon
const imgElements = shoppingCartIcon;
// Heart/Favorite icon (wishlist)
const imgVuesaxLinearHeart = wishlistIcon;
// Compare icon
const imgVuesaxOutlineArrowSwapHorizontal = compareIcon;

function User({ className }) {
  return (
    <div data-node-id="35:256" className={className}>
      <div data-node-id="35:257" className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearUser} />
      </div>
    </div>
  );
}

function ShoppingBasket({ className }) {
  return (
    <div data-node-id="35:112" className={className}>
      <div data-node-id="35:113" className="absolute inset-[8.33%_10.42%]">
        <div className="absolute inset-[-3.75%_-3.95%]">
          <img className="block max-w-none size-full" alt="" src={imgElements} />
        </div>
      </div>
    </div>
  );
}

function More({ className }) {
  return (
    <div data-node-id="35:101" className={className}>
      <div data-node-id="35:102" className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearHeart} />
      </div>
    </div>
  );
}

function ArrowSwapHorizontal({ className }) {
  return (
    <div data-node-id="35:84" className={className}>
      <div data-node-id="35:85" className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxOutlineArrowSwapHorizontal} />
      </div>
    </div>
  );
}

export default function Header() {
  const SHOW_REPORT_FRAUD = false;
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNavCategoryDropdown, setShowNavCategoryDropdown] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const navCategoryDropdownRef = useRef(null);
  const countryId = resolveCountryId(1);

  useEffect(() => {
    const loadHeaderCategories = async () => {
      try {
        const categoriesList = await getCategories();
        setApiCategories(categoriesList);
      } catch {
        setApiCategories([]);
      }
    };

    loadHeaderCategories();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadNotificationCount(0);
      return;
    }

    let cancelled = false;
    const loadNotificationCount = async () => {
      try {
        const list = await getNotifications();
        if (!cancelled) {
          const unread = list.filter((item) => !item.read).length;
          setUnreadNotificationCount(unread);
        }
      } catch {
        if (!cancelled) setUnreadNotificationCount(0);
      }
    };

    loadNotificationCount();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const categories = React.useMemo(() => {
    const apiList = apiCategories.map((item) => ({
      id: item.id,
      name: item.name,
      path: `/search?country_id=${countryId}&category_id=${item.id}`,
    }));

    return [
      { id: 'all', name: 'All Categories', path: `/search?country_id=${countryId}` },
      ...apiList,
    ];
  }, [apiCategories, countryId]);

  const topHeaderCategories = React.useMemo(
    () => categories.filter((item) => item.id !== 'all').slice(0, 5),
    [categories]
  );

  const selectedCategory = React.useMemo(
    () => categories.find((item) => String(item.id) === String(selectedCategoryId)) || categories[0],
    [categories, selectedCategoryId]
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryCategoryId = query.get('category_id');
    const querySearch = query.get('q');
    setSearchTerm(querySearch || '');
    if (queryCategoryId) {
      setSelectedCategoryId(queryCategoryId);
      return;
    }
    setSelectedCategoryId('all');
  }, [location.search]);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (navCategoryDropdownRef.current && !navCategoryDropdownRef.current.contains(event.target)) {
        setShowNavCategoryDropdown(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setShowDropdown(false);
        setShowCategoryDropdown(false);
        setShowNavCategoryDropdown(false);
      }
    }

    if (showDropdown || showCategoryDropdown || showNavCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when dropdown is open on mobile
      if (showDropdown) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showDropdown, showCategoryDropdown, showNavCategoryDropdown]);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className="relative z-[50]">
      {/* Top bar */}
      <div className="bg-[#0e1c47] dark:bg-[#0a1529] border-[#4b505e] dark:border-[#2a3a5a] border-b border-l-0 border-r-0 border-solid border-t-0 content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between px-[12px] sm:px-[16px] md:px-[40px] lg:px-[60px] xl:px-[120px] 2xl:px-[140px] py-[8px] sm:py-[10px] md:py-[12px] lg:py-[12px] xl:py-[8px] 2xl:py-[20px] relative shrink-0 w-full max-w-full overflow-hidden transition-colors duration-300" data-node-id="39:5520">
        <div className="content-stretch h-[15px !important]  flex gap-[6px] sm:gap-[8px] md:gap-[12px] lg:gap-[16px] items-center relative shrink-0 flex-wrap w-full sm:w-auto " data-node-id="39:5521" >
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 4" data-node-id="39:5522">
            <div className="relative shrink-0 size-[16px]" data-name="call" data-node-id="39:5523">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
            <p className="capitalize font-['Pacifico'] leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-center" dir="auto">
              <span className="font-['Poppins'] font-semibold">{`Call us `}</span>
              <span className="font-['Poppins'] font-sm hidden sm:inline">: +965 XXX XXXX</span>
              <span className="font-['Poppins'] font-sm sm:hidden">: +965...</span>
            </p>
          </div>
          <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[270deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-0.5px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
            </div>
          </div>
          <Link to="/track-order" className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-name="new-next-logo-gold 3">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img1} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-center hidden sm:block" dir="auto">
              Track Order
            </p>
          </Link>
          <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[270deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-0.5px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
            </div>
          </div>
          <Link to="/help-center" className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-center hidden md:block" dir="auto">
              Help Center
            </p>
          </Link>
          {SHOW_REPORT_FRAUD ? (
            <>
              <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-[270deg]">
                  <div className="h-0 relative w-[24px]">
                    <div className="absolute inset-[-0.5px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/report-fraud" className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="relative shrink-0 size-[16px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img2} />
                  </div>
                </div>
                <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-center hidden lg:block" dir="auto">
                  Report Fraud
                </p>
              </Link>
              <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
                <div className="flex-none rotate-[270deg]">
                  <div className="h-0 relative w-[24px]">
                    <div className="absolute inset-[-0.5px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          <a
            href={VENDOR_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img3} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-center hidden lg:block" dir="auto">{` Become a Seller`}</p>
          </a>
        </div>
        <div className="content-stretch flex gap-[6px] sm:gap-[8px] items-center justify-end relative shrink-0 w-full sm:w-auto mt-[8px] sm:mt-0">
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-[20px] rounded-[2px]">
              <img alt="Egypt" className="block size-full object-cover" src={imgFlat} />
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[14px] sm:text-[15px] lg:text-[14px] text-center" dir="auto">
              egypt
            </p>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[14px] sm:text-[15px] lg:text-[14px] text-center" dir="auto">
              eN
            </p>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Search bar and logo */}
      <div className="bg-[#0e1c47]   dark:bg-[#0a1529] content-stretch flex flex-col items-start px-[12px]  sm:px-[16px] md:px-[40px] lg:px-[60px] xl:px-[120px] 2xl:px-[140px] py-[0] sm:py-[12px] md:py-[14px] lg:py-[14px] xl:py-[20px] 2xl:py-[22px] relative shrink-0 w-full max-w-full overflow-visible transition-colors duration-300"   style={{ paddingTop: '0px'  ,paddingBottom: '0px'}}>
        <div className="content-stretch flex flex-col sm:flex-row items-center justify-between relative shrink-0 w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto gap-[12px] sm:gap-[14px] lg:gap-[16px] xl:gap-[24px]">
          <Link to="/" className="relative shrink-0 size-[36px] sm:size-[38px] md:size-[42px] lg:size-[42px] xl:size-[52px] 2xl:size-[56px] self-start sm:self-center cursor-pointer hover:opacity-80 transition-opacity">
            <img alt="Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
          </Link>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const query = new URLSearchParams();
              query.set('country_id', String(countryId));
              if (selectedCategoryId && selectedCategoryId !== 'all') {
                query.set('category_id', String(selectedCategoryId));
              }
              if (searchTerm.trim()) {
                query.set('q', searchTerm.trim());
              }
              navigate(`/search?${query.toString()}`);
            }}
            className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex h-[30px] sm:h-[30px] md:h-[30px] lg:h-[30px] xl:h-[30px] 2xl:h-[40px] items-center justify-between overflow-visible pl-[10px] sm:pl-[12px] md:pl-[14px] lg:pl-[16px] xl:pl-[24px] pr-0 py-0 relative rounded-[4px] shrink-0 w-full sm:w-[480px] md:w-[520px] lg:w-[520px] xl:w-[650px] 2xl:w-[700px] sm:max-w-full sm:flex-1 sm:min-w-0"
          >
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[13px] sm:text-[13px] md:text-[14px] lg:text-[14px] text-white bg-transparent border-none outline-none flex-1 min-w-0" 
              placeholder="Search for products" 
            />
            <div className="content-stretch flex gap-[12px] lg:gap-[14px] h-full items-center relative shrink-0">
              <div className="relative z-[100]" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="content-stretch flex gap-[6px] lg:gap-[8px] items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  aria-expanded={showCategoryDropdown}
                  aria-haspopup="true"
                >
                  <p className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[13px] sm:text-[14px] lg:text-[14px] text-white whitespace-nowrap">
                    {selectedCategory?.name || 'All Categories'}
                  </p>
                  <div className={`relative shrink-0 size-[20px] lg:size-[22px] transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`}>
                    <div className="absolute contents inset-0">
                      <img alt="" className="block max-w-none size-full" src={img5} />
                    </div>
                  </div>
                </button>
                
                {/* Category Dropdown */}
                {showCategoryDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-[9998] sm:hidden bg-black bg-opacity-20"
                      onClick={() => setShowCategoryDropdown(false)}
                      aria-hidden="true"
                    ></div>
                    <div className="absolute left-0 top-full mt-[8px] bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] w-[280px] sm:w-[300px] z-[9999] overflow-hidden animate-[dropdownFadeIn_0.2s_ease-out] max-h-[400px] overflow-y-auto">
                      <div className="py-[4px]">
                        {categories.map((category, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedCategoryId(String(category.id));
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full text-left flex items-center px-[16px] py-[10px] sm:py-[12px] text-[14px] font-['Poppins'] font-medium text-[#0e1c47] dark:text-white hover:bg-[#f8f9fa] dark:hover:bg-[#0f172a] transition-colors duration-150 cursor-pointer"
                          >
                            <span className="whitespace-nowrap">{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button 
                type="submit"
                className="bg-[#eea137] h-[30px] py-[10px] content-stretch flex h-full items-center justify-center px-[10px] sm:px-[14px] md:px-[16px] lg:px-[18px] py-[8px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <p className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] text-white whitespace-nowrap">
                  Search
                </p>
              </button>
            </div>
          </form>
          <div className="content-stretch flex gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[12px] items-center justify-end relative shrink-0 w-full sm:w-auto">
            <Link to="/compare" className="cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowSwapHorizontal className="relative shrink-0 size-[18px] sm:size-[19px] md:size-[20px] lg:size-[20px]" />
            </Link>
            <Link to="/favorite" className="cursor-pointer hover:opacity-80 transition-opacity">
              <More className="relative shrink-0 size-[18px] sm:size-[19px] md:size-[20px] lg:size-[20px]" />
            </Link>
            <Link to="/shopping-cart" className="cursor-pointer hover:opacity-80 transition-opacity relative">
              <ShoppingBasket className="overflow-clip relative shrink-0 size-[18px] sm:size-[19px] md:size-[20px] lg:size-[20px]" />
              {cartItemsCount > 0 ? (
                <span className="absolute -top-[8px] -right-[8px] min-w-[16px] h-[16px] px-[4px] rounded-full bg-[#eea137] text-white text-[10px] leading-[16px] text-center font-['Poppins'] font-semibold">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              ) : null}
            </Link>
            <Link to="/notifications" className="relative shrink-0 size-[18px] sm:size-[19px] md:size-[20px] lg:size-[20px] cursor-pointer hover:opacity-80 transition-opacity">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img6} />
              </div>
              {unreadNotificationCount > 0 ? (
                <span className="absolute -top-[8px] -right-[8px] min-w-[16px] h-[16px] px-[4px] rounded-full bg-[#eea137] text-white text-[10px] leading-[16px] text-center font-['Poppins'] font-semibold">
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </span>
              ) : null}
            </Link>
            <ThemeToggle />
            
            {/* User Authentication Button */}
            {isAuthenticated ? (
              <div className="relative z-[100]" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-[#eea137] content-stretch cursor-pointer flex gap-[6px] sm:gap-[7px] h-[38px] sm:h-[30px] md:h-[25px] lg:h-[30px] items-center justify-center px-[10px] sm:px-[12px] md:px-[14px] lg:px-[16px] py-[6px] sm:py-[6px] relative rounded-[4px] shrink-0 hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  <User className="relative shrink-0 size-[17px] sm:size-[18px] md:size-[20px] lg:size-[20px]" />
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-white whitespace-nowrap hidden sm:block">
                    {user?.firstName || user?.name || 'User'}
                  </p>
                  <div className={`relative shrink-0 size-[12px] sm:size-[14px] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}>
                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {/* Professional Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop overlay for mobile */}
                    <div 
                      className="fixed inset-0 z-40 sm:hidden"
                      onClick={() => setShowDropdown(false)}
                      aria-hidden="true"
                    ></div>
                    
                    {/* Dropdown Content */}
                    <div className="absolute right-0 top-full mt-[8px] sm:mt-[10px] bg-white border border-[#e6e6e6] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] w-[calc(100vw-32px)] max-w-[280px] sm:w-auto sm:min-w-[220px] md:min-w-[240px] z-[9999] overflow-hidden animate-[dropdownFadeIn_0.2s_ease-out] sm:right-0">
                      {/* User Info Section */}
                      <div className="bg-gradient-to-r from-[#0e1c47] to-[#1a2d5a] px-[16px] sm:px-[18px] py-[14px] sm:py-[16px] border-b border-[#e6e6e6]">
                        <div className="flex items-center gap-[12px]">
                          <div className="bg-[#eea137] rounded-full p-[8px] sm:p-[10px] flex items-center justify-center shrink-0">
                            <User className="relative shrink-0 size-[18px] sm:size-[20px] text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-['Poppins'] font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-white truncate leading-tight">
                              {user?.firstName && user?.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user?.firstName || user?.name || 'User Account'}
                            </p>
                            {user?.email && (
                              <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13px] text-[#f2f2f2] truncate mt-[2px] leading-tight">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-[4px]">
                        <Link
                          to="/my-profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#0e1c47] hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
                        >
                          <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#666] group-hover:text-[#eea137] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="whitespace-nowrap">My Profile</span>
                        </Link>

                        {!user?.isEmailVerified ? (
                          <Link
                            to="/verification"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#0e1c47] hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
                          >
                            <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#666] group-hover:text-[#eea137] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="whitespace-nowrap">Verify Email</span>
                          </Link>
                        ) : null}
                        
                        <Link
                          to="/my-orders"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#0e1c47] hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
                        >
                          <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#666] group-hover:text-[#eea137] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span className="whitespace-nowrap">My Orders</span>
                        </Link>

                        <Link
                          to="/my-tickets"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#0e1c47] hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
                        >
                          <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#666] group-hover:text-[#eea137] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4" />
                          </svg>
                          <span className="whitespace-nowrap">My Tickets</span>
                        </Link>
                        
                        <Link
                          to="/favorite"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#0e1c47] hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
                        >
                          <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#666] group-hover:text-[#eea137] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="whitespace-nowrap">Favorites</span>
                        </Link>
                        
                        <Link
                          to="/track-order"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#0e1c47] hover:bg-[#f8f9fa] transition-colors duration-150 group cursor-pointer"
                        >
                          <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#666] group-hover:text-[#eea137] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="whitespace-nowrap">Track Order</span>
                        </Link>
                      </div>
                      
                      {/* Divider */}
                      <div className="border-t border-[#e6e6e6] my-[2px]"></div>
                      
                      {/* Sign Out */}
                      <div className="py-[2px]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-[12px] px-[16px] sm:px-[18px] py-[10px] sm:py-[12px] text-[14px] sm:text-[15px] font-['Poppins'] font-medium text-[#dc2626] hover:bg-[#fef2f2] transition-colors duration-150 cursor-pointer"
                        >
                          <svg className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#dc2626] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="whitespace-nowrap">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="bg-[#eea137] content-stretch cursor-pointer flex h-[38px] sm:h-[40px] md:h-[42px] lg:h-[42px] items-center justify-center px-[12px] sm:px-[14px] md:px-[16px] lg:px-[18px] py-[8px] sm:py-[9px] relative rounded-[4px] shrink-0 hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
              >
                <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] sm:text-[12px] md:text-[12px] lg:text-[12px] text-white whitespace-nowrap">
                  Sign In
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Navigation menu */}
      <div className="bg-[#0e1c47] dark:bg-[#0a1529] content-stretch flex flex-col sm:flex-row gap-[10px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] xl:gap-[28px] 2xl:gap-[32px] items-center justify-center px-[12px] sm:px-[16px] md:px-[40px] lg:px-[60px] xl:px-[100px] 2xl:px-[120px] py-[10px] sm:py-[14px] md:py-[8px] lg:py-[8px] xl:py-[18px] 2xl:py-[22px] relative shrink-0 w-full max-w-full overflow-x-auto overflow-y-visible py-[8px] transition-colors duration-300" style={{ paddingTop: '10px', paddingBottom: '10px', overflow: 'visible' }}>
        <div className="relative z-[10000]" ref={navCategoryDropdownRef}>
          <button
            onClick={() => setShowNavCategoryDropdown(!showNavCategoryDropdown)}
            className="bg-[#eea137] hover:bg-[#ffb84d] content-stretch flex gap-[6px] sm:gap-[7px] h-[30px] sm:h-[30px] lg:h-[30px] items-center px-[12px] sm:px-[14px] md:px-[18px] lg:px-[18px] py-[8px] relative rounded-[4px] shrink-0 w-full sm:w-auto cursor-pointer transition-all duration-200"
            aria-expanded={showNavCategoryDropdown}
            aria-haspopup="true"
          >
            <p className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[15px] text-white whitespace-nowrap">
              Category
            </p>
            <div className={`relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[20px] transition-transform duration-200 ${showNavCategoryDropdown ? 'rotate-180' : ''}`}>
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img5} />
              </div>
            </div>
          </button>
          
          {/* Navigation Category Dropdown */}
          {showNavCategoryDropdown && (
            <>
              <div 
                className="fixed inset-0 z-[9998] sm:hidden bg-black bg-opacity-20"
                onClick={() => setShowNavCategoryDropdown(false)}
                aria-hidden="true"
              ></div>
              <div 
                className="absolute left-0 top-full mt-[8px] bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] w-[280px] sm:w-[300px] md:w-[320px] z-[10001] overflow-hidden animate-[dropdownFadeIn_0.2s_ease-out] max-h-[400px] overflow-y-auto"
                style={{ position: 'absolute', top: '100%', left: '0', marginTop: '8px' }}
              >
                <div className="py-[4px]">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={category.path}
                      onClick={() => setShowNavCategoryDropdown(false)}
                      className="flex items-center px-[16px] py-[10px] sm:py-[12px] text-[14px] font-['Poppins'] font-medium text-[#0e1c47] dark:text-white hover:bg-[#f8f9fa] dark:hover:bg-[#0f172a] transition-colors duration-150 cursor-pointer"
                    >
                      <span className="whitespace-nowrap">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="content-stretch flex flex-wrap gap-[10px] sm:gap-[14px] md:gap-[16px] lg:gap-[14px] items-center justify-center relative shrink-0 w-full sm:w-auto">
          {topHeaderCategories.map((category) => (
            <Link key={category.id} to={category.path} className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[7px] relative shrink-0 hover:opacity-80 transition-opacity">
              <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[14px] text-left text-white">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

