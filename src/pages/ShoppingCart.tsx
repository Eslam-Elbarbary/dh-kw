// Shopping Cart page component - exact Figma implementation
// This is a large component, splitting into multiple files would be better
// For now, creating the full component

const imgUntitled111 = "https://www.figma.com/api/mcp/asset/f31432a1-167d-4d8b-9ee7-b251ce43e5b4";
const imgImage = "https://www.figma.com/api/mcp/asset/d21476fb-b45c-4ced-901d-0fd2694a38ab";
const imgImage1 = "https://www.figma.com/api/mcp/asset/901c345a-eff2-4acb-8a8a-b0ba204195fd";
const imgVector = "https://www.figma.com/api/mcp/asset/d295f00c-f727-4394-ada2-0cca08982b3d";
const imgGroup = "https://www.figma.com/api/mcp/asset/644d434a-e4ac-4929-a260-3720902310b7";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/7b1806c4-6849-4313-83e9-00ebbf2c4bcd";
const imgVector1 = "https://www.figma.com/api/mcp/asset/6f6637f9-4c98-4165-8fa9-c262a842a568";
const imgVuesaxLinearUser = "https://www.figma.com/api/mcp/asset/6864330c-0bbe-4530-8845-063f68683f34";
const imgElements = "https://www.figma.com/api/mcp/asset/64763ae8-71d8-4332-ab94-11c0b35ba0cb";
const imgVuesaxLinearHeart = "https://www.figma.com/api/mcp/asset/be2e3cf6-c96e-4aa3-92dd-0bd3886ea905";
const imgVuesaxOutlineArrowSwapHorizontal = "https://www.figma.com/api/mcp/asset/6c17a39a-5718-4120-a0e9-8b6994ef0a94";
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
const img7 = "https://www.figma.com/api/mcp/asset/f55c5731-fc21-44e2-ad54-331e88dab72d";
const img8 = "https://www.figma.com/api/mcp/asset/201e3f4b-6da4-4c9e-a228-ea0a93dcdc70";
const img9 = "https://www.figma.com/api/mcp/asset/007a2458-9e7e-41a8-86cc-4a7f81aa5df1";
const img10 = "https://www.figma.com/api/mcp/asset/91d7c076-3c2e-4fb3-8eda-c25d27b76d22";
const img11 = "https://www.figma.com/api/mcp/asset/a752551b-37b1-4353-8b18-2fbc80502325";
const imgRemove = "https://www.figma.com/api/mcp/asset/c40b14b4-1eeb-4f53-840d-0b7d2bc68ff3";
const img12 = "https://www.figma.com/api/mcp/asset/80bb8388-30da-4f64-b5f4-c92dd6ecc7dc";
const imgLine25 = "https://www.figma.com/api/mcp/asset/fa0dcf4b-8e0e-44c3-ba81-95559dc153ac";
const imgLine26 = "https://www.figma.com/api/mcp/asset/fea37081-f4bb-4633-9e27-b6df88af3120";
const imgShoppingCartSimple = "https://www.figma.com/api/mcp/asset/5390c4da-ea50-4245-a3be-cbe32d6afdc6";
const img13 = "https://www.figma.com/api/mcp/asset/174d514e-8a5a-46a0-bcd1-937ce3d9074c";
const img14 = "https://www.figma.com/api/mcp/asset/c1b14a15-5ce7-440a-b753-982768eb80e8";
const imgEmailSvg = "https://www.figma.com/api/mcp/asset/19365f23-25c4-449c-96f3-68de3e9bcd48";
const imgLine4 = "https://www.figma.com/api/mcp/asset/3c8cc8da-c650-43d1-ba88-6682dd8d3f49";
const img15 = "https://www.figma.com/api/mcp/asset/3e663716-787f-4a2f-a1b9-efdae9696a6f";
const img16 = "https://www.figma.com/api/mcp/asset/718dfbb2-d057-49a5-b7a5-30215a7a9baa";
const img17 = "https://www.figma.com/api/mcp/asset/8ac69c39-805b-4605-a49d-acc967886987";

function IconLinkedin({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Icon-Linkedin" data-node-id="1:533">
      <div className="absolute inset-[12.5%_14.58%_14.58%_12.5%]" data-name="Vector" data-node-id="1:534">
        <img alt="" className="block max-w-none size-full" src={imgVector} />
      </div>
    </div>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <div className={className} data-name="icon-instagram" data-node-id="1:528">
      <div className="absolute inset-[12.5%]" data-name="Group" data-node-id="1:529">
        <div className="absolute inset-[-4.17%]">
          <img alt="" className="block max-w-none size-full" src={imgGroup} />
        </div>
      </div>
    </div>
  );
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Icon-Twitter" data-node-id="1:524">
      <div className="absolute inset-[0_8.09%_0_-20.83%]" data-name="Group" data-node-id="1:525">
        <img alt="" className="block max-w-none size-full" src={imgGroup1} />
      </div>
    </div>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Icon-Facebook" data-node-id="1:521">
      <div className="absolute inset-[12.5%_27.08%_12.5%_29.17%]" data-name="Vector" data-node-id="1:522">
        <img alt="" className="block max-w-none size-full" src={imgVector1} />
      </div>
    </div>
  );
}

type UserProps = {
  className?: string;
  property1?: "Default" | "Variant2";
};

function User({ className }: UserProps) {
  return (
    <div data-node-id="35:256" className={className}>
      <div data-node-id="35:257" className="absolute contents inset-0" data-name="vuesax/linear/user">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearUser} />
      </div>
    </div>
  );
}

type ShoppingBasketProps = {
  className?: string;
};

function ShoppingBasket({ className }: ShoppingBasketProps) {
  return (
    <div data-node-id="35:112" className={className}>
      <div data-node-id="35:113" className="absolute inset-[8.33%_10.42%]" data-name="elements">
        <div className="absolute inset-[-3.75%_-3.95%]">
          <img className="block max-w-none size-full" alt="" src={imgElements} />
        </div>
      </div>
    </div>
  );
}

type MoreProps = {
  className?: string;
};

function More({ className }: MoreProps) {
  return (
    <div data-node-id="35:101" className={className}>
      <div data-node-id="35:102" className="absolute contents inset-0" data-name="vuesax/linear/heart">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxLinearHeart} />
      </div>
    </div>
  );
}

type ArrowSwapHorizontalProps = {
  className?: string;
};

function ArrowSwapHorizontal({ className }: ArrowSwapHorizontalProps) {
  return (
    <div data-node-id="35:84" className={className}>
      <div data-node-id="35:85" className="absolute contents inset-0" data-name="vuesax/outline/arrow-swap-horizontal">
        <img className="block max-w-none size-full" alt="" src={imgVuesaxOutlineArrowSwapHorizontal} />
      </div>
    </div>
  );
}

export default function ShoppingCart() {
  return (
    <div className="bg-white relative size-full min-h-screen w-full" data-name="Shopping Cart" data-node-id="35:4812">
      <div className="content-stretch flex flex-col gap-[40px] items-center left-0 top-0 w-full" data-node-id="35:4813">
        {/* Header Section - Top bar with contact info */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4814">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="35:4815">
            <div className="bg-[#0e1c47] border-[#4b505e] border-b border-l-0 border-r-0 border-solid border-t-0 content-stretch flex items-center justify-between px-[100px] py-[16px] relative shrink-0 w-full max-w-full" data-node-id="39:5520">
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 flex-wrap" data-node-id="39:5521">
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 4" data-node-id="39:5522">
                  <div className="relative shrink-0 size-[16px]" data-name="call" data-node-id="39:5523">
                    <div className="absolute contents inset-0" data-name="vuesax/linear/call" data-node-id="I39:5523;12:54351">
                      <img alt="" className="block max-w-none size-full" src={img} />
                    </div>
                  </div>
                  <p className="capitalize font-['Pacifico'] leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5524">
                    <span className="font-['Poppins'] font-semibold">{`Call us `}</span>
                    <span className="font-['Poppins'] font-normal">: +965 XXX XXXX</span>
                  </p>
                </div>
                <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
                  <div className="flex-none rotate-[270deg]">
                    <div className="h-0 relative w-[24px]" data-node-id="39:5525">
                      <div className="absolute inset-[-0.5px_0_0_0]">
                        <img alt="" className="block max-w-none size-full" src={imgLine1} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 3" data-node-id="39:5526">
                  <div className="relative shrink-0 size-[16px]" data-name="truck" data-node-id="39:5527">
                    <div className="absolute contents inset-0" data-name="vuesax/outline/truck" data-node-id="I39:5527;12:71167">
                      <img alt="" className="block max-w-none size-full" src={img1} />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5528">
                    Track Order
                  </p>
                </div>
                <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
                  <div className="flex-none rotate-[270deg]">
                    <div className="h-0 relative w-[24px]" data-node-id="39:5529">
                      <div className="absolute inset-[-0.5px_0_0_0]">
                        <img alt="" className="block max-w-none size-full" src={imgLine1} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 5" data-node-id="39:5530">
                  <div className="relative shrink-0 size-[16px]" data-name="call" data-node-id="39:5531">
                    <div className="absolute contents inset-0" data-name="vuesax/linear/call" data-node-id="I39:5531;12:54351">
                      <img alt="" className="block max-w-none size-full" src={img} />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5532">
                    Help Center
                  </p>
                </div>
                <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
                  <div className="flex-none rotate-[270deg]">
                    <div className="h-0 relative w-[24px]" data-node-id="39:5533">
                      <div className="absolute inset-[-0.5px_0_0_0]">
                        <img alt="" className="block max-w-none size-full" src={imgLine1} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 6" data-node-id="39:5534">
                  <div className="relative shrink-0 size-[16px]" data-name="message-text" data-node-id="39:5535">
                    <div className="absolute contents inset-0" data-name="vuesax/outline/message-text" data-node-id="I39:5535;12:69675">
                      <img alt="" className="block max-w-none size-full" src={img2} />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5536">
                    Report Fraud
                  </p>
                </div>
                <div className="flex h-[24px] items-center justify-center relative shrink-0 w-0">
                  <div className="flex-none rotate-[270deg]">
                    <div className="h-0 relative w-[24px]" data-node-id="39:5537">
                      <div className="absolute inset-[-0.5px_0_0_0]">
                        <img alt="" className="block max-w-none size-full" src={imgLine1} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 7" data-node-id="39:5538">
                  <div className="relative shrink-0 size-[16px]" data-name="user" data-node-id="39:5539">
                    <div className="absolute contents inset-0" data-name="vuesax/outline/user" data-node-id="I39:5539;12:69466">
                      <img alt="" className="block max-w-none size-full" src={img3} />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5540">{` Become a Seller`}</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-node-id="39:5541">
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 6" data-node-id="39:5542">
                  <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Frame" data-node-id="39:5543">
                    <div className="absolute contents inset-0" data-name="Page-1" data-node-id="39:5544">
                      <div className="absolute contents inset-0" data-name="Flat" data-node-id="39:5545">
                        <img alt="" className="block max-w-none size-full" src={imgFlat} />
                      </div>
                    </div>
                    <div className="absolute inset-[12.76%_4.42%_0_0]" data-name="gloss" data-node-id="39:5638">
                      <img alt="" className="block max-w-none size-full" src={imgGloss} />
                    </div>
                  </div>
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5639">
                    egypt
                  </p>
                  <div className="relative shrink-0 size-[16px]" data-name="arrow-down" data-node-id="39:5640">
                    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down" data-node-id="I39:5640;12:67890">
                      <img alt="" className="block max-w-none size-full" src={img4} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[4px] relative shrink-0" data-name="new-next-logo-gold 5" data-node-id="39:5641">
                  <p className="capitalize font-['Poppins'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#f2f2f2] text-[16px] text-center" dir="auto" data-node-id="39:5642">
                    eN
                  </p>
                  <div className="relative shrink-0 size-[16px]" data-name="arrow-down" data-node-id="39:5643">
                    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down" data-node-id="I39:5643;12:67890">
                      <img alt="" className="block max-w-none size-full" src={img4} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Search bar and navigation */}
            <div className="bg-[#0e1c47] content-stretch flex flex-col items-start px-[100px] py-[16px] relative shrink-0 w-full max-w-full" data-node-id="35:4840">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full max-w-[1240px] mx-auto" data-node-id="35:4841">
                <div className="relative shrink-0 size-[48px]" data-name="Untitled-1[1] 1" data-node-id="35:4842">
                  <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
                </div>
                <div className="border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex h-[48px] items-center justify-between overflow-clip pl-[16px] pr-0 py-0 relative rounded-[4px] shrink-0 w-[550px] max-w-full" data-name="search" data-node-id="35:4843">
                  <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="35:4844">
                    <p className="leading-[normal]" dir="auto">
                      Search for products
                    </p>
                  </div>
                  <div className="content-stretch flex gap-[16px] h-full items-center relative shrink-0" data-node-id="35:4845">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="35:4846">
                      <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="35:4847">
                        <p className="leading-[normal]" dir="auto">
                          Category
                        </p>
                      </div>
                      <div className="relative shrink-0 size-[24px]" data-name="arrow-down" data-node-id="35:4848">
                        <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down" data-node-id="I35:4848;12:67890">
                          <img alt="" className="block max-w-none size-full" src={img5} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#eea137] content-stretch flex h-full items-center justify-center px-[24px] py-[8px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-node-id="35:4849">
                      <div className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="35:4850">
                        <p className="leading-[normal]" dir="auto">
                          Search
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="35:4851">
                  <ArrowSwapHorizontal className="relative shrink-0 size-[24px]" />
                  <More className="relative shrink-0 size-[24px]" />
                  <ShoppingBasket className="overflow-clip relative shrink-0 size-[24px]" />
                  <div className="relative shrink-0 size-[24px]" data-name="notification-bing" data-node-id="43:3094">
                    <div className="absolute contents inset-0" data-name="vuesax/outline/notification-bing" data-node-id="I43:3094;12:71901">
                      <img alt="" className="block max-w-none size-full" src={img6} />
                    </div>
                  </div>
                  <User className="relative shrink-0 size-[24px]" />
                </div>
              </div>
            </div>
            {/* Navigation menu */}
            <div className="bg-[#0e1c47] content-stretch flex gap-[20px] items-center justify-center px-[80px] py-[24px] relative shrink-0 w-full max-w-full" data-name="Nav" data-node-id="35:4856">
              <div className="bg-[#eea137] content-stretch flex gap-[8px] h-[40px] items-center px-[24px] py-[8px] relative rounded-[4px] shrink-0" data-node-id="35:4857">
                <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap" data-node-id="35:4858">
                  <p className="leading-[normal]" dir="auto">
                    Category
                  </p>
                </div>
                <div className="relative shrink-0 size-[24px]" data-name="arrow-down" data-node-id="35:4859">
                  <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down" data-node-id="I35:4859;12:67890">
                    <img alt="" className="block max-w-none size-full" src={img5} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[20px] items-center relative shrink-0 flex-wrap" data-node-id="35:4860">
                <a className="content-stretch cursor-pointer flex items-center justify-center px-[4px] py-[8px] relative shrink-0" data-name="Text" data-node-id="35:4861">
                  <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left text-white" data-node-id="35:4862">{`Computers & Laptops`}</p>
                </a>
                <div className="content-stretch flex items-center justify-center px-[4px] py-[8px] relative shrink-0" data-name="Text" data-node-id="35:4863">
                  <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white" data-node-id="35:4864">{`Mobiles & Tablets`}</p>
                </div>
                <div className="content-stretch flex items-center justify-center px-[4px] py-[8px] relative shrink-0" data-node-id="35:4865">
                  <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white" data-node-id="35:4866">
                    Smartphones
                  </p>
                </div>
                <div className="content-stretch flex items-center justify-center px-[4px] py-[8px] relative shrink-0" data-node-id="35:4867">
                  <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white" data-node-id="35:4868">
                    Monitors
                  </p>
                </div>
                <div className="content-stretch flex items-center justify-center px-[4px] py-[8px] relative shrink-0" data-node-id="35:4869">
                  <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white" data-node-id="35:4870">
                    Processors
                  </p>
                </div>
                <div className="content-stretch flex items-center justify-center px-[4px] py-[8px] relative shrink-0" data-node-id="35:4871">
                  <p className="capitalize font-['Poppins'] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white" data-node-id="35:4872">
                    Motherboards
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Breadcrumb */}
          <div className="content-stretch flex gap-[8px] items-center px-[100px] py-0 relative shrink-0 w-full" data-name="Breadcumb" data-node-id="35:4873">
            <p className="font-['Poppins'] font-normal leading-[20px] not-italic relative shrink-0 text-[#5f6c72] text-[14px]" data-node-id="35:4874">
              Home
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-[18px]">
              <div className="flex-none rotate-[270deg]">
                <div className="relative size-[18px]" data-name="arrow-down" data-node-id="35:4875">
                  <div className="absolute contents inset-0" data-name="vuesax/linear/arrow-down" data-node-id="I35:4875;166:15267">
                    <img alt="" className="block max-w-none size-full" src={img7} />
                  </div>
                </div>
              </div>
            </div>
            <p className="font-['Poppins'] font-medium leading-[20px] not-italic relative shrink-0 text-[#eea137] text-[14px]" data-node-id="35:4884">
              Shopping Cart
            </p>
          </div>
        </div>
        {/* Cart Content */}
        <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full max-w-[1240px] mx-auto px-[100px] flex-wrap" data-node-id="35:4889">
          {/* Products List */}
          <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex flex-col items-start relative rounded-[12px] shrink-0 flex-1 min-w-[600px]" data-name="Shoping Card" data-node-id="35:4890">
            <div className="content-stretch flex items-start px-[24px] py-[20px] relative shrink-0 w-full" data-name="Heading" data-node-id="35:4891">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] text-black" data-node-id="35:4892">
                Shopping Cart
              </p>
            </div>
            <div className="bg-[#f2f4f5] border border-[#e4e7e9] border-solid content-stretch flex font-['Poppins'] font-normal gap-[24px] items-center leading-[24px] not-italic px-[24px] py-[10px] relative shrink-0 w-full whitespace-pre-wrap" data-name="Sub-Heading" data-node-id="35:4893">
              <p className="relative shrink-0 w-[380px]" data-node-id="35:4894">
                Products
              </p>
              <p className="relative shrink-0 w-[88px]" data-node-id="35:4895">
                Price
              </p>
              <p className="relative shrink-0 w-[172px]" data-node-id="35:4896">
                Quantity
              </p>
              <p className="relative shrink-0 w-[112px]" data-node-id="35:4897">
                Sub-Total
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-name="Products" data-node-id="35:4898">
              {/* Product Item 1 */}
              <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full flex-wrap" data-name="Product" data-node-id="35:4899">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 flex-1 min-w-[300px]" data-name="Product" data-node-id="35:4900">
                  <div className="relative rounded-[2px] shrink-0 size-[72px]" data-name="Image" data-node-id="35:4901">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[2px] size-full" src={imgImage} />
                  </div>
                  <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[14px] text-black flex-1 whitespace-pre-wrap" data-node-id="35:4902">
                    Wired Over-Ear Gaming Headphones with USB
                  </p>
                </div>
                <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[88px] whitespace-pre-wrap" data-node-id="35:4903">
                  $250
                </p>
                <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Quantity" data-node-id="35:4904">
                  <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex items-center justify-between px-[20px] py-[12px] relative rounded-[3px] shrink-0 w-[148px]" data-name="Button" data-node-id="35:4905">
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Minus" data-node-id="35:4906">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                    <p className="font-['Public_Sans'] font-normal leading-[24px] relative shrink-0 text-[#475156] text-[16px]" data-node-id="35:4907">
                      03
                    </p>
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Plus" data-node-id="35:4908">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                  </div>
                </div>
                <p className="font-['Public_Sans'] font-medium leading-[20px] relative shrink-0 text-[14px] text-black w-[112px] whitespace-pre-wrap" data-node-id="35:4909">
                  $250
                </p>
                <button className="overflow-clip relative shrink-0 size-[20px]" data-name="Capa_1" data-node-id="35:4910">
                  <div className="absolute inset-[3.91%_10.94%]" data-name="Remove" data-node-id="35:4911">
                    <div className="absolute inset-[-4.24%_-5%]">
                      <img alt="" className="block max-w-none size-full" src={imgRemove} />
                    </div>
                  </div>
                </button>
              </div>
              {/* Product Item 2 */}
              <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full flex-wrap" data-name="Product" data-node-id="35:4918">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 flex-1 min-w-[300px]" data-name="Product" data-node-id="35:4919">
                  <div className="relative rounded-[2px] shrink-0 size-[72px]" data-name="Image" data-node-id="35:4920">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[2px] size-full" src={imgImage} />
                  </div>
                  <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[14px] text-black flex-1 whitespace-pre-wrap" data-node-id="35:4921">
                    Wired Over-Ear Gaming Headphones with USB
                  </p>
                </div>
                <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[88px] whitespace-pre-wrap" data-node-id="35:4922">
                  $250
                </p>
                <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Quantity" data-node-id="35:4923">
                  <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex items-center justify-between px-[20px] py-[12px] relative rounded-[3px] shrink-0 w-[148px]" data-name="Button" data-node-id="35:4924">
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Minus" data-node-id="35:4925">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                    <p className="font-['Public_Sans'] font-normal leading-[24px] relative shrink-0 text-[#475156] text-[16px]" data-node-id="35:4926">
                      03
                    </p>
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Plus" data-node-id="35:4927">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                  </div>
                </div>
                <p className="font-['Public_Sans'] font-medium leading-[20px] relative shrink-0 text-[14px] text-black w-[112px] whitespace-pre-wrap" data-node-id="35:4928">
                  $250
                </p>
                <button className="overflow-clip relative shrink-0 size-[20px]" data-name="Capa_1" data-node-id="35:4929">
                  <div className="absolute inset-[3.91%_10.94%]" data-name="Remove" data-node-id="35:4930">
                    <div className="absolute inset-[-4.24%_-5%]">
                      <img alt="" className="block max-w-none size-full" src={imgRemove} />
                    </div>
                  </div>
                </button>
              </div>
              {/* Product Item 3 */}
              <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full flex-wrap" data-name="Product" data-node-id="35:4937">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 flex-1 min-w-[300px]" data-name="Product" data-node-id="35:4938">
                  <div className="relative rounded-[2px] shrink-0 size-[72px]" data-name="Image" data-node-id="35:4939">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[2px] size-full" src={imgImage} />
                  </div>
                  <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[14px] text-black flex-1 whitespace-pre-wrap" data-node-id="35:4940">
                    Wired Over-Ear Gaming Headphones with USB
                  </p>
                </div>
                <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[88px] whitespace-pre-wrap" data-node-id="35:4941">
                  $250
                </p>
                <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Quantity" data-node-id="35:4942">
                  <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex items-center justify-between px-[20px] py-[12px] relative rounded-[3px] shrink-0 w-[148px]" data-name="Button" data-node-id="35:4943">
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Minus" data-node-id="35:4944">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                    <p className="font-['Public_Sans'] font-normal leading-[24px] relative shrink-0 text-[#475156] text-[16px]" data-node-id="35:4945">
                      03
                    </p>
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Plus" data-node-id="35:4946">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                  </div>
                </div>
                <p className="font-['Public_Sans'] font-medium leading-[20px] relative shrink-0 text-[14px] text-black w-[112px] whitespace-pre-wrap" data-node-id="35:4947">
                  $250
                </p>
                <button className="overflow-clip relative shrink-0 size-[20px]" data-name="Capa_1" data-node-id="35:4948">
                  <div className="absolute inset-[3.91%_10.94%]" data-name="Remove" data-node-id="35:4949">
                    <div className="absolute inset-[-4.24%_-5%]">
                      <img alt="" className="block max-w-none size-full" src={imgRemove} />
                    </div>
                  </div>
                </button>
              </div>
              {/* Product Item 4 */}
              <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full flex-wrap" data-name="Product" data-node-id="35:4956">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 flex-1 min-w-[300px]" data-name="Product" data-node-id="35:4957">
                  <div className="relative rounded-[2px] shrink-0 size-[72px]" data-name="Image" data-node-id="35:4958">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[2px] size-full" src={imgImage1} />
                  </div>
                  <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[14px] text-black flex-1 whitespace-pre-wrap" data-node-id="35:4959">
                    4K UHD LED Smart TV with Chromecast Built-in
                  </p>
                </div>
                <div className="font-['Public_Sans'] font-normal h-[20px] leading-[20px] relative shrink-0 text-[14px] w-[88px]" data-node-id="35:4960">
                  <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-solid left-0 line-through text-[#929fa5] top-0" data-node-id="35:4961">
                    $99
                  </p>
                  <p className="absolute left-[31px] text-[#475156] top-0" data-node-id="35:4962">
                    $70
                  </p>
                </div>
                <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Quantity" data-node-id="35:4963">
                  <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex items-center justify-between px-[20px] py-[12px] relative rounded-[3px] shrink-0 w-[148px]" data-name="Button" data-node-id="35:4964">
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Minus" data-node-id="35:4965">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                    <p className="font-['Public_Sans'] font-normal leading-[24px] relative shrink-0 text-[#475156] text-[16px]" data-node-id="35:4966">
                      01
                    </p>
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Plus" data-node-id="35:4967">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                  </div>
                </div>
                <p className="font-['Public_Sans'] font-medium leading-[20px] relative shrink-0 text-[14px] text-black w-[112px] whitespace-pre-wrap" data-node-id="35:4968">
                  $70
                </p>
                <button className="overflow-clip relative shrink-0 size-[20px]" data-name="Capa_1" data-node-id="35:4969">
                  <div className="absolute inset-[3.91%_10.94%]" data-name="Remove" data-node-id="35:4970">
                    <div className="absolute inset-[-4.24%_-5%]">
                      <img alt="" className="block max-w-none size-full" src={imgRemove} />
                    </div>
                  </div>
                </button>
              </div>
              {/* Product Item 5 */}
              <div className="content-stretch flex gap-[24px] items-center justify-center relative shrink-0 w-full flex-wrap" data-name="Product" data-node-id="35:4977">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 flex-1 min-w-[300px]" data-name="Product" data-node-id="35:4978">
                  <div className="relative rounded-[2px] shrink-0 size-[72px]" data-name="Image" data-node-id="35:4979">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[2px] size-full" src={imgImage} />
                  </div>
                  <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[14px] text-black flex-1 whitespace-pre-wrap" data-node-id="35:4980">
                    Wired Over-Ear Gaming Headphones with USB
                  </p>
                </div>
                <p className="font-['Public_Sans'] font-normal leading-[20px] relative shrink-0 text-[#475156] text-[14px] w-[88px] whitespace-pre-wrap" data-node-id="35:4981">
                  $250
                </p>
                <div className="content-stretch flex flex-col items-start pl-0 pr-[24px] py-0 relative shrink-0" data-name="Quantity" data-node-id="35:4982">
                  <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex items-center justify-between px-[20px] py-[12px] relative rounded-[3px] shrink-0 w-[148px]" data-name="Button" data-node-id="35:4983">
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Minus" data-node-id="35:4984">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                    <p className="font-['Public_Sans'] font-normal leading-[24px] relative shrink-0 text-[#475156] text-[16px]" data-node-id="35:4985">
                      03
                    </p>
                    <button className="relative shrink-0 size-[16px]" data-name="Duotone/Plus" data-node-id="35:4986">
                      <img alt="" className="block max-w-none size-full" src={img8} />
                    </button>
                  </div>
                </div>
                <p className="font-['Public_Sans'] font-medium leading-[20px] relative shrink-0 text-[14px] text-black w-[112px] whitespace-pre-wrap" data-node-id="35:4987">
                  $250
                </p>
                <button className="overflow-clip relative shrink-0 size-[20px]" data-name="Capa_1" data-node-id="35:4988">
                  <div className="absolute inset-[3.91%_10.94%]" data-name="Remove" data-node-id="35:4989">
                    <div className="absolute inset-[-4.24%_-5%]">
                      <img alt="" className="block max-w-none size-full" src={imgRemove} />
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="h-0 relative shrink-0 w-full" data-node-id="35:4996">
              <div className="absolute inset-[-1px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgLine25} />
              </div>
            </div>
          </div>
          {/* Cart Total */}
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative shrink-0 min-w-[350px]" data-node-id="35:4997">
            <div className="bg-white border border-[#e4e7e9] border-solid content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="Card Total" data-node-id="35:4998">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full whitespace-pre-wrap" data-node-id="35:4999">
                Cart Totals
              </p>
              <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-node-id="35:5000">
                <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Total" data-node-id="35:5001">
                  <div className="content-stretch flex flex-col gap-[12px] items-start pb-[4px] pt-0 px-0 relative shrink-0 w-full" data-name="Content" data-node-id="35:5002">
                    <div className="content-stretch flex items-center justify-between leading-[20px] not-italic relative shrink-0 text-[14px] w-full" data-node-id="35:5003">
                      <p className="font-['Poppins'] font-normal relative shrink-0 text-[#5f6c72]" data-node-id="35:5004">
                        Sub-total
                      </p>
                      <p className="font-['Poppins'] font-medium relative shrink-0 text-black" data-node-id="35:5005">
                        $320
                      </p>
                    </div>
                    <div className="content-stretch flex items-center justify-between leading-[20px] not-italic relative shrink-0 text-[14px] w-full" data-node-id="35:5006">
                      <p className="font-['Poppins'] font-normal relative shrink-0 text-[#5f6c72]" data-node-id="35:5007">
                        Shipping
                      </p>
                      <p className="font-['Poppins'] font-medium relative shrink-0 text-black" data-node-id="35:5008">
                        Free
                      </p>
                    </div>
                    <div className="content-stretch flex items-center justify-between leading-[20px] not-italic relative shrink-0 text-[14px] w-full" data-node-id="35:5009">
                      <p className="font-['Poppins'] font-normal relative shrink-0 text-[#5f6c72]" data-node-id="35:5010">
                        Discount
                      </p>
                      <p className="font-['Poppins'] font-medium relative shrink-0 text-black" data-node-id="35:5011">
                        $24
                      </p>
                    </div>
                    <div className="content-stretch flex items-center justify-between leading-[20px] not-italic relative shrink-0 text-[14px] w-full" data-node-id="35:5012">
                      <p className="font-['Poppins'] font-normal relative shrink-0 text-[#5f6c72]" data-node-id="35:5013">
                        Tax
                      </p>
                      <p className="font-['Poppins'] font-medium relative shrink-0 text-black" data-node-id="35:5014">
                        $61.99
                      </p>
                    </div>
                  </div>
                  <div className="h-0 relative shrink-0 w-full" data-node-id="35:5015">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine26} />
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-between leading-[24px] not-italic relative shrink-0 text-[16px] text-black w-full" data-node-id="35:5016">
                    <p className="font-['Poppins'] font-normal relative shrink-0" data-node-id="35:5017">
                      Total
                    </p>
                    <p className="font-['Poppins'] font-semibold relative shrink-0" data-node-id="35:5018">
                      $357.99 USD
                    </p>
                  </div>
                </div>
                <button className="bg-[#0e1c47] content-stretch cursor-pointer flex gap-[11.273px] h-[45.091px] items-center justify-center px-[22.545px] py-0 relative rounded-[4px] shrink-0 w-full" data-name="Button" data-node-id="35:5019">
                  <p className="capitalize font-['Poppins'] font-semibold leading-[52.606px] not-italic relative shrink-0 text-[16px] text-white tracking-[0.192px]" data-node-id="35:5020">
                    shop now
                  </p>
                  <div className="relative shrink-0 size-[22.545px]" data-name="ShoppingCartSimple" data-node-id="35:5021">
                    <img alt="" className="block max-w-none size-full" src={imgShoppingCartSimple} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-[#0e1c47] content-stretch flex flex-col gap-[20px] items-start justify-center pb-[16px] pt-[40px] px-0 relative shrink-0 w-full max-w-full" data-name="Footer" data-node-id="35:5022">
          <div className="content-stretch flex flex-col items-start px-[120px] py-0 relative shrink-0 w-full" data-node-id="35:5023">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full flex-wrap gap-[40px]" data-node-id="35:5024">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-node-id="35:5025">
                <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-node-id="35:5026">
                  <div className="relative shrink-0 size-[100px]" data-name="Untitled-1[1] 1" data-node-id="35:5027">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
                  </div>
                  <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[303px]" data-node-id="35:5028">
                    <p className="leading-[1.35] whitespace-pre-wrap">{`A premium store offering a curated selection from top international brands. `}</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-node-id="35:5029">
                  <IconFacebook className="overflow-clip relative shrink-0 size-[24px]" />
                  <IconTwitter className="overflow-clip relative shrink-0 size-[24px]" />
                  <IconInstagram className="overflow-clip relative shrink-0 size-[24px]" />
                  <IconLinkedin className="overflow-clip relative shrink-0 size-[24px]" />
                </div>
              </div>
              <div className="content-stretch flex gap-[99px] items-start justify-center relative shrink-0 flex-wrap" data-node-id="35:5034">
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[200px]" data-node-id="35:5035">
                  <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="35:5036">
                    <p className="leading-[19.5px]">Links</p>
                  </div>
                  <div className="content-stretch flex flex-col font-['Poppins'] font-medium gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[14px] w-full whitespace-nowrap" data-node-id="35:5037">
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5038">
                      <p className="leading-[19.5px]">About us</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5039">
                      <p className="leading-[19.5px]">FAQs</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5040">
                      <p className="leading-[19.5px]">Contact Us</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5041">
                      <p className="leading-[19.5px]">{`Delivery & Return`}</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[200px]" data-node-id="35:5042">
                  <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="35:5043">
                    <p className="leading-[19.5px]">My Account</p>
                  </div>
                  <div className="content-stretch flex flex-col font-['Poppins'] font-medium gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[14px] w-full whitespace-nowrap" data-node-id="35:5044">
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5045">
                      <p className="leading-[19.5px]">Brands</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5046">
                      <p className="leading-[19.5px]">Returns</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5047">
                      <p className="leading-[19.5px]">Site Map</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0" data-node-id="35:5048">
                      <p className="leading-[19.5px]">My Account</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[200px]" data-node-id="35:5049">
                  <div className="flex flex-col font-['Cairo'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap" data-node-id="35:5050">
                    <p className="leading-[1.2]">Newsletter</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="35:5051">
                    <div className="content-stretch flex flex-col h-[38px] items-start relative rounded-[4px] shrink-0 w-full" data-node-id="35:5052">
                      <div className="border-[#f2f2f2] border-[0.75px] border-solid content-stretch flex flex-col gap-[8px] h-[38px] items-start justify-center pl-[16px] pr-[19px] py-[8px] relative rounded-[4px] shrink-0 w-full" data-name="Input" data-node-id="35:5053">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="35:5055">
                          <div className="h-[9px] relative shrink-0 w-[12px]" data-name="email.svg" data-node-id="35:5056">
                            <img alt="" className="block max-w-none size-full" src={imgEmailSvg} />
                          </div>
                          <input type="email" className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] bg-transparent border-none outline-none" placeholder="Enter your email" data-node-id="35:5058" />
                        </div>
                      </div>
                    </div>
                    <button className="bg-[#eea137] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[10px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:5059">
                      <div className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="35:5060">
                        <p className="leading-[18px]">Send</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="35:5061">
            <div className="flex items-center justify-center relative shrink-0 w-full">
              <div className="flex-none rotate-[180deg] w-full">
                <div className="h-0 relative w-full" data-node-id="35:5062">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img alt="" className="block max-w-none size-full" src={imgLine4} />
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] h-[60px] items-center justify-center relative shrink-0 w-full max-w-full" data-name="Copyright - Desktop" data-node-id="35:5063">
              <p className="font-['Alexandria'] font-normal leading-[normal] relative shrink-0 text-[#f2f2f2] text-[18px] text-center" data-node-id="I35:5063;1:246">
                Copyright © 2025
              </p>
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-[0] relative shrink-0" data-name="Layer 1" data-node-id="I35:5063;1:279">
                <div className="col-[1] grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start ml-0 mt-0 relative row-[1]" data-name="Group" data-node-id="I35:5063;1:280">
                  <div className="col-[1] h-[2.595px] ml-[10.58%] mt-[93.51%] relative row-[1] w-[60.81px]" data-name="Group" data-node-id="I35:5063;1:281">
                    <img alt="" className="block max-w-none size-full" src={img15} />
                  </div>
                  <div className="col-[1] h-[19.922px] ml-[22.21%] mt-0 relative row-[1] w-[40.887px]" data-name="Group" data-node-id="I35:5063;1:296">
                    <img alt="" className="block max-w-none size-full" src={img16} />
                  </div>
                  <div className="col-[1] h-[9.827px] ml-0 mt-[63.18%] relative row-[1] w-[73.627px]" data-name="Group" data-node-id="I35:5063;1:299">
                    <img alt="" className="block max-w-none size-full" src={img17} />
                  </div>
                </div>
              </div>
              <p className="font-['Alexandria'] font-normal leading-[normal] relative shrink-0 text-[#f2f2f2] text-[18px] text-center" data-node-id="I35:5063;1:278">
                | All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

