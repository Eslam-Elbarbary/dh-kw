// Favorites page component - exact Figma implementation
// Based on Figma design - Favorites/Wishlist Page

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavoriteList, resolveCountryId, toggleFavoriteProduct } from '../services/catalog.service';
import { useCart } from '../context/CartContext';

// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';
import heartIcon from '../assets/wishlist.svg';
import shoppingCartIcon from '../assets/shopping-basket-01.svg';

// Icon Assets
const imgArrowDown = arrowDownIcon;
const imgHeart = heartIcon;
const imgShoppingCart = shoppingCartIcon;

export default function Favorites() {
  const { addToCart } = useCart();
  const countryId = useMemo(() => resolveCountryId(1), []);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        setFavoritesError('');
        const productsList = await getFavoriteList({ countryId, perPage: 50, page: 1 });
        setFavoriteProducts(
          productsList.map((product) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            originalPrice: product.originalPrice,
            salePrice: product.salePrice,
            image: product.image || '',
            badges: Array.isArray(product.badges) ? product.badges : [],
          })).filter((product) => Boolean(product.image))
        );
      } catch (error) {
        setFavoritesError(error?.response?.data?.message || 'Failed to load favorites.');
        setFavoriteProducts([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [countryId]);

  const removeFavorite = async (productId) => {
    const previous = favoriteProducts;
    setFavoriteProducts((prev) => prev.filter((item) => item.id !== productId));
    try {
      await toggleFavoriteProduct({ productId });
    } catch (error) {
      setFavoriteProducts(previous);
      setFavoritesError(error?.response?.data?.message || 'Failed to remove favorite.');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!productId) return;
    try {
      setFavoritesError('');
      await addToCart({ productId, quantity: 1 });
    } catch (error) {
      setFavoritesError(error?.response?.data?.message || 'Failed to add item to cart.');
    }
  };

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
          {loadingFavorites ? (
            <div className="flex flex-col items-center justify-center py-[60px] sm:py-[80px] md:py-[100px] w-full">
              <p className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px]">Loading favorites...</p>
            </div>
          ) : favoritesError ? (
            <div className="flex flex-col items-center justify-center py-[60px] sm:py-[80px] md:py-[100px] w-full">
              <p className="font-['Poppins'] font-normal text-[#8e0909] text-[14px] sm:text-[16px]">{favoritesError}</p>
            </div>
          ) : (
          <div className="flex flex-wrap gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px]">
            {favoriteProducts.map((product) => (
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
                  <div className="absolute top-[8px] right-[8px] flex flex-col gap-[8px] items-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeFavorite(product.id)}
                      className="bg-white rounded-full p-[6px] sm:p-[8px] hover:bg-[#f0f0f0] transition-colors shadow-md"
                      aria-label="Remove from favorites"
                    >
                      <svg className="size-[16px] sm:size-[18px] text-[#dc2626]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21s-6.716-4.438-9.193-8.11C1.205 10.518 1 8.41 1 7.5 1 4.462 3.462 2 6.5 2c2.06 0 3.854 1.133 4.5 2.81C11.646 3.133 13.44 2 15.5 2 18.538 2 21 4.462 21 7.5c0 .91-.205 3.018-1.807 5.39C18.716 16.562 12 21 12 21z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-white rounded-full p-[6px] sm:p-[8px] hover:bg-[#f0f0f0] transition-colors shadow-md"
                      aria-label="Add to cart"
                    >
                      <img
                        src={imgShoppingCart}
                        alt="Add to cart"
                        className="size-[16px] sm:size-[18px] object-contain"
                        style={{ filter: 'brightness(0) saturate(100%)' }}
                      />
                    </button>
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
          )}

          {/* Empty State (if no favorites) */}
          {!loadingFavorites && !favoritesError && favoriteProducts.length === 0 && (
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

