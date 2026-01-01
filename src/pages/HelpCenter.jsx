// Help Center page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Icon Assets (from existing components)
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgPhone = "https://www.figma.com/api/mcp/asset/4d564cb0-8338-4267-86a3-dfd6078c6d49"; // From Header
const imgTruck = "https://www.figma.com/api/mcp/asset/44bb4a15-1b33-43cb-b03c-a87b32237591"; // From Header
const imgArrowRight = "https://www.figma.com/api/mcp/asset/c993c6e9-76bd-4fc1-8f76-8c9f70ebc1a0";

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 1,
      title: "Orders & Shipping",
      icon: imgTruck,
      description: "Track orders, shipping info, and delivery",
      color: "bg-[#0e1c47]"
    },
    {
      id: 2,
      title: "Returns & Refunds",
      icon: imgArrowRight,
      description: "Return policies and refund process",
      color: "bg-[#eea137]"
    },
    {
      id: 3,
      title: "Payment & Billing",
      icon: imgPhone,
      description: "Payment methods and billing questions",
      color: "bg-[#0e1c47]"
    },
    {
      id: 4,
      title: "Account & Profile",
      icon: imgPhone,
      description: "Account settings and profile management",
      color: "bg-[#eea137]"
    },
    {
      id: 5,
      title: "Products & Services",
      icon: imgTruck,
      description: "Product information and services",
      color: "bg-[#0e1c47]"
    },
    {
      id: 6,
      title: "Technical Support",
      icon: imgArrowRight,
      description: "Technical issues and troubleshooting",
      color: "bg-[#eea137]"
    }
  ];

  const popularQuestions = [
    {
      id: 1,
      category: "Orders & Shipping",
      question: "How can I track my order?",
      answer: "You can track your order by visiting the Track Order page and entering your order ID. You'll receive real-time updates on your order status, from placement to delivery."
    },
    {
      id: 2,
      category: "Returns & Refunds",
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. To initiate a return, please visit your order history and select the item you wish to return."
    },
    {
      id: 3,
      category: "Payment & Billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, Venmo, Amazon Pay, and cash on delivery. All transactions are secure and encrypted for your protection."
    },
    {
      id: 4,
      category: "Shipping",
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping options are available for 2-3 business day delivery. International shipping times vary by location."
    },
    {
      id: 5,
      category: "Account & Profile",
      question: "How do I update my account information?",
      answer: "You can update your account information by logging into your account and navigating to the Account Settings page. From there, you can update your personal details, shipping addresses, and payment methods."
    },
    {
      id: 6,
      category: "Technical Support",
      question: "I'm having trouble accessing my account. What should I do?",
      answer: "If you're having trouble accessing your account, try resetting your password using the 'Forgot Password' link on the sign-in page. If the issue persists, please contact our support team for assistance."
    }
  ];

  const filteredQuestions = popularQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Help Center
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            How can we help you?
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[600px]">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-[700px] mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[50px] sm:h-[56px] md:h-[60px] px-[20px] sm:px-[24px] pr-[60px] border-2 border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
            />
            <button className="absolute right-[8px] top-1/2 -translate-y-1/2 bg-[#eea137] hover:bg-[#d8902f] text-white font-['Poppins'] font-semibold px-[20px] sm:px-[24px] h-[36px] sm:h-[40px] md:h-[44px] rounded-[4px] transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="w-full">
          <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px]">
            {faqCategories.map((category) => (
              <Link
                key={category.id}
                to="#"
                className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[20px] sm:p-[24px] hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`${category.color} w-[56px] h-[56px] rounded-full flex items-center justify-center mb-[16px] group-hover:scale-110 transition-transform`}>
                  <img 
                    alt={category.title} 
                    className="w-[28px] h-[28px] object-contain filter brightness-0 invert" 
                    src={category.icon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  {category.title}
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Questions */}
        <div className="w-full">
          <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
            {searchQuery ? `Search Results (${filteredQuestions.length})` : 'Popular Questions'}
          </h2>
          <div className="flex flex-col gap-[12px] sm:gap-[16px]">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((faq) => (
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
            ) : searchQuery ? (
              <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[40px] text-center">
                <p className="font-['Poppins'] font-normal text-[16px] text-[#666]">
                  No results found for "{searchQuery}". Try different keywords or browse our categories above.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
          <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
            Still need help?
          </h2>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
            Our support team is here to help you 24/7. Get in touch with us through any of these channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] justify-center items-center">
            <Link
              to="/track-order"
              className="bg-white text-[#0e1c47] font-['Poppins'] font-semibold px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] hover:bg-[#f0f0f0] transition-colors flex items-center gap-[8px]"
            >
              <img alt="" className="w-[20px] h-[20px]" src={imgTruck} onError={(e) => e.target.style.display = 'none'} />
              <span>Track Order</span>
            </Link>
            <a
              href="tel:+965XXXXXXX"
              className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors flex items-center gap-[8px]"
            >
              <img alt="" className="w-[20px] h-[20px] filter brightness-0 invert" src={imgPhone} onError={(e) => e.target.style.display = 'none'} />
              <span>Call Us: +965 XXX XXXX</span>
            </a>
            <Link
              to="/report-fraud"
              className="bg-transparent border-2 border-white text-white font-['Poppins'] font-semibold px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] hover:bg-white hover:text-[#0e1c47] transition-colors"
            >
              Report Fraud
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

