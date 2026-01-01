// Scroll To Top Component - matches site's visual identity
// Scrolls to top on route changes and provides scroll-to-top button

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[24px] sm:bottom-[32px] right-[16px] sm:right-[24px] md:right-[32px] lg:right-[40px] z-50 bg-[#eea137] hover:bg-[#d8902f] text-white rounded-full size-[48px] sm:size-[52px] md:size-[56px] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <svg
            className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] md:w-[28px] md:h-[28px] transform group-hover:-translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
}
