import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFavoriteList, toggleFavoriteProduct } from '../services/catalog.service';
import { useCountry } from '../context/CountryContext';
import { useCart } from '../context/useCart';
import { ProductCard } from '../components/ProductCard';
import { ProductVariantPickModal } from '../components/ProductVariantPickModal';
import { addCompareProductId, getCompareIds, MAX_COMPARE_ITEMS } from '../utils/compareStorage';
import { productNeedsVariantPick } from '../utils/productVariants';
import { shouldShowInlineCartError } from '../utils/cartErrors';
import { isCartAddConflict } from '../utils/cartAdd';
import { CART_ITEM_TYPE } from '../services/cart.service';

import arrowDownIcon from '../assets/ArrowRight.svg';
import heartIcon from '../assets/wishlist.svg';

const imgArrowDown = arrowDownIcon;
const imgHeart = heartIcon;

const FAVORITE_CARD_WIDTH =
  'w-full sm:w-[calc(50%-10.183px)] md:w-[calc(33.333%-13.577px)] lg:w-[calc((100%-61.098px)/4)] xl:w-[calc((100%-81.464px)/5)]';

export default function Favorites() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { countryId, countryCode } = useCountry();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');
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

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        setFavoritesError('');
        const productsList = await getFavoriteList({ countryId, countryCode, perPage: 50, page: 1 });
        setFavoriteProducts(productsList);
      } catch (error) {
        setFavoritesError(error?.response?.data?.message || 'Failed to load favorites.');
        setFavoriteProducts([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [countryId, countryCode]);

  const handleToggleFavorite = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || favoriteBusyId === productId) return;

    setFavoriteBusyId(productId);
    setFavoritesError('');

    try {
      await toggleFavoriteProduct({ productId });
      setFavoriteProducts((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      setFavoritesError(error?.response?.data?.message || 'Failed to remove favorite.');
    } finally {
      setFavoriteBusyId(null);
    }
  };

  const handleAddToCartCard = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || cartBusyId) return;
    const product = favoriteProducts.find((item) => item.id === productId);
    if (product && productNeedsVariantPick(product)) {
      setVariantPickModal({ product, intent: 'cart' });
      return;
    }
    setCartBusyId(productId);
    setFavoritesError('');
    try {
      const result = await addToCart({ productId, quantity: 1, itemType: CART_ITEM_TYPE.PHYSICAL });
      if (isCartAddConflict(result)) return;
    } catch (error) {
      if (!shouldShowInlineCartError(error)) return;
      const message = String(error?.response?.data?.message || '').toLowerCase();
      if (product && message.includes('variant')) {
        setVariantPickModal({ product, intent: 'cart' });
        return;
      }
      setFavoritesError(error?.response?.data?.message || 'Could not add to cart. You may need to sign in.');
    } finally {
      setCartBusyId(null);
    }
  };

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

  const extractErrorMessage = (error, fallback) => {
    const responseData = error?.response?.data;
    const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
      ? Object.values(responseData.errors).flat().filter(Boolean)
      : [];
    if (validationErrors.length > 0) return validationErrors.join(' ');
    return responseData?.message || error?.message || fallback;
  };

  const handleVariantPickConfirm = async ({ intent, productId, variantId }) => {
    setVariantPickSubmitting(true);
    setFavoritesError('');
    try {
      if (intent === 'details') {
        navigate(`/product/${productId}`);
        setVariantPickModal(null);
        return;
      }
      if (!productId || cartBusyId) return;
      const modalProduct = variantPickModal?.product;
      if (productNeedsVariantPick(modalProduct) && !variantId) {
        setFavoritesError('Please select a product option before adding to cart.');
        return;
      }
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
        setFavoritesError(extractErrorMessage(error, 'Could not add to cart. You may need to sign in.'));
      } finally {
        setCartBusyId(null);
      }
    } finally {
      setVariantPickSubmitting(false);
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex gap-[8px] items-center mb-[20px] sm:mb-[24px] md:mb-[32px]">
            <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors">
              Home
            </Link>
            <div className="flex items-center justify-center relative size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>
            <span className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]">
              Favorites
            </span>
          </div>

          <div className="mb-[24px] sm:mb-[32px] md:mb-[40px]">
            <h1 className="font-['Poppins'] font-semibold text-[#191c1f] text-[24px] sm:text-[28px] md:text-[32px]">
              My Favorites
            </h1>
            <p className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px] mt-[8px]">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} in your favorites list
            </p>
          </div>
        </div>
      </div>

      <div className="px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] pb-[40px] sm:pb-[60px] md:pb-[80px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {compareToast ? (
            <p
              className="font-['Poppins'] text-[13px] sm:text-[14px] text-[#92400e] bg-[#fffbeb] border border-[#fde68a] rounded-[6px] px-[14px] py-[10px] mb-[16px]"
              role="status"
            >
              {compareToast}{' '}
              <Link to="/compare" className="font-semibold text-[#0e1c47] underline underline-offset-2">
                View compare
              </Link>
            </p>
          ) : null}

          {loadingFavorites ? (
            <div className="flex flex-col items-center justify-center py-[60px] sm:py-[80px] md:py-[100px] w-full">
              <p className="font-['Poppins'] font-normal text-[#666] text-[14px] sm:text-[16px]">Loading favorites...</p>
            </div>
          ) : favoritesError && favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[60px] sm:py-[80px] md:py-[100px] w-full">
              <p className="font-['Poppins'] font-normal text-[#8e0909] text-[14px] sm:text-[16px]">{favoritesError}</p>
            </div>
          ) : favoriteProducts.length > 0 ? (
            <>
              {favoritesError ? (
                <p className="font-['Poppins'] text-[13px] text-[#8e0909] mb-[12px]">{favoritesError}</p>
              ) : null}
              <div className="flex flex-wrap gap-[20.366px] items-start justify-start w-full">
                {favoriteProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={FAVORITE_CARD_WIDTH}
                    isFavorite
                    inCompare={isProductInCompare(product.id)}
                    favoriteBusy={favoriteBusyId === product.id}
                    cartBusy={cartBusyId === product.id || (variantPickSubmitting && variantPickModal?.product?.id === product.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, product.id)}
                    onAddToCompare={(e) => handleAddToCompare(e, product.id)}
                    onAddToCart={(e) => handleAddToCartCard(e, product.id)}
                    onVariantChoiceView={() => setVariantPickModal({ product, intent: 'details' })}
                    onVariantChoiceCart={() => setVariantPickModal({ product, intent: 'cart' })}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-[60px] sm:py-[80px] md:py-[100px]">
              <div className="relative size-[120px] sm:size-[150px] mb-[24px] sm:mb-[32px]">
                <img
                  src={imgHeart}
                  alt=""
                  className="w-full h-full object-contain opacity-30"
                  onError={(e) => { e.target.style.display = 'none'; }}
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
