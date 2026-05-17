// Home page component - exact Figma implementation
// Based on node 35:497

import React from 'react';
import { Link } from 'react-router-dom';
import { getTopLevelCategories, getSliders } from '../services/catalog.service';
import { useCountry } from '../context/CountryContext';
import { getDigitalCategories } from '../services/digitalProducts.service';

// Import assets
import truckDeliveryIcon from '../assets/truck-delivery.svg';
import creditCardIcon from '../assets/CreditCard.svg';
import deliveryReturnIcon from '../assets/delivery-return-01.svg';
import customerSupportIcon from '../assets/customer-support.svg';

import heroBackgroundImage from '../assets/Frame 1984079875 (1).png';

const imgHeroBackground = heroBackgroundImage;

const SUB_CATEGORY_TILE_BACKGROUNDS = [
  'bg-[#eef4fc]',
  'bg-[#f0faf4]',
  'bg-[#fff8ed]',
  'bg-[#f5f0ff]',
];

const MAX_SUB_CATEGORIES = 4;

// Features Assets
const imgShipping = truckDeliveryIcon;
const imgPayment = creditCardIcon;
const imgExchange = deliveryReturnIcon;
const imgCustomer = customerSupportIcon;

const buildPhysicalSubCategories = (category, countryId) => {
  const children = Array.isArray(category.children) ? category.children : [];
  const fromChildren = children.slice(0, MAX_SUB_CATEGORIES).map((child) => ({
    title: child.name,
    image: child.image || '',
    imageAlt: child.name,
    linkTo: `/search?country_id=${countryId}&category_id=${child.id}`,
  }));

  if (fromChildren.length > 0) return fromChildren;

  if (category.image) {
    return [{
      title: category.name,
      image: category.image,
      imageAlt: category.name,
      linkTo: `/search?country_id=${countryId}&category_id=${category.id}`,
    }];
  }

  return [];
};

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

function SubCategoryTile({ title, image, imageAlt, linkTo, variant = 'grid', accentIndex = 0 }) {
  const isSingle = variant === 'single';
  const isLarge = variant === 'large';
  const tileBg = SUB_CATEGORY_TILE_BACKGROUNDS[accentIndex % SUB_CATEGORY_TILE_BACKGROUNDS.length];

  return (
    <Link
      to={linkTo}
      className={`group flex flex-col min-w-0 ${
        isSingle ? 'flex-1 min-h-0 gap-[10px] sm:gap-[12px]' : `gap-[8px] sm:gap-[10px] ${isLarge ? 'col-span-2' : ''}`
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-[4px] ${tileBg} dark:bg-[#1e293b] flex items-center justify-center transition-shadow duration-200 group-hover:shadow-md ${
          isSingle
            ? 'flex-1 min-h-[180px] sm:min-h-[200px] md:min-h-[220px]'
            : isLarge
              ? 'aspect-[2.1/1] min-h-[120px] sm:min-h-[140px]'
              : 'aspect-square min-h-[88px] sm:min-h-[100px]'
        }`}
      >
        {image ? (
          <img
            alt={imageAlt || title}
            className={`object-contain transition-transform duration-200 group-hover:scale-[1.03] ${
              isSingle
                ? 'max-h-[min(92%,280px)] max-w-[min(92%,100%)] w-auto h-auto p-[14px] sm:p-[18px] md:p-[22px]'
                : `p-[10px] sm:p-[12px] ${isLarge ? 'max-h-[85%] max-w-[75%]' : 'max-h-[78%] max-w-[78%]'}`
            }`}
            src={image}
            loading="lazy"
          />
        ) : (
          <span className="font-['Poppins'] text-[11px] sm:text-[12px] text-[#94a3b8] dark:text-[#64748b] px-[8px] text-center">
            No image
          </span>
        )}
      </div>
      <p
        className={`font-['Poppins'] font-normal text-[12px] sm:text-[13px] leading-[1.35] text-[#0f0f0f] dark:text-[#e2e8f0] text-center line-clamp-2 px-[2px] shrink-0 ${
          isSingle ? 'min-h-[2rem]' : 'min-h-[2.5rem]'
        }`}
        dir="auto"
      >
        {title}
      </p>
    </Link>
  );
}

function SubCategoryLayout({ subCategories }) {
  const items = subCategories.slice(0, MAX_SUB_CATEGORIES);
  const count = items.length;

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="flex flex-1 flex-col min-h-0 w-full">
        <SubCategoryTile {...items[0]} variant="single" accentIndex={0} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex flex-col gap-[10px] sm:gap-[12px]">
        {items.map((item, index) => (
          <SubCategoryTile key={item.linkTo || index} {...item} variant="large" accentIndex={index} />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex flex-col gap-[10px] sm:gap-[12px]">
        <SubCategoryTile {...items[0]} variant="large" accentIndex={0} />
        <div className="grid grid-cols-2 gap-[10px] sm:gap-[12px]">
          {items.slice(1).map((item, index) => (
            <SubCategoryTile key={item.linkTo || index} {...item} variant="grid" accentIndex={index + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[10px] sm:gap-[12px]">
      {items.map((item, index) => (
        <SubCategoryTile key={item.linkTo || index} {...item} variant="grid" accentIndex={index} />
      ))}
    </div>
  );
}

function ProductCategoryCard({ title, subCategories, linkTo = '/' }) {
  const visibleSubs = Array.isArray(subCategories) ? subCategories.slice(0, MAX_SUB_CATEGORIES) : [];

  return (
    <article className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] flex flex-col h-full overflow-hidden p-[14px] sm:p-[16px] md:p-[18px] rounded-[8px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(14,28,71,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-shadow duration-300">
      <Link
        to={linkTo}
        className="font-['Poppins'] font-semibold text-[#0f0f0f] dark:text-white text-[16px] sm:text-[17px] md:text-[18px] leading-tight line-clamp-2 mb-[12px] sm:mb-[14px] hover:text-[#0e1c47] dark:hover:text-[#eea137] transition-colors"
        dir="auto"
      >
        {title}
      </Link>
      <div className={`flex flex-col min-h-0 ${visibleSubs.length === 1 ? 'flex-1' : ''}`}>
        <SubCategoryLayout subCategories={visibleSubs} />
      </div>
    </article>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] rounded-[8px] p-[16px] animate-pulse h-full min-h-[280px]">
      <div className="h-5 bg-[#e8e8e8] dark:bg-[#334155] rounded w-2/3 mb-4" />
      <div className="h-[140px] bg-[#f0f0f0] dark:bg-[#334155] rounded mb-3" />
      <div className="grid grid-cols-2 gap-3">
        <div className="aspect-square bg-[#f0f0f0] dark:bg-[#334155] rounded" />
        <div className="aspect-square bg-[#f0f0f0] dark:bg-[#334155] rounded" />
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: imgShipping,
      title: 'Fast Shipping',
      description: 'Lightning-fast delivery',
    },
    {
      icon: imgPayment,
      title: 'Instant Payment',
      description: 'Secure and instant transactions',
    },
    {
      icon: imgExchange,
      title: 'Exchange & Return',
      description: 'Hassle-free easy exchanges',
    },
    {
      icon: imgCustomer,
      title: 'Customer Service',
      description: 'help you with anything',
    },
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
  const [digitalCategories, setDigitalCategories] = React.useState([]);
  const [sliders, setSliders] = React.useState([]);
  const [loadingHomeData, setLoadingHomeData] = React.useState(true);
  const { countryId } = useCountry();

  React.useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoadingHomeData(true);
        const [categoriesList, slidersList, digitalCats] = await Promise.all([
          getTopLevelCategories(),
          getSliders(),
          getDigitalCategories({ countryId }).catch(() => []),
        ]);

        setApiCategories(categoriesList);
        setDigitalCategories(Array.isArray(digitalCats) ? digitalCats : []);
        setSliders(Array.isArray(slidersList) ? slidersList : []);
      } catch {
        setApiCategories([]);
        setDigitalCategories([]);
        setSliders([]);
      } finally {
        setLoadingHomeData(false);
      }
    };

    loadHomeData();
  }, [countryId]);

  const productCategories = React.useMemo(() => {
    const physical = apiCategories.map((category) => ({
      key: `cat-${category.id}`,
      title: category.name,
      linkTo: `/search?country_id=${countryId}&category_id=${category.id}`,
      subCategories: buildPhysicalSubCategories(category, countryId),
    }));

    const digitalSubs = digitalCategories.slice(0, MAX_SUB_CATEGORIES).map((cat) => ({
      title: cat.name,
      image: cat.image || '',
      imageAlt: cat.name,
      linkTo: `/digital-category/${cat.id}`,
    }));

    const digitalHub = {
      key: 'digital-products-hub',
      title: 'Digital products',
      linkTo: '/digital-categories',
      subCategories: digitalSubs,
    };

    return [...physical, digitalHub];
  }, [apiCategories, digitalCategories, countryId]);

  return (
    <div className="bg-white dark:bg-[#0f172a] relative w-full min-h-screen transition-colors duration-300" data-name="home" data-node-id="35:497">
      <div className="flex flex-col gap-[24px] sm:gap-[32px] md:gap-[40px] items-center relative w-full" data-node-id="35:498">
        {/* Hero Banner */}
        <div className="w-full" data-node-id="35:500">
          <HeroBanner sliders={sliders} />
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] xl:gap-[36px] 2xl:gap-[40px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[60px] xl:px-[80px] 2xl:px-[100px]" data-node-id="35:561">
          <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
            <p className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-white text-[22px] sm:text-[26px]">
              Shop by category
            </p>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto"
            data-node-id="35:9481"
          >
            {loadingHomeData ? (
              Array.from({ length: 8 }).map((_, i) => <CategoryCardSkeleton key={i} />)
            ) : productCategories.length > 0 ? (
              productCategories.map(({ key, ...category }) => (
                <ProductCategoryCard key={key} {...category} linkTo={category.linkTo} />
              ))
            ) : (
              <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[16px] py-[20px] col-span-full text-center">
                No categories available.
              </p>
            )}
          </div>
        </div>


        {/* Features Section */}
        <div className="w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto lg:px-[100px] xl:px-[120px] 2xl:px-[140px] md:px-[60px] sm:px-[40px] px-[12px] py-[24px] sm:py-[32px] md:py-[40px] lg:py-[48px] xl:py-[56px] 2xl:py-[64px]" data-node-id="35:814">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
