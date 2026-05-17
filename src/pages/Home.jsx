// Home page component - exact Figma implementation
// Based on node 35:497

import React from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts, getSliders } from '../services/catalog.service';
import { useCountry } from '../context/CountryContext';
import { getDigitalProducts } from '../services/digitalProducts.service';

// Import assets
import arrowRightIcon from '../assets/ArrowRight.svg';
import truckDeliveryIcon from '../assets/truck-delivery.svg';
import creditCardIcon from '../assets/CreditCard.svg';
import deliveryReturnIcon from '../assets/delivery-return-01.svg';
import customerSupportIcon from '../assets/customer-support.svg';

// Product images - using placeholder images from assets
// You may want to replace these with actual product category images
import productImage1 from '../assets/aea077bf04af7282f36991b02261f6144abee355 (1).png';
import productImage2 from '../assets/0e25c65909ff9d8fdace00ffb430dbc3cbf9784b.png';
import productImage3 from '../assets/bb78ddf69f42960d1b738bd3b005bc00c143cfb6.png';
import productImage4 from '../assets/95835fab043de209b7a372fca8d7f780a4915f2b.png';
import heroBackgroundImage from '../assets/Frame 1984079875 (1).png';

// Hero Banner Assets - using the provided hero background image
const imgHeroBackground = heroBackgroundImage;

// Product Category Assets
const img69694768AmazonEchoPngClipartTransparentAmazonEchoPng1 = productImage1;
const imgSleekBlackTabletModernDigitalDevice1 = productImage2;
const imgElectronicCollectionComputerMotherboardWithCpuCooler1 = productImage3;
const imgLaptopTabletPcTvMobilePhone3D1 = productImage4;
const imgArrowRight = arrowRightIcon;

// Features Assets
const imgShipping = truckDeliveryIcon;
const imgPayment = creditCardIcon;
const imgExchange = deliveryReturnIcon;
const imgCustomer = customerSupportIcon;

// Hero Banner Component
function HeroBanner({ sliders = [] }) {
  const safeSliders = Array.isArray(sliders) ? sliders.filter((item) => Boolean(item?.image)) : [];
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    setActiveSlide(0);
  }, [safeSliders.length]);

  React.useEffect(() => {
    if (safeSliders.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % safeSliders.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [safeSliders.length]);

  const currentSlide = safeSliders[activeSlide] || null;
  const sliderImage = currentSlide?.image || imgHeroBackground;
  const sliderTitle = currentSlide?.title || 'Exclusive Collection';
  const sliderSubtitle = currentSlide?.subtitle || 'Special offer today';

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[499px] lg:h-[550px] xl:h-[600px] 2xl:h-[650px]" data-node-id="35:560">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Hero Background" 
            src={sliderImage}
            onError={(e) => {
              e.target.src = imgHeroBackground;
            }}
          />
        </div>
        <div className="absolute bg-gradient-to-t from-[rgba(0,101,176,0)] inset-0 to-[rgba(0,101,176,0.2)]" />
      </div>
      <div className="absolute inset-0 flex items-end sm:items-center px-[16px] sm:px-[32px] md:px-[60px] lg:px-[100px] xl:px-[120px] pb-[24px] sm:pb-0">
        <div className="max-w-[520px] bg-black/20 backdrop-blur-[1px] rounded-[8px] p-[12px] sm:p-[16px] md:p-[20px]">
          <h2 className="font-['Poppins'] font-semibold text-white text-[22px] sm:text-[30px] md:text-[36px] leading-[1.2] mb-[6px]">
            {sliderTitle}
          </h2>
          <p className="font-['Poppins'] font-normal text-white/90 text-[13px] sm:text-[15px] md:text-[16px] leading-[1.4] line-clamp-3">
            {sliderSubtitle}
          </p>
        </div>
      </div>
      {safeSliders.length > 1 ? (
        <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 flex items-center gap-[8px] z-10">
          {safeSliders.map((slide, idx) => (
            <button
              key={slide.id || `${slide.image}-${idx}`}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`h-[8px] rounded-full transition-all duration-200 ${
                idx === activeSlide ? 'w-[24px] bg-[#eea137]' : 'w-[8px] bg-white/70 hover:bg-white'
              }`}
              aria-label={`Show slide ${idx + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Product Category Card Component
function ProductCategoryCard({ title, mainImage, mainImageAlt, linkText, subCategories, linkTo = "/" }) {
  return (
    <Link to={linkTo} className="bg-white border border-[#e6e6e6] border-solid flex items-center overflow-hidden p-[10px] sm:p-[12px] md:p-[16px] lg:p-[20px] xl:p-[24px] 2xl:p-[28px] relative rounded-[8px] shrink-0 w-full sm:w-auto sm:flex-1 max-w-full sm:max-w-[368px] lg:max-w-[360px] xl:max-w-[380px] 2xl:max-w-[400px] cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-center relative shrink-0 w-full">
        <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] sm:text-[20px] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] text-black text-center line-clamp-1 w-full" dir="auto">
          {title}
        </p>
        <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start relative shrink-0 w-full">
          {/* Main Category */}
          <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start relative shrink-0 w-full">
            <div className="bg-[#0e1c47] flex flex-col h-[120px] sm:h-[140px] md:h-[168px] lg:h-[180px] xl:h-[200px] 2xl:h-[220px] items-center justify-center overflow-clip px-[40px] sm:px-[50px] md:px-[67px] lg:px-[75px] xl:px-[85px] 2xl:px-[95px] py-[12px] sm:py-[16px] md:py-[20px] lg:py-[24px] xl:py-[28px] relative rounded-[4px] shrink-0 w-full">
              <div className="flex items-center relative shrink-0">
                {mainImage ? (
                  <img alt={mainImageAlt} className="h-[70px] w-[120px] sm:h-[85px] sm:w-[150px] md:h-[102px] md:w-[180px] lg:h-[110px] lg:w-[200px] xl:h-[120px] xl:w-[220px] 2xl:h-[130px] 2xl:w-[240px] object-contain" src={mainImage} />
                ) : (
                  <p className="font-['Poppins'] font-normal text-white text-[12px] sm:text-[14px] text-center">No image</p>
                )}
              </div>
            </div>
            <div className="flex gap-[12px] sm:gap-[14px] md:gap-[16px] items-center justify-center relative shrink-0 w-full">
              <p className="capitalize font-['Poppins'] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] text-black text-center line-clamp-1 max-w-[85%]" dir="auto">
                {linkText}
              </p>
              <div className="relative shrink-0 size-[20px] sm:size-[22px] md:size-[24px] lg:size-[26px] xl:size-[28px]">
                <img alt="" className="block max-w-none size-full" src={imgArrowRight} />
              </div>
            </div>
          </div>
          {/* Sub Categories — only when present so card height matches peers */}
          {Array.isArray(subCategories) && subCategories.length > 0 ? (
            <div className="flex gap-[12px] sm:gap-[14px] md:gap-[16px] items-center relative shrink-0 w-full">
              {subCategories.map((sub, index) => (
                <div key={index} className="flex flex-[1_0_0] flex-col gap-[10px] sm:gap-[12px] md:gap-[14px] items-start justify-start min-h-px min-w-px relative shrink-0">
                  <div className="bg-[#0e1c47] flex flex-col items-start overflow-clip p-[12px] sm:p-[16px] md:p-[20px] relative rounded-[4px] shrink-0 w-full">
                    <div className="flex flex-col items-center justify-center relative shrink-0 w-full min-h-[90px] sm:min-h-[110px] md:min-h-[128px]">
                      {sub.image ? (
                        <img alt={sub.imageAlt} className="h-[90px] w-[60px] sm:h-[110px] sm:w-[75px] md:h-[128px] md:w-[86.116px] object-contain" src={sub.image} />
                      ) : (
                        <p className="font-['Poppins'] font-normal text-white text-[10px] sm:text-[12px] text-center">No image</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center relative shrink-0 w-full min-h-[50px] px-[2px]">
                    <p className="capitalize font-['Poppins'] font-medium leading-[1.25] not-italic relative text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] text-black text-center line-clamp-2 break-words w-full max-w-full overflow-hidden" dir="auto">
                      {sub.linkText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: imgShipping,
      title: "Fast Shipping",
      description: "Lightning-fast delivery"
    },
    {
      icon: imgPayment,
      title: "Instant Payment",
      description: "Secure and instant transactions"
    },
    {
      icon: imgExchange,
      title: "Exchange & Return",
      description: "Hassle-free easy exchanges"
    },
    {
      icon: imgCustomer,
      title: "Customer Service",
      description: "help you with anything"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#0f172a] py-[32px] sm:py-[40px] md:py-[48px] lg:py-[56px] xl:py-[64px] transition-colors duration-300" data-node-id="35:814">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-[20px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[32px] lg:px-[60px] xl:px-[100px] 2xl:px-[120px]">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col gap-[10px] sm:gap-[12px] md:gap-[14px] lg:gap-[16px] xl:gap-[18px] items-center p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px] xl:p-[20px] relative shrink-0 w-full sm:w-auto sm:flex-1 max-w-[280px] md:max-w-none">
            <div className="overflow-clip relative shrink-0 size-[36px] sm:size-[40px] md:size-[44px] lg:size-[48px] xl:size-[52px] 2xl:size-[56px]">
              <img alt={feature.title} className="block max-w-none size-full object-contain" src={feature.icon} />
            </div>
            <div className="flex flex-col gap-[6px] sm:gap-[8px] md:gap-[10px] lg:gap-[12px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-full">
              <p className="font-['Poppins'] font-semibold relative shrink-0 text-[#0f0f0f] dark:text-white text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] whitespace-nowrap transition-colors duration-300" dir="auto">
                {feature.title}
              </p>
              <p className="font-['Poppins'] font-normal relative shrink-0 text-[#666] dark:text-[#9ca3af] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] leading-[1.5] break-words w-full max-w-[200px] sm:max-w-none transition-colors duration-300" dir="auto">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [apiCategories, setApiCategories] = React.useState([]);
  const [apiCategoryProducts, setApiCategoryProducts] = React.useState({});
  const [sliders, setSliders] = React.useState([]);
  const [loadingHomeData, setLoadingHomeData] = React.useState(true);
  const [digitalPreview, setDigitalPreview] = React.useState([]);
  const [digitalPreviewLoading, setDigitalPreviewLoading] = React.useState(true);
  const { countryId } = useCountry();

  React.useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoadingHomeData(true);
        setDigitalPreviewLoading(true);
        const [categoriesList, slidersList, digitalListRes] = await Promise.all([
          getCategories(),
          getSliders(),
          getDigitalProducts({ countryId, page: 1, perPage: 8 }).catch(() => ({ items: [] })),
        ]);
        const digitalItems = Array.isArray(digitalListRes?.items) ? digitalListRes.items : [];

        const topCategories = categoriesList.slice(0, 3);
        const categoryProductPairs = await Promise.all(
          topCategories.map(async (category) => {
            const list = await getProducts({
              countryId,
              categoryId: category.id,
              perPage: 2,
              page: 1,
            });
            return [category.id, list];
          })
        );
        setApiCategories(topCategories);
        setApiCategoryProducts(Object.fromEntries(categoryProductPairs));
        setSliders(Array.isArray(slidersList) ? slidersList : []);
        setDigitalPreview(digitalItems);
      } catch {
        setApiCategories([]);
        setApiCategoryProducts({});
        setDigitalPreview([]);
        setSliders([]);
      } finally {
        setLoadingHomeData(false);
        setDigitalPreviewLoading(false);
      }
    };

    loadHomeData();
  }, [countryId]);

  const productCategories = React.useMemo(() => {
    const physical = apiCategories.map((category) => {
      const previews = apiCategoryProducts[category.id] || [];
      const mainPreview = previews[0];

      return {
        key: `cat-${category.id}`,
        title: category.name,
        mainImage: category.image || mainPreview?.image || '',
        mainImageAlt: category.name,
        linkText: category.name,
        linkTo: `/search?country_id=${countryId}&category_id=${category.id}`,
        subCategories: previews.length > 0
          ? previews.map((item) => ({
              image: item.image || '',
              imageAlt: item.name || `${category.name} item`,
              linkText: item.name || 'Product',
            }))
          : [],
      };
    });

    const firstDigital = digitalPreview[0];
    const hubPreviews = digitalPreview.length > 1 ? digitalPreview.slice(1, 3) : [];

    const digitalHub = {
      key: 'digital-products-hub',
      title: 'Digital products',
      mainImage: firstDigital?.image || '',
      mainImageAlt: 'Digital products',
      linkText: 'Browse digital',
      linkTo: '/digital-categories',
      subCategories: hubPreviews.map((item) => ({
        image: item.image || '',
        imageAlt: item.name || 'Digital product',
        linkText: item.name || 'Product',
      })),
    };

    return [...physical, digitalHub];
  }, [apiCategories, apiCategoryProducts, digitalPreview, countryId]);

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300" data-name="home" data-node-id="35:497">
      <div className="flex flex-col gap-[24px] sm:gap-[32px] md:gap-[40px] items-center relative w-full" data-node-id="35:498">
        {/* Hero Banner */}
        <div className="w-full" data-node-id="35:500">
          <HeroBanner sliders={sliders} />
        </div>

        {/* Product Categories Section */}
        <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] xl:gap-[36px] 2xl:gap-[40px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[60px] xl:px-[80px] 2xl:px-[100px]" data-node-id="35:561">
          <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
            <p className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-white text-[22px] sm:text-[26px]">Top Categories</p>
          </div>
          {/* First Row */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto" data-node-id="35:9481">
            {loadingHomeData ? (
              <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[16px] py-[20px]">Loading categories...</p>
            ) : productCategories.length > 0 ? (
              productCategories.map(({ key, ...category }) => (
                <ProductCategoryCard key={key} {...category} linkTo={category.linkTo} />
              ))
            ) : (
              <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[16px] py-[20px]">No categories available.</p>
            )}
          </div>
        </div>

        {(digitalPreviewLoading || digitalPreview.length > 0) && (
          <section
            className="w-full relative border-t border-[#e2e8f0] dark:border-[#1e293b] bg-gradient-to-b from-[#f1f5f9] via-white to-[#f8fafc] dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0c1322] py-[28px] sm:py-[36px] md:py-[44px] transition-colors duration-300"
            aria-labelledby="home-digital-heading"
          >
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#eea137] to-transparent opacity-90"
              aria-hidden
            />
            <div className="flex flex-col gap-[18px] sm:gap-[22px] items-stretch w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[60px] xl:px-[80px] 2xl:px-[100px]">
              <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[16px]">
                <div className="flex gap-[12px] items-start max-w-[640px]">
                  <span className="w-[5px] min-h-[48px] sm:min-h-[52px] bg-[#eea137] rounded-[3px] shrink-0 mt-[4px]" aria-hidden />
                  <div>
                    <div className="flex flex-wrap items-center gap-[8px] gap-y-[6px] mb-[6px]">
                      <h2
                        id="home-digital-heading"
                        className="font-['Poppins'] font-bold text-[#0e1c47] dark:text-white text-[22px] sm:text-[26px] md:text-[28px] leading-tight tracking-tight"
                      >
                        Digital products
                      </h2>
                      <span className="font-['Poppins'] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] px-[10px] py-[4px] rounded-full bg-[#0e1c47] dark:bg-[#eea137] text-white dark:text-[#0e1c47]">
                        No cart
                      </span>
                      <span className="font-['Poppins'] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] px-[10px] py-[4px] rounded-full border border-[#cbd5e1] dark:border-[#475569] text-[#475569] dark:text-[#94a3b8]">
                        Direct order
                      </span>
                    </div>
                    <p className="font-['Poppins'] text-[13px] sm:text-[15px] text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
                      Gift cards and digital codes — delivered digitally. Complete your profile, then order on the product page (separate from regular checkout).
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-[10px] shrink-0">
                  <Link
                    to="/digital-categories"
                    className="font-['Poppins'] font-semibold text-[14px] inline-flex items-center justify-center px-[18px] py-[11px] rounded-[8px] border-2 border-[#0e1c47] dark:border-[#94a3b8] text-[#0e1c47] dark:text-white hover:bg-[#0e1c47] hover:text-white dark:hover:bg-[#334155] transition-colors"
                  >
                    By category
                  </Link>
                  <Link
                    to="/digital-products"
                    className="font-['Poppins'] font-semibold text-[14px] inline-flex items-center justify-center gap-[8px] px-[20px] py-[11px] rounded-[8px] bg-[#0e1c47] dark:bg-[#eea137] text-white dark:text-[#0e1c47] hover:opacity-90 transition-opacity shadow-md"
                  >
                    Browse all digital
                    <img alt="" className="size-[16px] brightness-0 invert dark:brightness-0 dark:invert-0 rotate-[-90deg]" src={imgArrowRight} />
                  </Link>
                </div>
              </div>

              <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
                {digitalPreviewLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[14px] sm:gap-[18px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-[12px] border border-[#e2e8f0] dark:border-[#334155] bg-white/60 dark:bg-[#1e293b]/50 overflow-hidden animate-pulse"
                      >
                        <div className="aspect-[4/3] bg-[#e2e8f0] dark:bg-[#334155]" />
                        <div className="p-4 space-y-2">
                          <div className="h-3 bg-[#e2e8f0] dark:bg-[#334155] rounded w-4/5" />
                          <div className="h-3 bg-[#e2e8f0] dark:bg-[#334155] rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[14px] sm:gap-[18px] md:gap-[22px]">
                    {digitalPreview.map((item) => (
                      <Link
                        key={item.id}
                        to={`/digital-product/${item.id}`}
                        className="group relative flex flex-col overflow-hidden rounded-[12px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-[0_2px_14px_rgba(14,28,71,0.07)] hover:shadow-[0_14px_32px_rgba(14,28,71,0.14)] hover:border-[#eea137]/45 dark:hover:border-[#eea137]/50 transition-all duration-300 hover:-translate-y-[3px]"
                      >
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#eef2f9] via-[#f8fafc] to-[#e8edf5] dark:from-[#1a2744] dark:via-[#1e293b] dark:to-[#0f172a]">
                          <span className="absolute top-[10px] left-[10px] z-[1] font-['Poppins'] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-[8px] py-[3px] rounded-[6px] bg-[#0e1c47]/92 text-white shadow-sm">
                            Digital
                          </span>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="absolute inset-0 w-full h-full object-contain p-[12px] sm:p-[14px] group-hover:scale-[1.04] transition-transform duration-300 ease-out"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center p-[16px]">
                              <span className="font-['Poppins'] text-[11px] text-[#94a3b8] text-center">No image</span>
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/[0.06] to-transparent dark:from-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex flex-col flex-1 p-[12px] sm:p-[14px] gap-[8px] min-h-0">
                          <p className="font-['Poppins'] font-semibold text-[#0f172a] dark:text-white text-[12px] sm:text-[13px] leading-snug line-clamp-2 min-h-[2.5rem]">
                            {item.name}
                          </p>
                          {item.merchantName ? (
                            <p className="font-['Poppins'] text-[11px] text-[#64748b] dark:text-[#94a3b8] line-clamp-1">
                              {item.merchantName}
                            </p>
                          ) : null}
                          <div className="mt-auto flex items-end justify-between gap-[8px] pt-[4px] border-t border-[#f1f5f9] dark:border-[#334155]">
                            <p className="font-['Poppins'] font-bold text-[#059669] dark:text-[#34d399] text-[15px] sm:text-[16px] tabular-nums">
                              {item.priceFormatted}
                            </p>
                            <span className="font-['Poppins'] font-semibold text-[11px] sm:text-[12px] text-[#0e1c47] dark:text-[#eea137] inline-flex items-center gap-[4px] shrink-0 group-hover:gap-[6px] transition-all">
                              Order
                              <img
                                alt=""
                                className="size-[14px] rotate-[-90deg] opacity-80 group-hover:translate-x-[2px] transition-transform"
                                src={imgArrowRight}
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto lg:px-[100px] xl:px-[120px] 2xl:px-[140px] md:px-[60px] sm:px-[40px] px-[12px] py-[24px] sm:py-[32px] md:py-[40px] lg:py-[48px] xl:py-[56px] 2xl:py-[64px]" data-node-id="35:814">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
