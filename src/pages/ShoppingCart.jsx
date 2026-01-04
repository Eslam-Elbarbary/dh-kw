// Shopping Cart page component - exact Figma implementation
// Based on Figma design - Shopping Cart Page

import { Link } from 'react-router-dom';
import { useState } from 'react';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgRemove = "https://www.figma.com/api/mcp/asset/c40b14b4-1eeb-4f53-840d-0b7d2bc68ff3";
const imgLine25 = "https://www.figma.com/api/mcp/asset/fa0dcf4b-8e0e-44c3-ba81-95559dc153ac";
const imgLine26 = "https://www.figma.com/api/mcp/asset/fea37081-f4bb-4633-9e27-b6df88af3120";
const imgShoppingCartSimple = "https://www.figma.com/api/mcp/asset/5390c4da-ea50-4245-a3be-cbe32d6afdc6";

// Product Images
const imgHeadphones = "https://www.figma.com/api/mcp/asset/d21476fb-b45c-4ced-901d-0fd2694a38ab";
const imgTV = "https://www.figma.com/api/mcp/asset/901c345a-eff2-4acb-8a8a-b0ba204195fd";

export default function ShoppingCart() {
  const [quantities, setQuantities] = useState({
    1: 3,
    2: 3,
    3: 3,
    4: 1
  });

  const updateQuantity = (id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, prev[id] + change)
    }));
  };

  const cartItems = [
    {
      id: 1,
      name: "Wired Over-Ear Gaming Headphones with USB",
      price: 250,
      image: imgHeadphones,
      quantity: quantities[1]
    },
    {
      id: 2,
      name: "Wired Over-Ear Gaming Headphones with USB",
      price: 250,
      image: imgHeadphones,
      quantity: quantities[2]
    },
    {
      id: 3,
      name: "Wired Over-Ear Gaming Headphones with USB",
      price: 250,
      image: imgHeadphones,
      quantity: quantities[3]
    },
    {
      id: 4,
      name: "4K UHD LED Smart TV with Chromecast Built-in",
      originalPrice: 99,
      price: 70,
      image: imgTV,
      quantity: quantities[4]
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free
  const discount = 24;
  const tax = 61.99;
  const total = subtotal - discount + tax;

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      <div className="flex flex-col gap-[32px] sm:gap-[36px] md:gap-[40px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[32px] lg:px-[60px] xl:px-[100px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-name="Breadcrumb" data-node-id="35:4873">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#5f6c72] dark:text-white text-[14px] hover:text-[#eea137] transition-colors cursor-pointer" data-node-id="35:4874">
            Home
          </Link>
          <div className="flex items-center justify-center relative size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]" data-name="arrow-down" data-node-id="35:4875">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
          <p className="font-['Poppins'] font-medium leading-[20px] text-[#eea137] text-[14px]" data-node-id="35:4884">
            Shopping Cart
          </p>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col lg:flex-row gap-[20px] md:gap-[24px] lg:gap-[28px] xl:gap-[32px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-node-id="35:4889">
          {/* Shopping Cart Section */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] border-solid flex flex-col items-start relative rounded-[12px] shrink-0 flex-1 w-full lg:flex-[2] lg:min-w-0 transition-colors duration-300" data-name="Shopping Cart" data-node-id="35:4890">
            {/* Section Title */}
            <div className="flex items-start px-[16px] sm:px-[20px] md:px-[22px] lg:px-[24px] py-[14px] sm:py-[16px] md:py-[18px] lg:py-[20px] relative shrink-0 w-full border-b border-[#e4e7e9] dark:border-[#334155]" data-name="Heading" data-node-id="35:4891">
              <p className="font-['Poppins'] font-medium leading-[24px] text-[16px] sm:text-[17px] md:text-[18px] text-black dark:text-white" data-node-id="35:4892">
                Shopping Cart
              </p>
            </div>

            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:flex bg-[#f2f4f5] dark:bg-[#0f172a] border-b border-[#e4e7e9] dark:border-[#334155] border-solid font-['Poppins'] font-normal gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[20px] xl:gap-[24px] items-center leading-[24px] px-[16px] sm:px-[20px] md:px-[22px] lg:px-[24px] py-[10px] relative shrink-0 w-full transition-colors duration-300" data-name="Sub-Heading" data-node-id="35:4893">
              <p className="relative shrink-0 flex-1 min-w-[180px] md:min-w-[200px] lg:min-w-[220px] text-black dark:text-white text-[13px] sm:text-[14px]" data-node-id="35:4894">
                Products
              </p>
              <p className="relative shrink-0 w-[80px] md:w-[88px] lg:w-[90px] text-center text-black dark:text-white text-[13px] sm:text-[14px]" data-node-id="35:4895">
                Price
              </p>
              <p className="relative shrink-0 w-[130px] md:w-[148px] lg:w-[160px] xl:w-[172px] text-center text-black dark:text-white text-[13px] sm:text-[14px]" data-node-id="35:4896">
                Quantity
              </p>
              <p className="relative shrink-0 w-[90px] md:w-[100px] lg:w-[105px] xl:w-[112px] text-center text-black dark:text-white text-[13px] sm:text-[14px]" data-node-id="35:4897">
                Sub-Total
              </p>
              <p className="relative shrink-0 w-[20px]"></p>
            </div>

            {/* Products List */}
            <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[18px] lg:gap-[20px] items-start p-[12px] sm:p-[14px] md:p-[18px] lg:p-[20px] xl:p-[24px] relative shrink-0 w-full" data-name="Products" data-node-id="35:4898">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-[12px] md:gap-[16px] lg:gap-[20px] xl:gap-[24px] items-start md:items-center justify-between relative shrink-0 w-full border-b border-[#e4e7e9] dark:border-[#334155] pb-[14px] md:pb-[16px] last:border-b-0 last:pb-0 transition-colors duration-300" data-name="Product" data-node-id={`35:${4899 + item.id}`}>
                  {/* Product Info */}
                  <div className="flex gap-[10px] sm:gap-[12px] items-center relative shrink-0 flex-1 w-full md:min-w-[180px] lg:min-w-[200px]" data-name="Product" data-node-id={`35:${4900 + item.id}`}>
                    <div className="relative rounded-[2px] shrink-0 size-[60px] sm:size-[72px]" data-name="Image" data-node-id={`35:${4901 + item.id}`}>
                      <img 
                        alt={item.name} 
                        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[2px] size-full" 
                        src={item.image}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                      <p className="font-['Public_Sans'] font-normal leading-[20px] text-[13px] sm:text-[14px] text-black dark:text-white line-clamp-2" data-node-id={`35:${4902 + item.id}`}>
                        {item.name}
                      </p>
                      {/* Mobile Price Display */}
                      <div className="md:hidden font-['Public_Sans'] font-normal leading-[20px] text-[14px]" data-node-id={`35:${4903 + item.id}-mobile`}>
                        {item.originalPrice ? (
                          <>
                            <span className="line-through text-[#929fa5] dark:text-[#9ca3af] mr-[8px]">
                              ${item.originalPrice}
                            </span>
                            <span className="text-[#475156] dark:text-white font-medium">
                              ${item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-[#475156] dark:text-white font-medium">
                            ${item.price}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Remove Button - Mobile */}
                    <button 
                      className="md:hidden overflow-clip relative shrink-0 size-[20px] cursor-pointer hover:opacity-70 transition-opacity text-black dark:text-white" 
                      data-name="Remove" 
                      data-node-id={`35:${4910 + item.id}-mobile`}
                      aria-label="Remove item"
                    >
                      <div className="absolute inset-[3.91%_10.94%]">
                        <div className="absolute inset-[-4.24%_-5%]">
                          <img 
                            alt="Remove" 
                            className="block max-w-none size-full dark:hidden" 
                            src={imgRemove}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
                            }}
                          />
                          <svg className="hidden dark:block w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Desktop Layout - Price, Quantity, Sub-Total, Remove */}
                  <div className="hidden md:flex gap-[12px] md:gap-[16px] lg:gap-[20px] xl:gap-[24px] items-center justify-end w-full md:w-auto">
                    {/* Price - Desktop */}
                    <div className="font-['Public_Sans'] font-normal h-[20px] leading-[20px] relative shrink-0 text-[13px] md:text-[14px] w-[80px] md:w-[88px] lg:w-[90px] text-center" data-node-id={`35:${4903 + item.id}`}>
                      {item.originalPrice ? (
                        <>
                          <span className="line-through text-[#929fa5] dark:text-[#9ca3af] mr-[8px]">
                            ${item.originalPrice}
                          </span>
                          <span className="text-[#475156] dark:text-white">
                            ${item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#475156] dark:text-white">
                          ${item.price}
                        </span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col items-start pl-0 pr-[12px] md:pr-[16px] lg:pr-[20px] xl:pr-[24px] py-0 relative shrink-0" data-name="Quantity" data-node-id={`35:${4904 + item.id}`}>
                      <div className="bg-white dark:bg-[#0f172a] border border-[#e4e7e9] dark:border-[#334155] border-solid flex items-center justify-between px-[10px] sm:px-[12px] md:px-[14px] lg:px-[16px] xl:px-[20px] py-[8px] sm:py-[10px] md:py-[12px] relative rounded-[3px] shrink-0 w-[110px] sm:w-[120px] md:w-[130px] lg:w-[140px] xl:w-[148px] transition-colors duration-300" data-name="Button" data-node-id={`35:${4905 + item.id}`}>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="relative shrink-0 size-[16px] sm:size-[18px] cursor-pointer hover:opacity-70 transition-opacity touch-manipulation text-black dark:text-white"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <p className="font-['Public_Sans'] font-normal leading-[24px] text-[14px] sm:text-[16px] text-[#475156] dark:text-white" data-node-id={`35:${4907 + item.id}`}>
                          {String(item.quantity).padStart(2, '0')}
                        </p>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="relative shrink-0 size-[16px] sm:size-[18px] cursor-pointer hover:opacity-70 transition-opacity touch-manipulation text-black dark:text-white"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Sub-Total */}
                    <p className="font-['Public_Sans'] font-medium leading-[20px] text-[13px] md:text-[14px] text-black dark:text-white w-[90px] md:w-[100px] lg:w-[105px] xl:w-[112px] text-center" data-node-id={`35:${4909 + item.id}`}>
                      ${item.price * item.quantity}
                    </p>

                    {/* Remove Button - Desktop */}
                    <button 
                      className="overflow-clip relative shrink-0 size-[20px] cursor-pointer hover:opacity-70 transition-opacity touch-manipulation text-black dark:text-white" 
                      data-name="Remove" 
                      data-node-id={`35:${4910 + item.id}`}
                      aria-label="Remove item"
                    >
                      <div className="absolute inset-[3.91%_10.94%]">
                        <div className="absolute inset-[-4.24%_-5%]">
                          <img 
                            alt="Remove" 
                            className="block max-w-none size-full dark:hidden" 
                            src={imgRemove}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
                            }}
                          />
                          <svg className="hidden dark:block w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Mobile Layout - Quantity and Sub-Total */}
                  <div className="md:hidden flex items-center justify-between w-full gap-[12px]">
                    <div className="flex items-center gap-[12px]">
                      <span className="font-['Poppins'] font-normal text-[12px] text-[#666] dark:text-white">Quantity:</span>
                      <div className="bg-white dark:bg-[#0f172a] border border-[#e4e7e9] dark:border-[#334155] border-solid flex items-center justify-between px-[12px] py-[10px] relative rounded-[3px] shrink-0 w-[100px] transition-colors duration-300" data-name="Button" data-node-id={`35:${4905 + item.id}-mobile`}>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-70 transition-opacity touch-manipulation text-black dark:text-white"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <p className="font-['Public_Sans'] font-normal leading-[24px] text-[14px] text-[#475156] dark:text-white">
                          {String(item.quantity).padStart(2, '0')}
                        </p>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="relative shrink-0 size-[16px] cursor-pointer hover:opacity-70 transition-opacity touch-manipulation text-black dark:text-white"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-['Poppins'] font-normal text-[12px] text-[#666] dark:text-white">Sub-Total:</span>
                      <p className="font-['Public_Sans'] font-medium leading-[20px] text-[14px] text-black dark:text-white">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-[1px] relative shrink-0 w-full border-t border-[#e4e7e9] dark:border-[#334155] transition-colors duration-300" data-node-id="35:4996">
              <img alt="" className="block max-w-none size-full opacity-0" src={imgLine25} onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>

          {/* Cart Totals Section */}
          <div className="flex flex-col items-start relative shrink-0 w-full lg:w-[380px] xl:w-[400px] lg:sticky lg:top-[100px] lg:self-start" data-node-id="35:4997">
            <div className="bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] border-solid flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] items-center justify-center p-[16px] sm:p-[18px] md:p-[20px] lg:p-[22px] xl:p-[24px] relative rounded-[12px] shrink-0 w-full transition-colors duration-300" data-name="Cart Totals" data-node-id="35:4998">
              <p className="font-['Poppins'] font-medium leading-[24px] text-[16px] sm:text-[18px] text-black dark:text-white w-full" data-node-id="35:4999">
                Cart Totals
              </p>
              
              <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] items-start relative shrink-0 w-full" data-node-id="35:5000">
                <div className="flex flex-col gap-[12px] sm:gap-[16px] items-start relative shrink-0 w-full" data-name="Total" data-node-id="35:5001">
                  <div className="flex flex-col gap-[10px] sm:gap-[12px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full" data-name="Content" data-node-id="35:5002">
                    <div className="flex items-center justify-between leading-[20px] text-[13px] sm:text-[14px] w-full" data-node-id="35:5003">
                      <p className="font-['Poppins'] font-normal text-[#5f6c72] dark:text-white" data-node-id="35:5004">
                        Sub-total
                      </p>
                      <p className="font-['Poppins'] font-medium text-black dark:text-white" data-node-id="35:5005">
                        ${subtotal}
                      </p>
                    </div>
                    <div className="flex items-center justify-between leading-[20px] text-[13px] sm:text-[14px] w-full" data-node-id="35:5006">
                      <p className="font-['Poppins'] font-normal text-[#5f6c72] dark:text-white" data-node-id="35:5007">
                        Shipping
                      </p>
                      <p className="font-['Poppins'] font-medium text-black dark:text-white" data-node-id="35:5008">
                        Free
                      </p>
                    </div>
                    <div className="flex items-center justify-between leading-[20px] text-[13px] sm:text-[14px] w-full" data-node-id="35:5009">
                      <p className="font-['Poppins'] font-normal text-[#5f6c72] dark:text-white" data-node-id="35:5010">
                        Discount
                      </p>
                      <p className="font-['Poppins'] font-medium text-black dark:text-white" data-node-id="35:5011">
                        ${discount}
                      </p>
                    </div>
                    <div className="flex items-center justify-between leading-[20px] text-[13px] sm:text-[14px] w-full" data-node-id="35:5012">
                      <p className="font-['Poppins'] font-normal text-[#5f6c72] dark:text-white" data-node-id="35:5013">
                        Tax
                      </p>
                      <p className="font-['Poppins'] font-medium text-black dark:text-white" data-node-id="35:5014">
                        ${tax}
                      </p>
                    </div>
                  </div>

                  {/* Dashed Line Separator */}
                  <div className="h-[1px] relative shrink-0 w-full border-t border-dashed border-[#e4e7e9] dark:border-[#334155]" data-node-id="35:5015">
                    <img alt="" className="block max-w-none size-full opacity-0" src={imgLine26} onError={(e) => e.target.style.display = 'none'} />
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between leading-[22px] sm:leading-[24px] text-[15px] sm:text-[16px] text-black dark:text-white w-full" data-node-id="35:5016">
                    <p className="font-['Poppins'] font-normal" data-node-id="35:5017">
                      Total
                    </p>
                    <p className="font-['Poppins'] font-semibold" data-node-id="35:5018">
                      ${total.toFixed(2)} USD
                    </p>
                  </div>
                </div>

                {/* Shop Now Button */}
                <Link 
                  to="/checkout" 
                  className="bg-[#0e1c47] cursor-pointer flex gap-[8px] sm:gap-[11.273px] h-[44px] sm:h-[45.091px] items-center justify-center px-[16px] sm:px-[20px] md:px-[22.545px] py-0 relative rounded-[4px] shrink-0 w-full hover:bg-[#1a2f5c] transition-colors touch-manipulation" 
                  data-name="Button" 
                  data-node-id="35:5019"
                >
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] text-[14px] sm:text-[15px] md:text-[16px] text-white tracking-[0.192px]" data-node-id="35:5020">
                    Shop Now
                  </p>
                  <div className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22.545px]" data-name="ShoppingCartSimple" data-node-id="35:5021">
                    <img 
                      alt="" 
                      className="block max-w-none size-full" 
                      src={imgShoppingCartSimple}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
