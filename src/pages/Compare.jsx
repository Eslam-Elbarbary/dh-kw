// Compare page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, resolveCountryId } from '../services/catalog.service';

// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

// Icon Assets
const imgArrowDown = arrowDownIcon;

export default function Compare() {
  const countryId = useMemo(() => resolveCountryId(1), []);
  const [compareItems, setCompareItems] = useState([]);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [compareError, setCompareError] = useState('');

  useEffect(() => {
    const loadCompareItems = async () => {
      try {
        setLoadingCompare(true);
        setCompareError('');
        const productsList = await getProducts({ countryId, perPage: 4, page: 1 });
        setCompareItems(
          productsList.slice(0, 3).map((product) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: Number(product.priceValue || 0),
            originalPrice: Number((product.originalPrice || '').replace(/[^0-9.]/g, '')) || null,
            image: product.image || '',
            specs: {
              processor: product.tag || product.category || 'N/A',
              memory: product.stock > 0 ? 'Available' : 'Out of stock',
              storage: product.sku || 'N/A',
              display: product.category || 'N/A',
              battery: product.rating ? `${product.rating.toFixed(1)} Rating` : 'N/A',
              weight: product.vendorName || 'N/A',
            },
          }))
        );
      } catch (error) {
        setCompareError(error?.response?.data?.message || 'Failed to load products to compare.');
        setCompareItems([]);
      } finally {
        setLoadingCompare(false);
      }
    };

    loadCompareItems();
  }, [countryId]);

  const removeItem = (id) => {
    setCompareItems(compareItems.filter(item => item.id !== id));
  };

  const specsList = ['processor', 'memory', 'storage', 'display', 'battery', 'weight'];

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300">
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
            Compare Products
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-[20px] sm:gap-[24px]">
          <div>
            <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47] dark:text-white mb-[8px]">
              Compare Products
            </h1>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] dark:text-[#e5e7eb]">
              Compare up to 4 products side by side
            </p>
          </div>
          {compareItems.length > 0 && (
            <button
              onClick={() => setCompareItems([])}
              className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#dc2626] hover:text-[#b91c1c] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Main Content */}
        {loadingCompare ? (
          <div className="w-full bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center transition-colors duration-300">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb]">Loading products...</p>
          </div>
        ) : compareError ? (
          <div className="w-full bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center transition-colors duration-300">
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#8e0909]">{compareError}</p>
          </div>
        ) : compareItems.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Products Grid */}
              <div className="grid gap-[16px] sm:gap-[20px]" style={{ gridTemplateColumns: `repeat(${compareItems.length + 1}, minmax(200px, 1fr))` }}>
                {/* Specs Column Header */}
                <div className="bg-[#f8f9fa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[16px] sm:p-[20px] transition-colors duration-300">
                  <h3 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47] dark:text-white mb-[16px]">
                    Specifications
                  </h3>
                </div>

                {/* Product Cards */}
                {compareItems.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[16px] sm:p-[20px] relative transition-colors duration-300">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-[12px] right-[12px] text-[#666] dark:text-white hover:text-[#dc2626] dark:hover:text-[#f87171] transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center gap-[12px] sm:gap-[16px]">
                      <div className="w-full h-[180px] sm:h-[200px] bg-[#f8f9fa] dark:bg-[#0f172a] rounded-[4px] overflow-hidden transition-colors duration-300">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="w-full text-center">
                        <p className="font-['Poppins'] font-medium text-[12px] sm:text-[14px] text-[#666] dark:text-[#e5e7eb] mb-[4px]">
                          {item.brand}
                        </p>
                        <h3 className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white mb-[8px] line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-center gap-[8px] mb-[12px]">
                          <span className="font-['Poppins'] font-bold text-[16px] sm:text-[18px] text-[#0e1c47] dark:text-white">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <span className="font-['Poppins'] font-normal text-[14px] text-[#666] dark:text-[#9ca3af] line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/product/${item.id}`}
                          className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[16px] py-[8px] rounded-[4px] hover:bg-[#d8902f] transition-colors text-[12px] sm:text-[14px] w-full"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specifications Comparison */}
              <div className="mt-[20px] sm:mt-[24px]">
                <div className="grid gap-[16px] sm:gap-[20px]" style={{ gridTemplateColumns: `repeat(${compareItems.length + 1}, minmax(200px, 1fr))` }}>
                  {specsList.map((spec) => (
                    <React.Fragment key={spec}>
                      <div className="bg-[#f8f9fa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[12px] sm:p-[16px] transition-colors duration-300">
                        <p className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] dark:text-white capitalize">
                          {spec.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                      {compareItems.map((item) => (
                        <div key={`${item.id}-${spec}`} className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[12px] sm:p-[16px] transition-colors duration-300">
                          <p className="font-['Poppins'] font-normal text-[14px] text-[#666] dark:text-white">
                            {item.specs[spec]}
                          </p>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid rounded-[4px] p-[40px] sm:p-[48px] md:p-[56px] text-center transition-colors duration-300">
            <div className="text-[64px] mb-[16px]">⚖️</div>
            <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] dark:text-white mb-[8px]">
              No products to compare
            </h3>
            <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] dark:text-[#e5e7eb] mb-[24px]">
              Add products to compare their features and specifications side by side.
            </p>
            <Link
              to="/search"
              className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

