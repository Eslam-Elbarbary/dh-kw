// Shared Header Component used across pages
// This will be a reusable component based on the Figma design

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const imgUntitled111 = "https://www.figma.com/api/mcp/asset/f31432a1-167d-4d8b-9ee7-b251ce43e5b4";
const img = "https://www.figma.com/api/mcp/asset/4d564cb0-8338-4267-86a3-dfd6078c6d49";
const imgLine1 = "https://www.figma.com/api/mcp/asset/3d13583c-17cc-49fa-9981-7ac0daee5848";
const img1 = "https://www.figma.com/api/mcp/asset/44bb4a15-1b33-43cb-b03c-a87b32237591";
const img2 = "https://www.figma.com/api/mcp/asset/ecb82ee8-788c-4e28-8a1e-21ac31f85326";
const img3 = "https://www.figma.com/api/mcp/asset/69fd3785-75a0-4e97-b176-040bfbf2f27c";
const imgFlat = "https://www.figma.com/api/mcp/asset/dffb8424-3ec8-4a86-a1b5-4d02a9ea4de6";
const imgGloss = "https://www.figma.com/api/mcp/asset/d6bfa6be-9b1d-4027-9757-840d5570b228";
const img4 = "https://www.figma.com/api/mcp/asset/20de8cb0-4925-46b3-a332-aba9de662e58";
const img5 = "https://www.figma.com/api/mcp/asset/5ae7a2bc-9643-45e3-a5c9-fdf5ec2767b0";
const img6 = "https://www.figma.com/api/mcp/asset/435b1176-2161-45eb-b98f-f5b4d519dc89";
const imgVuesaxLinearUser = "https://www.figma.com/api/mcp/asset/6864330c-0bbe-4530-8845-063f68683f34";
const imgElements = "https://www.figma.com/api/mcp/asset/64763ae8-71d8-4332-ab94-11c0b35ba0cb";
const imgVuesaxLinearHeart = "https://www.figma.com/api/mcp/asset/be2e3cf6-c96e-4aa3-92dd-0bd3886ea905";
const imgVuesaxOutlineArrowSwapHorizontal = "https://www.figma.com/api/mcp/asset/6c17a39a-5718-4120-a0e9-8b6994ef0a94";

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
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape' && showDropdown) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when dropdown is open on mobile
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0e1c47] dark:bg-[#0a1529] border-[#4b505e] dark:border-[#2a3a5a] border-b border-l-0 border-r-0 border-solid border-t-0 content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[10px] sm:py-[12px] md:py-[14px] lg:py-[16px] xl:py-[18px] 2xl:py-[20px] relative shrink-0 w-full max-w-full overflow-hidden transition-colors duration-300" data-node-id="39:5520">
        <div className="content-stretch flex gap-[6px] sm:gap-[8px] md:gap-[12px] lg:gap-[16px] items-center relative shrink-0 flex-wrap w-full sm:w-auto" data-node-id="39:5521">
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 4" data-node-id="39:5522">
            <div className="relative shrink-0 size-[16px]" data-name="call" data-node-id="39:5523">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
            <p className="capitalize font-['Pacifico'] leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center" dir="auto">
              <span className="font-['Poppins'] font-semibold">{`Call us `}</span>
              <span className="font-['Poppins'] font-normal hidden sm:inline">: +965 XXX XXXX</span>
              <span className="font-['Poppins'] font-normal sm:hidden">: +965...</span>
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
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden sm:block" dir="auto">
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
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden md:block" dir="auto">
              Help Center
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
          <Link to="/report-fraud" className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img2} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden lg:block" dir="auto">
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
          <Link to="/become-a-seller" className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img3} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden lg:block" dir="auto">{` Become a Seller`}</p>
          </Link>
        </div>
        <div className="content-stretch flex gap-[6px] sm:gap-[8px] items-center justify-end relative shrink-0 w-full sm:w-auto mt-[8px] sm:mt-0">
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgFlat} />
                </div>
              </div>
              <div className="absolute inset-[12.76%_4.42%_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgGloss} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto">
              egypt
            </p>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto">
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
      <div className="bg-[#0e1c47] dark:bg-[#0a1529] content-stretch flex flex-col items-start px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[12px] sm:py-[14px] md:py-[16px] lg:py-[18px] xl:py-[20px] 2xl:py-[22px] relative shrink-0 w-full max-w-full overflow-visible transition-colors duration-300">
        <div className="content-stretch flex flex-col sm:flex-row items-center justify-between relative shrink-0 w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto gap-[12px] sm:gap-[16px] lg:gap-[20px] xl:gap-[24px]">
          <Link to="/" className="relative shrink-0 size-[36px] sm:size-[40px] md:size-[44px] lg:size-[48px] xl:size-[52px] 2xl:size-[56px] self-start sm:self-center cursor-pointer hover:opacity-80 transition-opacity">
            <img alt="Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
          </Link>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/search');
            }}
            className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex h-[42px] sm:h-[44px] md:h-[48px] lg:h-[52px] xl:h-[56px] 2xl:h-[60px] items-center justify-between overflow-hidden pl-[10px] sm:pl-[12px] md:pl-[16px] lg:pl-[20px] xl:pl-[24px] pr-0 py-0 relative rounded-[4px] shrink-0 w-full sm:w-[500px] md:w-[550px] lg:w-[600px] xl:w-[650px] 2xl:w-[700px] sm:max-w-full sm:flex-1 sm:min-w-0"
          >
            <input 
              type="text" 
              className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[13px] sm:text-[14px] md:text-[16px] text-white bg-transparent border-none outline-none flex-1 min-w-0" 
              placeholder="Search for products" 
            />
            <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <p className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
                  Category
                </p>
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img5} />
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                className="bg-[#eea137] content-stretch flex h-full items-center justify-center px-[12px] sm:px-[16px] md:px-[20px] lg:px-[24px] py-[8px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <p className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white whitespace-nowrap">
                  Search
                </p>
              </button>
            </div>
          </form>
          <div className="content-stretch flex gap-[10px] sm:gap-[12px] md:gap-[14px] lg:gap-[16px] items-center justify-end relative shrink-0 w-full sm:w-auto">
            <Link to="/compare" className="cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowSwapHorizontal className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
            </Link>
            <Link to="/favorite" className="cursor-pointer hover:opacity-80 transition-opacity">
              <More className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
            </Link>
            <Link to="/shopping-cart" className="cursor-pointer hover:opacity-80 transition-opacity">
              <ShoppingBasket className="overflow-clip relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
            </Link>
            <Link to="/notifications" className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px] cursor-pointer hover:opacity-80 transition-opacity">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img6} />
              </div>
            </Link>
            <ThemeToggle />
            
            {/* User Authentication Button */}
            {isAuthenticated ? (
              <div className="relative z-[100]" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-[#eea137] content-stretch cursor-pointer flex gap-[6px] sm:gap-[8px] h-[40px] sm:h-[44px] md:h-[48px] items-center justify-center px-[10px] sm:px-[12px] md:px-[16px] lg:px-[20px] py-[8px] sm:py-[10px] relative rounded-[4px] shrink-0 hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  <User className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] sm:text-[14px] md:text-[16px] text-white whitespace-nowrap hidden sm:block">
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
                className="bg-[#eea137] content-stretch cursor-pointer flex h-[40px] sm:h-[44px] md:h-[48px] items-center justify-center px-[12px] sm:px-[16px] md:px-[20px] py-[8px] sm:py-[10px] relative rounded-[4px] shrink-0 hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
              >
                <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[12px] sm:text-[14px] md:text-[16px] text-white whitespace-nowrap">
                  Sign In
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Navigation menu */}
      <div className="bg-[#0e1c47] dark:bg-[#0a1529] content-stretch flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] items-center justify-center px-[12px] sm:px-[16px] md:px-[40px] lg:px-[80px] xl:px-[100px] 2xl:px-[120px] py-[12px] sm:py-[16px] md:py-[20px] lg:py-[24px] xl:py-[28px] 2xl:py-[32px] relative shrink-0 w-full max-w-full overflow-x-auto transition-colors duration-300">
        <div className="bg-[#eea137] content-stretch flex gap-[6px] sm:gap-[8px] h-[36px] sm:h-[40px] items-center px-[12px] sm:px-[16px] md:px-[20px] lg:px-[24px] py-[8px] relative rounded-[4px] shrink-0 w-full sm:w-auto">
          <p className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] sm:text-[17px] md:text-[18px] text-white whitespace-nowrap">
            Category
          </p>
          <div className="relative shrink-0 size-[20px] sm:size-[22px] md:size-[24px]">
            <div className="absolute contents inset-0">
              <img alt="" className="block max-w-none size-full" src={img5} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-wrap gap-[12px] sm:gap-[16px] md:gap-[20px] items-center justify-center relative shrink-0 w-full sm:w-auto">
          <Link to="/pc-components" className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0 hover:opacity-80 transition-opacity">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-left text-white">{`Computers & Laptops`}</p>
          </Link>
          <Link to="/" className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0 hover:opacity-80 transition-opacity">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">{`Mobiles & Tablets`}</p>
          </Link>
          <Link to="/digital-e-cards" className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0 hover:opacity-80 transition-opacity">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Smartphones
            </p>
          </Link>
          <Link to="/pc-components" className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0 hover:opacity-80 transition-opacity">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Monitors
            </p>
          </Link>
          <Link to="/pc-components" className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0 hover:opacity-80 transition-opacity">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Processors
            </p>
          </Link>
          <Link to="/pc-components" className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0 hover:opacity-80 transition-opacity">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Motherboards
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}

