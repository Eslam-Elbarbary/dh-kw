// Search Results page component - exact Figma implementation
// Based on node 35:2469 and 35:3733

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCategories, getProducts, searchPhysicalProducts, toggleFavoriteProduct } from '../services/catalog.service';
import { searchDigitalProducts } from '../services/digitalProducts.service';
import { useCountry } from '../context/CountryContext';
import { addCompareProductId, getCompareIds, MAX_COMPARE_ITEMS } from '../utils/compareStorage';
import { useCart } from '../context/useCart';
import { ProductCardQuickActions } from '../components/ProductCardQuickActions';
import { ProductVariantPickModal } from '../components/ProductVariantPickModal';
import { productNeedsVariantPick } from '../utils/productVariants';
import { shouldShowInlineCartError } from '../utils/cartErrors';
import { isCartAddConflict } from '../utils/cartAdd';
import { productMatchesSearch } from '../utils/productSearch';

// Import assets
import productImage1 from '../assets/2c2703028e858e93057b03391653381259c5700c.png';
import productImage2 from '../assets/4290b5299d7820aab27a24eef721fc6a3de6f994.png';
import productImage3 from '../assets/45ffebea53178df09da5b55aa5ec9c64f9c97219.png';
import productImage4 from '../assets/495f2db0dba66b830ccfbc2b70ff68519b13ce45.png';
import productImage5 from '../assets/51514609622e9c097a0531f13c0db834797cda9c.png';
import productImage6 from '../assets/5d1b5ca4f6671da94d620d7aec269e2d17cf66e0.png';
import productImage7 from '../assets/709f890284df9f0583ba3f0cbed489bb013b8efb.png';
import productImage8 from '../assets/76236df7a5ad3774e8e14a241d83f4af473d2f52.png';
import productImage9 from '../assets/89ed235ee47f8d384c57df36ae75c564312166e3.png';
import productImage10 from '../assets/95835fab043de209b7a372fca8d7f780a4915f2b.png';
import arrowDownIcon from '../assets/ArrowRight.svg';
import filterHorizontalIcon from '../assets/filter-horizontal.svg';
import checkIcon from '../assets/CheckCircle.svg';

// Product Image Assets
const imgProduct1 = productImage1;
const imgProduct2 = productImage2;
const imgProduct3 = productImage3;
const imgProduct4 = productImage4;
const imgProduct5 = productImage5;
const imgProductImage = productImage1; // For the 4K TV search results

// Icon Assets
const imgArrowDown = arrowDownIcon;
const imgRegularCaretDown = arrowDownIcon;
const imgRegularCaretDownVector = arrowDownIcon;
const imgDropdownCaret = arrowDownIcon;

// Filter Assets
// "From" elements - using inline SVG for price range inputs
const imgFromElements = "data:image/svg+xml,%3Csvg width='12' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='0' y='10' font-size='12' fill='%23666'%3EFrom%3C/text%3E%3C/svg%3E";
// Divider line
const imgLine13 = "data:image/svg+xml,%3Csvg width='100%25' height='1' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100%25' y2='0' stroke='%23e4e7e9'/%3E%3C/svg%3E";
// Check icons
const imgDuotoneCheck = checkIcon;
const imgCheckVector = checkIcon;
const imgFilterHorizontal = filterHorizontalIcon;
const imgFilterHorizontalElements = filterHorizontalIcon;

const mapDigitalToSearchProduct = (item) => ({
  id: item.id,
  name: item.name,
  brand: item.merchantName || item.companyName || 'Digital product',
  vendorName: item.merchantName || item.companyName || 'Digital product',
  vendorId: null,
  category: 'Digital products',
  categoryId: null,
  tag: 'Digital',
  originalPrice: item.priceFormatted,
  salePrice: item.priceFormatted,
  priceValue: item.price,
  image: item.image,
  images: item.image ? [item.image] : [],
  badges: [],
  popularity: 0,
  rating: 0,
  ratingCount: 0,
  isFavorite: false,
  isDigital: true,
  isAvailable: item.isAvailable,
  description: item.description || '',
  howToUse: item.howToUse || '',
  companyName: item.companyName || '',
});

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const params = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const { countryId: selectedCountryId, countries, countryCurrencyCode } = useCountry();
  const urlCountryId = Number(params.get('country_id'));
  const countryId = Number.isFinite(urlCountryId) && urlCountryId > 0
    ? urlCountryId
    : selectedCountryId;
  const activeCountry = countries.find((c) => String(c.id) === String(countryId));
  const countryCode = activeCountry?.code || '';
  const resolvedCurrencyCode = activeCountry?.currencyCode || countryCurrencyCode || '';
  const preselectedCategoryId = params.get('category_id');
  const preselectedVendorId = params.get('vendor_id');
  const searchQuery = (params.get('q') || '').trim();
  const hasSearchCriteria = Boolean(searchQuery || preselectedCategoryId || preselectedVendorId);

  const [showFilter, setShowFilter] = useState(true); // Visible by default on desktop
  const [selectedCategory, setSelectedCategory] = useState('All Categories'); // Show all by default
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Price'); // Show all by default
  const [selectedBrands, setSelectedBrands] = useState([]); // Empty = show all brands
  const [selectedTags, setSelectedTags] = useState([]); // Empty = show all tags
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Pagination and display states
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [gridView, setGridView] = useState(2); // 1 = 3 columns, 2 = 4 columns, 3 = 5 columns
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [favoriteBusyId, setFavoriteBusyId] = useState(null);
  const [cartBusyId, setCartBusyId] = useState(null);
  const [compareIds, setCompareIds] = useState(() => getCompareIds());
  const [compareToast, setCompareToast] = useState('');
  const compareToastTimerRef = useRef(null);
  const [variantPickModal, setVariantPickModal] = useState(null);
  const [variantPickSubmitting, setVariantPickSubmitting] = useState(false);

  useEffect(() => {
    const syncCompareIds = () => setCompareIds(getCompareIds());
    const onStorage = (e) => {
      if (e.key === 'dh_compare_product_ids' || e.key === null) syncCompareIds();
    };
    window.addEventListener('dh-compare-updated', syncCompareIds);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('dh-compare-updated', syncCompareIds);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => () => {
    if (compareToastTimerRef.current) window.clearTimeout(compareToastTimerRef.current);
  }, []);

  const showCompareToast = (text) => {
    if (compareToastTimerRef.current) window.clearTimeout(compareToastTimerRef.current);
    setCompareToast(text);
    compareToastTimerRef.current = window.setTimeout(() => {
      setCompareToast('');
      compareToastTimerRef.current = null;
    }, 4500);
  };

  const isProductInCompare = (productId) => compareIds.includes(Number(productId));

  const handleAddToCompare = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    const result = addCompareProductId(productId);
    setCompareIds(getCompareIds());
    if (!result.ok && result.reason === 'full') {
      showCompareToast(`You can compare up to ${MAX_COMPARE_ITEMS} products. Open Compare to remove one.`);
      return;
    }
    if (result.added) showCompareToast('Added to your compare list.');
    else showCompareToast('This product is already in your compare list.');
  };

  const handleAddToCartCard = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || cartBusyId) return;
    setCartBusyId(productId);
    setProductsError('');
    try {
      const result = await addToCart({ productId, quantity: 1, itemType: CART_ITEM_TYPE.PHYSICAL });
      if (isCartAddConflict(result)) return;
    } catch (error) {
      if (!shouldShowInlineCartError(error)) return;
      setProductsError(error?.response?.data?.message || 'Could not add to cart. You may need to sign in.');
    } finally {
      setCartBusyId(null);
    }
  };

  const handleVariantPickConfirm = async ({ intent, productId, variantId }) => {
    setVariantPickSubmitting(true);
    setProductsError('');
    try {
      if (intent === 'details') {
        navigate(`/product/${productId}`);
        setVariantPickModal(null);
        return;
      }
      if (!productId || cartBusyId) return;
      setCartBusyId(productId);
      try {
        const result = await addToCart({
          productId,
          quantity: 1,
          ...(variantId ? { variantId } : {}),
          itemType: CART_ITEM_TYPE.PHYSICAL,
        });
        if (isCartAddConflict(result)) return result;
        setVariantPickModal(null);
        return result;
      } catch (error) {
        if (!shouldShowInlineCartError(error)) return { conflict: true };
        setProductsError(error?.response?.data?.message || 'Could not add to cart. You may need to sign in.');
      } finally {
        setCartBusyId(null);
      }
    } finally {
      setVariantPickSubmitting(false);
    }
  };

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

  const handleToggleFavorite = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || favoriteBusyId === productId) return;

    setFavoriteBusyId(productId);
    setProductsError('');
    setAllProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, isFavorite: !Boolean(item.isFavorite) } : item
      )
    );

    try {
      await toggleFavoriteProduct({ productId });
    } catch (error) {
      setAllProducts((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, isFavorite: !Boolean(item.isFavorite) } : item
        )
      );
      setProductsError(error?.response?.data?.message || 'Failed to update favorite.');
    } finally {
      setFavoriteBusyId(null);
    }
  };

  useEffect(() => {
    const loadCatalog = async () => {
      if (!hasSearchCriteria) {
        setAllProducts([]);
        setProductsError('');
        setLoadingProducts(false);
        try {
          const categoriesList = await getCategories();
          setCategories(categoriesList);
        } catch {
          setCategories([]);
        }
        return;
      }

      try {
        setLoadingProducts(true);
        setProductsError('');

        const [productsList, digitalProducts, categoriesList] = await Promise.all([
          searchQuery
            ? searchPhysicalProducts({
                countryId,
                countryCode,
                search: searchQuery,
                categoryId: preselectedCategoryId || undefined,
                vendorId: preselectedVendorId || undefined,
              })
            : getProducts({
                countryId,
                countryCode,
                perPage: 50,
                page: 1,
                categoryId: preselectedCategoryId || undefined,
                vendorId: preselectedVendorId || undefined,
              }),
          searchQuery
            ? searchDigitalProducts({
                countryId,
                countryCode,
                fallbackCurrencyCode: resolvedCurrencyCode,
                search: searchQuery,
              })
            : Promise.resolve([]),
          getCategories(),
        ]);

        const physicalProducts = Array.isArray(productsList) ? productsList : [];
        const digitalItems = (Array.isArray(digitalProducts) ? digitalProducts : []).map(mapDigitalToSearchProduct);
        setAllProducts([...physicalProducts, ...digitalItems]);
        setCategories(categoriesList);
      } catch (error) {
        setProductsError(error?.response?.data?.message || 'Failed to load products.');
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadCatalog();
  }, [countryId, countryCode, resolvedCurrencyCode, preselectedCategoryId, preselectedVendorId, searchQuery, hasSearchCriteria]);

  useEffect(() => {
    if (!preselectedCategoryId || categories.length === 0) return;
    const match = categories.find((item) => String(item.id) === String(preselectedCategoryId));
    if (match) setSelectedCategory(match.name);
  }, [categories, preselectedCategoryId]);

  useEffect(() => {
    if (!preselectedVendorId || allProducts.length === 0) return;
    const match = allProducts.find((item) => String(item.vendorId) === String(preselectedVendorId));
    if (match?.vendorName) setSelectedBrands([match.vendorName]);
  }, [allProducts, preselectedVendorId]);

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    if (searchQuery) {
      filtered = filtered.filter((product) => productMatchesSearch(product, searchQuery));
    }

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
  const brandOptions = React.useMemo(
    () => [...new Set(allProducts.map((item) => item.vendorName || item.brand).filter(Boolean))],
    [allProducts]
  );
  const tagOptions = React.useMemo(
    () => [...new Set(allProducts.map((item) => item.tag).filter(Boolean))],
    [allProducts]
  );
  
  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange, selectedBrands, selectedTags, minPrice, maxPrice, sortBy, itemsPerPage, searchQuery]);

  // Grid columns based on view
  const getGridColumns = () => {
    const gap = 20.366; // Gap between items
    switch (gridView) {
      case 1: 
        // 3 columns: 2 gaps = 2 * 20.366 = 40.732px
        return 'lg:w-[calc((100%-40.732px)/3)]';
      case 2: 
        // 4 columns: 3 gaps = 3 * 20.366 = 61.098px
        return 'lg:w-[calc((100%-61.098px)/4)]';
      case 3: 
        // 5 columns: 4 gaps = 4 * 20.366 = 81.464px
        return 'lg:w-[calc((100%-81.464px)/5)]';
      default: 
        return 'lg:w-[calc((100%-61.098px)/4)]';
    }
  };

  const productsPerRow = gridView === 1 ? 3 : gridView === 2 ? 4 : 5;
  const categoryOptions = ['All Categories', ...categories.map((item) => item.name)];

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
              {searchQuery ? `Search results for "${searchQuery}"` : preselectedCategoryId ? 'Category results' : 'Search'}
            </span>
          </div>

          {/* Sort and Filter Controls - Exact Figma */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] sm:gap-[20px] md:gap-[40px]" data-node-id="35:2535">
            {/* Show Items */}
            <div className="flex gap-[8px] items-center leading-[0] not-italic whitespace-nowrap" data-node-id="35:2536">
              <span className="font-['Poppins'] font-normal text-[#333] dark:text-white text-[14px] sm:text-[16px] leading-[18px]" data-node-id="35:2537">
                Show: 
              </span>
              <button
                onClick={() => setItemsPerPage(15)}
                className={`font-['Poppins'] relative shrink-0 text-[14px] sm:text-[16px] leading-[18px] transition-colors cursor-pointer hover:opacity-80 ${
                  itemsPerPage === 15 
                    ? 'font-semibold text-[#333] dark:text-white' 
                    : 'font-normal text-[#e6e6e6] dark:text-[#475156]'
                }`}
                data-node-id="35:2538"
              >
                15
              </button>
              <span className="font-['Inter'] font-normal text-[#e6e6e6] dark:text-[#475156] text-[16px] sm:text-[18px] leading-[18px]" data-node-id="35:2539">
                /
              </span>
              <button
                onClick={() => setItemsPerPage(20)}
                className={`font-['Poppins'] relative shrink-0 text-[14px] sm:text-[16px] leading-[18px] transition-colors cursor-pointer hover:opacity-80 ${
                  itemsPerPage === 20 
                    ? 'font-semibold text-[#333] dark:text-white' 
                    : 'font-normal text-[#e6e6e6] dark:text-[#475156]'
                }`}
                data-node-id="35:2540"
              >
                20
              </button>
              <span className="font-['Inter'] font-normal text-[#e6e6e6] dark:text-[#475156] text-[16px] sm:text-[18px] leading-[18px]" data-node-id="35:2541">
                /
              </span>
              <button
                onClick={() => setItemsPerPage(30)}
                className={`font-['Poppins'] relative shrink-0 text-[14px] sm:text-[16px] leading-[18px] transition-colors cursor-pointer hover:opacity-80 ${
                  itemsPerPage === 30 
                    ? 'font-semibold text-[#333] dark:text-white' 
                    : 'font-normal text-[#e6e6e6] dark:text-[#475156]'
                }`}
                data-node-id="35:2542"
              >
                30
              </button>
            </div>

            {/* Grid View Icons */}
            <div className="flex gap-[8px] items-center relative shrink-0" data-node-id="35:2543">
              <button
                onClick={() => setGridView(1)}
                className={`gap-[2px] grid grid-cols-3 grid-rows-3 p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${
                  gridView === 1 ? 'opacity-100' : 'opacity-60'
                }`}
                data-node-id="35:2544"
                aria-label="3 column grid view"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`shrink-0 size-[4px] transition-colors ${
                      gridView === 1 ? 'bg-[#999]' : 'bg-[#e6e6e6] dark:bg-[#475156]'
                    }`} 
                    data-node-id={`35:${2545 + i}`} 
                  />
                ))}
              </button>
              <button
                onClick={() => setGridView(2)}
                className={`gap-[2px] grid grid-cols-4 grid-rows-3 p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${
                  gridView === 2 ? 'opacity-100' : 'opacity-60'
                }`}
                data-node-id="35:2554"
                aria-label="4 column grid view"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`shrink-0 size-[4px] transition-colors ${
                      gridView === 2 ? 'bg-[#999]' : 'bg-[#e6e6e6] dark:bg-[#475156]'
                    }`} 
                    data-node-id={`35:${2555 + i}`} 
                  />
                ))}
              </button>
              <button
                onClick={() => setGridView(3)}
                className={`gap-[2px] grid grid-cols-5 grid-rows-3 p-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${
                  gridView === 3 ? 'opacity-100' : 'opacity-60'
                }`}
                data-node-id="35:2567"
                aria-label="5 column grid view"
              >
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`shrink-0 size-[4px] transition-colors ${
                      gridView === 3 ? 'bg-[#999]' : 'bg-[#e6e6e6] dark:bg-[#475156]'
                    }`} 
                    data-node-id={`35:${2568 + i}`} 
                  />
                ))}
              </button>
            </div>

            {/* Sort By */}
            <div className="flex gap-[22px] items-center relative shrink-0" data-name="Sort By" data-node-id="35:2583">
              <p className="font-['Poppins'] font-normal leading-[20px] not-italic relative shrink-0 text-[#191c1f] dark:text-white text-[14px]" data-node-id="35:2584">
                Sort by:
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] border-solid h-[40px] overflow-hidden relative rounded-[2px] shrink-0 w-[180px] px-[15px] pr-[35px] font-['Poppins'] font-normal text-[14px] text-[#666] dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1c47] dark:focus:border-[#eea137] transition-colors duration-300"
                  data-name="Dropdown"
                  data-node-id="35:2585"
                >
                  <option value="Most Popular">Most Popular</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Rating: High to Low">Rating: High to Low</option>
                  <option value="Name: A to Z">Name: A to Z</option>
                  <option value="Name: Z to A">Name: Z to A</option>
                </select>
                <div className="absolute right-[15px] size-[16px] top-1/2 -translate-y-1/2 pointer-events-none" data-name="Regular/CaretDown">
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
              {/* Results Count */}
              <div className="mb-[16px] sm:mb-[20px] space-y-[10px]">
                {hasSearchCriteria && sortedProducts.length > 0 ? (
                  <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px]">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} {searchQuery ? 'results' : 'products'}
                  </p>
                ) : null}
                {compareToast ? (
                  <p
                    className="font-['Poppins'] text-[13px] sm:text-[14px] text-[#92400e] dark:text-[#fde68a] bg-[#fffbeb] dark:bg-[#422006]/50 border border-[#fde68a] dark:border-[#854d0e] rounded-[6px] px-[14px] py-[10px]"
                    role="status"
                  >
                    {compareToast}{' '}
                    <Link to="/compare" className="font-semibold text-[#0e1c47] dark:text-[#eea137] underline underline-offset-2">
                      View compare
                    </Link>
                  </p>
                ) : null}
              </div>

              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px]">Loading products...</p>
                </div>
              ) : productsError ? (
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="font-['Poppins'] font-semibold text-[#8e0909] text-[16px] mb-[8px]">Unable to load products</p>
                  <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px]">{productsError}</p>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="font-['Poppins'] font-semibold text-[#191c1f] dark:text-white text-[18px] mb-[8px]">
                    {!hasSearchCriteria ? 'Enter a search term' : 'No products found'}
                  </p>
                  <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px] text-center max-w-[420px]">
                    {!hasSearchCriteria
                      ? 'Type a product name in the search box above, or pick a category and search to browse products.'
                      : searchQuery
                        ? `No results found for "${searchQuery}". Try a different search term.`
                        : 'Try adjusting your filters'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-[20.366px] w-full">
                  {/* Product Rows - Dynamic products per row based on grid view */}
                  {Array.from({ length: Math.ceil(paginatedProducts.length / productsPerRow) }).map((_, rowIndex) => {
                    const rowStart = rowIndex * productsPerRow;
                    return (
                      <div 
                        key={rowStart} 
                        className="flex flex-wrap gap-[20.366px] items-start justify-start w-full"
                        data-node-id={rowStart === 0 ? "35:3855" : `row-${rowStart}`}
                      >
                        {paginatedProducts.slice(rowStart, rowStart + productsPerRow).map((product, idx) => {
                      return (
                        <Link
                          key={`${product.isDigital ? 'digital' : 'physical'}-${product.id}`}
                          to={product.isDigital ? `/digital-product/${product.id}` : `/product/${product.id}`}
                          className={`group bg-white dark:bg-[#1e293b] border-[#e4e7e9] dark:border-[#334155] border-[0.849px] border-solid flex flex-col gap-[6.789px] items-start overflow-hidden p-[13.578px] rounded-[3.394px] w-full sm:w-[calc(50%-10.183px)] md:w-[calc(33.333%-13.577px)] ${getGridColumns()} hover:shadow-lg transition-all cursor-pointer`}
                          data-name="Product"
                          data-node-id={rowStart === 0 && idx === 0 ? "35:3856" : undefined}
                        >
                          {/* Product Image */}
                          <div className="h-[159.537px] relative w-full bg-[#f5f5f5] dark:bg-[#0f172a] flex items-center justify-center" data-name="Image" data-node-id="35:3857">
                            {product.image ? (
                              <img
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                src={product.image}
                              />
                            ) : (
                              <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[12px] text-center px-[8px]">
                                No image from API
                              </p>
                            )}

                            {product.isDigital ? (
                              <div className="absolute left-[13.15px] top-[13.15px]">
                                <span className="font-['Poppins'] font-semibold text-[10px] uppercase tracking-wide bg-[#0e1c47] text-white px-[8px] py-[4px] rounded-[3px]">
                                  Digital
                                </span>
                              </div>
                            ) : (
                              <ProductCardQuickActions
                                variantChoiceRequired={productNeedsVariantPick(product)}
                                onVariantChoiceView={() => setVariantPickModal({ product, intent: 'details' })}
                                onVariantChoiceCart={() => setVariantPickModal({ product, intent: 'cart' })}
                                isFavorite={Boolean(product.isFavorite)}
                                inCompare={isProductInCompare(product.id)}
                                favoriteBusy={favoriteBusyId === product.id}
                                cartBusy={cartBusyId === product.id || (variantPickSubmitting && variantPickModal?.product?.id === product.id)}
                                onToggleFavorite={(e) => handleToggleFavorite(e, product.id)}
                                onAddToCompare={(e) => handleAddToCompare(e, product.id)}
                                onAddToCart={(e) => handleAddToCartCard(e, product.id)}
                              />
                            )}

                            {/* Badges */}
                            {(product.badges || []).length > 0 && (
                              <div className="absolute flex flex-col gap-[6.789px] items-start left-[13.15px] top-[13.15px]" data-name="Badge" data-node-id="35:3864">
                                {(product.badges || []).map((badge, badgeIdx) => (
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
                              {product.showStrike && product.originalPrice ? (
                                <p className="line-through text-[#929fa5]" data-node-id="35:3862">
                                  {product.originalPrice}
                                </p>
                              ) : null}
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
              {totalPages > 1 && (
                <div className="flex gap-[8px] items-center justify-center mt-[40px] sm:mt-[60px]" data-name="Pages" data-node-id="35:2820">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center size-[15.03px] transition-opacity ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                    }`}
                    aria-label="Previous page"
                  >
                    <div className="flex-none rotate-[270deg] scale-y-[-100%]">
                      <div className="relative size-[15.03px]" data-name="Regular/CaretDown" data-node-id="35:2821">
                        <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                      </div>
                    </div>
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex gap-[8px] items-center" data-node-id="35:2822">
                    {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 6) {
                        // Show all pages if 6 or fewer
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // Show first 6 pages if near start
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Show last 6 pages if near end
                        pageNum = totalPages - 5 + i;
                      } else {
                        // Show pages around current page
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
                          data-name="Pagination/Item"
                          data-node-id={`35:${2823 + (pageNum - 1) * 2}`}
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
                    className={`flex items-center justify-center size-[15.03px] transition-opacity ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                    }`}
                    aria-label="Next page"
                  >
                    <div className="flex items-center justify-center size-[15.03px]">
                      <div className="flex-none rotate-[270deg]">
                        <div className="relative size-[15.03px]" data-name="Regular/CaretDown" data-node-id="35:2836">
                          <img alt="" className="block w-full h-full" src={imgRegularCaretDown} />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
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
                    {categoryOptions.map((category, idx) => (
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
                  <div
                    className="w-full h-px shrink-0 bg-[#e4e7e9] dark:bg-[#334155] rounded-full"
                    aria-hidden
                  />

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
                    ].map((range, idx) => {
                      const priceSelected = selectedPriceRange === range;
                      return (
                      <label
                        key={range}
                        className="flex gap-[10px] items-center cursor-pointer w-full rounded-[4px] -mx-[4px] px-[4px] py-[2px] hover:bg-[#f8f9fa] dark:hover:bg-[#1e293b]/80 transition-colors"
                        data-name="Category"
                        data-node-id={`35:${4228 + idx * 3}`}
                      >
                        <div
                          className={`bg-white dark:bg-[#0f172a] border-[#c9cfd2] dark:border-[#475569] border-solid rounded-full size-[20.065px] flex-shrink-0 flex items-center justify-center transition-colors duration-200 ${
                            priceSelected ? 'border-[#0e1c47] dark:border-[#eea137] border-[2px]' : 'border-[1.003px]'
                          }`}
                          data-name="From Elements"
                          aria-hidden
                        >
                          {priceSelected ? (
                            <div className="w-full h-full rounded-full bg-[#0e1c47] dark:bg-[#eea137] flex items-center justify-center">
                              <div className="w-[8px] h-[8px] rounded-full bg-white shrink-0" />
                            </div>
                          ) : null}
                        </div>
                        <input
                          type="radio"
                          name="priceRange"
                          value={range}
                          checked={priceSelected}
                          onChange={() => setSelectedPriceRange(range)}
                          className="sr-only"
                        />
                        <span className={`font-['Poppins'] font-semibold leading-[20.065px] text-[13px] sm:text-[14.045px] ${priceSelected ? 'text-[#0e1c47] dark:text-[#eea137]' : 'text-[#475156] dark:text-[#9ca3af]'}`}>
                          {range}
                        </span>
                      </label>
                    );
                    })}
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
                    {(brandOptions.length > 0 ? brandOptions.map((brand) => [brand]) : [['No brand data']]).map((row, rowIdx) => (
                      <div key={rowIdx} className="flex gap-[8.026px] items-start w-full" data-name="Row">
                        {row.map((brand, brandIdx) => {
                          const isChecked = selectedBrands.includes(brand);
                          const nodeIds = [
                            [4254, 4258], [4263, 4267], [4271, 4274], [4279, 4282], [4286, 4289], [4294, 4298], [4302]
                          ];
                          const nodeId = nodeIds[rowIdx]?.[brandIdx] ?? (4254 + rowIdx * 4 + brandIdx);
                          
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
                                disabled={brand === 'No brand data'}
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
                    {(tagOptions.length > 0 ? [tagOptions] : [['No tags from API']]).map((row, rowIdx) => (
                      <div key={rowIdx} className="flex gap-[8.026px] items-start flex-wrap" data-name="Row">
                        {row.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              disabled={tag === 'No tags from API'}
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

      <ProductVariantPickModal
        open={Boolean(variantPickModal)}
        intent={variantPickModal?.intent ?? 'cart'}
        product={variantPickModal?.product}
        onClose={() => !variantPickSubmitting && setVariantPickModal(null)}
        onConfirm={handleVariantPickConfirm}
        isSubmitting={variantPickSubmitting}
      />
    </div>
  );
}
