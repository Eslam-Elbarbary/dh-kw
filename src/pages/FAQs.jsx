// FAQs page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Icon Assets
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";

export default function FAQs() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "General",
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. To initiate a return, please visit your order history and select the item you wish to return."
    },
    {
      id: 2,
      category: "Shipping",
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping options are available for 2-3 business day delivery. International shipping times vary by location."
    },
    {
      id: 3,
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, Venmo, Amazon Pay, and cash on delivery. All transactions are secure and encrypted for your protection."
    },
    {
      id: 4,
      category: "Orders",
      question: "How can I track my order?",
      answer: "You can track your order by visiting the Track Order page and entering your order ID. You'll receive real-time updates on your order status, from placement to delivery."
    },
    {
      id: 5,
      category: "Account",
      question: "How do I create an account?",
      answer: "Click on 'Sign In' in the header, then select 'Sign Up'. Enter your phone number and follow the verification process to create your account."
    },
    {
      id: 6,
      category: "Products",
      question: "Are your products authentic?",
      answer: "Yes, all our products are 100% authentic. We source directly from authorized distributors and manufacturers to ensure authenticity and quality."
    },
    {
      id: 7,
      category: "Shipping",
      question: "Do you ship internationally?",
      answer: "Yes, we ship to many countries worldwide. Shipping costs and delivery times vary by destination. Check our shipping page for more details."
    },
    {
      id: 8,
      category: "Returns",
      question: "How do I return an item?",
      answer: "To return an item, log into your account, go to your order history, and select the item you want to return. Follow the return process and you'll receive a return label. Items must be in original condition."
    },
    {
      id: 9,
      category: "Payment",
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption and secure payment gateways to protect your financial information. We never store your full payment details."
    },
    {
      id: 10,
      category: "Account",
      question: "I forgot my password. How do I reset it?",
      answer: "Click on 'Sign In' and then 'Forgot Password'. Enter your registered email or phone number, and we'll send you instructions to reset your password."
    }
  ];

  const categories = ["All", "General", "Shipping", "Payment", "Orders", "Account", "Products", "Returns"];

  const [selectedCategory, setSelectedCategory] = useState("All");

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
            {filteredFaqs.map((faq) => (
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
            ))}
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

