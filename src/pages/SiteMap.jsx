// Site Map page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function SiteMap() {
  const siteMapSections = [
    {
      title: "Shop",
      links: [
        { name: "Home", path: "/" },
        { name: "PC Components", path: "/pc-components" },
        { name: "Digital E-Cards", path: "/digital-e-cards" },
        { name: "Search Products", path: "/search" },
        { name: "Brands", path: "/brands" }
      ]
    },
    {
      title: "Account",
      links: [
        { name: "My Account", path: "/my-account" },
        { name: "Sign In", path: "/sign-in" },
        { name: "Sign Up", path: "/sign-up" },
        { name: "Favorites", path: "/favorite" },
        { name: "Shopping Cart", path: "/shopping-cart" }
      ]
    },
    {
      title: "Orders",
      links: [
        { name: "Track Order", path: "/track-order" },
        { name: "Checkout", path: "/checkout" },
        { name: "Returns", path: "/returns" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help-center" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "FAQs", path: "/faqs" },
        { name: "Report Fraud", path: "/report-fraud" }
      ]
    },
    {
      title: "Information",
      links: [
        { name: "About Us", path: "/about-us" },
        { name: "Delivery & Return", path: "/delivery-return" },
        { name: "Become A Seller", path: "/become-a-seller" },
        { name: "Site Map", path: "/site-map" }
      ]
    }
  ];

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full" data-name="Breadcrumb">
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
            Site Map
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Site Map
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Find all pages and sections of our website organized by category.
          </p>
        </div>

        {/* Site Map Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] sm:gap-[32px]">
            {siteMapSections.map((section, index) => (
              <div
                key={index}
                className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[28px] md:p-[32px] shadow-sm"
              >
                <h2 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[16px] sm:mb-[20px] pb-[12px] border-b border-[#e6e6e6]">
                  {section.title}
                </h2>
                <ul className="flex flex-col gap-[10px] sm:gap-[12px]">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] hover:text-[#eea137] transition-colors flex items-center gap-[8px] group"
                      >
                        <span className="text-[#eea137] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px]">
          <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[20px] sm:mb-[24px] text-center">
            Popular Pages
          </h2>
          <div className="flex flex-wrap gap-[12px] sm:gap-[16px] justify-center">
            <Link
              to="/"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] hover:bg-[#eea137] hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pc-components"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] hover:bg-[#eea137] hover:text-white transition-colors"
            >
              PC Components
            </Link>
            <Link
              to="/shopping-cart"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] hover:bg-[#eea137] hover:text-white transition-colors"
            >
              Shopping Cart
            </Link>
            <Link
              to="/favorite"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] hover:bg-[#eea137] hover:text-white transition-colors"
            >
              Favorites
            </Link>
            <Link
              to="/help-center"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] hover:bg-[#eea137] hover:text-white transition-colors"
            >
              Help Center
            </Link>
            <Link
              to="/contact-us"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] hover:bg-[#eea137] hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

