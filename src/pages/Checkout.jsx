// Checkout page - exact Figma implementation
// Based on Figma design - Checkout Page

import { Link } from 'react-router-dom';
import { useState } from 'react';

// Arrow icon for breadcrumbs
const imgArrowDown = "https://www.figma.com/api/mcp/asset/213740b6-f6ce-401b-b216-6f0baca55345";

// Payment method icons - using placeholder URLs, replace with actual Figma assets
const imgCashOnDelivery = "https://www.figma.com/api/mcp/asset/bf5d3cb2-5229-4f9a-b1c9-668837cf4746"; // Dollar icon
const imgVenmo = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop"; // Placeholder - replace with Venmo logo
const imgPayPal = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop"; // Placeholder - replace with PayPal logo
const imgAmazonPay = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop"; // Placeholder - replace with Amazon logo
const imgCreditCard = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop"; // Placeholder - replace with card icon

// Arrow right icon for button
const imgArrowRight = "https://www.figma.com/api/mcp/asset/6151f0b2-acef-45a0-95df-6f7ce61ca8a5";

// Product images for order summary
const imgCamera = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop";
const imgHeadphones = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);

  return (
    <div className="bg-white relative w-full min-h-screen" data-name="Checkout" data-node-id="35:5064">
      <div className="flex flex-col gap-[40px] sm:gap-[50px] md:gap-[60px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[20px] sm:py-[30px] md:py-[40px]">
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full max-w-[1240px] px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-name="Breadcrumb" data-node-id="35:5125">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] not-italic relative shrink-0 text-[#666] text-[14px] hover:text-[#eea137] transition-colors cursor-pointer" data-node-id="35:5126">
            Home
          </Link>
          <div className="flex items-center justify-center relative shrink-0 size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]" data-name="arrow-down" data-node-id="35:5127">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
          <Link to="/shopping-cart" className="font-['Poppins'] font-medium leading-[20px] not-italic relative shrink-0 text-[#eea137] text-[14px] hover:opacity-80 transition-opacity cursor-pointer" data-node-id="35:5136">
            Shopping Card
          </Link>
        </div>
        
        {/* Checkout Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-[24px] sm:gap-[32px] relative w-full max-w-[1240px]" data-node-id="35:5141">
          {/* Left Column - Checkout Information */}
          <div className="flex flex-col gap-[40px] sm:gap-[50px] items-start relative shrink-0 flex-1 w-full lg:min-w-0" data-name="Checkout Information" data-node-id="35:5142">
            {/* Billing Information */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Billing Information" data-node-id="35:5143">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5144">
                Billing Information
              </p>
              
              {/* Name Fields */}
              <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">First name</label>
                  <input 
                    type="text" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="First name"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Last name</label>
                  <input 
                    type="text" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-[8px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Company Name (Optional)</label>
                <input 
                  type="text" 
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                  placeholder="Company Name"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-[8px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Address</label>
                <input 
                  type="text" 
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                  placeholder="Address"
                />
              </div>

              {/* Location Details */}
              <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Country</label>
                  <select className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white">
                    <option value="">Select...</option>
                    <option value="kuwait">Kuwait</option>
                    <option value="saudi">Saudi Arabia</option>
                    <option value="uae">UAE</option>
                  </select>
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Region/State</label>
                  <select className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white">
                    <option value="">Select...</option>
                  </select>
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">City</label>
                  <select className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white">
                    <option value="">Select...</option>
                  </select>
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Zip Code</label>
                  <input 
                    type="text" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Zip Code"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Email</label>
                  <input 
                    type="email" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Email"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Phone Number</label>
                  <input 
                    type="tel" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Shipping Option */}
              <div className="flex items-center gap-[8px] w-full">
                <input 
                  type="checkbox" 
                  id="shipDifferent"
                  checked={shipToDifferentAddress}
                  onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                  className="w-[16px] h-[16px] cursor-pointer"
                />
                <label htmlFor="shipDifferent" className="font-['Poppins'] font-normal text-[14px] text-[#333] cursor-pointer">
                  Ship into different address
                </label>
              </div>
            </div>
            
            {/* Payment Option */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:5194">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5195">
                Payment Option
              </p>
              
              {/* Payment Methods */}
              <div className="flex flex-wrap gap-[12px] sm:gap-[16px] w-full">
                {[
                  { id: 'cash', label: 'Cash on Delivery', icon: imgCashOnDelivery },
                  { id: 'venmo', label: 'Venmo', icon: imgVenmo },
                  { id: 'paypal', label: 'Paypal', icon: imgPayPal },
                  { id: 'amazon', label: 'Amazon Pay', icon: imgAmazonPay },
                  { id: 'card', label: 'Debit/Credit Card', icon: imgCreditCard }
                ].map((method) => (
                  <div key={method.id} className="flex flex-col items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`border border-[#e4e7e9] border-solid rounded-[8px] p-[12px] sm:p-[16px] flex flex-col items-center justify-center gap-[8px] w-[100px] sm:w-[120px] h-[120px] sm:h-[140px] cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'border-[#eea137] bg-[#fff9f0]' 
                          : 'hover:border-[#0e1c47]'
                      }`}
                    >
                      <div className="relative size-[40px] sm:size-[48px] flex items-center justify-center shrink-0">
                        {method.id === 'cash' ? (
                          <div className="text-[24px] sm:text-[28px]">$</div>
                        ) : (
                          <img 
                            src={method.icon} 
                            alt={method.label} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop';
                            }}
                          />
                        )}
                      </div>
                      <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13px] text-[#333] text-center leading-tight">
                        {method.label}
                      </p>
                    </button>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="w-[16px] h-[16px] cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Card Details - Show when Debit/Credit Card is selected */}
              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-[16px] sm:gap-[20px] w-full mt-[8px]">
                  <div className="flex flex-col gap-[8px] w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Name on Card</label>
                    <input 
                      type="text" 
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Name on Card"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Card Number</label>
                    <input 
                      type="text" 
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Card Number"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                    <div className="flex flex-col gap-[8px] flex-1 w-full">
                      <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Expire Date</label>
                      <input 
                        type="text" 
                        className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                        placeholder="DD/YY"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px] flex-1 w-full">
                      <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">CVC</label>
                      <input 
                        type="text" 
                        className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Information */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Additional Information" data-node-id="35:5250">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5251">
                Additional Information
              </p>
              <div className="flex flex-col gap-[8px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Order Notes (Optional)</label>
                <textarea 
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full min-h-[100px] resize-y"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="bg-white border border-[#e6e6e6] border-solid flex flex-col gap-[24px] items-start justify-start p-[20px] sm:p-[24px] rounded-[12px] shrink-0 w-full lg:w-[400px] lg:sticky lg:top-[100px] lg:self-start" data-name="Order Summery" data-node-id="35:5256">
            <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5257">
              Order Summery
            </p>
            
            {/* Order Items */}
            <div className="flex flex-col gap-[16px] w-full">
              {/* Item 1 */}
              <div className="flex gap-[12px] items-start w-full">
                <div className="relative size-[80px] sm:size-[100px] shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5]">
                  <img 
                    src={imgCamera} 
                    alt="Canon EOS 1500D DSLR Camera" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-['Poppins'] font-normal text-[14px] text-[#333] line-clamp-2">
                    Canon EOS 1500D DSLR Camera Body+ 18-...
                  </p>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#333]">
                    1 x $70
                  </p>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex gap-[12px] items-start w-full">
                <div className="relative size-[80px] sm:size-[100px] shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5]">
                  <img 
                    src={imgHeadphones} 
                    alt="Wired Over-Ear Gaming Headphones" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-['Poppins'] font-normal text-[14px] text-[#333] line-clamp-2">
                    Wired Over-Ear Gaming Headphones with U...
                  </p>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#333]">
                    3 x $250
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-[12px] w-full border-t border-[#e4e7e9] pt-[16px]">
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Sub-total</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">$320</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Shipping</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">Free</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Discount</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">$24</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Tax</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">$61.99</p>
              </div>
              <div className="flex justify-between items-center w-full border-t border-[#e4e7e9] pt-[12px] mt-[4px]">
                <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#333]">Total</p>
                <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#333]">$357.99 USD</p>
              </div>
            </div>

            {/* Process To Check Button */}
            <button className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[14px] sm:text-[16px] w-full flex items-center justify-center gap-[8px] cursor-pointer">
              <span>Process To Check</span>
              <div className="relative size-[16px] sm:size-[18px]">
                <img 
                  src={imgArrowRight} 
                  alt="Arrow" 
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
