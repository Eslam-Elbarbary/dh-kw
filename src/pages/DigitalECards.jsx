// Digital E-Cards page component - exact Figma implementation
// Based on Figma design - Digital E-Cards Page

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

// Hero Banner Assets
const imgHeroBackground = "https://www.figma.com/api/mcp/asset/0e1f27bc-f780-47c8-a09e-32dbd0fb7fbb";
const imgGamingController1 = "https://www.figma.com/api/mcp/asset/c51d743d-9a51-46f7-9cc8-cbb0ae33c211";
const imgGamingController2 = "https://www.figma.com/api/mcp/asset/f6e8ad89-d785-4d4a-8073-1d46bb090f8a";
const imgElectronicsIcon = "https://www.figma.com/api/mcp/asset/365eadac-66d8-438d-9365-7b2dcb2f8153";

// Category Icons (from Figma assets)
const imgVoucherIcon = "https://www.figma.com/api/mcp/asset/8299a1b9-6556-403f-b2d9-f12a3714794e";
const imgConsoleController = "https://www.figma.com/api/mcp/asset/f6e8ad89-d785-4d4a-8073-1d46bb090f8a";
const imgCreditCardIcon = "https://www.figma.com/api/mcp/asset/6b827610-4ce8-4870-9b99-b0828c3f20da";
const imgGiftCard = "https://www.figma.com/api/mcp/asset/48ec3927-83ae-4763-adb6-71e570f01c8b";
const imgTelecom = "https://www.figma.com/api/mcp/asset/365eadac-66d8-438d-9365-7b2dcb2f8153";
const imgPlayStation = "https://www.figma.com/api/mcp/asset/c51d743d-9a51-46f7-9cc8-cbb0ae33c211";

// Store Flags (from Figma assets - glossy circular badges)
const imgEgyptFlag = "https://www.figma.com/api/mcp/asset/a0b8346c-9d02-4156-a818-8bcc1b66037a";
const imgUSFlag = "https://www.figma.com/api/mcp/asset/a8383584-6e5d-4a1b-b6f7-aaf3bcf58116";
const imgUAEFlag = "https://www.figma.com/api/mcp/asset/dfb0c21b-ea4f-4128-bd54-973402e364ba";
const imgSaudiFlag = "https://www.figma.com/api/mcp/asset/0a27a1d6-13bc-4427-a6c9-7db2beaf0dab";
// Placeholder flags for Italian, Japanese, Mexican, Indian - need Figma asset IDs
const imgItalianFlag = "https://www.figma.com/api/mcp/asset/placeholder-italian-flag"; // TODO: Get actual Figma asset ID
const imgJapaneseFlag = "https://www.figma.com/api/mcp/asset/placeholder-japanese-flag"; // TODO: Get actual Figma asset ID
const imgMexicanFlag = "https://www.figma.com/api/mcp/asset/placeholder-mexican-flag"; // TODO: Get actual Figma asset ID
const imgIndianFlag = "https://www.figma.com/api/mcp/asset/placeholder-indian-flag"; // TODO: Get actual Figma asset ID

export default function DigitalECards() {
  const categories = [
    {
      id: 1,
      name: "Digital Vouchers",
      icon: imgVoucherIcon
    },
    {
      id: 2,
      name: "Gaming Vouchers",
      icon: imgConsoleController
    },
    {
      id: 3,
      name: "Internet Cards",
      icon: imgCreditCardIcon
    },
    {
      id: 4,
      name: "Gift Cards",
      icon: imgGiftCard
    },
    {
      id: 5,
      name: "Telecom",
      icon: imgTelecom
    },
    {
      id: 6,
      name: "PlayStation",
      icon: imgPlayStation
    },
    {
      id: 7,
      name: "Movie Tickets",
      icon: imgVoucherIcon
    },
    {
      id: 8,
      name: "Streaming Services",
      icon: imgConsoleController
    },
    {
      id: 9,
      name: "Spotify",
      icon: imgCreditCardIcon
    }
  ];

  const stores = [
    {
      id: 1,
      name: "Egyptian Store",
      flag: imgEgyptFlag
    },
    {
      id: 2,
      name: "American Store",
      flag: imgUSFlag
    },
    {
      id: 3,
      name: "Italian Store",
      flag: imgItalianFlag
    },
    {
      id: 4,
      name: "Japanese Store",
      flag: imgJapaneseFlag
    },
    {
      id: 5,
      name: "Mexican Store",
      flag: imgMexicanFlag
    },
    {
      id: 6,
      name: "Indian Store",
      flag: imgIndianFlag
    }
  ];

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="flex flex-col gap-[40px] sm:gap-[50px] md:gap-[60px] items-center relative w-full">
        {/* Hero Banner */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[499px] lg:h-[550px] xl:h-[600px] overflow-hidden" data-name="Hero Banner">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 overflow-hidden">
              <img 
                className="absolute h-full w-full max-w-none object-cover" 
                alt="Hero Background" 
                src={imgHeroBackground}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=600&fit=crop';
                }}
              />
            </div>
            <div className="absolute bg-gradient-to-t from-[rgba(0,101,176,0)] inset-0 to-[rgba(0,101,176,0.2)]" />
          </div>
          

          {/* Gaming Elements - Decorative */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-[5%] top-[20%] opacity-30">
              <img 
                src={imgGamingController1} 
                alt="" 
                className="w-[80px] sm:w-[100px] md:w-[120px] h-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <div className="absolute right-[5%] top-[15%] opacity-30">
              <img 
                src={imgGamingController2} 
                alt="" 
                className="w-[80px] sm:w-[100px] md:w-[120px] h-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <div className="absolute left-[10%] bottom-[15%] opacity-20">
              <img 
                src={imgElectronicsIcon} 
                alt="" 
                className="w-[60px] sm:w-[80px] md:w-[100px] h-auto"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px]" data-name="Breadcrumb">
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
            Digital E-Cards
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px]">
          <h2 className="capitalize font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-black w-full text-center">
            Categories
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] w-full">
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-white border border-[#e6e6e6] border-solid flex flex-col items-center justify-center p-[16px] sm:p-[20px] md:p-[24px] rounded-[4px] hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex flex-col gap-[12px] sm:gap-[16px] items-center justify-center w-full">
                  <div className="bg-[#0e1c47] flex items-center justify-center p-[16px] sm:p-[20px] md:p-[24px] rounded-[4px] w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
                    <div className="h-[100px] sm:h-[120px] md:h-[140px] relative w-full flex items-center justify-center">
                      <img 
                        alt={category.name} 
                        className="max-h-full max-w-full object-contain" 
                        src={category.icon}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop';
                        }}
                      />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-semibold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-black text-center">
                    {category.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stores Section */}
        <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] items-start justify-center relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] pb-[40px] sm:pb-[60px] md:pb-[80px]">
          <h2 className="capitalize font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-black w-full text-center">
            Stores
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] w-full">
            {stores.map((store) => (
              <Link
                key={store.id}
                to="#"
                className="flex flex-col gap-[12px] sm:gap-[16px] md:gap-[20px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity group"
              >
                <div className="relative size-[80px] sm:size-[100px] md:size-[120px] lg:size-[150px] rounded-full overflow-hidden border-2 border-[#e4e7e9] group-hover:border-[#0e1c47] transition-colors shadow-md">
                  <img 
                    alt={store.name} 
                    className="w-full h-full object-cover object-center" 
                    src={store.flag}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=200&h=200&fit=crop';
                    }}
                  />
                </div>
                <p className="capitalize font-['Poppins'] font-semibold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-black text-center">
                  {store.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
