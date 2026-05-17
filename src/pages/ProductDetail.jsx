// Product Detail page component - exact Figma implementation
// Based on Figma design - Product Detail Page
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  getProduct,
  getProducts,
  getCategory,
  getVendor,
  toggleFavoriteProduct,
  resolveCountryId,
} from '../services/catalog.service';
import {
  rateProduct,
  rateVendor,
  reportProduct,
  reportVendor,
} from '../services/ratings-reports.service';
import { addCompareProductId, getCompareIds, MAX_COMPARE_ITEMS } from '../utils/compareStorage';
import { buildVariantGroups, getSelectedVariantId, productNeedsVariantPick } from '../utils/productVariants';
import { ProductCardQuickActions } from '../components/ProductCardQuickActions';
import { ProductVariantPickModal } from '../components/ProductVariantPickModal';

// Import assets
import productImage1 from '../assets/4290b5299d7820aab27a24eef721fc6a3de6f994.png';
import productImage2 from '../assets/45ffebea53178df09da5b55aa5ec9c64f9c97219.png';
import productImage3 from '../assets/495f2db0dba66b830ccfbc2b70ff68519b13ce45.png';
import productImage4 from '../assets/51514609622e9c097a0531f13c0db834797cda9c.png';
import productImage5 from '../assets/5d1b5ca4f6671da94d620d7aec269e2d17cf66e0.png';
import productImage6 from '../assets/709f890284df9f0583ba3f0cbed489bb013b8efb.png';
import productImage7 from '../assets/76236df7a5ad3774e8e14a241d83f4af473d2f52.png';
import productImage8 from '../assets/89ed235ee47f8d384c57df36ae75c564312166e3.png';
import productImage9 from '../assets/95835fab043de209b7a372fca8d7f780a4915f2b.png';
import productImage10 from '../assets/95835fab043de209b7a372fca8d7f780a4915f2b.png';
import productImage11 from '../assets/993680a4fb804721053db577fe1e84c4758c415b.png';
import productImage12 from '../assets/ad7f4ceaa2fcf37913dd3ab0d058af38e9247ccc.png';
import arrowDownIcon from '../assets/ArrowRight.svg';
import arrowRightIcon from '../assets/ArrowRight.svg';
import heartIcon from '../assets/wishlist.svg';
import shoppingCartIcon from '../assets/shopping-basket-01.svg';
import compareIcon from '../assets/arrow-swap-horizontal.svg';
import linkedinIcon from '../assets/Icon-Linkedin.svg';
import instagramIcon from '../assets/icon-instagram.svg';
import twitterIcon from '../assets/Icon-Twitter.svg';
import facebookIcon from '../assets/Icon-Facebook.svg';
import pinterestIcon from '../assets/Pinterest.svg';
import copyIcon from '../assets/Copy.svg';

// Icon Assets
const imgArrowDown = arrowDownIcon;
const imgArrowRight = arrowRightIcon;
const imgVuesaxLinearHeart = heartIcon;
const imgShoppingCart = shoppingCartIcon;
const imgVuesaxOutlineArrowSwapHorizontal = compareIcon;

// Social Media Icons
const imgVector = linkedinIcon;
const imgGroup = instagramIcon;
const imgGroup1 = twitterIcon;
const imgVector1 = facebookIcon;
const imgCopy = copyIcon;
const imgPinterest = pinterestIcon;

// Icon Components (matching Header/Footer pattern)
function HeartIcon({ className }) {
  return (
    <div className={className} data-node-id="35:101">
      <div className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearHeart} />
      </div>
    </div>
  );
}

function CompareIcon({ className }) {
  return (
    <div className={className} data-node-id="35:84">
      <div className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxOutlineArrowSwapHorizontal} />
      </div>
    </div>
  );
}

function IconFacebook({ className }) {
  return (
    <div className={className} data-name="Icon-Facebook" data-node-id="1:521">
      <div className="absolute inset-[12.5%_27.08%_12.5%_29.17%]" data-name="Vector" data-node-id="1:522">
        <img alt="" className="block max-w-none size-full" src={imgVector1} />
      </div>
    </div>
  );
}

function IconTwitter({ className }) {
  return (
    <div className={className} data-name="Icon-Twitter" data-node-id="1:524">
      <div className="absolute inset-[0_8.09%_0_-20.83%]" data-name="Group" data-node-id="1:525">
        <img alt="" className="block max-w-none size-full" src={imgGroup1} />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [productData, setProductData] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [productVendor, setProductVendor] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [productError, setProductError] = useState('');
  const [ratingComment, setRatingComment] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [ratingValueInput, setRatingValueInput] = useState(5);
  const [reportTarget, setReportTarget] = useState('product');
  const [rateTarget, setRateTarget] = useState('product');
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [compareHint, setCompareHint] = useState('');
  const compareHintTimerRef = useRef(null);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const [compareIds, setCompareIds] = useState(() => getCompareIds());
  const [relatedFavoriteBusyId, setRelatedFavoriteBusyId] = useState(null);
  const [relatedCartBusyId, setRelatedCartBusyId] = useState(null);
  const [relatedVariantModal, setRelatedVariantModal] = useState(null);
  const [relatedVariantPickSubmitting, setRelatedVariantPickSubmitting] = useState(false);
  const countryId = resolveCountryId(1);

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

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoadingProduct(true);
        setProductError('');
        const singleProduct = await getProduct({ id, countryId });
        const relatedParams = {
          countryId,
          perPage: 10,
          page: 1,
          categoryId: singleProduct?.categoryId || undefined,
          vendorId: singleProduct?.vendorId || undefined,
        };
        const [productsList, categoryDetails, vendorDetails] = await Promise.all([
          getProducts(relatedParams),
          singleProduct?.categoryId ? getCategory({ id: singleProduct.categoryId }) : Promise.resolve(null),
          singleProduct?.vendorId ? getVendor({ id: singleProduct.vendorId }) : Promise.resolve(null),
        ]);

        setProductData(singleProduct);
        setProductCategory(categoryDetails);
        setProductVendor(vendorDetails);
        setSelectedImage(0);
        setRelatedProducts(
          productsList
            .filter((item) => String(item.id) !== String(id))
            .slice(0, 5)
            .map((item) => ({
              id: item.id,
              name: item.name,
              brand: item.brand,
              price: item.salePrice,
              salePrice: item.salePrice,
              image: item.image || '',
              badges: Array.isArray(item.badges) ? item.badges : [],
              isFavorite: Boolean(item.isFavorite),
              variants: Array.isArray(item.variants) ? item.variants : [],
            }))
            .filter((item) => item.image)
        );
      } catch (error) {
        setProductError(error?.response?.data?.message || 'Failed to load product details.');
        setProductCategory(null);
        setProductVendor(null);
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, countryId]);

  const thumbnails = productData?.images?.length
    ? productData.images
    : productData?.image
    ? [productData.image]
    : [];

  const ratingValue = Math.max(0, Math.min(5, Number(productData?.rating || 0)));
  const ratingCount = Number(productData?.ratingCount || 0);
  const discountLabel = useMemo(() => {
    if (!productData?.discount) return '';
    if (productData.discountType === 'percentage') return `${productData.discount}% OFF`;
    return `$${productData.discount} OFF`;
  }, [productData]);

  const variantGroups = useMemo(() => buildVariantGroups(productData), [productData]);
  const selectedVariantId = useMemo(
    () => getSelectedVariantId(variantGroups, selectedVariants, productData?.variants),
    [selectedVariants, variantGroups, productData?.variants],
  );
  const additionalInfo = useMemo(() => {
    const entries = [];
    if (productData?.sku) entries.push({ label: 'SKU', value: productData.sku });
    if (productData?.slug) entries.push({ label: 'Slug', value: productData.slug });
    if (productData?.category) entries.push({ label: 'Category', value: productData.category });
    if (productVendor?.name) entries.push({ label: 'Vendor', value: productVendor.name });
    if (productData?.stock !== undefined && productData?.stock !== null) {
      entries.push({ label: 'Stock', value: String(productData.stock) });
    }
    if (productData?.discount) {
      entries.push({ label: 'Discount', value: discountLabel });
    }
    if (variantGroups.length > 0) {
      entries.push({
        label: 'Variants',
        value: variantGroups
          .map((group) => `${group.name}: ${group.values.map((item) => item.value).join(', ')}`)
          .join(' | '),
      });
    }
    return entries;
  }, [productData, productVendor, discountLabel, variantGroups]);
  const featureItems = useMemo(() => {
    if (!productData) return [];
    const items = [];
    if ((productData.stock ?? 0) > 0) items.push('In stock');
    if (productData.isFeatured) items.push('Featured product');
    if (productData.isNew) items.push('New arrival');
    if (productData.isBookable) items.push('Bookable');
    if (productData.isActive) items.push('Active listing');
    return items;
  }, [productData]);
  const normalizedDescription = useMemo(() => {
    const raw = productData?.description || '';
    if (!raw) return 'Product description is not available.';

    // Convert common HTML block tags into readable line breaks, then strip tags.
    const withBreaks = String(raw)
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\s*\/p\s*>/gi, '\n')
      .replace(/<\s*p[^>]*>/gi, '')
      .replace(/<\s*\/li\s*>/gi, '\n')
      .replace(/<\s*li[^>]*>/gi, '- ');

    const withoutTags = withBreaks.replace(/<[^>]+>/g, '');

    // Decode basic HTML entities safely in browser context.
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;
    const decoded = textarea.value;

    return decoded
      .replace(/\n{3,}/g, '\n\n')
      .trim() || 'Product description is not available.';
  }, [productData?.description]);

  useEffect(() => {
    if (variantGroups.length === 0) return;
    setSelectedVariants((prev) => {
      const next = { ...prev };
      variantGroups.forEach((group) => {
        if (!next[group.name] && group.values[0]?.value) {
          next[group.name] = group.values[0].value;
        }
      });
      return next;
    });
  }, [variantGroups]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const isFavorite = Boolean(productData?.isFavorite);

  const handleToggleFavorite = async () => {
    if (!productData?.id || favoriteBusy) return;
    const previous = productData;
    setFavoriteBusy(true);
    setProductError('');
    setProductData((prev) => (prev ? { ...prev, isFavorite: !Boolean(prev.isFavorite) } : prev));
    try {
      await toggleFavoriteProduct({ productId: productData.id });
    } catch (error) {
      setProductData(previous);
      setProductError(error?.response?.data?.message || 'Failed to update favorites.');
    } finally {
      setFavoriteBusy(false);
    }
  };

  const showCompareHint = (text) => {
    if (compareHintTimerRef.current) window.clearTimeout(compareHintTimerRef.current);
    setCompareHint(text);
    compareHintTimerRef.current = window.setTimeout(() => {
      setCompareHint('');
      compareHintTimerRef.current = null;
    }, 6000);
  };

  const handleAddToCompare = () => {
    if (!productData?.id) return;
    const result = addCompareProductId(productData.id);
    setCompareIds(getCompareIds());
    if (!result.ok && result.reason === 'full') {
      showCompareHint(`You can compare up to ${MAX_COMPARE_ITEMS} products. Open Compare to remove one.`);
      return;
    }
    if (result.added) showCompareHint('Added to your compare list.');
    else showCompareHint('This product is already in your compare list.');
  };

  const isProductInCompare = (productId) => compareIds.includes(Number(productId));

  const handleRelatedCompare = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    const result = addCompareProductId(productId);
    setCompareIds(getCompareIds());
    if (!result.ok && result.reason === 'full') {
      showCompareHint(`You can compare up to ${MAX_COMPARE_ITEMS} products. Open Compare to remove one.`);
      return;
    }
    if (result.added) showCompareHint('Added to your compare list.');
    else showCompareHint('This product is already in your compare list.');
  };

  const handleRelatedFavorite = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || relatedFavoriteBusyId === productId) return;
    setRelatedFavoriteBusyId(productId);
    setRelatedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isFavorite: !Boolean(p.isFavorite) } : p))
    );
    try {
      await toggleFavoriteProduct({ productId });
    } catch (error) {
      setRelatedProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isFavorite: !Boolean(p.isFavorite) } : p))
      );
      setProductError(error?.response?.data?.message || 'Failed to update favorite.');
    } finally {
      setRelatedFavoriteBusyId(null);
    }
  };

  const handleRelatedAddToCart = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || relatedCartBusyId) return;
    setRelatedCartBusyId(productId);
    setProductError('');
    try {
      await addToCart({ productId, quantity: 1 });
    } catch (error) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
        ? Object.values(responseData.errors).flat().filter(Boolean)
        : [];
      const errorMessage = validationErrors.length > 0
        ? validationErrors.join(' ')
        : (responseData?.message || error?.message || 'Failed to add product to cart.');
      setProductError(errorMessage);
    } finally {
      setRelatedCartBusyId(null);
    }
  };

  const handleRelatedVariantConfirm = async ({ intent, productId, variantId }) => {
    setRelatedVariantPickSubmitting(true);
    setProductError('');
    try {
      if (intent === 'details') {
        navigate(`/product/${productId}`);
        setRelatedVariantModal(null);
        return;
      }
      if (!productId || relatedCartBusyId) return;
      setRelatedCartBusyId(productId);
      try {
        await addToCart({ productId, quantity: 1, ...(variantId ? { variantId } : {}) });
        setRelatedVariantModal(null);
      } catch (error) {
        const responseData = error?.response?.data;
        const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
          ? Object.values(responseData.errors).flat().filter(Boolean)
          : [];
        const errorMessage = validationErrors.length > 0
          ? validationErrors.join(' ')
          : (responseData?.message || error?.message || 'Failed to add product to cart.');
        setProductError(errorMessage);
      } finally {
        setRelatedCartBusyId(null);
      }
    } finally {
      setRelatedVariantPickSubmitting(false);
    }
  };

  useEffect(() => () => {
    if (compareHintTimerRef.current) window.clearTimeout(compareHintTimerRef.current);
  }, []);

  const handleAddToCart = async () => {
    if (!productData?.id || cartBusy) return;
    if (variantGroups.length > 0 && !selectedVariantId) {
      setProductError('Please choose a valid product variant before adding to cart.');
      return;
    }
    try {
      setCartBusy(true);
      setProductError('');
      await addToCart({ productId: productData.id, quantity, variantId: selectedVariantId });
    } catch (error) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
        ? Object.values(responseData.errors).flat().filter(Boolean)
        : [];
      const errorMessage = validationErrors.length > 0
        ? validationErrors.join(' ')
        : (responseData?.message || error?.message || 'Failed to add product to cart.');
      setProductError(errorMessage);
    } finally {
      setCartBusy(false);
    }
  };

  const resolveApiErrorMessage = (error, fallback) => {
    const responseData = error?.response?.data;
    const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
      ? Object.values(responseData.errors).flat().filter(Boolean)
      : [];
    if (validationErrors.length > 0) return validationErrors.join(' ');
    return responseData?.message || fallback;
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (feedbackBusy) return;
    if (String(ratingComment || '').trim().length === 0) {
      setFeedbackError('Please add a short comment with your rating.');
      setFeedbackSuccess('');
      return;
    }
    try {
      setFeedbackBusy(true);
      setFeedbackError('');
      setFeedbackSuccess('');
      if (rateTarget === 'vendor') {
        if (!productVendor?.id) throw new Error('Vendor is not available for rating.');
        await rateVendor({ vendorId: productVendor.id, rating: ratingValueInput, comment: ratingComment });
        setFeedbackSuccess('Vendor rating submitted successfully.');
      } else {
        await rateProduct({ productId: productData?.id, rating: ratingValueInput, comment: ratingComment });
        setFeedbackSuccess('Product rating submitted successfully.');
      }
      setRatingComment('');
      setRatingValueInput(5);
    } catch (error) {
      setFeedbackError(resolveApiErrorMessage(error, 'Unable to submit rating right now.'));
    } finally {
      setFeedbackBusy(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (feedbackBusy) return;
    if (String(reportReason || '').trim().length < 3) {
      setFeedbackError('Please provide a clear report reason (at least 3 characters).');
      setFeedbackSuccess('');
      return;
    }
    try {
      setFeedbackBusy(true);
      setFeedbackError('');
      setFeedbackSuccess('');
      if (reportTarget === 'vendor') {
        if (!productVendor?.id) throw new Error('Vendor is not available for reporting.');
        await reportVendor({ vendorId: productVendor.id, reason: reportReason });
        setFeedbackSuccess('Vendor report submitted successfully.');
      } else {
        await reportProduct({ productId: productData?.id, reason: reportReason });
        setFeedbackSuccess('Product report submitted successfully.');
      }
      setReportReason('');
    } catch (error) {
      setFeedbackError(resolveApiErrorMessage(error, 'Unable to submit report right now.'));
    } finally {
      setFeedbackBusy(false);
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[16px] sm:py-[20px] md:py-[24px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex gap-[8px] items-center">
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
            <Link to="/search" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors">
              All Categories
            </Link>
            <div className="flex items-center justify-center size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[18px]">
                  <img alt="" className="block w-full h-full" src={imgArrowDown} />
                </div>
              </div>
            </div>
            <span className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]">
              {productCategory?.name || productData?.category || 'Product'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-[20px] sm:gap-[24px] md:gap-[32px] lg:gap-[40px]">
            {/* Left Column - Product Image Gallery */}
            <div className="flex-1 w-full lg:max-w-[50%] lg:flex-shrink-0">
              {/* Main Image */}
              <div className="bg-[#f5f5f5] rounded-[8px] mb-[12px] sm:mb-[16px] aspect-square flex items-center justify-center overflow-hidden min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                {thumbnails[selectedImage] ? (
                  <img
                    src={thumbnails[selectedImage]}
                    alt={productData?.name || 'Product'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="font-['Poppins'] font-normal text-[#666] text-[14px]">No product image from API</p>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex gap-[8px] sm:gap-[12px] items-center overflow-x-auto pb-[8px] scrollbar-hide">
                <button 
                  className="flex-shrink-0 size-[32px] sm:size-[40px] flex items-center justify-center hover:bg-[#f0f0f0] rounded-[4px] transition-colors"
                  onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                  disabled={selectedImage === 0}
                >
                  <img alt="Previous" className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] rotate-180" src={imgArrowRight} />
                </button>
                <div className="flex gap-[8px] sm:gap-[12px] flex-1 min-w-0">
                  {thumbnails.slice(0, 6).map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 size-[60px] sm:size-[70px] md:size-[80px] rounded-[4px] overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-[#0e1c47] border-[2px]' : 'border-[#e4e7e9]'
                      }`}
                    >
                      <img 
                        src={thumb} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover bg-[#f5f5f5]"
                      />
                    </button>
                  ))}
                </div>
                <button 
                  className="flex-shrink-0 size-[32px] sm:size-[40px] flex items-center justify-center hover:bg-[#f0f0f0] rounded-[4px] transition-colors"
                  onClick={() => setSelectedImage(Math.min(thumbnails.length - 1, selectedImage + 1))}
                  disabled={selectedImage >= thumbnails.length - 1}
                >
                  <img alt="Next" className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" src={imgArrowRight} />
                </button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="flex-1 w-full lg:max-w-[50%] lg:flex-shrink-0">
              {/* Rating */}
              <div className="flex flex-wrap gap-[8px] items-center mb-[12px]">
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-[16px] sm:text-[18px] ${star <= Math.round(ratingValue) ? 'text-[#ffc107]' : 'text-[#e0e0e0]'}`}>★</span>
                  ))}
                </div>
                <span className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px]">
                  {ratingValue.toFixed(1)} ({ratingCount.toLocaleString()} User feedback)
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-['Poppins'] font-semibold leading-[24px] sm:leading-[28px] md:leading-[32px] text-[#191c1f] text-[18px] sm:text-[22px] md:text-[24px] lg:text-[28px] mb-[12px] sm:mb-[16px]">
                {loadingProduct ? 'Loading product...' : (productData?.name || 'Product details')}
              </h1>
              {productError ? (
                <p className="font-['Poppins'] font-normal text-[#8e0909] text-[14px] mb-[12px]">{productError}</p>
              ) : null}

              {/* Product Information */}
              <div className="flex flex-col gap-[8px] mb-[24px]">
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Sku:</span>
                  <span className="font-['Poppins'] font-normal text-[#666] text-[14px]">{productData?.sku || 'N/A'}</span>
                </div>
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Brand:</span>
                  <span className="font-['Poppins'] font-normal text-[#666] text-[14px]">{productVendor?.name || productData?.brand || 'Brand'}</span>
                </div>
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Availability:</span>
                  <span className="font-['Poppins'] font-normal text-[#00a651] text-[14px]">{(productData?.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Category:</span>
                  <span className="font-['Poppins'] font-normal text-[#666] text-[14px]">{productData?.category || 'Category'}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex gap-[12px] items-center mb-[24px]">
                <span className="font-['Poppins'] font-semibold line-through text-[#929fa5] text-[20px]">
                  {productData?.originalPrice || '$0'}
                </span>
                <span className="font-['Poppins'] font-semibold text-[#ff9500] text-[28px]">
                  {productData?.salePrice || '$0'}
                </span>
                {discountLabel ? (
                  <span className="bg-[#fc0] px-[8px] py-[4px] rounded-[4px] font-['Poppins'] font-semibold text-[#191c1f] text-[12px]">
                    {discountLabel}
                  </span>
                ) : null}
              </div>

              {/* Configuration Options */}
              {variantGroups.length > 0 ? (
                <div className="flex flex-col gap-[16px] sm:gap-[20px] mb-[24px] sm:mb-[32px] p-[16px] rounded-[8px] border border-[#e4e7e9] bg-[#fafafa]">
                  <p className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] sm:text-[15px]">
                    Choose variant
                  </p>
                  {variantGroups.map((group) => (
                    <div key={group.name}>
                      <label className="block font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] mb-[8px]">
                        {group.name}
                      </label>
                      {group.values.length <= 5 ? (
                        <div className="flex flex-wrap gap-[8px]">
                          {group.values.map((value) => {
                            const isSelected = (selectedVariants[group.name] || group.values[0]?.value) === value.value;
                            return (
                              <button
                                key={`${group.name}-${value.value}`}
                                type="button"
                                onClick={() => setSelectedVariants((prev) => ({ ...prev, [group.name]: value.value }))}
                                className={`px-[10px] py-[8px] rounded-[6px] border text-[12px] sm:text-[13px] font-['Poppins'] transition-colors ${
                                  isSelected
                                    ? 'bg-[#0e1c47] text-white border-[#0e1c47]'
                                    : 'bg-white text-[#191c1f] border-[#d0d7de] hover:border-[#0e1c47]'
                                }`}
                              >
                                {value.value}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <select
                          value={selectedVariants[group.name] || group.values[0]?.value || ''}
                          onChange={(e) => setSelectedVariants((prev) => ({ ...prev, [group.name]: e.target.value }))}
                          className="w-full max-w-full sm:max-w-[300px] border border-[#d0d7de] rounded-[6px] px-[12px] py-[10px] font-['Poppins'] text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0e1c47] bg-white"
                        >
                          {group.values.map((value) => (
                            <option key={`${group.name}-${value.value}`} value={value.value}>
                              {value.value}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Quantity and Action Buttons */}
              <div className="flex flex-col gap-[16px] sm:gap-[20px] mb-[24px] sm:mb-[32px]">
                <div className="flex flex-wrap gap-[12px] sm:gap-[16px] items-center">
                  <label className="font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] whitespace-nowrap">Quantity:</label>
                  <div className="flex items-center border border-[#e4e7e9] rounded-[4px]">
                    <button
                      onClick={decreaseQuantity}
                      className="px-[10px] sm:px-[12px] py-[8px] sm:py-[10px] hover:bg-[#f0f0f0] transition-colors text-[16px] sm:text-[18px]"
                    >
                      -
                    </button>
                    <span className="px-[12px] sm:px-[16px] py-[8px] sm:py-[10px] font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] min-w-[50px] sm:min-w-[60px] text-center">
                      {String(quantity).padStart(2, '0')}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-[10px] sm:px-[12px] py-[8px] sm:py-[10px] hover:bg-[#f0f0f0] transition-colors text-[16px] sm:text-[18px]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-[12px]">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={cartBusy || !productData?.id}
                    className="flex-1 bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors flex items-center justify-center gap-[8px] text-[13px] sm:text-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <img src={imgShoppingCart} alt="Cart" className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                    {cartBusy ? 'ADDING...' : 'ADD TO CART'}
                  </button>
                  <button className="flex-1 bg-[#ff9500] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#e68600] transition-colors text-[13px] sm:text-[14px]">
                    BUY NOW
                  </button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-col gap-[12px] sm:gap-[16px] mb-[24px] sm:mb-[32px]">
                <div className="flex flex-wrap gap-[16px] sm:gap-[24px]">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favoriteBusy || !productData?.id}
                    className={`flex items-center gap-[6px] sm:gap-[8px] font-['Poppins'] font-normal text-[12px] sm:text-[14px] transition-colors ${
                      isFavorite ? 'text-[#dc2626]' : 'text-[#666] hover:text-[#0e1c47]'
                    } ${favoriteBusy ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <HeartIcon className="relative shrink-0 size-[16px] sm:size-[18px]" />
                    {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCompare}
                    disabled={!productData?.id}
                    className="flex items-center gap-[6px] sm:gap-[8px] font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] hover:text-[#0e1c47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CompareIcon className="relative shrink-0 size-[16px] sm:size-[18px]" />
                    Add to Compare
                  </button>
                </div>
                {compareHint ? (
                  <p className="font-['Poppins'] text-[12px] sm:text-[13px] text-[#0e1c47]">
                    {compareHint}{' '}
                    <Link to="/compare" className="font-semibold text-[#eea137] hover:underline">
                      View compare
                    </Link>
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-[8px] sm:gap-[12px]">
                  <span className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] whitespace-nowrap">Share product:</span>
                  <div className="flex gap-[6px] sm:gap-[8px] items-center">
                    {/* Copy Icon - Hidden if asset not available */}
                    {imgCopy && (
                      <a 
                        href="#" 
                        className="hover:opacity-70 transition-opacity overflow-clip relative shrink-0 size-[24px]" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                      >
                        <img src={imgCopy} alt="Copy" className="block max-w-none size-full" onError={(e) => e.target.style.display = 'none'} />
                      </a>
                    )}
                    {/* Facebook Icon */}
                    <a href="#" className="hover:opacity-70 transition-opacity">
                      <IconFacebook className="overflow-clip relative shrink-0 size-[24px]" />
                    </a>
                    {/* Twitter Icon */}
                    <a href="#" className="hover:opacity-70 transition-opacity">
                      <IconTwitter className="overflow-clip relative shrink-0 size-[24px]" />
                    </a>
                    {/* Pinterest Icon - Hidden if asset not available */}
                    {imgPinterest && (
                      <a href="#" className="hover:opacity-70 transition-opacity overflow-clip relative shrink-0 size-[24px]">
                        <img src={imgPinterest} alt="Pinterest" className="block max-w-none size-full" onError={(e) => e.target.style.display = 'none'} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Guarantee */}
              <div className="border-t border-[#e4e7e9] pt-[16px] sm:pt-[20px]">
                <p className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] mb-[10px] sm:mb-[12px]">
                  100% Guarantee Safe Checkout
                </p>
                <div className="flex gap-[8px] sm:gap-[12px] items-center flex-wrap">
                  <span className="text-[20px] sm:text-[24px]">💳</span>
                  <span className="text-[20px] sm:text-[24px]">💳</span>
                  <span className="text-[20px] sm:text-[24px]">💳</span>
                  <span className="text-[20px] sm:text-[24px]">💳</span>
                  <span className="text-[20px] sm:text-[24px]">💳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-[4px] sm:gap-[8px] border-b border-[#e4e7e9] mb-[20px] sm:mb-[24px] overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-[12px] sm:px-[16px] md:px-[20px] py-[10px] sm:py-[12px] font-['Poppins'] font-semibold text-[12px] sm:text-[14px] border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'description' ? 'border-[#0e1c47] text-[#0e1c47]' : 'border-transparent text-[#666]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`px-[12px] sm:px-[16px] md:px-[20px] py-[10px] sm:py-[12px] font-['Poppins'] font-semibold text-[12px] sm:text-[14px] border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'additional' ? 'border-[#0e1c47] text-[#0e1c47]' : 'border-transparent text-[#666]'
              }`}
            >
              Additional information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-[12px] sm:px-[16px] md:px-[20px] py-[10px] sm:py-[12px] font-['Poppins'] font-semibold text-[12px] sm:text-[14px] border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-[#0e1c47] text-[#0e1c47]' : 'border-transparent text-[#666]'
              }`}
            >
              Reviews (0)
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col lg:flex-row gap-[24px] sm:gap-[32px]">
            <div className="flex-1 w-full">
              {activeTab === 'description' && (
                <div className="flex flex-col lg:flex-row gap-[20px] sm:gap-[24px]">
                  <div className="w-full lg:w-[300px] flex-shrink-0">
                    {thumbnails[0] ? (
                      <img
                        src={thumbnails[0]}
                        alt={productData?.name || 'Product'}
                        className="w-full rounded-[8px]"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 w-full">
                    <p className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px] leading-[22px] sm:leading-[24px] mb-[12px] sm:mb-[16px]">
                      {normalizedDescription}
                    </p>
                    <p className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px] leading-[22px] sm:leading-[24px]">
                      {productData?.brand ? `Brand: ${productData.brand}` : 'Additional product details will appear here.'}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'additional' && (
                additionalInfo.length > 0 ? (
                  <div className="space-y-[8px]">
                    {additionalInfo.map((item) => (
                      <div key={item.label} className="flex flex-wrap gap-[8px]">
                        <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px]">{item.label}:</span>
                        <span className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px] break-words">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-['Poppins'] font-normal text-[#666] text-[14px]">
                    No additional information returned by API.
                  </p>
                )
              )}
              {activeTab === 'reviews' && (
                <div>
                  {ratingCount > 0 ? (
                    <p className="font-['Poppins'] font-normal text-[#666] text-[14px]">
                      Average rating: {ratingValue.toFixed(1)} from {ratingCount.toLocaleString()} reviews.
                    </p>
                  ) : (
                    <p className="font-['Poppins'] font-normal text-[#666] text-[14px]">
                      No review details returned by API.
                    </p>
                  )}
                  <div className="mt-[16px] grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
                    <form onSubmit={handleSubmitRating} className="border border-[#e4e7e9] rounded-[8px] p-[12px] sm:p-[14px]">
                      <h4 className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] mb-[10px]">Rate</h4>
                      <label className="block font-['Poppins'] text-[12px] text-[#666] mb-[6px]">Target</label>
                      <select
                        value={rateTarget}
                        onChange={(e) => setRateTarget(e.target.value)}
                        className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] text-[13px] font-['Poppins'] mb-[10px]"
                      >
                        <option value="product">Product</option>
                        <option value="vendor" disabled={!productVendor?.id}>Vendor</option>
                      </select>
                      <label className="block font-['Poppins'] text-[12px] text-[#666] mb-[6px]">Rating</label>
                      <select
                        value={ratingValueInput}
                        onChange={(e) => setRatingValueInput(Number(e.target.value))}
                        className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] text-[13px] font-['Poppins'] mb-[10px]"
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <label className="block font-['Poppins'] text-[12px] text-[#666] mb-[6px]">Comment</label>
                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows={3}
                        className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] text-[13px] font-['Poppins'] mb-[10px]"
                        placeholder="Share your experience"
                      />
                      <button
                        type="submit"
                        disabled={feedbackBusy || !productData?.id}
                        className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold px-[16px] py-[9px] rounded-[4px] text-[12px] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {feedbackBusy ? 'Submitting...' : 'Submit Rating'}
                      </button>
                    </form>

                    <form onSubmit={handleSubmitReport} className="border border-[#e4e7e9] rounded-[8px] p-[12px] sm:p-[14px]">
                      <h4 className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px] mb-[10px]">Report</h4>
                      <label className="block font-['Poppins'] text-[12px] text-[#666] mb-[6px]">Target</label>
                      <select
                        value={reportTarget}
                        onChange={(e) => setReportTarget(e.target.value)}
                        className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] text-[13px] font-['Poppins'] mb-[10px]"
                      >
                        <option value="product">Product</option>
                        <option value="vendor" disabled={!productVendor?.id}>Vendor</option>
                      </select>
                      <label className="block font-['Poppins'] text-[12px] text-[#666] mb-[6px]">Reason</label>
                      <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        rows={3}
                        className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] text-[13px] font-['Poppins'] mb-[10px]"
                        placeholder="Describe the issue"
                      />
                      <button
                        type="submit"
                        disabled={feedbackBusy || !productData?.id}
                        className="bg-[#b91c1c] text-white font-['Poppins'] font-semibold px-[16px] py-[9px] rounded-[4px] text-[12px] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {feedbackBusy ? 'Submitting...' : 'Submit Report'}
                      </button>
                    </form>
                  </div>
                  {feedbackError ? (
                    <p className="font-['Poppins'] font-normal text-[#8e0909] text-[13px] mt-[12px]">{feedbackError}</p>
                  ) : null}
                  {feedbackSuccess ? (
                    <p className="font-['Poppins'] font-normal text-[#00a651] text-[13px] mt-[12px]">{feedbackSuccess}</p>
                  ) : null}
                </div>
              )}
            </div>
            <div className="w-full lg:w-[300px] flex-shrink-0 mt-[24px] lg:mt-0">
              <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[16px] sm:text-[18px] mb-[12px] sm:mb-[16px]">Feature</h3>
              <div className="flex flex-col gap-[10px] sm:gap-[12px]">
                {featureItems.length > 0 ? featureItems.map((feature) => (
                  <div key={feature} className="flex items-center gap-[10px] sm:gap-[12px]">
                    <span className="text-[#00a651] text-[18px] sm:text-[20px]">✓</span>
                    <span className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px]">{feature}</span>
                  </div>
                )) : (
                  <p className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px]">
                    No feature flags returned by API.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 ? (
        <div className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
          <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px] sm:gap-0 mb-[20px] sm:mb-[24px]">
              <h2 className="font-['Poppins'] font-semibold text-[#191c1f] text-[20px] sm:text-[24px] md:text-[28px]">
                Related Products
              </h2>
              <div className="flex flex-wrap gap-[12px] sm:gap-[16px] items-center w-full sm:w-auto">
                <Link to="/search" className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] hover:text-[#0e1c47] transition-colors whitespace-nowrap">
                  Browse All Product →
                </Link>
                <div className="flex gap-[8px]">
                  <button className="size-[28px] sm:size-[32px] flex items-center justify-center border border-[#e4e7e9] rounded-[4px] hover:bg-[#f0f0f0] transition-colors">
                    <img src={imgArrowRight} alt="Previous" className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] rotate-180" />
                  </button>
                  <button className="size-[28px] sm:size-[32px] flex items-center justify-center border border-[#e4e7e9] rounded-[4px] hover:bg-[#f0f0f0] transition-colors">
                    <img src={imgArrowRight} alt="Next" className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-[12px] sm:gap-[16px] md:gap-[20px] overflow-x-auto md:overflow-x-visible pb-[8px] scrollbar-hide -mx-[12px] sm:-mx-[16px] md:mx-0 px-[12px] sm:px-[16px] md:px-0 md:flex-wrap">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group flex-shrink-0 md:flex-shrink-0 w-[160px] sm:w-[180px] md:w-[calc((100%-80px)/5)] lg:w-[calc((100%-80px)/5)] bg-white border border-[#e4e7e9] rounded-[8px] overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-[140px] sm:h-[160px] md:h-[180px] bg-[#f5f5f5]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <ProductCardQuickActions
                      variantChoiceRequired={productNeedsVariantPick(product)}
                      onVariantChoiceView={() => setRelatedVariantModal({ product, intent: 'details' })}
                      onVariantChoiceCart={() => setRelatedVariantModal({ product, intent: 'cart' })}
                      isFavorite={Boolean(product.isFavorite)}
                      inCompare={isProductInCompare(product.id)}
                      favoriteBusy={relatedFavoriteBusyId === product.id}
                      cartBusy={relatedCartBusyId === product.id || (relatedVariantPickSubmitting && relatedVariantModal?.product?.id === product.id)}
                      onToggleFavorite={(e) => handleRelatedFavorite(e, product.id)}
                      onAddToCompare={(e) => handleRelatedCompare(e, product.id)}
                      onAddToCart={(e) => handleRelatedAddToCart(e, product.id)}
                    />
                    {product.badges.length > 0 && (
                      <div className="absolute top-[6px] sm:top-[8px] left-[6px] sm:left-[8px] flex flex-col gap-[3px] sm:gap-[4px]">
                        {product.badges.map((badge, badgeIdx) => (
                          <span
                            key={badgeIdx}
                            className={`px-[6px] sm:px-[8px] py-[3px] sm:py-[4px] rounded-[4px] font-['Poppins'] font-semibold text-[9px] sm:text-[10px] ${
                              badge === '32% OFF' ? 'bg-[#fc0] text-[#191c1f]' :
                              badge === 'Only 10 Left' ? 'bg-[#ff9500] text-white' :
                              badge === 'HOT' ? 'bg-[#ee5858] text-white' : ''
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-[10px] sm:p-[12px]">
                    <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[12px] sm:text-[14px] mb-[4px] line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="font-['Poppins'] font-normal text-[#999] text-[11px] sm:text-[12px] mb-[6px] sm:mb-[8px]">
                      {product.brand}
                    </p>
                    <p className="font-['Poppins'] font-semibold text-[#0e1c47] text-[14px] sm:text-[16px]">
                      {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <ProductVariantPickModal
        open={Boolean(relatedVariantModal)}
        intent={relatedVariantModal?.intent ?? 'cart'}
        product={relatedVariantModal?.product}
        onClose={() => !relatedVariantPickSubmitting && setRelatedVariantModal(null)}
        onConfirm={handleRelatedVariantConfirm}
        isSubmitting={relatedVariantPickSubmitting}
      />
    </div>
  );
}

