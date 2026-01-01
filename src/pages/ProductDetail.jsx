// Product Detail page component - exact Figma implementation
// Based on Figma design - Product Detail Page
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// Product Image Assets - Using working placeholders until Figma assets are available
// TODO: Replace with actual Figma asset URLs from your product detail page design
// To get assets: Open Figma, select product images, right-click > Copy/Paste as > Copy as PNG
// Or provide the Figma file URL/node ID to extract assets automatically
const imgMacBookMain = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop";
const imgMacBookThumb1 = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop";
const imgMacBookThumb2 = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop";
const imgMacBookThumb3 = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop";
const imgMacBookThumb4 = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop";
const imgMacBookThumb5 = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop";
const imgMacBookThumb6 = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop";
const imgMacBookThumb7 = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop";

// Icon Assets (from existing components - using exact same assets as Header)
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/c993c6e9-76bd-4fc1-8f76-8c9f70ebc1a0";
const imgVuesaxLinearHeart = "https://www.figma.com/api/mcp/asset/be2e3cf6-c96e-4aa3-92dd-0bd3886ea905"; // Heart icon from Header
const imgShoppingCart = "https://www.figma.com/api/mcp/asset/281e5eef-36c1-49be-8714-dd8f301bf649";
const imgVuesaxOutlineArrowSwapHorizontal = "https://www.figma.com/api/mcp/asset/6c17a39a-5718-4120-a0e9-8b6994ef0a94"; // Compare icon from Header

// Social Media Icons (from Footer component)
const imgVector = "https://www.figma.com/api/mcp/asset/d295f00c-f727-4394-ada2-0cca08982b3d"; // LinkedIn
const imgGroup = "https://www.figma.com/api/mcp/asset/644d434a-e4ac-4929-a260-3720902310b7"; // Instagram
const imgGroup1 = "https://www.figma.com/api/mcp/asset/7b1806c4-6849-4313-83e9-00ebbf2c4bcd"; // Twitter
const imgVector1 = "https://www.figma.com/api/mcp/asset/6f6637f9-4c98-4165-8fa9-c262a842a568"; // Facebook
// Copy icon and Pinterest icon - TODO: Get actual Figma asset IDs
const imgCopy = "https://www.figma.com/api/mcp/asset/copy-icon-id"; // Two overlapping squares
const imgPinterest = "https://www.figma.com/api/mcp/asset/pinterest-icon-id"; // Pinterest P logo

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

// Related Products Images
const imgProduct1 = "https://www.figma.com/api/mcp/asset/31331607-e3da-4091-a87f-d673768d08a0";
const imgProduct2 = "https://www.figma.com/api/mcp/asset/397ef9d6-e230-46dc-a591-71cc82d81a35";
const imgProduct3 = "https://www.figma.com/api/mcp/asset/57cdecfc-ac27-4553-af8c-666330f3a295";
const imgProduct4 = "https://www.figma.com/api/mcp/asset/6e338bde-c416-445f-9838-e842db794196";
const imgProduct5 = "https://www.figma.com/api/mcp/asset/2285c162-bbe8-4bdc-9913-5a9447d89870";

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('gray');
  const [selectedMemory, setSelectedMemory] = useState('16GB');
  const [selectedSize, setSelectedSize] = useState('14-inch');
  const [selectedStorage, setSelectedStorage] = useState('1TB');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const thumbnails = [
    imgMacBookThumb1, imgMacBookThumb2, imgMacBookThumb3, 
    imgMacBookThumb4, imgMacBookThumb5, imgMacBookThumb6, imgMacBookThumb7
  ];

  const relatedProducts = [
    { id: 1, name: "Bose Sport Earbuds Wireless Earphones", brand: "Brand Name", price: "$2,300", image: imgProduct1, badges: ['Only 10 Left'] },
    { id: 2, name: "Bose Sport Earbuds Wireless Earphones", brand: "Brand Name", price: "$2,300", image: imgProduct2, badges: ['32% OFF', 'Only 10 Left'] },
    { id: 3, name: "Bose Sport Earbuds Wireless Earphones", brand: "Brand Name", price: "$2,300", image: imgProduct3, badges: ['HOT'] },
    { id: 4, name: "Bose Sport Earbuds Wireless Earphones", brand: "Brand Name", price: "$2,300", image: imgProduct4, badges: [] },
    { id: 5, name: "Bose Sport Earbuds Wireless Earphones", brand: "Brand Name", price: "$2,300", image: imgProduct5, badges: [] },
  ];

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

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
              Electronics Devices
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
                <img 
                  src={thumbnails[selectedImage] || imgMacBookMain} 
                  alt="MacBook Pro" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop";
                  }}
                />
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
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop`;
                        }}
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
                    <span key={star} className={`text-[16px] sm:text-[18px] ${star <= 4 ? 'text-[#ffc107]' : 'text-[#e0e0e0]'}`}>★</span>
                  ))}
                </div>
                <span className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px]">
                  4.7 (21,671 User feedback)
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-['Poppins'] font-semibold leading-[24px] sm:leading-[28px] md:leading-[32px] text-[#191c1f] text-[18px] sm:text-[22px] md:text-[24px] lg:text-[28px] mb-[12px] sm:mb-[16px]">
                2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray
              </h1>

              {/* Product Information */}
              <div className="flex flex-col gap-[8px] mb-[24px]">
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Sku:</span>
                  <span className="font-['Poppins'] font-normal text-[#666] text-[14px]">A264671</span>
                </div>
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Brand:</span>
                  <span className="font-['Poppins'] font-normal text-[#666] text-[14px]">Apple</span>
                </div>
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Availability:</span>
                  <span className="font-['Poppins'] font-normal text-[#00a651] text-[14px]">In Stock</span>
                </div>
                <div className="flex gap-[8px]">
                  <span className="font-['Poppins'] font-semibold text-[#191c1f] text-[14px]">Category:</span>
                  <span className="font-['Poppins'] font-normal text-[#666] text-[14px]">Electronics Devices</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex gap-[12px] items-center mb-[24px]">
                <span className="font-['Poppins'] font-semibold line-through text-[#929fa5] text-[20px]">
                  $250.00
                </span>
                <span className="font-['Poppins'] font-semibold text-[#ff9500] text-[28px]">
                  $125.00
                </span>
                <span className="bg-[#fc0] px-[8px] py-[4px] rounded-[4px] font-['Poppins'] font-semibold text-[#191c1f] text-[12px]">
                  32% OFF
                </span>
              </div>

              {/* Configuration Options */}
              <div className="flex flex-col gap-[16px] sm:gap-[20px] mb-[24px] sm:mb-[32px]">
                {/* Color */}
                <div>
                  <label className="block font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] mb-[8px]">
                    Color
                  </label>
                  <div className="flex gap-[12px]">
                    <button
                      onClick={() => setSelectedColor('gray')}
                      className={`size-[36px] sm:size-[40px] rounded-full border-2 transition-all ${
                        selectedColor === 'gray' ? 'border-[#0e1c47] scale-110' : 'border-[#e4e7e9]'
                      } bg-[#4a4a4a]`}
                    />
                    <button
                      onClick={() => setSelectedColor('white')}
                      className={`size-[36px] sm:size-[40px] rounded-full border-2 transition-all ${
                        selectedColor === 'white' ? 'border-[#0e1c47] scale-110' : 'border-[#e4e7e9]'
                      } bg-white`}
                    />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <label className="block font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] mb-[8px]">
                    Memory
                  </label>
                  <select
                    value={selectedMemory}
                    onChange={(e) => setSelectedMemory(e.target.value)}
                    className="w-full max-w-full sm:max-w-[300px] border border-[#e4e7e9] rounded-[4px] px-[12px] py-[10px] font-['Poppins'] text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0e1c47]"
                  >
                    <option value="16GB">16GB unified memory</option>
                    <option value="32GB">32GB unified memory</option>
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] mb-[8px]">
                    Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full max-w-full sm:max-w-[300px] border border-[#e4e7e9] rounded-[4px] px-[12px] py-[10px] font-['Poppins'] text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0e1c47]"
                  >
                    <option value="14-inch">14-inch Liquid Retina XDR display</option>
                    <option value="16-inch">16-inch Liquid Retina XDR display</option>
                  </select>
                </div>

                {/* Storage */}
                <div>
                  <label className="block font-['Poppins'] font-semibold text-[#191c1f] text-[13px] sm:text-[14px] mb-[8px]">
                    Storage
                  </label>
                  <select
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                    className="w-full max-w-full sm:max-w-[300px] border border-[#e4e7e9] rounded-[4px] px-[12px] py-[10px] font-['Poppins'] text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0e1c47]"
                  >
                    <option value="1TB">1TB SSD Storage</option>
                    <option value="512GB">512GB SSD Storage</option>
                    <option value="256GB">256GB SSD Storage</option>
                  </select>
                </div>
              </div>

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
                  <button className="flex-1 bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors flex items-center justify-center gap-[8px] text-[13px] sm:text-[14px]">
                    <img src={imgShoppingCart} alt="Cart" className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                    ADD TO CARD
                  </button>
                  <button className="flex-1 bg-[#ff9500] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#e68600] transition-colors text-[13px] sm:text-[14px]">
                    BUY NOW
                  </button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-col gap-[12px] sm:gap-[16px] mb-[24px] sm:mb-[32px]">
                <div className="flex flex-wrap gap-[16px] sm:gap-[24px]">
                  <button className="flex items-center gap-[6px] sm:gap-[8px] font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] hover:text-[#0e1c47] transition-colors">
                    <HeartIcon className="relative shrink-0 size-[16px] sm:size-[18px]" />
                    Add to Wishlist
                  </button>
                  <button className="flex items-center gap-[6px] sm:gap-[8px] font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] hover:text-[#0e1c47] transition-colors">
                    <CompareIcon className="relative shrink-0 size-[16px] sm:size-[18px]" />
                    Add to Compare
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-[8px] sm:gap-[12px]">
                  <span className="font-['Poppins'] font-normal text-[#666] text-[12px] sm:text-[14px] whitespace-nowrap">Share product:</span>
                  <div className="flex gap-[6px] sm:gap-[8px] items-center">
                    {/* Copy Icon - Hidden if asset not available */}
                    {imgCopy && imgCopy !== "https://www.figma.com/api/mcp/asset/copy-icon-id" && (
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
                    {imgPinterest && imgPinterest !== "https://www.figma.com/api/mcp/asset/pinterest-icon-id" && (
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
                    <img 
                      src={imgMacBookMain} 
                      alt="MacBook Pro" 
                      className="w-full rounded-[8px]"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop";
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px] leading-[22px] sm:leading-[24px] mb-[12px] sm:mb-[16px]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                    </p>
                    <p className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px] leading-[22px] sm:leading-[24px]">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'additional' && (
                <div>
                  <p className="font-['Poppins'] font-normal text-[#666] text-[14px]">
                    Additional information will be displayed here.
                  </p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <p className="font-['Poppins'] font-normal text-[#666] text-[14px]">
                    No reviews yet. Be the first to review this product.
                  </p>
                </div>
              )}
            </div>
            <div className="w-full lg:w-[300px] flex-shrink-0 mt-[24px] lg:mt-0">
              <h3 className="font-['Poppins'] font-semibold text-[#191c1f] text-[16px] sm:text-[18px] mb-[12px] sm:mb-[16px]">Feature</h3>
              <div className="flex flex-col gap-[10px] sm:gap-[12px]">
                {['Free 1 Year Warranty', 'Free Shipping & Fasted Delivery', '100% Money-back guarantee', '24/7 Customer support', 'Secure payment method'].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-[10px] sm:gap-[12px]">
                    <span className="text-[#00a651] text-[18px] sm:text-[20px]">✓</span>
                    <span className="font-['Poppins'] font-normal text-[#666] text-[13px] sm:text-[14px]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Sections */}
      {['Compatible With Your Setup', 'You Might Like It', 'Recommended For You'].map((sectionTitle, sectionIdx) => (
        <div key={sectionIdx} className="bg-white px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[24px] sm:py-[32px] md:py-[40px]">
          <div className="max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px] sm:gap-0 mb-[20px] sm:mb-[24px]">
              <h2 className="font-['Poppins'] font-semibold text-[#191c1f] text-[20px] sm:text-[24px] md:text-[28px]">
                {sectionTitle}
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
                  to="/product/1"
                  className="flex-shrink-0 md:flex-shrink-0 w-[160px] sm:w-[180px] md:w-[calc((100%-80px)/5)] lg:w-[calc((100%-80px)/5)] bg-white border border-[#e4e7e9] rounded-[8px] overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-[140px] sm:h-[160px] md:h-[180px] bg-[#f5f5f5]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
      ))}
    </div>
  );
}

