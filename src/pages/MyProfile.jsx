// My Profile page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function MyProfile() {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Profile updated successfully!');
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
            My Profile
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            My Profile
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Main Content */}
        {isAuthenticated ? (
          <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
            {/* Profile Form */}
            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
                Personal Information
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] sm:gap-[24px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[24px]">
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] sm:gap-[24px]">
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your country"
                    />
                  </div>
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your zip code"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] justify-end mt-[8px]">
                  <button
                    type="submit"
                    className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Account Security */}
            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
                Account Security
              </h2>
              <div className="flex flex-col gap-[16px] sm:gap-[20px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] p-[16px] sm:p-[20px] bg-[#f8f9fa] rounded-[4px]">
                  <div>
                    <h3 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] mb-[4px]">
                      Change Password
                    </h3>
                    <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                      Update your password to keep your account secure
                    </p>
                  </div>
                  <button className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold px-[24px] py-[12px] rounded-[4px] hover:bg-[#1a2d5a] transition-colors whitespace-nowrap">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
            <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
              Please Sign In
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
              You need to be signed in to access your profile. Sign in to view and edit your personal information.
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

