// Digital E-Cards page component - exact Figma implementation
// Based on Figma design - Digital E-Cards Page

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, resolveCountryId } from '../services/catalog.service';

// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';
import creditCardIcon from '../assets/CreditCard.svg';
import heroBackgroundImage from '../assets/Frame 1984079876.png';
import productImage1 from '../assets/2c2703028e858e93057b03391653381259c5700c.png';
import productImage2 from '../assets/4290b5299d7820aab27a24eef721fc6a3de6f994.png';
import productImage3 from '../assets/45ffebea53178df09da5b55aa5ec9c64f9c97219.png';
import productImage4 from '../assets/495f2db0dba66b830ccfbc2b70ff68519b13ce45.png';
import productImage5 from '../assets/51514609622e9c097a0531f13c0db834797cda9c.png';
import productImage6 from '../assets/5d1b5ca4f6671da94d620d7aec269e2d17cf66e0.png';
import productImage7 from '../assets/709f890284df9f0583ba3f0cbed489bb013b8efb.png';
import productImage8 from '../assets/76236df7a5ad3774e8e14a241d83f4af473d2f52.png';
import productImage9 from '../assets/89ed235ee47f8d384c57df36ae75c564312166e3.png';

// Icon Assets
const imgArrowDown = arrowDownIcon;

// Hero Banner Assets - using the provided hero background image
const imgHeroBackground = heroBackgroundImage;
const imgGamingController1 = productImage1;
const imgGamingController2 = productImage2;
const imgElectronicsIcon = productImage3;

// Category Icons
const imgVoucherIcon = creditCardIcon;
const imgConsoleController = productImage4;
const imgCreditCardIcon = creditCardIcon;
const imgGiftCard = creditCardIcon;
const imgTelecom = productImage5;
const imgPlayStation = productImage6;

// Store Flags - using placeholder circular badges (you may want to add actual flag images)
const imgEgyptFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23ed2939'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ccircle cx='20' cy='20' r='12' fill='%23000'/%3E%3Ctext x='20' y='25' font-size='12' fill='%23fff' text-anchor='middle'%3EEG%3C/text%3E%3C/svg%3E";
const imgUSFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23b22234'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ctext x='20' y='25' font-size='12' fill='%23b22234' text-anchor='middle'%3EUS%3C/text%3E%3C/svg%3E";
const imgUAEFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%2300729f'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ctext x='20' y='25' font-size='12' fill='%2300729f' text-anchor='middle'%3EAE%3C/text%3E%3C/svg%3E";
const imgSaudiFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23006c35'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ctext x='20' y='25' font-size='12' fill='%23006c35' text-anchor='middle'%3ESA%3C/text%3E%3C/svg%3E";
const imgItalianFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23009246'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ctext x='20' y='25' font-size='12' fill='%23009246' text-anchor='middle'%3EIT%3C/text%3E%3C/svg%3E";
const imgJapaneseFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23bc002d'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ccircle cx='20' cy='20' r='8' fill='%23bc002d'/%3E%3C/svg%3E";
const imgMexicanFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23006147'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ctext x='20' y='25' font-size='12' fill='%23006147' text-anchor='middle'%3EMX%3C/text%3E%3C/svg%3E";
const imgIndianFlag = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23ff9933'/%3E%3Ccircle cx='20' cy='20' r='15' fill='%23fff'/%3E%3Ccircle cx='20' cy='20' r='6' fill='%2300066f'/%3E%3C/svg%3E";

export default function DigitalECards() {
  const countryId = useMemo(() => resolveCountryId(1), []);
  const [apiCategories, setApiCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoriesError('');
        const categoriesList = await getCategories();
        setApiCategories(categoriesList);
      } catch (error) {
        setCategoriesError(error?.response?.data?.message || 'Failed to load categories.');
        setApiCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const fallbackCategories = [
    { id: 1, name: 'Digital Vouchers', icon: productImage3 },
    { id: 2, name: 'Gaming Vouchers', icon: productImage4 },
    { id: 3, name: 'Internet Cards', icon: productImage9 },
    { id: 4, name: 'Gift Cards', icon: imgGiftCard },
    { id: 5, name: 'Telecom', icon: imgTelecom },
    { id: 6, name: 'PlayStation', icon: imgPlayStation },
    { id: 7, name: 'Movie Tickets', icon: productImage7 },
    { id: 8, name: 'Streaming Services', icon: productImage8 },
    { id: 9, name: 'Spotify', icon: productImage3 },
  ];

  const categories = apiCategories.length > 0
    ? apiCategories.map((category, index) => ({
        id: category.id,
        name: category.name,
        icon: category.image || [productImage3, productImage4, productImage9, imgGiftCard, imgTelecom, imgPlayStation][index % 6],
        linkTo: `/search?country_id=${countryId}&category_id=${category.id}`,
      }))
    : fallbackCategories.map((category) => ({ ...category, linkTo: '/search' }));

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
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Hero Background" 
                src={imgHeroBackground}
                onError={(e) => {
                  e.target.style.display = 'none';
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
          
          {loadingCategories ? (
            <div className="w-full flex justify-center py-[40px]">
              <p className="font-['Poppins'] font-normal text-[#666] text-[16px]">Loading categories...</p>
            </div>
          ) : categoriesError ? (
            <div className="w-full flex justify-center py-[40px]">
              <p className="font-['Poppins'] font-normal text-[#8e0909] text-[16px]">{categoriesError}</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] w-full">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.linkTo}
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
              </Link>
            ))}
          </div>
          )}
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
