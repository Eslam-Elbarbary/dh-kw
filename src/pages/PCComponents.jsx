// PC Components page component - exact Figma implementation
// Based on Figma design - PC Components Page

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Icon Assets (from existing components)
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgRegularCaretDown = "https://www.figma.com/api/mcp/asset/8b4bcb1e-3b4f-4071-91ff-2859363e4007";
const imgFilterHorizontalElements = "https://www.figma.com/api/mcp/asset/510df043-ce21-421e-81a0-6d7261d2351b";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/c993c6e9-76bd-4fc1-8f76-8c9f70ebc1a0";

// PC Component Assets
const imgMotherboard = "https://www.figma.com/api/mcp/asset/ce0bdc1e-3f9b-471b-aad7-a36b113a7c3a"; // From Home.tsx
const imgPlusIcon = "https://www.figma.com/api/mcp/asset/plus-icon"; // TODO: Get actual Figma asset ID

// Product Image Assets (reusing from SearchResults)
const imgProduct1 = "https://www.figma.com/api/mcp/asset/31331607-e3da-4091-a87f-d673768d08a0";
const imgProduct2 = "https://www.figma.com/api/mcp/asset/397ef9d6-e230-46dc-a591-71cc82d81a35";
const imgProduct3 = "https://www.figma.com/api/mcp/asset/57cdecfc-ac27-4553-af8c-666330f3a295";
const imgProduct4 = "https://www.figma.com/api/mcp/asset/6e338bde-c416-445f-9838-e842db794196";
const imgProduct5 = "https://www.figma.com/api/mcp/asset/2285c162-bbe8-4bdc-9913-5a9447d89870";

export default function PCComponents() {
  const [showFilter, setShowFilter] = useState(false);

  // Sample products data
  const products = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: "Bose Sport Earbuds Wireless Earphones",
    brand: "Brand Name",
    price: "$2,300",
    image: [imgProduct1, imgProduct2, imgProduct3, imgProduct4, imgProduct5][i % 5],
    badges: i % 5 === 0 ? ['Only 10 Left'] : i % 5 === 1 ? ['32% OFF', 'Only 10 Left'] : i % 5 === 2 ? ['HOT'] : []
  }));

  return (
    <div className="bg-white relative w-full min-h-screen">
      {/* Breadcrumbs and Search Controls */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[16px] sm:py-[20px] md:py-[24px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex gap-[8px] items-center mb-[16px] sm:mb-[20px]">
            <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors">
              Home
            </Link>
            <div className="flex items-center justify-center size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[18px]">
                  <img alt="" className="block w-full h-full" src={imgArrowDown} />
                </div>
              </div>
            </div>
            <span className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]">
              PC Components
            </span>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[12px] sm:gap-[16px] md:gap-[20px]">
            {/* Search Products */}
            <div className="flex-1 w-full sm:max-w-[400px] md:max-w-[500px] relative">
              <input
                type="text"
                placeholder="Search Products"
                className="w-full border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] text-[14px] focus:outline-none focus:border-[#0e1c47] pr-[40px]"
              />
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 size-[20px]">
                <svg className="w-full h-full text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex gap-[12px] sm:gap-[16px] items-center">
              <p className="font-['Poppins'] font-normal leading-[20px] text-[#191c1f] text-[14px] whitespace-nowrap">
                Sort by:
              </p>
              <div className="bg-white border border-[#e4e7e9] border-solid h-[40px] overflow-hidden relative rounded-[2px] shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
                <p className="absolute font-['Poppins'] font-normal leading-[20px] left-[15px] not-italic text-[#666] text-[14px] top-1/2 -translate-y-1/2">
                  Most Popular
                </p>
                <div className="absolute right-[15px] size-[16px] top-1/2 -translate-y-1/2">
                  <img alt="" className="block max-w-none size-full" src={imgRegularCaretDown} />
                </div>
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex gap-[8px] items-center p-0 relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <div className="absolute inset-[16.67%_12.5%]">
                  <div className="absolute inset-[-4.69%_-4.17%]">
                    <img alt="" className="block max-w-none size-full" src={imgFilterHorizontalElements} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[14px] sm:text-[16px] text-left whitespace-nowrap">
                <p className="leading-[18px]">Filter</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* PC Components Assembly Section */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="bg-[#f5f5f5] rounded-[8px] p-[20px] sm:p-[24px] md:p-[32px] lg:p-[40px]">
            <h2 className="font-['Poppins'] font-semibold text-[#191c1f] text-[20px] sm:text-[24px] md:text-[28px] mb-[20px] sm:mb-[24px] md:mb-[32px]">
              PC Components
            </h2>
            
            {/* Assembly Display */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-[20px] sm:gap-[24px] md:gap-[32px]">
              {/* Component Images with Plus Signs */}
              <div className="flex flex-wrap items-center justify-center gap-[8px] sm:gap-[12px] md:gap-[16px] lg:gap-[20px] flex-1 w-full">
                {[1, 2, 3, 4].map((item, idx) => (
                  <React.Fragment key={item}>
                    <div className="bg-white rounded-[8px] p-[8px] sm:p-[12px] md:p-[16px] border border-[#e4e7e9] w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] xl:w-[180px] aspect-square flex items-center justify-center">
                      <img 
                        src={imgMotherboard} 
                        alt={`Component ${item}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200&h=200&fit=crop";
                        }}
                      />
                    </div>
                    {idx < 3 && (
                      <div className="flex items-center justify-center size-[20px] sm:size-[24px] md:size-[28px] lg:size-[32px] flex-shrink-0">
                        <div className="bg-[#0e1c47] rounded-full size-full flex items-center justify-center">
                          <span className="text-white font-['Poppins'] font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-none">+</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-[10px] sm:gap-[12px] w-full sm:w-auto lg:w-[200px] lg:flex-shrink-0">
                <button className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] md:px-[32px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[13px] sm:text-[14px] md:text-[16px] whitespace-nowrap w-full sm:w-auto">
                  BUY & ASSEMBLE
                </button>
                <button className="bg-white border-2 border-[#0e1c47] text-[#0e1c47] font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] md:px-[32px] rounded-[4px] hover:bg-[#f0f0f0] transition-colors text-[13px] sm:text-[14px] md:text-[16px] whitespace-nowrap w-full sm:w-auto">
                  BUY PARTS ONLY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] pb-[40px] sm:pb-[60px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Product Grid - 5 columns on large screens */}
          <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] w-full">
            {[0, 5, 10, 15, 20].map((rowStart) => (
              <div 
                key={rowStart} 
                className="flex flex-wrap gap-[12px] sm:gap-[16px] md:gap-[20px] items-start justify-start w-full"
              >
                {products.slice(rowStart, rowStart + 5).map((product, idx) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-white border-[#e4e7e9] border-[0.849px] border-solid flex flex-col gap-[6.789px] items-start overflow-hidden p-[10px] sm:p-[12px] md:p-[13.578px] rounded-[3.394px] w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-13.333px)] lg:w-[calc((100%-80px)/5)] hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="h-[120px] sm:h-[140px] md:h-[159.537px] relative w-full">
                      <img 
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                        src={product.image} 
                      />
                      
                      {/* Badges */}
                      {product.badges.length > 0 && (
                        <div className="absolute flex flex-col gap-[6.789px] items-start left-[13.15px] top-[13.15px]">
                          {product.badges.map((badge, badgeIdx) => (
                            <div
                              key={badgeIdx}
                              className={`flex items-start px-[8.486px] py-[4.243px] rounded-[3.394px] ${
                                badge === '32% OFF' ? 'bg-[#fc0]' :
                                badge === 'Only 10 Left' ? 'bg-[#ff9500]' :
                                badge === 'HOT' ? 'bg-[#ee5858] rounded-[1.856px]' : ''
                              }`}
                            >
                              <p className={`font-['Poppins'] font-semibold leading-[13.578px] text-[10.183px] ${
                                badge === '32% OFF' ? 'text-[#191c1f]' : 'text-white'
                              }`}>
                                {badge}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-[6.789px] items-start w-full">
                      <p className="font-['Poppins'] font-semibold leading-[16.972px] text-[#191c1f] text-[12px] w-full line-clamp-2">
                        {product.name}
                      </p>
                      <p className="capitalize font-['Poppins'] font-medium leading-[18.563px] text-[#999] text-[12px]">
                        {product.brand}
                      </p>
                      <p className="font-['Poppins'] font-semibold leading-[16.972px] text-[#0e1c47] text-[12px]">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex gap-[8px] items-center justify-center mt-[40px] sm:mt-[60px]">
            <div className="flex items-center justify-center size-[15.03px]">
              <div className="flex-none rotate-[270deg] scale-y-[-100%]">
                <div className="relative size-[15.03px]">
                  <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                </div>
              </div>
            </div>
            <div className="flex gap-[8px] items-center">
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <div 
                  key={page}
                  className={`flex items-center justify-center px-0 py-[10px] rounded-[12px] ${page === 1 ? 'bg-[#0e1c47]' : 'bg-white'}`}
                >
                  <p className={`font-['Public_Sans'] ${page === 1 ? 'font-semibold' : 'font-normal'} leading-[20px] text-[14px] text-center ${page === 1 ? 'text-white' : 'text-[#191c1f]'} w-[40px]`}>
                    {String(page).padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center size-[15.03px]">
                <div className="flex-none rotate-[270deg]">
                  <div className="relative size-[15.03px]">
                    <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

