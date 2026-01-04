// Error Page Component - 404 and other errors
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const imgUntitled111 = "https://www.figma.com/api/mcp/asset/f31432a1-167d-4d8b-9ee7-b251ce43e5b4";

export default function ErrorPage({ errorCode = 404, errorMessage = "Page Not Found", errorDescription = "The page you are looking for doesn't exist or has been moved." }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0f172a] min-h-screen flex items-center justify-center px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] transition-colors duration-300">
      <div className="max-w-[600px] w-full text-center py-[40px] sm:py-[60px] md:py-[80px]">
        {/* Error Code */}
        <div className="mb-[24px] sm:mb-[32px]">
          <h1 className="font-['Poppins'] font-bold text-[#0e1c47] dark:text-white text-[120px] sm:text-[150px] md:text-[180px] leading-[1] transition-colors duration-300">
            {errorCode}
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-[16px] sm:mb-[20px]">
          <h2 className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-white text-[24px] sm:text-[28px] md:text-[32px] mb-[12px] transition-colors duration-300">
            {errorMessage}
          </h2>
          <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[14px] sm:text-[16px] md:text-[18px] leading-[1.6] transition-colors duration-300">
            {errorDescription}
          </p>
        </div>

        {/* Logo */}
        <div className="mb-[32px] sm:mb-[40px] flex justify-center">
          <Link to="/" className="relative shrink-0 size-[80px] sm:size-[100px] md:size-[120px] cursor-pointer hover:opacity-80 transition-opacity">
            <img alt="Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgUntitled111} />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] items-center justify-center">
          <Link
            to="/"
            className="bg-[#eea137] hover:bg-[#ffb84d] text-white font-['Poppins'] font-semibold text-[14px] sm:text-[16px] px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] transition-all duration-200 cursor-pointer hover:shadow-lg active:scale-[0.98] w-full sm:w-auto"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-[#1e293b] border border-[#e4e7e9] dark:border-[#334155] hover:bg-[#f8f9fa] dark:hover:bg-[#0f172a] text-[#0e1c47] dark:text-white font-['Poppins'] font-semibold text-[14px] sm:text-[16px] px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] transition-all duration-200 cursor-pointer w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-[40px] sm:mt-[48px] pt-[32px] sm:pt-[40px] border-t border-[#e4e7e9] dark:border-[#334155]">
          <p className="font-['Poppins'] font-normal text-[#666] dark:text-[#9ca3af] text-[13px] sm:text-[14px] mb-[16px] transition-colors duration-300">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-[12px] sm:gap-[16px] items-center justify-center">
            <Link to="/search" className="font-['Poppins'] font-medium text-[#0e1c47] dark:text-[#eea137] text-[13px] sm:text-[14px] hover:underline transition-colors duration-200">
              Search Products
            </Link>
            <span className="text-[#666] dark:text-[#9ca3af]">•</span>
            <Link to="/pc-components" className="font-['Poppins'] font-medium text-[#0e1c47] dark:text-[#eea137] text-[13px] sm:text-[14px] hover:underline transition-colors duration-200">
              PC Components
            </Link>
            <span className="text-[#666] dark:text-[#9ca3af]">•</span>
            <Link to="/help-center" className="font-['Poppins'] font-medium text-[#0e1c47] dark:text-[#eea137] text-[13px] sm:text-[14px] hover:underline transition-colors duration-200">
              Help Center
            </Link>
            <span className="text-[#666] dark:text-[#9ca3af]">•</span>
            <Link to="/contact-us" className="font-['Poppins'] font-medium text-[#0e1c47] dark:text-[#eea137] text-[13px] sm:text-[14px] hover:underline transition-colors duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

