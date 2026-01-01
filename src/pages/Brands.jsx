// Brands page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function Brands() {
  const brands = [
    { id: 1, name: "Apple", category: "Electronics", products: 250 },
    { id: 2, name: "Samsung", category: "Electronics", products: 180 },
    { id: 3, name: "Sony", category: "Electronics", products: 120 },
    { id: 4, name: "Dell", category: "Computers", products: 95 },
    { id: 5, name: "HP", category: "Computers", products: 110 },
    { id: 6, name: "Lenovo", category: "Computers", products: 85 },
    { id: 7, name: "Nike", category: "Fashion", products: 200 },
    { id: 8, name: "Adidas", category: "Fashion", products: 175 },
    { id: 9, name: "Canon", category: "Cameras", products: 65 },
    { id: 10, name: "Nikon", category: "Cameras", products: 55 },
    { id: 11, name: "LG", category: "Electronics", products: 90 },
    { id: 12, name: "Microsoft", category: "Electronics", products: 75 }
  ];

  const categories = ["All", "Electronics", "Computers", "Fashion", "Cameras"];

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
            Brands
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Our Brands
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Discover products from top international brands we partner with.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px] sm:gap-[24px]">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/search?brand=${brand.name}`}
                className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[28px] hover:border-[#eea137] hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center text-center gap-[12px] sm:gap-[16px]">
                  <div className="bg-[#f8f9fa] rounded-full size-[80px] sm:size-[100px] flex items-center justify-center group-hover:bg-[#fff4e6] transition-colors">
                    <span className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] text-[#0e1c47]">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[4px]">
                      {brand.name}
                    </h3>
                    <p className="font-['Poppins'] font-normal text-[14px] text-[#666] mb-[8px]">
                      {brand.category}
                    </p>
                    <p className="font-['Poppins'] font-medium text-[14px] text-[#eea137]">
                      {brand.products} Products
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
          <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
            Become a Partner Brand
          </h2>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
            Are you a brand looking to expand your reach? Partner with us to showcase your products to our global customer base.
          </p>
          <Link
            to="/become-a-seller"
            className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

