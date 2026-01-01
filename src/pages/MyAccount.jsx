// My Account page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function MyAccount() {
  const { isAuthenticated, user } = useAuth();

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
            My Account
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            My Account
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Manage your account settings, orders, and preferences.
          </p>
        </div>

        {/* Main Content */}
        {isAuthenticated ? (
          <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
            {/* Account Overview */}
            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[20px] sm:mb-[24px]">
                Account Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[24px]">
                <div>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#666] mb-[4px]">Full Name</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47]">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || user?.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#666] mb-[4px]">Email Address</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47]">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#666] mb-[4px]">Phone Number</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47]">
                    {user?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#666] mb-[4px]">Member Since</p>
                  <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47]">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px]">
                <Link
                  to="/shopping-cart"
                  className="bg-[#f8f9fa] border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] hover:border-[#eea137] hover:bg-[#fff4e6] transition-all group"
                >
                  <div className="text-[32px] mb-[12px]">🛒</div>
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    My Orders
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                    View and manage your orders
                  </p>
                </Link>
                <Link
                  to="/favorite"
                  className="bg-[#f8f9fa] border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] hover:border-[#eea137] hover:bg-[#fff4e6] transition-all group"
                >
                  <div className="text-[32px] mb-[12px]">❤️</div>
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    Favorites
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                    Your saved favorite items
                  </p>
                </Link>
                <Link
                  to="/track-order"
                  className="bg-[#f8f9fa] border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] hover:border-[#eea137] hover:bg-[#fff4e6] transition-all group"
                >
                  <div className="text-[32px] mb-[12px]">📦</div>
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    Track Order
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                    Track your order status
                  </p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
            <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
              Please Sign In
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
              You need to be signed in to access your account. Sign in to view your orders, favorites, and account settings.
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

