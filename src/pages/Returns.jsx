// Returns page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function Returns() {
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
            Returns
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Returns & Refunds
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Learn about our return policy and how to return items.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
          {/* Return Policy */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[16px] sm:mb-[20px]">
              30-Day Return Policy
            </h2>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed mb-[16px]">
              We offer a 30-day return policy for most items. If you're not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] sm:gap-[20px] mt-[20px]">
              <div className="bg-[#f8f9fa] p-[16px] sm:p-[20px] rounded-[4px]">
                <h3 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] mb-[8px]">
                  ✓ Eligible Items
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                  Most products in original condition with tags and packaging
                </p>
              </div>
              <div className="bg-[#f8f9fa] p-[16px] sm:p-[20px] rounded-[4px]">
                <h3 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] mb-[8px]">
                  ✗ Non-Returnable
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">
                  Personalized items, perishables, and digital products
                </p>
              </div>
            </div>
          </div>

          {/* How to Return */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
              How to Return an Item
            </h2>
            <div className="flex flex-col gap-[20px] sm:gap-[24px]">
              <div className="flex gap-[16px] sm:gap-[20px]">
                <div className="bg-[#eea137] text-white rounded-full size-[40px] sm:size-[48px] flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[18px] sm:text-[20px]">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    Log into Your Account
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                    Sign in to your account and navigate to your order history.
                  </p>
                </div>
              </div>
              <div className="flex gap-[16px] sm:gap-[20px]">
                <div className="bg-[#eea137] text-white rounded-full size-[40px] sm:size-[48px] flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[18px] sm:text-[20px]">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    Select Item to Return
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                    Choose the item you want to return and select the return reason.
                  </p>
                </div>
              </div>
              <div className="flex gap-[16px] sm:gap-[20px]">
                <div className="bg-[#eea137] text-white rounded-full size-[40px] sm:size-[48px] flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[18px] sm:text-[20px]">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    Print Return Label
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                    Print the return shipping label and attach it to your package.
                  </p>
                </div>
              </div>
              <div className="flex gap-[16px] sm:gap-[20px]">
                <div className="bg-[#eea137] text-white rounded-full size-[40px] sm:size-[48px] flex items-center justify-center shrink-0 font-['Poppins'] font-bold text-[18px] sm:text-[20px]">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                    Ship the Package
                  </h3>
                  <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                    Drop off your package at the designated shipping location. We'll process your refund once we receive it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[16px] sm:mb-[20px]">
              Refund Process
            </h2>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed mb-[16px]">
              Once we receive and inspect your returned item, we'll process your refund. Refunds are typically issued within 5-7 business days to your original payment method.
            </p>
            <div className="bg-[#fff4e6] border border-[#eea137] border-solid rounded-[4px] p-[16px] sm:p-[20px] mt-[20px]">
              <p className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47]">
                <span className="text-[#eea137] font-bold">Note:</span> Shipping costs are non-refundable unless the return is due to our error or a defective product.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
          <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
            Need Help with Returns?
          </h2>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
            Our customer support team is here to help you with any questions about returns or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] justify-center">
            <Link
              to="/contact-us"
              className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/help-center"
              className="inline-block bg-transparent border-2 border-white text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-white hover:text-[#0e1c47] transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

