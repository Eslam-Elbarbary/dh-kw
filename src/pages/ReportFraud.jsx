// Report Fraud page component - exact Figma implementation
// Based on Figma design - Report Fraud Page

import { Link } from 'react-router-dom';
import { useState } from 'react';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function ReportFraud() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    last4Digits: '',
    cardType: 'visa',
    fraudDescription: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="flex flex-col gap-[40px] sm:gap-[50px] md:gap-[60px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[20px] sm:py-[30px] md:py-[40px]">
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full max-w-[800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#5f6c72] text-[14px] hover:text-[#eea137] transition-colors cursor-pointer">
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
          <p className="font-['Poppins'] font-medium leading-[20px] text-[#eea137] text-[14px]">
            Report Fraud
          </p>
        </div>

        {/* Report Fraud Form */}
        <div className="w-full max-w-[800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-0">
          <div className="bg-white border border-[#e4e7e9] border-solid rounded-[12px] p-[20px] sm:p-[24px] md:p-[32px]">
            {/* Form Title */}
            <h1 className="font-['Poppins'] font-semibold text-[#191c1f] text-[24px] sm:text-[28px] md:text-[32px] mb-[32px] sm:mb-[40px]">
              Report Fraud
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] sm:gap-[40px]">
              {/* Personal Information Section */}
              <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <h2 className="font-['Poppins'] font-medium leading-[24px] text-[18px] sm:text-[20px] text-black w-full">
                  Personal Information
                </h2>
                
                {/* Full Name and Company Name */}
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Company Name (Optional)
                    </label>
                    <input 
                      type="text" 
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card Information Section */}
              <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <h2 className="font-['Poppins'] font-medium leading-[24px] text-[18px] sm:text-[20px] text-black w-full">
                  Card Information
                </h2>
                
                {/* Last 4 Digits and Card Type */}
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Last 4 Digits of Card
                    </label>
                    <input 
                      type="text" 
                      name="last4Digits"
                      value={formData.last4Digits}
                      onChange={handleChange}
                      maxLength={4}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="****"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Card Type
                    </label>
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white"
                      required
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="amex">American Express</option>
                      <option value="discover">Discover</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fraud Details Section */}
              <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <h2 className="font-['Poppins'] font-medium leading-[24px] text-[18px] sm:text-[20px] text-black w-full">
                  Fraud Details
                </h2>
                
                <div className="flex flex-col gap-[8px] w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                    Fraud Description
                  </label>
                  <textarea 
                    name="fraudDescription"
                    value={formData.fraudDescription}
                    onChange={handleChange}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full min-h-[120px] sm:min-h-[150px] resize-y"
                    placeholder="Please describe the suspicious activity, transaction date, amount, and any relevant details."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[24px] sm:px-[32px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[14px] sm:text-[16px] w-full sm:w-auto self-start"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

