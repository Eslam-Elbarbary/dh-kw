// Home page component - exact Figma implementation
// Based on node 35:497

import React from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts, getSliders, getVendors, resolveCountryId } from '../services/catalog.service';

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
import blogImage from '../assets/335d3b72fbbc6db1573cca89bf153f548926e796.jpg';
import heroBackgroundImage from '../assets/Frame 1984079875 (1).png';

// Hero Banner Assets - using the provided hero background image
const imgHeroBackground = heroBackgroundImage;

// Product Category Assets
const img69694768AmazonEchoPngClipartTransparentAmazonEchoPng1 = productImage1;
const imgSleekBlackTabletModernDigitalDevice1 = productImage2;
const imgElectronicCollectionComputerMotherboardWithCpuCooler1 = productImage3;
const imgLaptopTabletPcTvMobilePhone3D1 = productImage4;
const imgArrowRight = arrowRightIcon;

// Blogs Assets
const imgBlogImage = blogImage;
// Arrow circle icons - using ArrowRight with circle styling
const imgArrowCircleRight = "data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15' fill='none' stroke='%23ccc' stroke-width='2'/%3E%3Cpath d='M12 10l6 6-6 6' stroke='%23ccc' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";
const imgArrowCircleRightActive = "data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23eea137' stroke='%23eea137' stroke-width='2'/%3E%3Cpath d='M12 10l6 6-6 6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";
const imgArrowRightSmall = arrowRightIcon;

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
          {/* Sub Categories */}
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
        </div>
      </div>
    </Link>
  );
}

// Blogs Section Component with Carousel
function BlogsSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  
  const blogs = [
    { id: 1, title: "Bose Sport Earbuds Wireless Earphones", date: "3 days age" },
    { id: 2, title: "Bose Sport Earbuds Wireless Earphones", date: "3 days age" },
    { id: 3, title: "Bose Sport Earbuds Wireless Earphones", date: "3 days age" },
  ];

  // Determine how many blogs to show based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1536) return 4; // 2xl: 4 blogs
      if (window.innerWidth >= 1280) return 4; // xl: 4 blogs
      if (window.innerWidth >= 1024) return 3; // lg: 3 blogs
      if (window.innerWidth >= 640) return 2;  // sm: 2 blogs
      return 1; // mobile: 1 blog
    }
    return 1;
  };

  const [visibleCount, setVisibleCount] = React.useState(getVisibleCount());

  React.useEffect(() => {
    const handleResize = () => {
      const newVisibleCount = getVisibleCount();
      setVisibleCount(newVisibleCount);
      const newMaxIndex = Math.max(0, blogs.length - newVisibleCount);
      setCurrentIndex((prev) => Math.min(prev, newMaxIndex)); // Adjust index if needed
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [blogs.length]);

  const maxIndex = Math.max(0, blogs.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canGoNext) {
      nextSlide();
    }
    if (isRightSwipe && canGoPrev) {
      prevSlide();
    }
  };

  return (
    <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] xl:gap-[36px] 2xl:gap-[40px] items-center justify-center relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[40px] lg:px-[60px] xl:px-[100px] 2xl:px-[120px]" data-node-id="35:772">
      <div className="flex items-start justify-between relative shrink-0 w-full">
        <div className="flex gap-[6px] sm:gap-[8px] items-center relative shrink-0">
          <div className="h-[32px] sm:h-[36px] md:h-[40px] relative shrink-0 w-[8px] sm:w-[9px] md:w-[10px]">
            <div className="absolute bg-[#eea137] inset-0 rounded-[4px]" />
          </div>
          <p className="capitalize font-['Poppins'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#eea137] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[26px]">
            blogs
          </p>
        </div>
        <div className="flex gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] items-start relative shrink-0">
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`flex items-center justify-center relative shrink-0 cursor-pointer transition-opacity ${
              !canGoPrev ? 'opacity-20 cursor-not-allowed' : 'opacity-100 hover:opacity-80'
            }`}
            aria-label="Previous blog"
          >
            <div className="flex-none rotate-[180deg] scale-y-[-100%]">
              <div className="relative size-[24px] sm:size-[28px] md:size-[32px]">
                <img alt="" className="block max-w-none size-full" src={imgArrowCircleRight} />
              </div>
            </div>
          </button>
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`relative shrink-0 size-[24px] sm:size-[28px] md:size-[32px] cursor-pointer transition-opacity ${
              !canGoNext ? 'opacity-20 cursor-not-allowed' : 'opacity-100 hover:opacity-80'
            }`}
            aria-label="Next blog"
          >
            <img alt="" className="block max-w-none size-full" src={imgArrowCircleRightActive} />
          </button>
        </div>
      </div>
      
      {/* Carousel Container */}
      <div 
        className="relative w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out gap-[12px] sm:gap-[8px]"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border-[#e4e7e9] border-[0.928px] border-solid flex flex-col gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] items-center justify-center overflow-hidden px-[10px] sm:px-[12px] md:px-[14px] lg:px-[16px] py-[12px] sm:py-[16px] md:py-[20px] lg:py-[24px] relative rounded-[3.713px] shrink-0"
              style={{
                width: `${100 / visibleCount}%`,
                minWidth: `${100 / visibleCount}%`,
              }}
            >
              <div className="h-[140px] sm:h-[160px] md:h-[174px] relative rounded-[4px] shrink-0 w-full">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgBlogImage} />
              </div>
              <div className="flex flex-col gap-[6px] sm:gap-[7px] md:gap-[7.425px] items-start relative shrink-0 w-full">
                <p className="font-['Poppins'] font-normal leading-[18.563px] not-italic relative shrink-0 text-[#191c1f] text-[12px] sm:text-[13px] md:text-[14px] w-full whitespace-pre-wrap">
                  {blog.title}
                </p>
                <div className="flex items-center justify-between relative shrink-0 w-full">
                  <div className="flex gap-[3px] sm:gap-[3.5px] md:gap-[3.713px] items-start relative shrink-0">
                    <p className="font-['Poppins'] font-semibold leading-[18.563px] not-italic relative shrink-0 text-[#0e1c47] text-[12px] sm:text-[13px] md:text-[14px]">
                      read more
                    </p>
                    <div className="relative shrink-0 size-[16px] sm:size-[17px] md:size-[18px]">
                      <img alt="" className="block max-w-none size-full" src={imgArrowRightSmall} />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-medium leading-[18.563px] not-italic relative shrink-0 text-[#999] text-[10px] sm:text-[11px] md:text-[12px] text-right" dir="auto">
                    {blog.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/" className="flex gap-[8px] items-center px-0 py-[6px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
        <p className="capitalize font-['Poppins'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#0e1c47] text-[14px]">
          Browse All blogs
        </p>
        <div className="relative shrink-0 size-[18px]">
          <img alt="" className="block max-w-none size-full" src={imgArrowRightSmall} />
        </div>
      </Link>
    </div>
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
  const [apiVendors, setApiVendors] = React.useState([]);
  const [apiVendorProducts, setApiVendorProducts] = React.useState({});
  const [sliders, setSliders] = React.useState([]);
  const [loadingHomeData, setLoadingHomeData] = React.useState(true);
  const countryId = React.useMemo(() => resolveCountryId(1), []);

  React.useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoadingHomeData(true);
        const [categoriesList, vendorsList, slidersList] = await Promise.all([
          getCategories(),
          getVendors(),
          getSliders(),
        ]);
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
        const topVendors = vendorsList.slice(0, 3);
        const vendorProductPairs = await Promise.all(
          topVendors.map(async (vendor) => {
            const list = await getProducts({
              countryId,
              vendorId: vendor.id,
              perPage: 2,
              page: 1,
            });
            return [vendor.id, list];
          })
        );
        setApiCategories(topCategories);
        setApiCategoryProducts(Object.fromEntries(categoryProductPairs));
        setApiVendors(topVendors);
        setApiVendorProducts(Object.fromEntries(vendorProductPairs));
        setSliders(Array.isArray(slidersList) ? slidersList : []);
      } catch {
        setApiCategories([]);
        setApiCategoryProducts({});
        setApiVendors([]);
        setApiVendorProducts({});
        setSliders([]);
      } finally {
        setLoadingHomeData(false);
      }
    };

    loadHomeData();
  }, [countryId]);

  const productCategories = apiCategories.map((category) => {
      const previews = apiCategoryProducts[category.id] || [];
      const mainPreview = previews[0];

      return {
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

  const vendorCards = apiVendors.map((vendor) => {
    const previews = apiVendorProducts[vendor.id] || [];
    const mainPreview = previews[0];

    return {
      title: vendor.name,
      mainImage: vendor.image || mainPreview?.image || '',
      mainImageAlt: vendor.name,
      linkText: `Shop ${vendor.name}`,
      linkTo: `/search?country_id=${countryId}&vendor_id=${vendor.id}`,
      subCategories: previews.length > 0
        ? previews.map((item) => ({
            image: item.image || '',
            imageAlt: item.name || `${vendor.name} product`,
            linkText: item.name || 'Product',
          }))
        : [],
    };
  });

  return (
    <div className="bg-white relative w-full min-h-screen" data-name="home" data-node-id="35:497">
      <div className="flex flex-col gap-[24px] sm:gap-[32px] md:gap-[40px] items-center relative w-full" data-node-id="35:498">
        {/* Hero Banner */}
        <div className="w-full" data-node-id="35:500">
          <HeroBanner sliders={sliders} />
        </div>

        {/* Product Categories Section */}
        <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] xl:gap-[36px] 2xl:gap-[40px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[60px] xl:px-[80px] 2xl:px-[100px]" data-node-id="35:561">
          <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
            <p className="font-['Poppins'] font-semibold text-[#0e1c47] text-[22px] sm:text-[26px]">Top Categories</p>
          </div>
          {/* First Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto" data-node-id="35:9481">
            {loadingHomeData ? (
              <p className="font-['Poppins'] font-normal text-[#666] text-[16px] py-[20px]">Loading categories...</p>
            ) : productCategories.length > 0 ? (
              productCategories.map((category, index) => (
                <ProductCategoryCard key={index} {...category} linkTo={category.linkTo} />
              ))
            ) : (
              <p className="font-['Poppins'] font-normal text-[#666] text-[16px] py-[20px]">No categories available.</p>
            )}
          </div>

          <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
            <p className="font-['Poppins'] font-semibold text-[#0e1c47] text-[22px] sm:text-[26px]">Top Vendors</p>
          </div>
          {/* Second Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto" data-node-id="35:9604">
            {loadingHomeData ? (
              <p className="font-['Poppins'] font-normal text-[#666] text-[16px] py-[20px]">Loading vendors...</p>
            ) : vendorCards.length > 0 ? (
              vendorCards.map((vendor, index) => (
                <ProductCategoryCard key={index} {...vendor} linkTo={vendor.linkTo} />
              ))
            ) : (
              <p className="font-['Poppins'] font-normal text-[#666] text-[16px] py-[20px]">No vendors available.</p>
            )}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="flex flex-col gap-[24px] sm:gap-[28px] md:gap-[32px] lg:gap-[36px] xl:gap-[40px] 2xl:gap-[44px] items-center relative w-full  py-[24px] sm:py-[32px] md:py-[40px] lg:py-[48px] xl:py-[56px] 2xl:py-[64px]">
          <BlogsSection />
        </div>

        {/* Features Section */}
        <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto lg:px-[100px] xl:px-[120px] 2xl:px-[140px] md:px-[60px] sm:px-[40px] px-[12px] py-[24px] sm:py-[32px] md:py-[40px] lg:py-[48px] xl:py-[56px] 2xl:py-[64px]" data-node-id="35:814">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
