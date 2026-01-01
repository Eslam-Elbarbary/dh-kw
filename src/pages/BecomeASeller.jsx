// Become A Seller page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Icon Assets (from existing components)
const imgArrowDown = "https://www.figma.com/api/mcp/asset/11c6c4cc-49be-4c6e-beee-5f1767680185";
const imgVuesaxLinearUser = "https://www.figma.com/api/mcp/asset/6864330c-0bbe-4530-8845-063f68683f34";

export default function BecomeASeller() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    website: '',
    description: '',
    agreeToTerms: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will review your application and contact you soon.');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const benefits = [
    {
      icon: "💰",
      title: "Earn More",
      description: "Set your own prices and maximize your profits"
    },
    {
      icon: "📈",
      title: "Grow Your Business",
      description: "Reach millions of customers worldwide"
    },
    {
      icon: "🚀",
      title: "Easy Setup",
      description: "Get started in minutes with our simple onboarding"
    },
    {
      icon: "🛡️",
      title: "Secure Payments",
      description: "Get paid securely and on time"
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track your sales and performance in real-time"
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Our team is here to help you succeed"
    }
  ];

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
            Become A Seller
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            Start Selling Today
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Join thousands of successful sellers on our platform. Set up your store in minutes and start reaching customers worldwide.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="w-full">
          <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px] text-center">
            Why Sell With Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[24px]">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[20px] sm:p-[24px] hover:shadow-lg transition-all"
              >
                <div className="text-[40px] mb-[12px]">{benefit.icon}</div>
                <h3 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] text-[#0e1c47] mb-[8px]">
                  {benefit.title}
                </h3>
                <p className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="w-full max-w-[900px] mx-auto">
          <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
            {/* Progress Steps */}
            <div className="mb-[32px] sm:mb-[40px]">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center flex-1 relative">
                    {/* Progress Line */}
                    {step < totalSteps && (
                      <div className={`absolute top-[20px] left-[50%] right-0 h-[2px] ${
                        step < currentStep ? 'bg-[#0e1c47]' : 'bg-[#e6e6e6]'
                      }`} style={{ zIndex: 0 }}></div>
                    )}
                    {/* Step Circle and Label */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className={`size-[40px] rounded-full flex items-center justify-center font-['Poppins'] font-semibold text-[16px] mb-[12px] ${
                        step === currentStep 
                          ? 'bg-[#eea137] text-white' 
                          : step < currentStep 
                          ? 'bg-[#0e1c47] text-white' 
                          : 'bg-[#e6e6e6] text-[#666]'
                      }`}>
                        {step < currentStep ? '✓' : step}
                      </div>
                      <span className={`text-[12px] sm:text-[14px] font-['Poppins'] font-medium text-center ${
                        step === currentStep ? 'text-[#eea137]' : 'text-[#666]'
                      }`}>
                        {step === 1 ? 'Personal Info' : step === 2 ? 'Business Details' : 'Review & Submit'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-[20px] sm:gap-[24px]">
                  <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[8px]">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-[20px]">
                    <div>
                      <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-[20px] sm:gap-[24px]">
                  <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[8px]">
                    Business Details
                  </h3>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors bg-white"
                    >
                      <option value="">Select Business Type</option>
                      <option value="individual">Individual</option>
                      <option value="sole-proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="corporation">Corporation</option>
                      <option value="llc">LLC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Tax ID / EIN
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-[20px]">
                    <div>
                      <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-[20px]">
                    <div>
                      <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full h-[44px] sm:h-[48px] px-[16px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px]">
                      Business Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us about your business..."
                      className="w-full px-[16px] py-[12px] border border-[#e6e6e6] rounded-[4px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-[20px] sm:gap-[24px]">
                  <h3 className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] text-[#0e1c47] mb-[8px]">
                    Review Your Information
                  </h3>
                  <div className="bg-[#f8f9fa] border border-[#e6e6e6] rounded-[4px] p-[20px] sm:p-[24px] space-y-[16px]">
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#666] mb-[4px]">Name</p>
                      <p className="font-['Poppins'] font-normal text-[16px] text-[#0e1c47]">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#666] mb-[4px]">Email</p>
                      <p className="font-['Poppins'] font-normal text-[16px] text-[#0e1c47]">{formData.email}</p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#666] mb-[4px]">Phone</p>
                      <p className="font-['Poppins'] font-normal text-[16px] text-[#0e1c47]">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#666] mb-[4px]">Business Name</p>
                      <p className="font-['Poppins'] font-normal text-[16px] text-[#0e1c47]">{formData.businessName}</p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#666] mb-[4px]">Business Type</p>
                      <p className="font-['Poppins'] font-normal text-[16px] text-[#0e1c47] capitalize">{formData.businessType.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="font-['Poppins'] font-semibold text-[14px] text-[#666] mb-[4px]">Address</p>
                      <p className="font-['Poppins'] font-normal text-[16px] text-[#0e1c47]">{formData.address}, {formData.city}, {formData.country} {formData.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-[12px]">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className="mt-[4px] size-[20px] border-[#e6e6e6] rounded-[4px] focus:ring-2 focus:ring-[#eea137] cursor-pointer"
                    />
                    <label htmlFor="agreeToTerms" className="font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#666] cursor-pointer">
                      I agree to the <Link to="#" className="text-[#eea137] hover:underline">Terms and Conditions</Link> and <Link to="#" className="text-[#eea137] hover:underline">Privacy Policy</Link> *
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-[32px] sm:mt-[40px] pt-[24px] border-t border-[#e6e6e6]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-white border-2 border-[#0e1c47] text-[#0e1c47] font-['Poppins'] font-semibold px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] hover:bg-[#f8f9fa] transition-colors"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors ml-auto"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors ml-auto"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

