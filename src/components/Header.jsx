// Shared Header Component used across pages
// This will be a reusable component based on the Figma design

const imgUntitled111 = "https://www.figma.com/api/mcp/asset/f31432a1-167d-4d8b-9ee7-b251ce43e5b4";
const img = "https://www.figma.com/api/mcp/asset/4d564cb0-8338-4267-86a3-dfd6078c6d49";
const imgLine1 = "https://www.figma.com/api/mcp/asset/3d13583c-17cc-49fa-9981-7ac0daee5848";
const img1 = "https://www.figma.com/api/mcp/asset/44bb4a15-1b33-43cb-b03c-a87b32237591";
const img2 = "https://www.figma.com/api/mcp/asset/ecb82ee8-788c-4e28-8a1e-21ac31f85326";
const img3 = "https://www.figma.com/api/mcp/asset/69fd3785-75a0-4e97-b176-040bfbf2f27c";
const imgFlat = "https://www.figma.com/api/mcp/asset/dffb8424-3ec8-4a86-a1b5-4d02a9ea4de6";
const imgGloss = "https://www.figma.com/api/mcp/asset/d6bfa6be-9b1d-4027-9757-840d5570b228";
const img4 = "https://www.figma.com/api/mcp/asset/20de8cb0-4925-46b3-a332-aba9de662e58";
const img5 = "https://www.figma.com/api/mcp/asset/5ae7a2bc-9643-45e3-a5c9-fdf5ec2767b0";
const img6 = "https://www.figma.com/api/mcp/asset/435b1176-2161-45eb-b98f-f5b4d519dc89";
const imgVuesaxLinearUser = "https://www.figma.com/api/mcp/asset/6864330c-0bbe-4530-8845-063f68683f34";
const imgElements = "https://www.figma.com/api/mcp/asset/64763ae8-71d8-4332-ab94-11c0b35ba0cb";
const imgVuesaxLinearHeart = "https://www.figma.com/api/mcp/asset/be2e3cf6-c96e-4aa3-92dd-0bd3886ea905";
const imgVuesaxOutlineArrowSwapHorizontal = "https://www.figma.com/api/mcp/asset/6c17a39a-5718-4120-a0e9-8b6994ef0a94";

function User({ className }) {
  return (
    <div data-node-id="35:256" className={className}>
      <div data-node-id="35:257" className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearUser} />
      </div>
    </div>
  );
}

function ShoppingBasket({ className }) {
  return (
    <div data-node-id="35:112" className={className}>
      <div data-node-id="35:113" className="absolute inset-[8.33%_10.42%]">
        <div className="absolute inset-[-3.75%_-3.95%]">
          <img className="block max-w-none size-full" alt="" src={imgElements} />
        </div>
      </div>
    </div>
  );
}

function More({ className }) {
  return (
    <div data-node-id="35:101" className={className}>
      <div data-node-id="35:102" className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearHeart} />
      </div>
    </div>
  );
}

function ArrowSwapHorizontal({ className }) {
  return (
    <div data-node-id="35:84" className={className}>
      <div data-node-id="35:85" className="absolute contents inset-0">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxOutlineArrowSwapHorizontal} />
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0e1c47] border-[#4b505e] border-b border-l-0 border-r-0 border-solid border-t-0 content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[10px] sm:py-[12px] md:py-[14px] lg:py-[16px] xl:py-[18px] 2xl:py-[20px] relative shrink-0 w-full max-w-full overflow-hidden" data-node-id="39:5520">
        <div className="content-stretch flex gap-[6px] sm:gap-[8px] md:gap-[12px] lg:gap-[16px] items-center relative shrink-0 flex-wrap w-full sm:w-auto" data-node-id="39:5521">
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 4" data-node-id="39:5522">
            <div className="relative shrink-0 size-[16px]" data-name="call" data-node-id="39:5523">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
            <p className="capitalize font-['Pacifico'] leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center" dir="auto">
              <span className="font-['Poppins'] font-semibold">{`Call us `}</span>
              <span className="font-['Poppins'] font-normal hidden sm:inline">: +965 XXX XXXX</span>
              <span className="font-['Poppins'] font-normal sm:hidden">: +965...</span>
            </p>
          </div>
          <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[270deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-0.5px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 3">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img1} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden sm:block" dir="auto">
              Track Order
            </p>
          </div>
          <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[270deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-0.5px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden md:block" dir="auto">
              Help Center
            </p>
          </div>
          <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[270deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-0.5px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img2} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden lg:block" dir="auto">
              Report Fraud
            </p>
          </div>
          <div className="hidden sm:flex h-[24px] items-center justify-center relative shrink-0 w-0">
            <div className="flex-none rotate-[270deg]">
              <div className="h-0 relative w-[24px]">
                <div className="absolute inset-[-0.5px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img3} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] text-center hidden lg:block" dir="auto">{` Become a Seller`}</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[6px] sm:gap-[8px] items-center justify-end relative shrink-0 w-full sm:w-auto mt-[8px] sm:mt-0">
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <div className="absolute contents inset-0">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgFlat} />
                </div>
              </div>
              <div className="absolute inset-[12.76%_4.42%_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgGloss} />
              </div>
            </div>
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto">
              egypt
            </p>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto">
              eN
            </p>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img4} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Search bar and logo */}
      <div className="bg-[#0e1c47] content-stretch flex flex-col items-start px-[12px] sm:px-[16px] md:px-[40px] lg:px-[100px] xl:px-[120px] 2xl:px-[140px] py-[12px] sm:py-[14px] md:py-[16px] lg:py-[18px] xl:py-[20px] 2xl:py-[22px] relative shrink-0 w-full max-w-full overflow-hidden">
        <div className="content-stretch flex flex-col sm:flex-row items-center justify-between relative shrink-0 w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto gap-[12px] sm:gap-[16px] lg:gap-[20px] xl:gap-[24px]">
          <div className="relative shrink-0 size-[36px] sm:size-[40px] md:size-[44px] lg:size-[48px] xl:size-[52px] 2xl:size-[56px] self-start sm:self-center">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
          </div>
          <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex h-[42px] sm:h-[44px] md:h-[48px] lg:h-[52px] xl:h-[56px] 2xl:h-[60px] items-center justify-between overflow-hidden pl-[10px] sm:pl-[12px] md:pl-[16px] lg:pl-[20px] xl:pl-[24px] pr-0 py-0 relative rounded-[4px] shrink-0 w-full sm:w-[500px] md:w-[550px] lg:w-[600px] xl:w-[650px] 2xl:w-[700px] sm:max-w-full sm:flex-1 sm:min-w-0">
            <input type="text" className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[13px] sm:text-[14px] md:text-[16px] text-white bg-transparent border-none outline-none flex-1 min-w-0" placeholder="Search for products" />
            <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <p className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
                  Category
                </p>
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img5} />
                  </div>
                </div>
              </div>
              <button className="bg-[#eea137] content-stretch flex h-full items-center justify-center px-[12px] sm:px-[16px] md:px-[20px] lg:px-[24px] py-[8px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0">
                <p className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-white whitespace-nowrap">
                  Search
                </p>
              </button>
            </div>
          </div>
          <div className="content-stretch flex gap-[10px] sm:gap-[12px] md:gap-[14px] lg:gap-[16px] items-center justify-end relative shrink-0 w-full sm:w-auto">
            <ArrowSwapHorizontal className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px] hidden sm:block" />
            <More className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
            <ShoppingBasket className="overflow-clip relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
            <div className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px] hidden sm:block">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={img6} />
              </div>
            </div>
            <User className="relative shrink-0 size-[18px] sm:size-[20px] md:size-[22px] lg:size-[24px]" />
          </div>
        </div>
      </div>
      {/* Navigation menu */}
      <div className="bg-[#0e1c47] content-stretch flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] items-center justify-center px-[12px] sm:px-[16px] md:px-[40px] lg:px-[80px] xl:px-[100px] 2xl:px-[120px] py-[12px] sm:py-[16px] md:py-[20px] lg:py-[24px] xl:py-[28px] 2xl:py-[32px] relative shrink-0 w-full max-w-full overflow-x-auto">
        <div className="bg-[#eea137] content-stretch flex gap-[6px] sm:gap-[8px] h-[36px] sm:h-[40px] items-center px-[12px] sm:px-[16px] md:px-[20px] lg:px-[24px] py-[8px] relative rounded-[4px] shrink-0 w-full sm:w-auto">
          <p className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] sm:text-[17px] md:text-[18px] text-white whitespace-nowrap">
            Category
          </p>
          <div className="relative shrink-0 size-[20px] sm:size-[22px] md:size-[24px]">
            <div className="absolute contents inset-0">
              <img alt="" className="block max-w-none size-full" src={img5} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-wrap gap-[12px] sm:gap-[16px] md:gap-[20px] items-center justify-center relative shrink-0 w-full sm:w-auto">
          <a className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-left text-white">{`Computers & Laptops`}</p>
          </a>
          <div className="content-stretch flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">{`Mobiles & Tablets`}</p>
          </div>
          <div className="content-stretch flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Smartphones
            </p>
          </div>
          <div className="content-stretch flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Monitors
            </p>
          </div>
          <div className="content-stretch flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Processors
            </p>
          </div>
          <div className="content-stretch flex items-center justify-center px-[4px] py-[6px] sm:py-[8px] relative shrink-0">
            <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white">
              Motherboards
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

