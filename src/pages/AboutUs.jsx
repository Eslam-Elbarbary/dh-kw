// About Us page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function AboutUs() {
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
            About Us
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            About Us
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            A premium store offering a curated selection from top international brands.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
          {/* Mission Section */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[16px] sm:mb-[20px]">
              Our Mission
            </h2>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed mb-[16px]">
              At our core, we are committed to providing customers with access to the finest products from around the world. We carefully curate our selection to ensure that every item meets our high standards for quality, authenticity, and value.
            </p>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
              Our mission is to make premium products accessible to everyone while maintaining the highest level of customer service and satisfaction.
            </p>
          </div>

          {/* Values Section */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[24px]">
              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Quality First
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  We source only the highest quality products from trusted international brands and suppliers.
                </p>
              </div>
              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Customer Focus
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  Your satisfaction is our priority. We strive to provide exceptional service at every step of your journey.
                </p>
              </div>
              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Innovation
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  We continuously improve our platform and services to provide you with the best shopping experience.
                </p>
              </div>
              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Integrity
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  We conduct our business with honesty, transparency, and ethical practices in all our operations.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px]">
              <div>
                <div className="text-[40px] mb-[12px]">🌍</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Global Selection
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Access products from top international brands worldwide.
                </p>
              </div>
              <div>
                <div className="text-[40px] mb-[12px]">🚚</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Fast Delivery
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Quick and reliable shipping to get your orders to you fast.
                </p>
              </div>
              <div>
                <div className="text-[40px] mb-[12px]">🛡️</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Secure Shopping
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Your data and payments are protected with industry-leading security.
                </p>
              </div>
              <div>
                <div className="text-[40px] mb-[12px]">💬</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  24/7 Support
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Our customer support team is always ready to help you.
                </p>
              </div>
              <div>
                <div className="text-[40px] mb-[12px]">↩️</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Easy Returns
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Hassle-free return process if you're not completely satisfied.
                </p>
              </div>
              <div>
                <div className="text-[40px] mb-[12px]">⭐</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Best Prices
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Competitive pricing with regular deals and special offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

