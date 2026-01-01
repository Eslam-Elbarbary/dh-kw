// Delivery & Return page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgTruck = "https://www.figma.com/api/mcp/asset/44bb4a15-1b33-43cb-b03c-a87b32237591";

export default function DeliveryReturn() {
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
            Delivery & Return
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Delivery & Return Policy
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Learn about our shipping options, delivery times, and return process.
          </p>
        </div>

        {/* Delivery Section */}
        <div className="w-full">
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm mb-[32px] sm:mb-[40px]">
            <div className="flex items-center gap-[16px] mb-[24px] sm:mb-[32px]">
              <div className="bg-[#0e1c47] w-[56px] h-[56px] rounded-full flex items-center justify-center shrink-0">
                <img alt="" className="w-[28px] h-[28px] filter brightness-0 invert" src={imgTruck} onError={(e) => e.target.style.display = 'none'} />
              </div>
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47]">
                Delivery Information
              </h2>
            </div>

            <div className="flex flex-col gap-[24px] sm:gap-[32px]">
              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[12px]">
                  Shipping Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] sm:gap-[20px]">
                  <div className="bg-[#f8f9fa] border border-[#e6e6e6] rounded-[4px] p-[20px]">
                    <h4 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] mb-[8px]">
                      Standard Shipping
                    </h4>
                    <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mb-[8px]">
                      5-7 business days
                    </p>
                    <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#eea137]">
                      Free on orders over $50
                    </p>
                  </div>
                  <div className="bg-[#f8f9fa] border border-[#e6e6e6] rounded-[4px] p-[20px]">
                    <h4 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] mb-[8px]">
                      Express Shipping
                    </h4>
                    <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] mb-[8px]">
                      2-3 business days
                    </p>
                    <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#eea137]">
                      $15.00
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[12px]">
                  Delivery Process
                </h3>
                <ul className="flex flex-col gap-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] list-disc list-inside">
                  <li>Once your order is confirmed, you'll receive an email with tracking information</li>
                  <li>You can track your order in real-time using the Track Order page</li>
                  <li>Most orders are processed within 1-2 business days</li>
                  <li>You'll receive a notification when your order is out for delivery</li>
                  <li>Delivery requires a signature for orders over $500</li>
                </ul>
              </div>

              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[12px]">
                  International Shipping
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed mb-[12px]">
                  We ship to many countries worldwide. Shipping costs and delivery times vary by destination. International orders may be subject to customs duties and taxes, which are the responsibility of the recipient.
                </p>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  For international shipping estimates, please contact our customer service team.
                </p>
              </div>
            </div>
          </div>

          {/* Return Section */}
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            <div className="flex items-center gap-[16px] mb-[24px] sm:mb-[32px]">
              <div className="bg-[#eea137] w-[56px] h-[56px] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-[28px] h-[28px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47]">
                Return Policy
              </h2>
            </div>

            <div className="flex flex-col gap-[24px] sm:gap-[32px]">
              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[12px]">
                  30-Day Return Policy
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed mb-[12px]">
                  We offer a 30-day return policy for most items. To be eligible for a return, your item must be:
                </p>
                <ul className="flex flex-col gap-[8px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] list-disc list-inside mb-[12px]">
                  <li>Unused and in the same condition as when you received it</li>
                  <li>In the original packaging with all tags attached</li>
                  <li>Accompanied by the original receipt or proof of purchase</li>
                </ul>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  Items that are damaged, used, or missing parts may not be eligible for return.
                </p>
              </div>

              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[12px]">
                  How to Return an Item
                </h3>
                <div className="flex flex-col gap-[16px]">
                  <div className="flex gap-[12px]">
                    <div className="bg-[#eea137] text-white rounded-full size-[32px] flex items-center justify-center font-['Poppins'] font-semibold text-[16px] shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                        Log into your account and navigate to your order history
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[12px]">
                    <div className="bg-[#eea137] text-white rounded-full size-[32px] flex items-center justify-center font-['Poppins'] font-semibold text-[16px] shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                        Select the item you want to return and click "Return Item"
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[12px]">
                    <div className="bg-[#eea137] text-white rounded-full size-[32px] flex items-center justify-center font-['Poppins'] font-semibold text-[16px] shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                        Fill out the return form and print the return label
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[12px]">
                    <div className="bg-[#eea137] text-white rounded-full size-[32px] flex items-center justify-center font-['Poppins'] font-semibold text-[16px] shrink-0">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                        Package the item securely and ship it back using the provided label
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[12px]">
                  Refund Process
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed mb-[12px]">
                  Once we receive and inspect your returned item, we will process your refund. Refunds will be issued to the original payment method within 5-10 business days.
                </p>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed">
                  Shipping costs are non-refundable unless the item was defective or we made an error in your order.
                </p>
              </div>

              <div className="bg-[#fff4e6] border border-[#eea137] border-solid rounded-[4px] p-[20px] sm:p-[24px]">
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  Non-Returnable Items
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  Some items cannot be returned for hygiene or safety reasons, including: personalized items, digital products, perishable goods, and items marked as "Final Sale".
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
          <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
            Need More Help?
          </h2>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
            If you have questions about delivery or returns, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-[16px] justify-center">
            <Link
              to="/contact-us"
              className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/help-center"
              className="bg-transparent border-2 border-white text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-white hover:text-[#0e1c47] transition-colors"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

