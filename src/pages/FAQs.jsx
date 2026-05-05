// FAQs page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFaqs } from '../services/faqs.service';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function FAQs() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;
    const loadFaqs = async () => {
      try {
        setLoading(true);
        setError('');
        const list = await getFaqs();
        if (!cancelled) setFaqs(list);
      } catch (err) {
        if (!cancelled) {
          setFaqs([]);
          setError(err?.response?.data?.message || 'Could not load FAQs right now.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadFaqs();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(faqs.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [faqs]);

  const filteredFaqs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

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
            FAQs
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Frequently Asked Questions
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Find answers to the most common questions about our products, services, and policies.
          </p>
        </div>

        {/* Category Filter */}
        <div className="w-full">
          <div className="flex flex-wrap gap-[12px] sm:gap-[16px]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-['Poppins'] font-medium px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] rounded-[4px] transition-colors text-[14px] sm:text-[16px] ${
                  selectedCategory === category
                    ? 'bg-[#eea137] text-white'
                    : 'bg-white border border-[#e6e6e6] text-[#0e1c47] hover:border-[#eea137]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="w-full">
          <div className="flex flex-col gap-[12px] sm:gap-[16px]">
            {loading ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[32px] text-center">
                <p className="font-['Poppins'] font-normal text-[15px] text-[#666]">Loading FAQs...</p>
              </div>
            ) : error ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[32px] text-center">
                <p className="font-['Poppins'] font-normal text-[15px] text-[#8e0909]">{error}</p>
              </div>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-[16px] sm:p-[20px] text-left hover:bg-[#f8f9fa] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <span className="font-['Poppins'] font-medium text-[12px] sm:text-[14px] text-[#eea137] bg-[#fff4e6] px-[8px] py-[2px] rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#0e1c47]">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-[20px] h-[20px] text-[#666] transition-transform shrink-0 ${openFaq === faq.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-[16px] sm:px-[20px] pb-[16px] sm:pb-[20px] border-t border-[#e6e6e6]">
                      <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] leading-relaxed pt-[12px]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[32px] text-center">
                <p className="font-['Poppins'] font-normal text-[15px] text-[#666]">No FAQs found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
          <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
            Still have questions?
          </h2>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
            Can't find the answer you're looking for? Please contact our friendly team.
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

