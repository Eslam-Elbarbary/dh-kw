// Contact Us page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgPhone = "https://www.figma.com/api/mcp/asset/4d564cb0-8338-4267-86a3-dfd6078c6d49";
const imgEmailSvg = "https://www.figma.com/api/mcp/asset/19365f23-25c4-449c-96f3-68de3e9bcd48";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
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
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
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
            Contact Us
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Get in Touch
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Have a question or need assistance? We're here to help. Reach out to us through any of the methods below.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px] w-full">
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] text-center hover:shadow-lg transition-all">
            <div className="bg-[#0e1c47] w-[56px] h-[56px] rounded-full flex items-center justify-center mx-auto mb-[16px]">
              <img alt="" className="w-[28px] h-[28px] filter brightness-0 invert" src={imgPhone} onError={(e) => e.target.style.display = 'none'} />
            </div>
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
              Phone
            </h3>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
              +965 XXX XXXX
            </p>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mt-[4px]">
              Mon - Fri: 9:00 AM - 6:00 PM
            </p>
          </div>

          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] text-center hover:shadow-lg transition-all">
            <div className="bg-[#eea137] w-[56px] h-[56px] rounded-full flex items-center justify-center mx-auto mb-[16px]">
              <img alt="" className="w-[28px] h-[28px] filter brightness-0 invert" src={imgEmailSvg} onError={(e) => e.target.style.display = 'none'} />
            </div>
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
              Email
            </h3>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
              support@example.com
            </p>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mt-[4px]">
              We'll respond within 24 hours
            </p>
          </div>

          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] text-center hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
            <div className="bg-[#0e1c47] w-[56px] h-[56px] rounded-full flex items-center justify-center mx-auto mb-[16px]">
              <svg className="w-[28px] h-[28px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
              Address
            </h3>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
              Kuwait City, Kuwait
            </p>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mt-[4px]">
              Visit us during business hours
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-[800px] mx-auto">
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] sm:gap-[24px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-[20px]">
                <div>
                  <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                />
              </div>
              <div>
                <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                />
              </div>
              <div>
                <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-[16px] py-[12px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors text-[16px] sm:text-[18px]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

