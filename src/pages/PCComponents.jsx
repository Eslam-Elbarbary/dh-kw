// PC Components page component - exact Figma implementation
// Based on Figma design - PC Components Page

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Price');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Button action states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'assemble' or 'parts'
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Sample products data with variety for filtering
  const allProducts = Array.from({ length: 50 }, (_, i) => {
    const brands = ['Brand Name', 'ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Corsair', 'NVIDIA', 'AMD', 'Intel', 'Samsung'];
    const categories = ['Motherboard', 'Graphics Card', 'Processor', 'RAM', 'Storage', 'Power Supply', 'Case', 'Cooling', 'Monitor', 'Keyboard'];
    const names = [
      'Bose Sport Earbuds Wireless Earphones',
      'ASUS ROG Strix Gaming Motherboard',
      'NVIDIA RTX 4090 Graphics Card',
      'Intel Core i9-13900K Processor',
      'Corsair Vengeance DDR5 RAM',
      'Samsung 980 PRO SSD',
      'EVGA SuperNOVA Power Supply',
      'Fractal Design PC Case',
      'Noctua CPU Cooler',
      'ASUS ROG Gaming Monitor'
    ];
    
    const basePrice = 100 + (i * 100) + Math.floor(Math.random() * 500);
    const priceValue = basePrice;
    
    return {
      id: i + 1,
      name: names[i % names.length],
      brand: brands[i % brands.length],
      category: categories[i % categories.length],
      price: `$${priceValue.toLocaleString()}`,
      priceValue: priceValue,
      image: [imgProduct1, imgProduct2, imgProduct3, imgProduct4, imgProduct5][i % 5],
      badges: i % 5 === 0 ? ['Only 10 Left'] : i % 5 === 1 ? ['32% OFF', 'Only 10 Left'] : i % 5 === 2 ? ['HOT'] : [],
      popularity: Math.floor(Math.random() * 100),
      rating: 3 + Math.random() * 2
    };
  });

  // Filter products
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange && selectedPriceRange !== 'All Price') {
      const priceRanges = {
        'Under $100': (p) => p.priceValue < 100,
        '$100 to $500': (p) => p.priceValue >= 100 && p.priceValue <= 500,
        '$500 to $1,000': (p) => p.priceValue >= 500 && p.priceValue <= 1000,
        '$1,000 to $2,000': (p) => p.priceValue >= 1000 && p.priceValue <= 2000,
        '$2,000 to $5,000': (p) => p.priceValue >= 2000 && p.priceValue <= 5000,
        'Over $5,000': (p) => p.priceValue > 5000,
      };
      
      if (priceRanges[selectedPriceRange]) {
        filtered = filtered.filter(priceRanges[selectedPriceRange]);
      }
    }

    // Min/Max price filter
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

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    return filtered;
  };

  // Sort products
  const getSortedProducts = (products) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'Most Popular':
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case 'Price: Low to High':
        return sorted.sort((a, b) => a.priceValue - b.priceValue);
      case 'Price: High to Low':
        return sorted.sort((a, b) => b.priceValue - a.priceValue);
      case 'Rating: High to Low':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'Name: A to Z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Name: Z to A':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);
  
  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedBrands, minPrice, maxPrice, sortBy]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // PC Components for assembly (sample data)
  const pcComponents = [
    { id: 1, name: 'Motherboard', price: 299, image: imgMotherboard },
    { id: 2, name: 'Processor', price: 399, image: imgMotherboard },
    { id: 3, name: 'Graphics Card', price: 599, image: imgMotherboard },
    { id: 4, name: 'RAM', price: 149, image: imgMotherboard }
  ];

  const totalPrice = pcComponents.reduce((sum, comp) => sum + comp.price, 0);
  const assemblyFee = 99;

  // Handle Buy & Assemble
  const handleBuyAndAssemble = () => {
    setModalType('assemble');
    setShowModal(true);
  };

  // Handle Buy Parts Only
  const handleBuyPartsOnly = () => {
    setModalType('parts');
    setShowModal(true);
  };

  // Confirm action
  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setShowModal(false);
    
    // Show success notification
    setNotificationMessage(
      modalType === 'assemble' 
        ? `All components and assembly service added to cart! Total: $${(totalPrice + assemblyFee).toLocaleString()}`
        : `All components added to cart! Total: $${totalPrice.toLocaleString()}`
    );
    setShowNotification(true);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    
    // Redirect to cart after a short delay
    setTimeout(() => {
      navigate('/shopping-cart');
    }, 2000);
  };

  // Close modal
  const handleCloseModal = () => {
    if (!isLoading) {
      setShowModal(false);
      setModalType(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
      {/* Breadcrumbs and Search Controls */}
      <div className="bg-white dark:bg-[#0f172a] px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[16px] sm:py-[20px] md:py-[24px] transition-colors duration-300">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex gap-[8px] items-center mb-[16px] sm:mb-[20px]">
            <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] dark:text-white text-[14px] hover:text-[#eea137] transition-colors">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#e4e7e9] dark:border-[#334155] dark:bg-[#1e293b] dark:text-white border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] text-[14px] focus:outline-none focus:border-[#0e1c47] dark:focus:border-[#eea137] pr-[40px] transition-colors duration-300"
              />
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 size-[20px] pointer-events-none">
                <svg className="w-full h-full text-[#666] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex gap-[12px] sm:gap-[16px] items-center">
              <p className="font-['Poppins'] font-normal leading-[20px] text-[#191c1f] dark:text-white text-[14px] whitespace-nowrap">
                Sort by:
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] border-solid h-[40px] overflow-hidden relative rounded-[2px] shrink-0 w-[140px] sm:w-[160px] md:w-[180px] px-[15px] pr-[35px] font-['Poppins'] font-normal text-[14px] text-[#666] dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1c47] dark:focus:border-[#eea137] transition-colors duration-300"
                >
                  <option value="Most Popular">Most Popular</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Rating: High to Low">Rating: High to Low</option>
                  <option value="Name: A to Z">Name: A to Z</option>
                  <option value="Name: Z to A">Name: Z to A</option>
                </select>
                <div className="absolute right-[15px] size-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
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
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] dark:text-white text-[14px] sm:text-[16px] text-left whitespace-nowrap">
                <p className="leading-[18px]">Filter</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* PC Components Assembly Section */}
      <div className="bg-white dark:bg-[#0f172a] px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px] transition-colors duration-300">
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
                <button 
                  onClick={handleBuyAndAssemble}
                  className="bg-[#0e1c47] dark:bg-[#eea137] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] md:px-[32px] rounded-[4px] hover:bg-[#1a2f5c] dark:hover:bg-[#ffb84d] transition-all duration-200 text-[13px] sm:text-[14px] md:text-[16px] whitespace-nowrap w-full sm:w-auto active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  BUY & ASSEMBLE
                </button>
                <button 
                  onClick={handleBuyPartsOnly}
                  className="bg-white dark:bg-[#1e293b] border-2 border-[#0e1c47] dark:border-[#eea137] text-[#0e1c47] dark:text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] md:px-[32px] rounded-[4px] hover:bg-[#f0f0f0] dark:hover:bg-[#334155] transition-all duration-200 text-[13px] sm:text-[14px] md:text-[16px] whitespace-nowrap w-full sm:w-auto active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  BUY PARTS ONLY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="bg-white dark:bg-[#0f172a] px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] pb-[40px] sm:pb-[60px] transition-colors duration-300">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-[24px] relative">
            {/* Filter Sidebar */}
            <div
              className={`${
                showFilter 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-full lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto'
              } fixed lg:relative top-0 right-0 h-screen lg:h-auto bg-white dark:bg-[#1e293b] z-[999] lg:z-auto transition-all duration-300 ease-in-out overflow-y-auto w-[calc(100vw-32px)] sm:w-[calc(100vw-64px)] lg:w-[280px] max-w-[280px] lg:flex-shrink-0 lg:self-start`}
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden flex justify-between items-center p-[16px] border-b border-[#e4e7e9] dark:border-[#334155] sticky top-0 bg-white dark:bg-[#1e293b] z-10">
                <h2 className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[18px]">Filters</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="size-[32px] flex items-center justify-center hover:bg-[#f0f0f0] dark:hover:bg-[#334155] rounded-[4px] transition-colors"
                >
                  <svg className="size-[20px] text-[#191c1f] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-[24px] items-start p-[16px] sm:p-[20px] lg:p-[24px]">
                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedPriceRange('All Price');
                    setSelectedBrands([]);
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="w-full bg-[#0e1c47] dark:bg-[#eea137] hover:bg-[#1a2d5a] dark:hover:bg-[#ffb84d] text-white font-['Poppins'] font-semibold text-[14px] py-[10px] px-[16px] rounded-[4px] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>

                {/* Category Filter */}
                <div className="flex flex-col gap-[16px] items-start w-full">
                  <p className="font-['Poppins'] font-semibold leading-[24px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16px] uppercase w-full">
                    Category
                  </p>
                  <div className="flex flex-col gap-[12px] items-start w-full">
                    {['All Categories', 'Motherboard', 'Graphics Card', 'Processor', 'RAM', 'Storage', 'Power Supply', 'Case', 'Cooling', 'Monitor', 'Keyboard'].map((category) => (
                      <label
                        key={category}
                        className="flex gap-[8px] items-start cursor-pointer w-full"
                      >
                        <div className={`bg-white dark:bg-[#0f172a] border-[#c9cfd2] dark:border-[#334155] border-[1px] border-solid rounded-full size-[20px] flex-shrink-0 transition-colors duration-300 ${
                          selectedCategory === category ? 'border-[#0e1c47] dark:border-[#eea137] border-[2px]' : ''
                        }`}>
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
                        <p className={`font-['Poppins'] font-semibold leading-[20px] text-[13px] sm:text-[14px] ${
                          selectedCategory === category 
                            ? 'text-[#191c1f] dark:text-white' 
                            : 'text-[#475156] dark:text-[#9ca3af]'
                        }`}>
                          {category}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="flex flex-col gap-[16px] items-start w-full">
                  <p className="font-['Poppins'] font-semibold leading-[24px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16px] uppercase w-full">
                    Price Range
                  </p>
                  
                  {/* Min/Max Inputs */}
                  <div className="flex gap-[12px] items-start w-full">
                    <div className="bg-white dark:bg-[#0f172a] border-[#e4e7e9] dark:border-[#334155] border-[1px] border-solid h-[40px] rounded-[3px] flex-1 relative transition-colors duration-300">
                      <input
                        type="text"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="absolute font-['Poppins'] font-semibold leading-[24px] left-[11px] text-[#77878f] dark:text-white text-[13px] sm:text-[14px] top-1/2 -translate-y-1/2 bg-transparent border-none outline-none w-[calc(100%-22px)]"
                      />
                    </div>
                    <div className="bg-white dark:bg-[#0f172a] border-[#e4e7e9] dark:border-[#334155] border-[1px] border-solid h-[40px] rounded-[3px] flex-1 relative transition-colors duration-300">
                      <input
                        type="text"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="absolute font-['Poppins'] font-semibold leading-[24px] left-[11px] text-[#77878f] dark:text-white text-[13px] sm:text-[14px] top-1/2 -translate-y-1/2 bg-transparent border-none outline-none w-[calc(100%-22px)]"
                      />
                    </div>
                  </div>

                  {/* Price Range Options */}
                  <div className="flex flex-col gap-[12px] items-start w-full">
                    {['All Price', 'Under $100', '$100 to $500', '$500 to $1,000', '$1,000 to $2,000', '$2,000 to $5,000', 'Over $5,000'].map((range) => (
                      <label
                        key={range}
                        className="flex gap-[8px] items-start cursor-pointer w-full"
                      >
                        <div className={`bg-white dark:bg-[#0f172a] border border-[#c9cfd2] dark:border-[#334155] border-solid rounded-full size-[20px] flex-shrink-0 transition-colors duration-300 ${
                          selectedPriceRange === range ? 'border-[#0e1c47] dark:border-[#eea137] border-[2px]' : ''
                        }`}>
                          {selectedPriceRange === range && (
                            <div className="w-full h-full rounded-full bg-[#0e1c47] dark:bg-[#eea137] flex items-center justify-center">
                              <div className="w-[8px] h-[8px] rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name="priceRange"
                          value={range}
                          checked={selectedPriceRange === range}
                          onChange={() => setSelectedPriceRange(range)}
                          className="hidden"
                        />
                        <p className="font-['Poppins'] font-semibold leading-[20px] text-[#475156] dark:text-[#9ca3af] text-[13px] sm:text-[14px]">
                          {range}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Popular Brands Filter */}
                <div className="flex flex-col gap-[16px] items-start w-full">
                  <p className="font-['Poppins'] font-semibold leading-[24px] text-[#191c1f] dark:text-white text-[14px] sm:text-[16px] uppercase w-full">
                    Popular Brands
                  </p>
                  <div className="flex flex-col gap-[12px] items-start w-full">
                    {['Brand Name', 'ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Corsair', 'NVIDIA', 'AMD', 'Intel', 'Samsung'].map((brand) => {
                      const isChecked = selectedBrands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex gap-[8px] items-start cursor-pointer w-full"
                        >
                          {isChecked ? (
                            <div className="bg-[#0e1c47] dark:bg-[#eea137] relative rounded-[2px] size-[20px] flex-shrink-0">
                              <svg className="absolute left-[3px] size-[14px] top-[3px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="bg-white dark:bg-[#0f172a] border-[#c9cfd2] dark:border-[#334155] border-[1px] border-solid rounded-[2px] size-[20px] flex-shrink-0 transition-colors duration-300" />
                          )}
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brand)}
                            className="hidden"
                          />
                          <p className="font-['Poppins'] font-semibold leading-[20px] text-[#475156] dark:text-[#9ca3af] text-[13px] sm:text-[14px]">
                            {brand}
                          </p>
                        </label>
                      );
                    })}
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

            {/* Products Grid Container */}
            <div className="flex-1 w-full lg:w-auto">
              {/* Results Count */}
              <div className="mb-[16px] sm:mb-[20px]">
                <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px]">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} products
                </p>
              </div>

              {/* Product Grid - 5 columns on large screens */}
              {paginatedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[18px] mb-[8px]">No products found</p>
                  <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px]">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] w-full">
                  {Array.from({ length: Math.ceil(paginatedProducts.length / 5) }).map((_, rowIndex) => {
                    const rowStart = rowIndex * 5;
                    return (
                      <div 
                        key={rowStart} 
                        className="flex flex-wrap gap-[12px] sm:gap-[16px] md:gap-[20px] items-start justify-start w-full"
                      >
                        {paginatedProducts.slice(rowStart, rowStart + 5).map((product, idx) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-white dark:bg-[#1e293b] border-[#e4e7e9] dark:border-[#334155] border-[0.849px] border-solid flex flex-col gap-[6.789px] items-start overflow-hidden p-[10px] sm:p-[12px] md:p-[13.578px] rounded-[3.394px] w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-13.333px)] lg:w-[calc((100%-80px)/5)] hover:shadow-lg transition-all cursor-pointer"
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
                      <p className="font-['Poppins'] font-semibold leading-[16.972px] text-[#191c1f] dark:text-white text-[12px] w-full line-clamp-2">
                        {product.name}
                      </p>
                      <p className="capitalize font-['Poppins'] font-medium leading-[18.563px] text-[#999] dark:text-[#9ca3af] text-[12px]">
                        {product.brand}
                      </p>
                      <p className="font-['Poppins'] font-semibold leading-[16.972px] text-[#0e1c47] dark:text-[#eea137] text-[12px]">
                        {product.price}
                      </p>
                    </div>
                        </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
            <div className="flex gap-[8px] items-center justify-center mt-[40px] sm:mt-[60px]">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center size-[15.03px] ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'} transition-opacity`}
              >
                <div className="flex-none rotate-[270deg] scale-y-[-100%]">
                  <div className="relative size-[15.03px]">
                    <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                  </div>
                </div>
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-[8px] items-center">
                {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 6) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex items-center justify-center px-0 py-[10px] rounded-[12px] transition-colors duration-200 ${
                        currentPage === pageNum 
                          ? 'bg-[#0e1c47] dark:bg-[#eea137]' 
                          : 'bg-white dark:bg-[#1e293b] hover:bg-[#f0f0f0] dark:hover:bg-[#334155]'
                      }`}
                    >
                      <p className={`font-['Public_Sans'] ${
                        currentPage === pageNum ? 'font-semibold' : 'font-normal'
                      } leading-[20px] text-[14px] text-center ${
                        currentPage === pageNum 
                          ? 'text-white' 
                          : 'text-[#191c1f] dark:text-white'
                      } w-[40px]`}>
                        {String(pageNum).padStart(2, '0')}
                      </p>
                    </button>
                  );
                })}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center size-[15.03px] ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                } transition-opacity`}
              >
                <div className="flex-none rotate-[270deg]">
                  <div className="relative size-[15.03px]">
                    <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                  </div>
                </div>
              </button>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-[16px] sm:p-[24px]">
            <div className="bg-white dark:bg-[#1e293b] rounded-[12px] shadow-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-[20px] sm:p-[24px] border-b border-[#e4e7e9] dark:border-[#334155]">
                <h3 className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[18px] sm:text-[20px]">
                  {modalType === 'assemble' ? 'Buy & Assemble' : 'Buy Parts Only'}
                </h3>
                {!isLoading && (
                  <button
                    onClick={handleCloseModal}
                    className="size-[32px] flex items-center justify-center hover:bg-[#f0f0f0] dark:hover:bg-[#334155] rounded-[4px] transition-colors"
                  >
                    <svg className="size-[20px] text-[#666] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-[20px] sm:p-[24px]">
                {modalType === 'assemble' ? (
                  <>
                    <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px] mb-[20px]">
                      You are about to purchase all PC components with professional assembly service. Our team will assemble your PC and deliver it ready to use.
                    </p>
                    
                    {/* Components List */}
                    <div className="mb-[20px]">
                      <h4 className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[16px] mb-[12px]">
                        Components:
                      </h4>
                      <div className="space-y-[8px]">
                        {pcComponents.map((comp) => (
                          <div key={comp.id} className="flex items-center justify-between p-[12px] bg-[#f8f9fa] dark:bg-[#0f172a] rounded-[8px]">
                            <span className="font-['Poppins'] font-medium text-[#191c1f] dark:text-white text-[14px]">
                              {comp.name}
                            </span>
                            <span className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-[#eea137] text-[14px]">
                              ${comp.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between p-[12px] bg-[#f0f0f0] dark:bg-[#1e293b] rounded-[8px] border-t border-[#e4e7e9] dark:border-[#334155] mt-[8px]">
                          <span className="font-['Poppins'] font-medium text-[#191c1f] dark:text-white text-[14px]">
                            Assembly Service
                          </span>
                          <span className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-[#eea137] text-[14px]">
                            ${assemblyFee.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-[16px] bg-[#0e1c47] dark:bg-[#eea137] rounded-[8px] mb-[20px]">
                      <span className="font-['Poppins'] font-semibold text-white text-[16px]">
                        Total:
                      </span>
                      <span className="font-['Poppins'] font-bold text-white text-[18px]">
                        ${(totalPrice + assemblyFee).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px] mb-[20px]">
                      You are about to purchase all PC components. You will receive all parts separately and can assemble them yourself.
                    </p>
                    
                    {/* Components List */}
                    <div className="mb-[20px]">
                      <h4 className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[16px] mb-[12px]">
                        Components:
                      </h4>
                      <div className="space-y-[8px]">
                        {pcComponents.map((comp) => (
                          <div key={comp.id} className="flex items-center justify-between p-[12px] bg-[#f8f9fa] dark:bg-[#0f172a] rounded-[8px]">
                            <span className="font-['Poppins'] font-medium text-[#191c1f] dark:text-white text-[14px]">
                              {comp.name}
                            </span>
                            <span className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-[#eea137] text-[14px]">
                              ${comp.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-[16px] bg-[#0e1c47] dark:bg-[#eea137] rounded-[8px] mb-[20px]">
                      <span className="font-['Poppins'] font-semibold text-white text-[16px]">
                        Total:
                      </span>
                      <span className="font-['Poppins'] font-bold text-white text-[18px]">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-[12px]">
                  {!isLoading && (
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 bg-white dark:bg-[#0f172a] border-2 border-[#e4e7e9] dark:border-[#334155] text-[#191c1f] dark:text-white font-['Poppins'] font-semibold py-[12px] px-[20px] rounded-[8px] hover:bg-[#f0f0f0] dark:hover:bg-[#1e293b] transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 bg-[#0e1c47] dark:bg-[#eea137] text-white font-['Poppins'] font-semibold py-[12px] px-[20px] rounded-[8px] hover:bg-[#1a2f5c] dark:hover:bg-[#ffb84d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-[8px]"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin size-[20px] text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Confirm & Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed bottom-[24px] right-[24px] z-[10000] animate-[slideIn_0.3s_ease-out]">
          <div className="bg-[#00a651] text-white rounded-[8px] p-[16px] sm:p-[20px] shadow-2xl max-w-[400px]">
            <div className="flex items-start gap-[12px]">
              <svg className="size-[24px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex-1">
                <p className="font-['Poppins'] font-semibold text-[16px] mb-[4px]">Success!</p>
                <p className="font-['Poppins'] font-normal text-[14px] opacity-90">
                  {notificationMessage}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-[8px] hover:opacity-80 transition-opacity"
              >
                <svg className="size-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

