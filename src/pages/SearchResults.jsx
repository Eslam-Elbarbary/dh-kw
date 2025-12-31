// Search Results page component - exact Figma implementation
// Based on node 35:2469 and 35:3733

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Assets
const img7 = "https://www.figma.com/api/mcp/asset/34568305-034a-4f6d-ac70-442fd842a13b";
const imgProduct = "https://www.figma.com/api/mcp/asset/0e1f27bc-f780-47c8-a09e-32dbd0fb7fbb";
const imgFromElements = "https://www.figma.com/api/mcp/asset/d1f6be64-ccf2-4015-bc21-eb1bcb103c0c";
const imgLine13 = "https://www.figma.com/api/mcp/asset/19db4521-24eb-4863-a634-2bc7b613c4a8";
const imgPriceRange = "https://www.figma.com/api/mcp/asset/b4155f58-726d-4ba3-9539-21eb9e5d53c5";
const imgDuotoneCheck = "https://www.figma.com/api/mcp/asset/b38a6c8f-cd7a-4762-b1ca-6b38c922202e";
const imgCheck = "https://www.figma.com/api/mcp/asset/a210e631-7f0f-4511-bc1d-184cccd7a1fc";
const imgFilterHorizontal = "https://www.figma.com/api/mcp/asset/69fd3785-75a0-4e97-b176-040bfbf2f27c";
const imgGrid = "https://www.figma.com/api/mcp/asset/d72436df-62de-4301-9262-34ead329d65a";
const imgList = "https://www.figma.com/api/mcp/asset/d72436df-62de-4301-9262-34ead329d65a";
const imgArrowLeft = "https://www.figma.com/api/mcp/asset/c993c6e9-76bd-4fc1-8f76-8c9f70ebc1a0";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/c993c6e9-76bd-4fc1-8f76-8c9f70ebc1a0";

export default function SearchResults() {
  const [showFilter, setShowFilter] = useState(false); // false = hidden on mobile, visible on desktop
  const [selectedCategory, setSelectedCategory] = useState('Electronics Devices');
  const [selectedPriceRange, setSelectedPriceRange] = useState('$300 to $500');
  const [selectedBrands, setSelectedBrands] = useState(['Apple', 'Google', 'Microsoft', 'HP', 'Panasonic', 'LG']);
  const [selectedTags, setSelectedTags] = useState(['Graphics Card']);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Sample products data
  const products = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: "4K UHD LED Smart TV with Chromecast Built-in",
    brand: "brand name",
    price: "$865",
    originalPrice: "$1,50",
    badges: i % 3 === 1 ? ['32% OFF', 'Only 10 Left'] : i % 3 === 2 ? ['HOT'] : []
  }));

  return (
    <div className="bg-white relative w-full min-h-screen">
      {/* Breadcrumbs and Sort Controls */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex gap-[8px] items-center mb-[20px] sm:mb-[24px] md:mb-[32px]">
            <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors">
              Home
            </Link>
            <div className="flex items-center justify-center size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[18px]">
                  <img alt="" className="block max-w-none size-full" src={img7} />
                </div>
              </div>
            </div>
            <span className="font-['Poppins'] font-medium leading-[20px] text-[#eea137] text-[14px]">
              search Results
            </span>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] sm:gap-[20px]">
            {/* Show Items */}
            <div className="flex gap-[8px] items-center">
              <span className="font-['Poppins'] font-normal text-[#191c1f] text-[14px] sm:text-[16px]">Show:</span>
              <button className="font-['Poppins'] font-medium text-[#0e1c47] text-[14px] sm:text-[16px] px-[8px] py-[4px] bg-[#f0f0f0] rounded-[4px]">15</button>
              <span className="font-['Poppins'] font-normal text-[#191c1f] text-[14px] sm:text-[16px]">/</span>
              <button className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px] px-[8px] py-[4px] hover:text-[#0e1c47] transition-colors">20</button>
              <span className="font-['Poppins'] font-normal text-[#191c1f] text-[14px] sm:text-[16px]">/</span>
              <button className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px] px-[8px] py-[4px] hover:text-[#0e1c47] transition-colors">30</button>
            </div>

            {/* Grid/List View and Sort */}
            <div className="flex gap-[16px] sm:gap-[20px] items-center">
              {/* Grid/List View Icons */}
              <div className="hidden sm:flex gap-[8px] items-center">
                <button className="p-[8px] hover:bg-[#f0f0f0] rounded-[4px] transition-colors">
                  <div className="size-[20px]">
                    <img alt="Grid view" className="block max-w-none size-full" src={imgGrid} />
                  </div>
                </button>
                <button className="p-[8px] hover:bg-[#f0f0f0] rounded-[4px] transition-colors">
                  <div className="size-[20px]">
                    <img alt="List view" className="block max-w-none size-full" src={imgList} />
                  </div>
                </button>
              </div>

              {/* Sort By */}
              <div className="flex gap-[8px] items-center">
                <span className="font-['Poppins'] font-normal text-[#191c1f] text-[14px] sm:text-[16px]">Sort by:</span>
                <select className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] py-[8px] font-['Poppins'] font-normal text-[#191c1f] text-[14px] sm:text-[16px] bg-white cursor-pointer outline-none focus:border-[#0e1c47]">
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex gap-[8px] items-center px-[12px] py-[8px] border border-[#e4e7e9] border-solid rounded-[4px] hover:bg-[#f0f0f0] transition-colors"
              >
                <div className="size-[20px] sm:size-[24px]">
                  <img alt="Filter" className="block max-w-none size-full" src={imgFilterHorizontal} />
                </div>
                <span className="font-['Poppins'] font-medium text-[#191c1f] text-[14px] sm:text-[16px]">Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Products Grid and Filter Sidebar */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] pb-[40px] sm:pb-[60px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex gap-[24px] lg:gap-[32px] relative">
            {/* Products Grid */}
            <div className="flex-1 lg:max-w-[calc(100%-345px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] sm:gap-[20px] lg:gap-[24px]">
                {products.map((product) => (
                  <div key={product.id} className="bg-white border border-[#e4e7e9] border-solid rounded-[4px] overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-[#f5f5f5]">
                      <img 
                        src={imgProduct} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Badges */}
                      {product.badges.length > 0 && (
                        <div className="absolute top-[14px] left-[14px] flex flex-col gap-[8px]">
                          {product.badges.map((badge, idx) => (
                            <div
                              key={idx}
                              className={`px-[9px] py-[4px] rounded-[2px] font-['Poppins'] font-medium text-[12px] leading-[15px] ${
                                badge === '32% OFF' ? 'bg-[#ffd700] text-[#191c1f]' :
                                badge === 'Only 10 Left' ? 'bg-[#ff6b6b] text-white' :
                                badge === 'HOT' ? 'bg-[#ff0000] text-white' : ''
                              }`}
                            >
                              {badge}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-[12px] sm:p-[16px]">
                      <h3 className="font-['Poppins'] font-normal text-[#191c1f] text-[13px] sm:text-[14px] leading-[1.3] mb-[8px] line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[13px] mb-[8px]">
                        {product.brand}
                      </p>
                      <div className="flex gap-[8px] items-center">
                        <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] sm:text-[16px]">
                          {product.price}
                        </span>
                        <span className="font-['Poppins'] font-normal text-[#999] text-[12px] sm:text-[14px] line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-[8px] mt-[40px] sm:mt-[60px]">
                <button className="p-[8px] hover:bg-[#f0f0f0] rounded-[4px] transition-colors">
                  <div className="size-[20px] rotate-90">
                    <img alt="Previous" className="block max-w-none size-full" src={imgArrowLeft} />
                  </div>
                </button>
                {[1, 2, 3, 4, 5, 6].map((page) => (
                  <button
                    key={page}
                    className={`min-w-[40px] h-[40px] flex items-center justify-center font-['Poppins'] font-medium text-[14px] sm:text-[16px] rounded-[4px] transition-colors ${
                      page === 1 
                        ? 'bg-[#0e1c47] text-white' 
                        : 'text-[#191c1f] hover:bg-[#f0f0f0]'
                    }`}
                  >
                    {String(page).padStart(2, '0')}
                  </button>
                ))}
                <button className="p-[8px] hover:bg-[#f0f0f0] rounded-[4px] transition-colors">
                  <div className="size-[20px] -rotate-90">
                    <img alt="Next" className="block max-w-none size-full" src={imgArrowRight} />
                  </div>
                </button>
              </div>
            </div>

            {/* Filter Sidebar */}
            <div
              className={`fixed lg:static top-0 right-0 h-full lg:h-auto bg-white z-[999] transition-transform duration-300 ease-in-out overflow-y-auto w-[calc(100vw-32px)] lg:w-[313px] max-w-[313px] ${
                showFilter ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
              }`}
            >
              {/* Mobile Close Button */}
              {showFilter && (
                <div className="lg:hidden flex justify-between items-center p-[16px] border-b border-[#e4e7e9] sticky top-0 bg-white z-10">
                  <h2 className="font-['Poppins'] font-semibold text-[#191c1f] text-[18px]">Filters</h2>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="size-[32px] flex items-center justify-center hover:bg-[#f0f0f0] rounded-[4px] transition-colors"
                  >
                    <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="p-[16px] sm:p-[20px] lg:p-[24px]">
                {/* Category Filter */}
                <div className="mb-[24px]">
                  <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] sm:text-[16px] uppercase mb-[16px]">
                    Category
                  </h3>
                  <div className="flex flex-col gap-[12px]">
                    {[
                      'Electronics Devices',
                      'Computer & Laptop',
                      'Computer Accessories',
                      'SmartPhone',
                      'Headphone',
                      'Mobile Accessories',
                      'Gaming Console',
                      'Camera & Photo',
                      'TV & Homes Appliances',
                      'Watchs & Accessories',
                      'GPS & Navigation',
                      'Warable Technology'
                    ].map((category) => (
                      <label
                        key={category}
                        className="flex gap-[8px] items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="size-[20px] accent-[#0e1c47] cursor-pointer"
                        />
                        <span className="font-['Poppins'] font-medium text-[#191c1f] text-[13px] sm:text-[14px]">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#e4e7e9] mb-[24px]"></div>

                {/* Price Range Filter */}
                <div className="mb-[24px]">
                  <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] sm:text-[16px] uppercase mb-[16px]">
                    Price Range
                  </h3>
                  
                  {/* Slider */}
                  <div className="mb-[16px] relative h-[12px]">
                    <img src={imgPriceRange} alt="Price range slider" className="w-full h-full object-contain" />
                  </div>

                  {/* Min/Max Inputs */}
                  <div className="flex gap-[12px] mb-[16px]">
                    <input
                      type="text"
                      placeholder="Min price"
                      className="flex-1 border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] py-[8px] font-['Poppins'] font-medium text-[#77878f] text-[13px] sm:text-[14px] outline-none focus:border-[#0e1c47]"
                    />
                    <input
                      type="text"
                      placeholder="Max price"
                      className="flex-1 border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] py-[8px] font-['Poppins'] font-medium text-[#77878f] text-[13px] sm:text-[14px] outline-none focus:border-[#0e1c47]"
                    />
                  </div>

                  {/* Price Range Options */}
                  <div className="flex flex-col gap-[12px]">
                    {[
                      'All Price',
                      'Under $20',
                      '$25 to $100',
                      '$100 to $300',
                      '$300 to $500',
                      '$500 to $1,000',
                      '$1,000 to $10,000'
                    ].map((range) => (
                      <label
                        key={range}
                        className="flex gap-[8px] items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          value={range}
                          checked={selectedPriceRange === range}
                          onChange={() => setSelectedPriceRange(range)}
                          className="size-[20px] accent-[#0e1c47] cursor-pointer"
                        />
                        <span className="font-['Poppins'] font-medium text-[#191c1f] text-[13px] sm:text-[14px]">
                          {range}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#e4e7e9] mb-[24px]"></div>

                {/* Popular Brands Filter */}
                <div className="mb-[24px]">
                  <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] sm:text-[16px] uppercase mb-[16px]">
                    Popular Brands
                  </h3>
                  <div className="grid grid-cols-2 gap-[12px]">
                    {[
                      'Apple', 'Google', 'Microsoft', 'Samsung',
                      'Dell', 'HP', 'Symphony', 'Xiaomi',
                      'Sony', 'Panasonic', 'LG', 'Intel',
                      'One Plus'
                    ].map((brand) => (
                      <label
                        key={brand}
                        className="flex gap-[8px] items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="size-[20px] accent-[#0e1c47] cursor-pointer"
                        />
                        <span className="font-['Poppins'] font-medium text-[#191c1f] text-[13px] sm:text-[14px]">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#e4e7e9] mb-[24px]"></div>

                {/* Popular Tags Filter */}
                <div>
                  <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] sm:text-[16px] uppercase mb-[16px]">
                    Popular Tag
                  </h3>
                  <div className="flex flex-wrap gap-[8px]">
                    {[
                      'Game', 'iPhone', 'TV', 'Asus Laptops',
                      'Macbook', 'SSD', 'Graphics Card',
                      'Power Bank', 'Smart TV', 'Speaker',
                      'Tablet', 'Microwave', 'Samsung'
                    ].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-[12px] py-[6px] rounded-[2px] border border-solid font-['Public_Sans'] font-medium text-[13px] sm:text-[14px] transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-[#0e1c47] text-white border-[#0e1c47]'
                            : 'bg-white text-[#191c1f] border-[#e4e7e9] hover:border-[#0e1c47]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Overlay */}
            {showFilter && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-[998] lg:hidden"
                onClick={() => setShowFilter(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

