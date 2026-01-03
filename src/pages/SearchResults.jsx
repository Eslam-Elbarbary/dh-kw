// Search Results page component - exact Figma implementation
// Based on node 35:2469 and 35:3733

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Product Image Assets (from Figma)
const imgProduct1 = "https://www.figma.com/api/mcp/asset/31331607-e3da-4091-a87f-d673768d08a0";
const imgProduct2 = "https://www.figma.com/api/mcp/asset/397ef9d6-e230-46dc-a591-71cc82d81a35";
const imgProduct3 = "https://www.figma.com/api/mcp/asset/57cdecfc-ac27-4553-af8c-666330f3a295";
const imgProduct4 = "https://www.figma.com/api/mcp/asset/6e338bde-c416-445f-9838-e842db794196";
const imgProduct5 = "https://www.figma.com/api/mcp/asset/2285c162-bbe8-4bdc-9913-5a9447d89870";
const imgProductImage = "https://www.figma.com/api/mcp/asset/d7b25b9a-4cb5-4616-a033-525d62ea4734"; // For the 4K TV search results

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgRegularCaretDown = "https://www.figma.com/api/mcp/asset/8b4bcb1e-3b4f-4071-91ff-2859363e4007";
const imgRegularCaretDownVector = "https://www.figma.com/api/mcp/asset/b502bf77-f3c4-46dd-8e2e-dce0a330d6f8";
const imgHeart = "https://www.figma.com/api/mcp/asset/60067eaf-84de-435a-a60c-844b13c64552";
const imgShoppingCart = "https://www.figma.com/api/mcp/asset/281e5eef-36c1-49be-8714-dd8f301bf649";
const imgHeart3 = "https://www.figma.com/api/mcp/asset/64f5390e-b1f9-4bf7-9e61-c58eef611246";
const imgDropdownCaret = "https://www.figma.com/api/mcp/asset/9122ce45-3cf6-4c44-88ae-e7b8df7d1f51";

// Filter Assets
const imgFromElements = "https://www.figma.com/api/mcp/asset/d1f6be64-ccf2-4015-bc21-eb1bcb103c0c";
const imgLine13 = "https://www.figma.com/api/mcp/asset/19db4521-24eb-4863-a634-2bc7b613c4a8";
const imgPriceRange = "https://www.figma.com/api/mcp/asset/b4155f58-726d-4ba3-9539-21eb9e5d53c5";
const imgDuotoneCheck = "https://www.figma.com/api/mcp/asset/b38a6c8f-cd7a-4762-b1ca-6b38c922202e";
const imgCheckVector = "https://www.figma.com/api/mcp/asset/a210e631-7f0f-4511-bc1d-184cccd7a1fc";
const imgFilterHorizontal = "https://www.figma.com/api/mcp/asset/510df043-ce21-421e-81a0-6d7261d2351b";
const imgFilterHorizontalElements = "https://www.figma.com/api/mcp/asset/510df043-ce21-421e-81a0-6d7261d2351b";

export default function SearchResults() {
  const [showFilter, setShowFilter] = useState(true); // Visible by default on desktop
  const [selectedCategory, setSelectedCategory] = useState('All Categories'); // Show all by default
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Price'); // Show all by default
  const [selectedBrands, setSelectedBrands] = useState([]); // Empty = show all brands
  const [selectedTags, setSelectedTags] = useState([]); // Empty = show all tags
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  // Product images array matching Figma - All use the same TV image from search results design
  const productImage = imgProductImage; // 4K UHD LED Smart TV image

  // Sample products data with variety for filtering - matching Figma exactly (node 35:3733)
  const allProducts = Array.from({ length: 24 }, (_, i) => {
    // Create variety in products for filtering
    const brands = ['Apple', 'Microsoft', 'LG', 'HP', 'Panasonic', 'Samsung', 'Sony', 'Dell', 'Xiaomi', 'Google', 'Intel', 'One Plus'];
    const categories = ['Electronics Devices', 'Computer & Laptop', 'Computer Accessories', 'SmartPhone', 'Headphone', 'Mobile Accessories', 'Gaming Console', 'Camera & Photo', 'TV & Homes Appliances', 'Watchs & Accessories', 'GPS & Navigation', 'Warable Technology'];
    const tags = ['Game', 'iPhone', 'TV', 'Asus Laptops', 'Macbook', 'SSD', 'Graphics Card', 'Power Bank', 'Smart TV', 'Speaker', 'Tablet', 'Microwave', 'Samsung'];
    
    // Vary prices for filtering
    const basePrice = 200 + (i * 50) + Math.floor(Math.random() * 300);
    const salePrice = basePrice;
    const originalPrice = Math.floor(salePrice * 1.3);
    
    return {
      id: i + 1,
      name: "4K UHD LED Smart TV with Chromecast Built-in",
      brand: brands[i % brands.length],
      category: categories[i % categories.length],
      tag: tags[i % tags.length],
      originalPrice: `$${originalPrice.toLocaleString()}`,
      salePrice: `$${salePrice}`,
      priceValue: salePrice, // For numeric comparison
      image: productImage,
      badges: i % 4 === 0 ? ['32% OFF', 'Only 10 Left'] : i % 4 === 1 ? ['32% OFF', 'Only 10 Left'] : []
    };
  });

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories' && selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (selectedPriceRange && selectedPriceRange !== 'All Price') {
      const priceRanges = {
        'Under $20': (p) => p.priceValue < 20,
        '$25 to $100': (p) => p.priceValue >= 25 && p.priceValue <= 100,
        '$100 to $300': (p) => p.priceValue >= 100 && p.priceValue <= 300,
        '$300 to $500': (p) => p.priceValue >= 300 && p.priceValue <= 500,
        '$500 to $1,000': (p) => p.priceValue >= 500 && p.priceValue <= 1000,
        '$1,000 to $10,000': (p) => p.priceValue >= 1000 && p.priceValue <= 10000,
      };
      
      if (priceRanges[selectedPriceRange]) {
        filtered = filtered.filter(priceRanges[selectedPriceRange]);
      }
    }

    // Filter by min/max price inputs
    if (minPrice) {
      const min = parseFloat(minPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(min)) {
        filtered = filtered.filter(product => product.priceValue >= min);
      }
    }
    
    if (maxPrice) {
      const max = parseFloat(maxPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(max)) {
        filtered = filtered.filter(product => product.priceValue <= max);
      }
    }

    // Filter by brands (only if brands are selected)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    // Filter by tags (only if tags are selected)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => selectedTags.includes(product.tag));
    }

    return filtered;
  };

  const products = getFilteredProducts();

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      {/* Breadcrumbs and Sort Controls */}
      <div className="bg-white dark:bg-[#0f172a] px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px] transition-colors duration-300">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Breadcrumb - Exact Figma */}
          <div className="flex gap-[8px] items-center mb-[10px] sm:mb-[12px] md:mb-[16px]" data-node-id="35:2531">
            <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] dark:text-white text-[14px] hover:text-[#eea137] transition-colors" data-node-id="35:2532">
              Home
            </Link>
            <div className="flex items-center justify-center relative size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[18px]" data-name="arrow-down" data-node-id="35:2533">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
                  </div>
                </div>
              </div>
            </div>
            <span className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]" data-node-id="35:2534">
              search Results
            </span>
          </div>

          {/* Sort and Filter Controls - Exact Figma */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] sm:gap-[20px] md:gap-[40px]" data-node-id="35:2535">
            {/* Show Items */}
            <div className="flex gap-[8px] items-center leading-[0] not-italic whitespace-nowrap" data-node-id="35:2536">
              <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#333] dark:text-white text-[14px] sm:text-[16px]" data-node-id="35:2537">
                <p className="leading-[18px]">Show: </p>
              </div>
              <div className="flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#333] dark:text-white text-[14px] sm:text-[16px]" data-node-id="35:2538">
                <p className="leading-[18px]">15</p>
              </div>
              <div className="flex flex-col font-['Inter'] font-normal justify-center relative shrink-0 text-[#e6e6e6] dark:text-[#475156] text-[16px] sm:text-[18px]" data-node-id="35:2539">
                <p className="leading-[18px]">/</p>
              </div>
              <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#e6e6e6] dark:text-[#475156] text-[14px] sm:text-[16px]" data-node-id="35:2540">
                <p className="leading-[18px]">20</p>
              </div>
              <div className="flex flex-col font-['Inter'] font-normal justify-center relative shrink-0 text-[#e6e6e6] dark:text-[#475156] text-[16px] sm:text-[18px]" data-node-id="35:2541">
                <p className="leading-[18px]">/</p>
              </div>
              <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#e6e6e6] dark:text-[#475156] text-[14px] sm:text-[16px]" data-node-id="35:2542">
                <p className="leading-[18px]">30</p>
              </div>
            </div>

            {/* Grid View Icons */}
            <div className="flex gap-[8px] items-center relative shrink-0" data-node-id="35:2543">
              <div className="gap-[2px] grid grid-cols-3 grid-rows-3 p-[4px] relative shrink-0" data-node-id="35:2544">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-[#e6e6e6] shrink-0 size-[4px]" data-node-id={`35:${2545 + i}`} />
                ))}
              </div>
              <div className="gap-[2px] grid grid-cols-4 grid-rows-3 p-[4px] relative shrink-0" data-node-id="35:2554">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-[#e6e6e6] shrink-0 size-[4px]" data-node-id={`35:${2555 + i}`} />
                ))}
              </div>
              <div className="gap-[2px] grid grid-cols-5 grid-rows-3 p-[4px] relative shrink-0" data-node-id="35:2567">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="bg-[#999] shrink-0 size-[4px]" data-node-id={`35:${2568 + i}`} />
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="flex gap-[22px] items-center relative shrink-0" data-name="Sort By" data-node-id="35:2583">
              <p className="font-['Poppins'] font-normal leading-[20px] not-italic relative shrink-0 text-[#191c1f] dark:text-white text-[14px]" data-node-id="35:2584">
                Sort by:
              </p>
              <div className="bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] border-solid h-[40px] overflow-hidden relative rounded-[2px] shrink-0 w-[180px] transition-colors duration-300" data-name="Dropdown" data-node-id="35:2585">
                <p className="absolute font-['Poppins'] font-normal leading-[20px] left-[15px] not-italic text-[#666] dark:text-white text-[14px] top-1/2 -translate-y-1/2">
                  Most Popular
                </p>
                <div className="absolute right-[15px] size-[16px] top-1/2 -translate-y-1/2" data-name="Regular/CaretDown">
                  <img alt="" className="block max-w-none size-full" src={imgRegularCaretDown} />
                </div>
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex gap-[8px] items-center p-0 relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              data-node-id="35:2586"
            >
              <div className="overflow-clip relative shrink-0 size-[24px]" data-name="filter-horizontal">
                <div className="absolute inset-[16.67%_12.5%]">
                  <div className="absolute inset-[-4.69%_-4.17%]">
                    <img alt="" className="block max-w-none size-full" src={imgFilterHorizontalElements} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] dark:text-white text-[14px] sm:text-[16px] text-left whitespace-nowrap" data-node-id="35:2588">
                <p className="leading-[18px]">Filter</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Products Grid and Filter Sidebar */}
      <div className="bg-white dark:bg-[#0f172a] px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] pb-[40px] sm:pb-[60px] transition-colors duration-300">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-[24.078px] relative">
            {/* Products Grid - Exact Figma Layout */}
            <div className={`flex-1 w-full lg:w-auto`}>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[18px] mb-[8px]">No products found</p>
                  <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px]">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="flex flex-col gap-[20.366px] w-full">
                  {/* Product Rows - 4 products per row when filter visible (exact Figma) */}
                  {Array.from({ length: Math.ceil(products.length / 4) }).map((_, rowIndex) => {
                    const rowStart = rowIndex * 4;
                    return (
                      <div 
                        key={rowStart} 
                        className="flex flex-wrap gap-[20.366px] items-start justify-start w-full"
                        data-node-id={rowStart === 0 ? "35:3855" : `row-${rowStart}`}
                      >
                        {products.slice(rowStart, rowStart + 4).map((product, idx) => {
                      return (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="bg-white dark:bg-[#1e293b] border-[#e4e7e9] dark:border-[#334155] border-[0.849px] border-solid flex flex-col gap-[6.789px] items-start overflow-hidden p-[13.578px] rounded-[3.394px] w-full sm:w-[calc(50%-10.183px)] md:w-[calc(33.333%-13.577px)] lg:w-[calc((100%-61.098px)/4)] hover:shadow-lg transition-all cursor-pointer"
                          data-name="Product"
                          data-node-id={rowStart === 0 && idx === 0 ? "35:3856" : undefined}
                        >
                          {/* Product Image */}
                          <div className="h-[159.537px] relative w-full" data-name="Image" data-node-id="35:3857">
                            <img 
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                              src={product.image} 
                            />
                            
                            {/* Badges */}
                            {product.badges.length > 0 && (
                              <div className="absolute flex flex-col gap-[6.789px] items-start left-[13.15px] top-[13.15px]" data-name="Badge" data-node-id="35:3864">
                                {product.badges.map((badge, badgeIdx) => (
                                  <div
                                    key={badgeIdx}
                                    className={`flex items-start px-[8.486px] py-[4.243px] rounded-[3.394px] ${
                                      badge === '32% OFF' ? 'bg-[#fc0]' :
                                      badge === 'Only 10 Left' ? 'bg-[#ff9500]' :
                                      badge === 'HOT' ? 'bg-[#ee5858] rounded-[1.856px]' : ''
                                    }`}
                                    data-name="Badge"
                                    data-node-id={badgeIdx === 0 ? "35:3865" : "35:3867"}
                                  >
                                    <p className={`font-['Poppins'] font-semibold leading-[13.578px] text-[10.183px] ${
                                      badge === '32% OFF' ? 'text-[#191c1f]' : 'text-white'
                                    }`} data-node-id={badgeIdx === 0 ? "35:3866" : "35:3868"}>
                                      {badge}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col gap-[6.789px] items-start w-full" data-name="Content" data-node-id="35:3858">
                            <p className="font-['Poppins'] font-semibold leading-[16.972px] text-[#191c1f] dark:text-white text-[12px] w-full" data-node-id="35:3859">
                              {product.name}
                            </p>
                            <p className="capitalize font-['Poppins'] font-medium leading-[18.563px] text-[#999] dark:text-[#9ca3af] text-[12px]" data-node-id="35:3860">
                              {product.brand}
                            </p>
                            <div className="flex font-['Poppins'] font-semibold gap-[3.394px] items-start leading-[16.972px] text-[12px]" data-name="Price" data-node-id="35:3861">
                              <p className="line-through text-[#929fa5]" data-node-id="35:3862">
                                {product.originalPrice}
                              </p>
                              <p className="text-[#00a651]" data-node-id="35:3863">
                                {product.salePrice}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination - Exact Figma */}
              <div className="flex gap-[8px] items-center justify-center mt-[40px] sm:mt-[60px]" data-name="Pages" data-node-id="35:2820">
                <div className="flex items-center justify-center size-[15.03px]">
                  <div className="flex-none rotate-[270deg] scale-y-[-100%]">
                    <div className="relative size-[15.03px]" data-name="Regular/CaretDown" data-node-id="35:2821">
                      <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-[8px] items-center" data-node-id="35:2822">
                  {[1, 2, 3, 4, 5, 6].map((page) => (
                    <div 
                      key={page}
                      className={`flex items-center justify-center px-0 py-[10px] rounded-[12px] ${page === 1 ? 'bg-[#0e1c47]' : 'bg-white'}`}
                      data-name="Pagination/Item"
                      data-node-id={`35:${2823 + (page - 1) * 2}`}
                    >
                      <p className={`font-['Public_Sans'] ${page === 1 ? 'font-semibold' : 'font-normal'} leading-[20px] text-[14px] text-center ${page === 1 ? 'text-white' : 'text-[#191c1f]'} w-[40px]`}>
                        {String(page).padStart(2, '0')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center" data-node-id="35:2835">
                  <div className="flex items-center justify-center size-[15.03px]">
                    <div className="flex-none rotate-[270deg]">
                      <div className="relative size-[15.03px]" data-name="Regular/CaretDown" data-node-id="35:2836">
                        <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Sidebar - Exact Figma */}
            <div
              className={`${
                showFilter 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-full lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto'
              } fixed lg:relative top-0 right-0 h-screen lg:h-auto bg-white z-[999] lg:z-auto transition-all duration-300 ease-in-out overflow-y-auto w-[calc(100vw-32px)] sm:w-[calc(100vw-64px)] lg:w-[313.01px] max-w-[313.01px] lg:flex-shrink-0 lg:self-start`}
              data-name="Filter"
              data-node-id="35:4173"
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden flex justify-between items-center p-[16px] border-b border-[#e4e7e9] dark:border-[#334155] sticky top-0 bg-white dark:bg-[#1e293b] z-10 transition-colors duration-300">
                <h2 className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[18px]">Filters</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="size-[32px] flex items-center justify-center hover:bg-[#f0f0f0] rounded-[4px] transition-colors"
                >
                  <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-[24.078px] items-start p-[16px] sm:p-[20px] lg:p-[24px]">
                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedPriceRange('All Price');
                    setSelectedBrands([]);
                    setSelectedTags([]);
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="w-full bg-[#0e1c47] dark:bg-[#eea137] hover:bg-[#1a2d5a] dark:hover:bg-[#ffb84d] text-white font-['Poppins'] font-semibold text-[14px] py-[10px] px-[16px] rounded-[4px] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>

                {/* Category Filter */}
                <div className="flex flex-col gap-[16.052px] items-start w-full" data-name="Category" data-node-id="35:4174">
                  <p className="font-['Poppins'] font-semibold leading-[24.078px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16.052px] uppercase w-full" data-node-id="35:4175">
                    Category
                  </p>
                  <div className="flex flex-col gap-[12.039px] items-start w-full" data-name="Radio" data-node-id="35:4176">
                    {[
                      'All Categories',
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
                    ].map((category, idx) => (
                      <label
                        key={category}
                        className="flex gap-[8.026px] items-start cursor-pointer w-full"
                        data-name="Category"
                        data-node-id={`35:${4177 + idx * 4}`}
                      >
                        <div className={`bg-white dark:bg-[#0f172a] border-[#c9cfd2] dark:border-[#334155] border-[1.003px] border-solid rounded-[100.324px] size-[20.065px] flex-shrink-0 transition-colors duration-300 ${selectedCategory === category ? 'border-[#0e1c47] dark:border-[#eea137] border-[2px]' : ''}`} data-name="From Elements">
                          {selectedCategory === category && (
                            <div className="w-full h-full rounded-full bg-[#0e1c47] dark:bg-[#eea137] flex items-center justify-center">
                              <div className="w-[8px] h-[8px] rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="hidden"
                        />
                        <p className={`font-['Poppins'] font-semibold leading-[20.065px] text-[13px] sm:text-[14.045px] ${selectedCategory === category ? 'text-[#191c1f] dark:text-white' : 'text-[#475156] dark:text-[#9ca3af]'}`}>
                          {category}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full relative" data-node-id="35:4214">
                  <img alt="" className="block w-full h-full" src={imgLine13} />
                </div>

                {/* Price Range Filter */}
                <div className="flex flex-col gap-[16.052px] items-start w-full" data-name="Price Range" data-node-id="35:4215">
                  <p className="font-['Poppins'] font-semibold leading-[24.078px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16.052px] uppercase w-full" data-node-id="35:4216">
                    Price Range
                  </p>
                  
                  {/* Slider */}
                  <div className="h-[12.039px] w-full relative" data-name="Price Range" data-node-id="35:4217">
                    <img alt="Price range slider" className="block w-full h-full" src={imgPriceRange} />
                  </div>

                  {/* Min/Max Inputs */}
                  <div className="flex gap-[12.039px] items-start w-full" data-name="Input Field" data-node-id="35:4222">
                    <div className="bg-white dark:bg-[#0f172a] border-[#e4e7e9] dark:border-[#334155] border-[1.003px] border-solid h-[40.129px] rounded-[3.01px] flex-1 relative transition-colors duration-300" data-name="Min Price" data-node-id="35:4223">
                      <input
                        type="text"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="absolute font-['Poppins'] font-semibold leading-[24.078px] left-[11.04px] text-[#77878f] dark:text-white text-[13px] sm:text-[14.045px] top-1/2 -translate-y-1/2 bg-transparent border-none outline-none w-[calc(100%-22px)]"
                        data-node-id="35:4224"
                      />
                    </div>
                    <div className="bg-white dark:bg-[#0f172a] border-[#e4e7e9] dark:border-[#334155] border-[1.003px] border-solid h-[40.129px] rounded-[3.01px] flex-1 relative transition-colors duration-300" data-name="Max Price" data-node-id="35:4225">
                      <input
                        type="text"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="absolute font-['Poppins'] font-semibold leading-[24.078px] left-[11.04px] text-[#77878f] dark:text-white text-[13px] sm:text-[14.045px] top-1/2 -translate-y-1/2 bg-transparent border-none outline-none w-[calc(100%-22px)]"
                        data-node-id="35:4226"
                      />
                    </div>
                  </div>

                  {/* Price Range Options */}
                  <div className="flex flex-col gap-[12.039px] items-start w-full" data-name="Radio" data-node-id="35:4227">
                    {[
                      'All Price',
                      'Under $20',
                      '$25 to $100',
                      '$100 to $300',
                      '$300 to $500',
                      '$500 to $1,000',
                      '$1,000 to $10,000'
                    ].map((range, idx) => (
                      <label
                        key={range}
                        className="flex gap-[8.026px] items-start cursor-pointer w-full"
                        data-name="Category"
                        data-node-id={`35:${4228 + idx * 3}`}
                      >
                        <div className={`bg-white border border-[#c9cfd2] border-solid rounded-[100px] size-[20.065px] flex-shrink-0 ${selectedPriceRange === range ? 'border-[#0e1c47] border-[2.006px]' : ''}`} data-name="From Elements" />
                        <input
                          type="radio"
                          name="priceRange"
                          value={range}
                          checked={selectedPriceRange === range}
                          onChange={() => setSelectedPriceRange(range)}
                          className="hidden"
                        />
                        <p className="font-['Poppins'] font-semibold leading-[20.065px] text-[#475156] dark:text-[#9ca3af] text-[13px] sm:text-[14.045px]">
                          {range}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full relative" data-node-id="35:4249">
                  <img alt="" className="block w-full h-full" src={imgLine13} />
                </div>

                {/* Popular Brands Filter */}
                <div className="flex flex-col gap-[16.052px] items-start w-full" data-name="Popular Brands" data-node-id="35:4250">
                  <p className="font-['Poppins'] font-semibold leading-[24.078px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16.052px] uppercase w-full" data-node-id="35:4251">
                    popular Brands
                  </p>
                  <div className="flex flex-col gap-[12.039px] items-start w-full" data-name="CheckBox" data-node-id="35:4252">
                    {[
                      ['Apple', 'Google'],
                      ['Microsoft', 'Samsung'],
                      ['Dell', 'HP'],
                      ['Symphony', 'Xiaomi'],
                      ['Sony', 'Panasonic'],
                      ['LG', 'Intel'],
                      ['One Plus']
                    ].map((row, rowIdx) => (
                      <div key={rowIdx} className="flex gap-[8.026px] items-start w-full" data-name="Row">
                        {row.map((brand, brandIdx) => {
                          const isChecked = selectedBrands.includes(brand);
                          const nodeIds = [
                            [4254, 4258], [4263, 4267], [4271, 4274], [4279, 4282], [4286, 4289], [4294, 4298], [4302]
                          ];
                          const nodeId = rowIdx === 6 && brandIdx === 0 ? 4302 : nodeIds[rowIdx][brandIdx];
                          
                          return (
                            <label
                              key={brand}
                              className="flex gap-[8.026px] items-start cursor-pointer flex-1"
                              data-name="Checkbox"
                              data-node-id={`35:${nodeId}`}
                            >
                              {isChecked ? (
                                <div className="bg-[#0e1c47] relative rounded-[2.006px] size-[20.065px] flex-shrink-0" data-name="From Elements">
                                  <div className="absolute left-[3.01px] size-[14.045px] top-[3.01px]" data-name="Duotone/Check">
                                    <img alt="" className="block w-full h-full" src={imgDuotoneCheck} />
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white border-[#c9cfd2] border-[1.003px] border-solid rounded-[2.006px] size-[20.065px] flex-shrink-0" data-name="From Elements" />
                              )}
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleBrand(brand)}
                                className="hidden"
                              />
                              <p className="font-['Poppins'] font-semibold leading-[20.065px] text-[#475156] dark:text-[#9ca3af] text-[13px] sm:text-[14.045px]">
                                {brand}
                              </p>
                            </label>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full relative" data-node-id="35:4305">
                  <img alt="" className="block w-full h-full" src={imgLine13} />
                </div>

                {/* Popular Tags Filter */}
                <div className="flex flex-col gap-[18.058px] items-start w-full" data-name="Popular Tag" data-node-id="35:4306">
                  <p className="font-['Poppins'] font-semibold leading-[24.078px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16.052px] uppercase w-full" data-node-id="35:4307">
                    Popular Tag
                  </p>
                  <div className="flex flex-col gap-[8.026px] items-start w-full" data-name="Tag" data-node-id="35:4308">
                    {[
                      ['Game', 'iPhone', 'TV', 'Asus Laptops'],
                      ['Macbook', 'SSD', 'Graphics Card'],
                      ['Power Bank', 'Smart TV', 'Speaker'],
                      ['Tablet', 'Microwave', 'Samsung']
                    ].map((row, rowIdx) => (
                      <div key={rowIdx} className="flex gap-[8.026px] items-start flex-wrap" data-name="Row">
                        {row.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`border border-solid flex items-center justify-center px-[12.039px] py-[6.019px] rounded-[2px] cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#0e1c47] dark:bg-[#eea137] text-white border-[#0e1c47] dark:border-[#eea137]'
                                  : 'bg-white dark:bg-[#1e293b] text-[#191c1f] dark:text-white border-[#e4e7e9] dark:border-[#334155] hover:border-[#0e1c47] dark:hover:border-[#eea137]'
                              }`}
                              data-name="Tag"
                            >
                              <p className="font-['Public_Sans'] font-medium leading-[20.065px] text-[13px] sm:text-[14.05px]">
                                {tag}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Overlay */}
            {showFilter && (
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[998] transition-opacity duration-300"
                onClick={() => setShowFilter(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
