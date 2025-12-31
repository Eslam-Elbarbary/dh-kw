// Shared Footer Component used across pages
// Based on Figma design

import { Link } from 'react-router-dom';

const imgUntitled111 = "https://www.figma.com/api/mcp/asset/f31432a1-167d-4d8b-9ee7-b251ce43e5b4";
const imgVector = "https://www.figma.com/api/mcp/asset/d295f00c-f727-4394-ada2-0cca08982b3d";
const imgGroup = "https://www.figma.com/api/mcp/asset/644d434a-e4ac-4929-a260-3720902310b7";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/7b1806c4-6849-4313-83e9-00ebbf2c4bcd";
const imgVector1 = "https://www.figma.com/api/mcp/asset/6f6637f9-4c98-4165-8fa9-c262a842a568";
const imgEmailSvg = "https://www.figma.com/api/mcp/asset/19365f23-25c4-449c-96f3-68de3e9bcd48";
const imgLine4 = "https://www.figma.com/api/mcp/asset/3c8cc8da-c650-43d1-ba88-6682dd8d3f49";
const img15 = "https://www.figma.com/api/mcp/asset/3e663716-787f-4a2f-a1b9-efdae9696a6f";
const img16 = "https://www.figma.com/api/mcp/asset/718dfbb2-d057-49a5-b7a5-30215a7a9baa";
const img17 = "https://www.figma.com/api/mcp/asset/8ac69c39-805b-4605-a49d-acc967886987";

function IconLinkedin({ className }) {
  return (
    <div className={className} data-name="Icon-Linkedin" data-node-id="1:533">
      <div className="absolute inset-[12.5%_14.58%_14.58%_12.5%]" data-name="Vector" data-node-id="1:534">
        <img alt="" className="block max-w-none size-full" src={imgVector} />
      </div>
    </div>
  );
}

function IconInstagram({ className }) {
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

function IconTwitter({ className }) {
  return (
    <div className={className} data-name="Icon-Twitter" data-node-id="1:524">
      <div className="absolute inset-[0_8.09%_0_-20.83%]" data-name="Group" data-node-id="1:525">
        <img alt="" className="block max-w-none size-full" src={imgGroup1} />
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

export default function Footer() {
  return (
    <div className="bg-[#0e1c47] content-stretch flex flex-col gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] items-start justify-center pb-[16px] lg:pb-[20px] xl:pb-[24px] 2xl:pb-[28px] pt-[24px] sm:pt-[32px] md:pt-[40px] lg:pt-[48px] xl:pt-[56px] 2xl:pt-[64px] px-0 relative shrink-0 w-full overflow-hidden" data-name="Footer" data-node-id="35:5022">
      <div className="content-stretch flex flex-col items-start px-[12px] sm:px-[16px] md:px-[24px] lg:px-[80px] xl:px-[120px] 2xl:px-[140px] py-0 relative shrink-0 w-full max-w-full overflow-hidden" data-node-id="35:5023">
        <div className="content-stretch flex flex-col lg:flex-row items-start lg:items-center justify-between relative shrink-0 w-full gap-[32px] sm:gap-[36px] md:gap-[40px] lg:gap-[48px] xl:gap-[56px] 2xl:gap-[64px]" data-node-id="35:5024">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0" data-node-id="35:5025">
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-node-id="35:5026">
              <Link to="/" className="relative shrink-0 size-[80px] sm:size-[90px] md:size-[100px] lg:size-[110px] xl:size-[120px] 2xl:size-[130px] cursor-pointer hover:opacity-80 transition-opacity" data-name="Untitled-1[1] 1" data-node-id="35:5027">
                <img alt="Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
              </Link>
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[20px] text-white w-full sm:w-[280px] md:w-[303px] lg:w-[320px] xl:w-[340px] 2xl:w-[360px]" data-node-id="35:5028">
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
          <div className="content-stretch flex flex-col sm:flex-row gap-[32px] sm:gap-[40px] md:gap-[60px] lg:gap-[99px] xl:gap-[120px] 2xl:gap-[140px] items-start justify-center relative shrink-0 w-full sm:w-auto" data-node-id="35:5034">
            <div className="content-stretch flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] items-start relative shrink-0 w-full sm:w-[180px] md:w-[200px]" data-node-id="35:5035">
              <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white whitespace-nowrap" data-node-id="35:5036">
                <p className="leading-[19.5px]">Links</p>
              </div>
              <div className="content-stretch flex flex-col font-['Poppins'] font-medium gap-[10px] sm:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[13px] sm:text-[14px] w-full whitespace-nowrap" data-node-id="35:5037">
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5038">
                  <p className="leading-[19.5px]">About us</p>
                </Link>
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5039">
                  <p className="leading-[19.5px]">FAQs</p>
                </Link>
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5040">
                  <p className="leading-[19.5px]">Contact Us</p>
                </Link>
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5041">
                  <p className="leading-[19.5px]">{`Delivery & Return`}</p>
                </Link>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] items-start relative shrink-0 w-full sm:w-[180px] md:w-[200px]" data-node-id="35:5042">
              <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white whitespace-nowrap" data-node-id="35:5043">
                <p className="leading-[19.5px]">My Account</p>
              </div>
              <div className="content-stretch flex flex-col font-['Poppins'] font-medium gap-[10px] sm:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[13px] sm:text-[14px] w-full whitespace-nowrap" data-node-id="35:5044">
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5045">
                  <p className="leading-[19.5px]">Brands</p>
                </Link>
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5046">
                  <p className="leading-[19.5px]">Returns</p>
                </Link>
                <Link to="/" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5047">
                  <p className="leading-[19.5px]">Site Map</p>
                </Link>
                <Link to="/sign-in" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-node-id="35:5048">
                  <p className="leading-[19.5px]">My Account</p>
                </Link>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] items-start relative shrink-0 w-full sm:w-[180px] md:w-[200px]" data-node-id="35:5049">
              <div className="flex flex-col font-['Cairo'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white whitespace-nowrap" data-node-id="35:5050">
                <p className="leading-[1.2]">Newsletter</p>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="35:5051">
                <div className="content-stretch flex flex-col h-[38px] items-start relative rounded-[4px] shrink-0 w-full" data-node-id="35:5052">
                  <div className="border-[#f2f2f2] border-[0.75px] border-solid content-stretch flex flex-col gap-[8px] h-[38px] items-start justify-center pl-[16px] pr-[19px] py-[8px] relative rounded-[4px] shrink-0 w-full" data-name="Input" data-node-id="35:5053">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="35:5055">
                      <div className="h-[9px] relative shrink-0 w-[12px]" data-name="email.svg" data-node-id="35:5056">
                        <img alt="" className="block max-w-none size-full" src={imgEmailSvg} />
                      </div>
                      <input type="email" className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[12px] bg-transparent border-none outline-none flex-1" placeholder="Enter your email" data-node-id="35:5058" />
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
          <p className="font-['Alexandria'] font-normal leading-[normal] relative shrink-0 text-[#f2f2f2] text-[14px] sm:text-[16px] md:text-[18px] text-center" data-node-id="I35:5063;1:246">
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
          <p className="font-['Alexandria'] font-normal leading-[normal] relative shrink-0 text-[#f2f2f2] text-[14px] sm:text-[16px] md:text-[18px] text-center" data-node-id="I35:5063;1:278">
            | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

