// Home page component - exact Figma implementation
// Based on node 35:497

import React from 'react';
import { Link } from 'react-router-dom';

// Hero Banner Assets
const imgHeroBackground = "https://www.figma.com/api/mcp/asset/13ca6eee-fe0a-48f0-b246-80f0d10fd5ba";

// Product Category Assets
const img69694768AmazonEchoPngClipartTransparentAmazonEchoPng1 = "https://www.figma.com/api/mcp/asset/aea29c88-6458-4770-b05d-bd68b90e2cf6";
const imgSleekBlackTabletModernDigitalDevice1 = "https://www.figma.com/api/mcp/asset/0f137156-61d8-4c8a-8fb2-027462891154";
const imgElectronicCollectionComputerMotherboardWithCpuCooler1 = "https://www.figma.com/api/mcp/asset/ce0bdc1e-3f9b-471b-aad7-a36b113a7c3a";
const imgLaptopTabletPcTvMobilePhone3D1 = "https://www.figma.com/api/mcp/asset/ee4a5d62-9f8a-4d33-a358-56c270b0cc0e";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/c993c6e9-76bd-4fc1-8f76-8c9f70ebc1a0";

// Blogs Assets
const imgBlogImage = "https://www.figma.com/api/mcp/asset/8ce67e9d-6089-4556-b33c-5af5c62e8eb6";
const imgArrowCircleRight = "https://www.figma.com/api/mcp/asset/308c1800-b9a5-4ba0-8662-74b785f8a2ba";
const imgArrowCircleRightActive = "https://www.figma.com/api/mcp/asset/fcb02329-047e-40c1-8c02-8dbd43c626c4";
const imgArrowRightSmall = "https://www.figma.com/api/mcp/asset/d72436df-62de-4301-9262-34ead329d65a";

// Features Assets
const imgShipping = "https://www.figma.com/api/mcp/asset/cc0bd904-724b-48d2-bcf5-3ff820bb8506";
const imgPayment = "https://www.figma.com/api/mcp/asset/9d5f2920-31dd-4365-9eff-5affe1c4552b";
const imgExchange = "https://www.figma.com/api/mcp/asset/9b3894d9-7d19-41b2-8c0a-849488cf50c6";
const imgCustomer = "https://www.figma.com/api/mcp/asset/541fca88-180f-4ff9-8d8d-a97a3de8fa6e";

// Hero Banner Component
function HeroBanner() {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[499px] lg:h-[550px] xl:h-[600px] 2xl:h-[650px]" data-node-id="35:560">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden">
          <img className="absolute h-[152.5%] left-[-9.55%] max-w-none top-[-25.77%] w-[118.93%]" alt="" src={imgHeroBackground} />
        </div>
        <div className="absolute bg-gradient-to-t from-[rgba(0,101,176,0)] inset-0 to-[rgba(0,101,176,0.2)]" />
      </div>
    </div>
  );
}

// Product Category Card Component
function ProductCategoryCard({ title, mainImage, mainImageAlt, linkText, subCategories, linkTo = "/" }) {
  return (
    <Link to={linkTo} className="bg-white border border-[#e6e6e6] border-solid flex items-center overflow-hidden p-[10px] sm:p-[12px] md:p-[16px] lg:p-[20px] xl:p-[24px] 2xl:p-[28px] relative rounded-[4px] shrink-0 w-full max-w-full sm:max-w-[368px] lg:max-w-[380px] xl:max-w-[400px] 2xl:max-w-[420px] cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-center relative shrink-0 w-full">
        <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[18px] sm:text-[20px] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] text-black text-center" dir="auto">
          {title}
        </p>
        <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start relative shrink-0 w-full">
          {/* Main Category */}
          <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start relative shrink-0 w-full">
            <div className="bg-[#0e1c47] flex flex-col h-[120px] sm:h-[140px] md:h-[168px] lg:h-[180px] xl:h-[200px] 2xl:h-[220px] items-center justify-center overflow-clip px-[40px] sm:px-[50px] md:px-[67px] lg:px-[75px] xl:px-[85px] 2xl:px-[95px] py-[12px] sm:py-[16px] md:py-[20px] lg:py-[24px] xl:py-[28px] relative rounded-[4px] shrink-0 w-full">
              <div className="flex items-center relative shrink-0">
                <img alt={mainImageAlt} className="h-[70px] w-[120px] sm:h-[85px] sm:w-[150px] md:h-[102px] md:w-[180px] lg:h-[110px] lg:w-[200px] xl:h-[120px] xl:w-[220px] 2xl:h-[130px] 2xl:w-[240px] object-contain" src={mainImage} />
              </div>
            </div>
            <div className="flex gap-[12px] sm:gap-[14px] md:gap-[16px] items-center justify-center relative shrink-0 w-full">
              <p className="capitalize font-['Poppins'] font-medium leading-[normal] not-italic relative shrink-0 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] text-black text-center" dir="auto">
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
              <div key={index} className="flex flex-[1_0_0] flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start justify-center min-h-px min-w-px relative shrink-0">
                <div className="bg-[#0e1c47] flex flex-col items-start overflow-clip p-[12px] sm:p-[16px] md:p-[20px] relative rounded-[4px] shrink-0 w-full">
                  <div className="flex flex-col items-center justify-center relative shrink-0 w-full">
                    <img alt={sub.imageAlt} className="h-[90px] w-[60px] sm:h-[110px] sm:w-[75px] md:h-[128px] md:w-[86.116px] object-contain" src={sub.image} />
                  </div>
                </div>
                <div className="flex gap-[12px] sm:gap-[14px] md:gap-[16px] items-center justify-center relative shrink-0 w-full">
                  <p className="capitalize font-['Poppins'] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[24px] text-black text-center" dir="auto">
                    {sub.linkText}
                  </p>
                  <div className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[24px] lg:size-[26px] xl:size-[28px]">
                    <img alt="" className="block max-w-none size-full" src={imgArrowRight} />
                  </div>
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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-[24px] sm:gap-[20px] md:gap-[24px] lg:gap-[28px] xl:gap-[32px] 2xl:gap-[36px] lg:justify-between relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[40px] lg:px-[60px] xl:px-[100px] 2xl:px-[120px]" data-node-id="35:814">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] items-center p-[8px] sm:p-[12px] lg:p-[16px] xl:p-[20px] relative shrink-0 w-full sm:w-auto sm:flex-1">
          <div className="overflow-clip relative shrink-0 size-[40px] sm:size-[44px] md:size-[48px] lg:size-[52px] xl:size-[56px] 2xl:size-[60px]">
            <img alt="" className="block max-w-none size-full object-contain" src={feature.icon} />
          </div>
          <div className="flex flex-col gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[14px] xl:gap-[16px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-center w-full">
            <p className="font-['Poppins'] font-medium relative shrink-0 text-[#0f0f0f] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[26px] whitespace-nowrap" dir="auto">
              {feature.title}
            </p>
            <p className="font-['Poppins'] font-normal relative shrink-0 text-[#666] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[20px] leading-[1.4] break-words w-full" dir="auto">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const productCategories = [
    {
      title: "Digital E-Cards",
      mainImage: img69694768AmazonEchoPngClipartTransparentAmazonEchoPng1,
      mainImageAlt: "Digital E-Cards",
      linkText: "Digital E-Cards",
      linkTo: "/digital-e-cards",
      subCategories: [
        { image: imgSleekBlackTabletModernDigitalDevice1, imageAlt: "Tablet", linkText: "tablets" },
        { image: imgSleekBlackTabletModernDigitalDevice1, imageAlt: "Tablet", linkText: "tablets" }
      ]
    },
    {
      title: "PC Components",
      mainImage: imgElectronicCollectionComputerMotherboardWithCpuCooler1,
      mainImageAlt: "PC Components",
      linkText: "PC Components",
      linkTo: "/",
      subCategories: [
        { image: imgSleekBlackTabletModernDigitalDevice1, imageAlt: "Tablet", linkText: "tablets" },
        { image: imgSleekBlackTabletModernDigitalDevice1, imageAlt: "Tablet", linkText: "tablets" }
      ]
    },
    {
      title: "mobiles & tablets",
      mainImage: imgLaptopTabletPcTvMobilePhone3D1,
      mainImageAlt: "Mobiles & Tablets",
      linkText: "Digital E-Cards",
      linkTo: "/digital-e-cards",
      subCategories: [
        { image: imgSleekBlackTabletModernDigitalDevice1, imageAlt: "Tablet", linkText: "tablets" },
        { image: imgSleekBlackTabletModernDigitalDevice1, imageAlt: "Tablet", linkText: "tablets" }
      ]
    }
  ];

  return (
    <div className="bg-white relative w-full min-h-screen" data-name="home" data-node-id="35:497">
      <div className="flex flex-col gap-[24px] sm:gap-[32px] md:gap-[40px] items-center relative w-full" data-node-id="35:498">
        {/* Hero Banner */}
        <div className="w-full" data-node-id="35:500">
          <HeroBanner />
        </div>

        {/* Product Categories Section */}
        <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] xl:gap-[36px] 2xl:gap-[40px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-node-id="35:561">
          {/* First Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto lg:px-[100px] xl:px-[120px] 2xl:px-[140px] md:px-[60px] sm:px-[40px] px-[12px]" data-node-id="35:9481">
            {productCategories.map((category, index) => (
              <ProductCategoryCard key={index} {...category} linkTo={category.linkTo} />
            ))}
          </div>

          {/* Second Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto lg:px-[100px] xl:px-[120px] 2xl:px-[140px] md:px-[60px] sm:px-[40px] px-[12px]" data-node-id="35:9604">
            {productCategories.map((category, index) => (
              <ProductCategoryCard key={index} {...category} linkTo={category.linkTo} />
            ))}
          </div>

          {/* Third Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto lg:px-[100px] xl:px-[120px] 2xl:px-[140px] md:px-[60px] sm:px-[40px] px-[12px]" data-node-id="35:9358">
            {productCategories.map((category, index) => (
              <ProductCategoryCard key={index} {...category} linkTo={category.linkTo} />
            ))}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="flex flex-col gap-[24px] sm:gap-[28px] md:gap-[32px] lg:gap-[36px] xl:gap-[40px] 2xl:gap-[44px] items-center relative w-full py-[24px] sm:py-[32px] md:py-[40px] lg:py-[48px] xl:py-[56px] 2xl:py-[64px]">
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
