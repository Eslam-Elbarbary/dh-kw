// Shared Footer Component used across pages
// Based on Figma design

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSettings } from '../services/settings.service';

import logoImage from '../assets/websiteLogo.png';
import layer1Image from '../assets/Layer 1.svg';

// Logo - 3D gold "dh" logo (same as header)
const imgUntitled111 = logoImage;
// Email icon - using inline SVG
const imgEmailSvg = "data:image/svg+xml,%3Csvg width='12' height='9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 1H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 5L1 2h10L6 5z' fill='%23f2f2f2'/%3E%3C/svg%3E";
// Divider line - using inline SVG
const imgLine4 = "data:image/svg+xml,%3Csvg width='100%25' height='1' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100%25' y2='0' stroke='%23ffffff' stroke-opacity='0.2'/%3E%3C/svg%3E";
function IconLinkedin({ className }) {
  return (
    <div className={className} aria-hidden>
      <svg className="size-[16px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 8.5A1.44 1.44 0 1 0 6.94 5.6a1.44 1.44 0 0 0 0 2.9ZM5.7 9.75h2.5V18H5.7V9.75Zm4.07 0h2.4v1.13h.03c.34-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.66 3 3.81V18h-2.5v-3.94c0-.94-.02-2.15-1.3-2.15-1.3 0-1.5 1.02-1.5 2.08V18h-2.5V9.75Z" />
      </svg>
    </div>
  );
}

function IconInstagram({ className }) {
  return (
    <div className={className} aria-hidden>
      <svg className="size-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="3.8" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

function IconTwitter({ className }) {
  return (
    <div className={className} aria-hidden>
      <svg className="size-[16px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 4.5h-2.3l-3.2 3.7-2.7-3.7H5.1l5.4 7.4-5.1 6h2.3l3.9-4.5 3.3 4.5h5.6l-5.6-7.8 5-5.6Zm-3.2 11.9-7-9.8h1.6l7 9.8h-1.6Z" />
      </svg>
    </div>
  );
}

function IconFacebook({ className }) {
  return (
    <div className={className} aria-hidden>
      <svg className="size-[16px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.6 20v-6h2l.3-2.3h-2.3v-1.5c0-.7.2-1.2 1.2-1.2h1.3V6.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.1-3.2 3.3v1.7H9V14h2v6h2.6Z" />
      </svg>
    </div>
  );
}

function IconWhatsapp({ className }) {
  return (
    <div className={className} aria-hidden>
      <svg className="size-[16px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.08c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a7.86 7.86 0 0 1-1.21-4.31c0-4.35 3.54-7.89 7.89-7.89 4.35 0 7.89 3.54 7.89 7.89 0 4.35-3.54 7.89-7.89 7.89zm4.31-5.89c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </div>
  );
}

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        if (!cancelled) setSettings(data);
      } catch {
        if (!cancelled) setSettings(null);
      }
    };
    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-[#0e1c47] content-stretch flex flex-col gap-[20px] lg:gap-[24px] xl:gap-[28px] 2xl:gap-[32px] items-start justify-center pb-[16px] lg:pb-[20px] xl:pb-[24px] 2xl:pb-[28px] pt-[24px] sm:pt-[32px] md:pt-[40px] lg:pt-[48px] xl:pt-[56px] 2xl:pt-[64px] px-0 relative shrink-0 w-full overflow-hidden" data-name="Footer" data-node-id="35:5022">
      <div className="content-stretch flex flex-col items-start px-[12px] sm:px-[16px] md:px-[32px] lg:px-[50px] xl:px-[100px] 2xl:px-[140px] py-0 relative shrink-0 w-full max-w-full overflow-hidden" data-node-id="35:5023">
        <div className="content-stretch flex flex-col md:flex-row items-start md:items-start lg:items-center justify-between relative shrink-0 w-full gap-[24px] sm:gap-[28px] md:gap-[32px] lg:gap-[32px] xl:gap-[40px] 2xl:gap-[64px]" data-node-id="35:5024">
          <div className="content-stretch flex flex-col gap-[20px] sm:gap-[22px] md:gap-[24px] items-start relative shrink-0 w-full md:w-auto md:flex-shrink-0 md:max-w-[380px] lg:max-w-[320px] xl:max-w-[360px]" data-node-id="35:5025">
            <div className="content-stretch flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start relative shrink-0 w-full" data-node-id="35:5026">
              <Link to="/" className="relative shrink-0 size-[70px] sm:size-[80px] md:size-[90px] lg:size-[100px] xl:size-[110px] 2xl:size-[130px] cursor-pointer hover:opacity-80 transition-opacity" data-name="Untitled-1[1] 1" data-node-id="35:5027">
                <img
                  alt={settings?.appName || 'Logo'}
                  className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                  src={settings?.appLogo || imgUntitled111}
                  onError={(e) => {
                    e.currentTarget.src = imgUntitled111;
                  }}
                />
              </Link>
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15px] xl:text-[16px] 2xl:text-[17px] text-white w-full max-w-[340px] lg:max-w-[320px] xl:max-w-[360px]" data-node-id="35:5028">
                <p className="leading-[1.5] sm:leading-[1.45] lg:leading-[1.4] whitespace-pre-wrap">{`A premium store offering a curated selection from top international brands. `}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[10px] sm:gap-[12px] md:gap-[14px] items-start relative shrink-0" data-node-id="35:5029">
              <a href={settings?.contactFacebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">
                <IconFacebook className="overflow-clip relative shrink-0 text-white/90 hover:text-white size-[34px] sm:size-[36px] md:size-[38px] rounded-full border border-white/20 hover:border-[#eea137]/70 hover:bg-white/10 flex items-center justify-center transition-all" />
              </a>
              <a href={settings?.contactTwitter || '#'} target="_blank" rel="noreferrer" aria-label="Twitter">
                <IconTwitter className="overflow-clip relative shrink-0 text-white/90 hover:text-white size-[34px] sm:size-[36px] md:size-[38px] rounded-full border border-white/20 hover:border-[#eea137]/70 hover:bg-white/10 flex items-center justify-center transition-all" />
              </a>
              <a href={settings?.contactInstagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram">
                <IconInstagram className="overflow-clip relative shrink-0 text-white/90 hover:text-white size-[34px] sm:size-[36px] md:size-[38px] rounded-full border border-white/20 hover:border-[#eea137]/70 hover:bg-white/10 flex items-center justify-center transition-all" />
              </a>
              <a href={settings?.contactLinkedin || '#'} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <IconLinkedin className="overflow-clip relative shrink-0 text-white/90 hover:text-white size-[34px] sm:size-[36px] md:size-[38px] rounded-full border border-white/20 hover:border-[#eea137]/70 hover:bg-white/10 flex items-center justify-center transition-all" />
              </a>
              {settings?.contactWhatsappUrl ? (
                <a
                  href={settings.contactWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <IconWhatsapp className="overflow-clip relative shrink-0 text-white/90 hover:text-white size-[34px] sm:size-[36px] md:size-[38px] rounded-full border border-white/20 hover:border-[#eea137]/70 hover:bg-white/10 flex items-center justify-center transition-all" />
                </a>
              ) : null}
            </div>
          </div>
          <div className="content-stretch flex flex-col sm:flex-row md:flex-wrap lg:flex-nowrap gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[24px] xl:gap-[40px] 2xl:gap-[80px] items-start justify-start md:justify-start lg:justify-between xl:justify-center relative shrink-0 w-full md:w-auto md:flex-1 lg:flex-initial lg:flex-grow lg:max-w-[580px] xl:max-w-none" data-node-id="35:5034">
            <div className="content-stretch flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] items-start relative shrink-0 w-full sm:w-[150px] md:w-[160px] lg:w-[160px] xl:w-[180px]" data-node-id="35:5035">
              <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white whitespace-nowrap" data-node-id="35:5036">
                <p className="leading-[19.5px]">Links</p>
              </div>
              <div className="content-stretch flex flex-col font-['Poppins'] font-medium gap-[8px] sm:gap-[10px] md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[13px] sm:text-[14px] w-full whitespace-nowrap" data-node-id="35:5037">
                <Link to="/about-us" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5038">
                  <p className="leading-[19.5px]">About us</p>
                </Link>
                <Link to="/faqs" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5039">
                  <p className="leading-[19.5px]">FAQs</p>
                </Link>
                <Link to="/contact-us" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5040">
                  <p className="leading-[19.5px]">Contact Us</p>
                </Link>
                <Link to="/delivery-return" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5041">
                  <p className="leading-[19.5px]">{`Delivery & Return`}</p>
                </Link>
                <Link to="/report-fraud" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors">
                  <p className="leading-[19.5px]">Report Fraud</p>
                </Link>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] items-start relative shrink-0 w-full sm:w-[150px] md:w-[160px] lg:w-[160px] xl:w-[180px]" data-node-id="35:5042">
              <div className="flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white whitespace-nowrap" data-node-id="35:5043">
                <p className="leading-[19.5px]">My Account</p>
              </div>
              <div className="content-stretch flex flex-col font-['Poppins'] font-medium gap-[8px] sm:gap-[10px] md:gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[13px] sm:text-[14px] w-full whitespace-nowrap" data-node-id="35:5044">
                <Link to="/returns" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5046">
                  <p className="leading-[19.5px]">Returns</p>
                </Link>
                <Link to="/site-map" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5047">
                  <p className="leading-[19.5px]">Site Map</p>
                </Link>
                <Link to="/my-account" className="flex flex-col justify-center relative shrink-0 cursor-pointer hover:text-[#eea137] transition-colors" data-node-id="35:5048">
                  <p className="leading-[19.5px]">My Account</p>
                </Link>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] items-start relative shrink-0 w-full sm:w-[260px] md:w-[280px] lg:w-[280px] xl:w-[320px]" data-node-id="35:5049">
              <div className="flex flex-col font-['Cairo'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] sm:text-[15px] md:text-[16px] text-white whitespace-nowrap" data-node-id="35:5050">
                <p className="leading-[1.2]">Newsletter</p>
              </div>
              <div className="content-stretch flex flex-col gap-[10px] sm:gap-[12px] items-start relative shrink-0 w-full" data-node-id="35:5051">
                <div className="content-stretch flex flex-col h-[36px] sm:h-[38px] items-start relative rounded-[4px] shrink-0 w-full" data-node-id="35:5052">
                  <div className="border-[#f2f2f2] border-[0.75px] border-solid content-stretch flex flex-col gap-[8px] h-[36px] sm:h-[38px] items-start justify-center pl-[12px] sm:pl-[14px] md:pl-[16px] pr-[15px] sm:pr-[17px] md:pr-[19px] py-[7px] sm:py-[8px] relative rounded-[4px] shrink-0 w-full" data-name="Input" data-node-id="35:5053">
                    <div className="content-stretch flex gap-[6px] sm:gap-[8px] items-center relative shrink-0" data-node-id="35:5055">
                      <div className="h-[8px] sm:h-[9px] relative shrink-0 w-[11px] sm:w-[12px]" data-name="email.svg" data-node-id="35:5056">
                        <img alt="" className="block max-w-none size-full" src={imgEmailSvg} />
                      </div>
                      <input type="email" className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#f2f2f2] text-[11px] sm:text-[12px] bg-transparent border-none outline-none flex-1 placeholder:text-[#999]" placeholder="Enter your email" data-node-id="35:5058" />
                    </div>
                  </div>
                </div>
                <button className="bg-[#eea137] hover:bg-[#ffb84d] content-stretch flex h-[36px] sm:h-[40px] items-center justify-center px-[14px] sm:px-[16px] py-[8px] sm:py-[10px] relative rounded-[4px] shrink-0 w-full transition-colors cursor-pointer" data-node-id="35:5059">
                  <div className="flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[13px] sm:text-[14px] text-white whitespace-nowrap" data-node-id="35:5060">
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
        <div className="content-stretch flex flex-col sm:flex-row gap-[8px] sm:gap-[12px] h-auto sm:h-[60px] items-center justify-center relative shrink-0 w-full max-w-full px-[12px] sm:px-0" data-name="Copyright - Desktop" data-node-id="35:5063">
          <p className="font-['Alexandria'] font-normal leading-[normal] relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] text-center" data-node-id="I35:5063;1:246">
            Copyright © {new Date().getFullYear()}
          </p>
          <a
            href="https://www.qeematech.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 h-[16px] sm:h-[20px] md:h-[22px] w-auto hover:opacity-85 transition-opacity"
            data-name="Layer 1"
            data-node-id="I35:5063;1:279"
            aria-label="QeemaTech — visit website"
          >
            <img alt="QeemaTech" className="block h-full w-auto object-contain" src={layer1Image} />
          </a>
          <p className="font-['Alexandria'] font-normal leading-[normal] relative shrink-0 text-[#f2f2f2] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] text-center" data-node-id="I35:5063;1:278">
            | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

