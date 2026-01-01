// Favorites page component - exact Figma implementation
// Based on Figma design - Favorites/Wishlist Page

import React from 'react';
import { Link } from 'react-router-dom';

// Icon Assets (from existing components)
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgHeart = "https://www.figma.com/api/mcp/asset/60067eaf-84de-435a-a60c-844b13c64552";
const imgHeart3 = "https://www.figma.com/api/mcp/asset/64f5390e-b1f9-4bf7-9e61-c58eef611246";
const imgShoppingCart = "https://www.figma.com/api/mcp/asset/281e5eef-36c1-49be-8714-dd8f301bf649";
const imgRegularCaretDown = "https://www.figma.com/api/mcp/asset/8b4bcb1e-3b4f-4071-91ff-2859363e4007";

// Product Image Assets (reusing from SearchResults)
const imgProduct1 = "https://www.figma.com/api/mcp/asset/31331607-e3da-4091-a87f-d673768d08a0";
const imgProduct2 = "https://www.figma.com/api/mcp/asset/397ef9d6-e230-46dc-a591-71cc82d81a35";
const imgProduct3 = "https://www.figma.com/api/mcp/asset/57cdecfc-ac27-4553-af8c-666330f3a295";
const imgProduct4 = "https://www.figma.com/api/mcp/asset/6e338bde-c416-445f-9838-e842db794196";
const imgProduct5 = "https://www.figma.com/api/mcp/asset/2285c162-bbe8-4bdc-9913-5a9447d89870";
const imgProductImage = "https://www.figma.com/api/mcp/asset/d7b25b9a-4cb5-4616-a033-525d62ea4734";

export default function Favorites() {
  // Sample favorite products data
  const favoriteProducts = [
    {
      id: 1,
      name: "4K UHD LED Smart TV with Chromecast Built-in",
      brand: "Brand Name",
      originalPrice: "$1,50",
      salePrice: "$865",
      image: imgProductImage,
      badges: ['32% OFF', 'Only 10 Left']
    },
    {
      id: 2,
      name: "Bose Sport Earbuds Wireless Earphones",
      brand: "Brand Name",
      originalPrice: "$2,500",
      salePrice: "$2,300",
      image: imgProduct1,
      badges: ['32% OFF']
    },
    {
      id: 3,
      name: "Sony WH-1000XM4 Wireless Headphones",
      brand: "Brand Name",
      originalPrice: "$1,200",
      salePrice: "$999",
      image: imgProduct2,
      badges: []
    },
    {
      id: 4,
      name: "Apple AirPods Pro with MagSafe Case",
      brand: "Brand Name",
      originalPrice: "$899",
      salePrice: "$799",
      image: imgProduct3,
      badges: ['HOT']
    },
    {
      id: 5,
      name: "Samsung Galaxy Watch 4 Classic",
      brand: "Brand Name",
      originalPrice: "$1,100",
      salePrice: "$950",
      image: imgProduct4,
      badges: ['Only 10 Left']
    },
    {
      id: 6,
      name: "Canon EOS R5 Mirrorless Camera",
      brand: "Brand Name",
      originalPrice: "$3,500",
      salePrice: "$3,200",
      image: imgProduct5,
      badges: ['32% OFF', 'Only 10 Left']
    },
    {
      id: 7,
      name: "LG OLED 55-inch 4K Smart TV",
      brand: "Brand Name",
      originalPrice: "$1,800",
      salePrice: "$1,650",
      image: imgProductImage,
      badges: []
    },
    {
      id: 8,
      name: "JBL Flip 6 Portable Bluetooth Speaker",
      brand: "Brand Name",
      originalPrice: "$299",
      salePrice: "$249",
      image: imgProduct1,
      badges: ['HOT']
    }
  ];

  return (
    <div className="bg-white relative w-full min-h-screen">
      {/* Breadcrumbs and Header */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Breadcrumb - Exact Figma */}
          <div className="flex gap-[8px] items-center mb-[20px] sm:mb-[24px] md:mb-[32px]" data-node-id="35:2531">
            <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors" data-node-id="35:2532">
              Home
            </Link>
            <div className="flex items-center justify-center relative size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[18px]" data-name="arrow-down" data-node-id="35:2533">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                </div>
              </div>
            </div>
            <span className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]" data-node-id="35:2534">
              Favorites
            </span>
          </div>

          {/* Page Title */}
          <div className="mb-[24px] sm:mb-[32px] md:mb-[40px]">
            <h1 className="font-['Poppins'] font-semibold text-[#191c1f] text-[24px] sm:text-[28px] md:text-[32px]">
              My Favorites
            </h1>
            <p className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px] mt-[8px]">
              {favoriteProducts.length} items in your favorites list
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] pb-[40px] sm:pb-[60px] md:pb-[80px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex flex-wrap gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px]">
            {favoriteProducts.map((product, idx) => (
              <div
                key={product.id}
                className="bg-white border-[#e4e7e9] border-[0.849px] border-solid flex flex-col gap-[6.789px] items-start overflow-hidden p-[13.578px] rounded-[3.394px] w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-13.333px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] hover:shadow-lg transition-shadow cursor-pointer group"
                data-name="Product"
              >
                {/* Product Image Container */}
                <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] bg-[#f5f5f5] rounded-[4px] overflow-hidden mb-[8px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                    }}
                  />
                  
                  {/* Badges */}
                  {product.badges.length > 0 && (
                    <div className="absolute top-[8px] left-[8px] flex flex-col gap-[4px] items-start">
                      {product.badges.map((badge, badgeIdx) => (
                        <span
                          key={badgeIdx}
                          className={`font-['Poppins'] font-semibold text-[10px] sm:text-[11px] px-[6px] sm:px-[8px] py-[2px] sm:py-[4px] rounded-[2px] ${
                            badge === 'HOT'
                              ? 'bg-[#ff4444] text-white'
                              : badge === '32% OFF'
                              ? 'bg-[#eea137] text-white'
                              : 'bg-[#0e1c47] text-white'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-[8px] right-[8px] flex flex-col gap-[8px] items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="bg-white rounded-full p-[6px] sm:p-[8px] hover:bg-[#f0f0f0] transition-colors shadow-md"
                      aria-label="Remove from favorites"
                    >
                      <div className="relative size-[16px] sm:size-[18px]">
                        <img
                          src={imgHeart3}
                          alt="Remove from favorites"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display = 'block';
                            }
                          }}
                        />
                      </div>
                    </button>
                    <Link
                      to="/shopping-cart"
                      className="bg-white rounded-full p-[6px] sm:p-[8px] hover:bg-[#f0f0f0] transition-colors shadow-md"
                      aria-label="Add to cart"
                    >
                      <div className="relative size-[16px] sm:size-[18px]">
                        <img
                          src={imgShoppingCart}
                          alt="Add to cart"
                          className="w-full h-full object-contain"
                          style={{ filter: 'brightness(0) saturate(100%)' }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-[4px] sm:gap-[6px] w-full">
                  <p className="font-['Poppins'] font-normal text-[#666] text-[11px] sm:text-[12px] line-clamp-1">
                    {product.brand}
                  </p>
                  <Link
                    to={`/product/${product.id}`}
                    className="font-['Poppins'] font-medium text-[#191c1f] text-[13px] sm:text-[14px] md:text-[15px] line-clamp-2 min-h-[36px] sm:min-h-[40px] hover:text-[#eea137] transition-colors"
                  >
                    {product.name}
                  </Link>
                  
                  {/* Price */}
                  <div className="flex gap-[6px] sm:gap-[8px] items-center flex-wrap mt-[4px]">
                    {product.originalPrice && (
                      <span className="font-['Poppins'] font-normal text-[#999] text-[12px] sm:text-[13px] line-through">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="font-['Poppins'] font-semibold text-[#10b981] text-[14px] sm:text-[15px] md:text-[16px]">
                      {product.salePrice}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Link
                  to={`/product/${product.id}`}
                  className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[8px] sm:py-[10px] px-[12px] sm:px-[16px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[12px] sm:text-[13px] md:text-[14px] w-full text-center mt-auto"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Empty State (if no favorites) */}
          {favoriteProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-[60px] sm:py-[80px] md:py-[100px]">
              <div className="relative size-[120px] sm:size-[150px] mb-[24px] sm:mb-[32px]">
                <img
                  src={imgHeart}
                  alt="Empty favorites"
                  className="w-full h-full object-contain opacity-30"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h2 className="font-['Poppins'] font-semibold text-[#191c1f] text-[20px] sm:text-[24px] md:text-[28px] mb-[12px] sm:mb-[16px]">
                Your favorites list is empty
              </h2>
              <p className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px] mb-[24px] sm:mb-[32px] text-center max-w-[400px]">
                Start adding products to your favorites by clicking the heart icon on any product
              </p>
              <Link
                to="/"
                className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[24px] sm:px-[32px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[14px] sm:text-[16px]"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

