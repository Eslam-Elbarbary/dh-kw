// Report Fraud page component - exact Figma implementation
// Based on Figma design - Report Fraud Page

import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { submitFraudReport } from '../services/fraud-reports.service';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

function getSubmitErrorMessage(err) {
  const responseData = err?.response?.data;
  if (responseData?.message) return String(responseData.message);
  const errors = responseData?.errors;
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0];
    const val = errors[firstKey];
    if (Array.isArray(val) && val[0]) return String(val[0]);
  }
  return 'Could not submit your report right now. Please try again.';
}

export default function ReportFraud() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    last4Digits: '',
    cardType: 'visa',
    fraudDescription: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const continueBtnRef = useRef(null);

  const closeSuccess = useCallback(() => {
    setSuccessOpen(false);
  }, []);

  useEffect(() => {
    if (!successOpen) return undefined;
    continueBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeSuccess();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [successOpen, closeSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'last4Digits') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setFormData((prev) => ({ ...prev, last4Digits: digits }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      setSubmitting(true);
      const data = await submitFraudReport({
        full_name: formData.fullName,
        company_name: formData.companyName,
        email: formData.email,
        phone_number: formData.phone,
        card_last4: formData.last4Digits,
        card_type: formData.cardType,
        fraud_description: formData.fraudDescription,
      });
      const msg =
        (data && typeof data.message === 'string' && data.message.trim())
        || 'Fraud report submitted successfully.';
      setSuccessMessage(msg);
      setSuccessOpen(true);
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        last4Digits: '',
        cardType: 'visa',
        fraudDescription: '',
      });
    } catch (err) {
      setSubmitError(getSubmitErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen">
      {successOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[24px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fraud-success-title"
          aria-describedby="fraud-success-desc"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0e1c47]/45 backdrop-blur-[2px] cursor-default"
            aria-label="Close dialog"
            onClick={closeSuccess}
          />
          <div className="relative w-full max-w-[420px] bg-white rounded-[8px] shadow-[0_20px_50px_rgba(14,28,71,0.18)] border border-[#e6e6e6] p-[28px] sm:p-[32px]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-[16px] flex size-[56px] items-center justify-center rounded-full bg-[#ecfdf5] border border-[#a7f3d0]">
                <svg className="size-[28px] text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 id="fraud-success-title" className="font-['Poppins'] font-semibold text-[22px] sm:text-[24px] text-[#0e1c47] mb-[10px]">
                Report received
              </h2>
              <p id="fraud-success-desc" className="font-['Poppins'] text-[14px] sm:text-[15px] text-[#666] leading-relaxed mb-[24px]">
                {successMessage}
              </p>
              <button
                ref={continueBtnRef}
                type="button"
                onClick={closeSuccess}
                className="w-full sm:w-auto min-w-[200px] bg-[#0e1c47] text-white font-['Poppins'] font-semibold px-[28px] py-[12px] rounded-[4px] text-[15px] hover:bg-[#152a5c] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eea137] focus-visible:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-[40px] sm:gap-[50px] md:gap-[60px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[20px] sm:py-[30px] md:py-[40px]">
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full max-w-[800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-name="Breadcrumb">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#5f6c72] text-[14px] hover:text-[#eea137] transition-colors cursor-pointer">
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
          <p className="font-['Poppins'] font-medium leading-[20px] text-[#eea137] text-[14px]">
            Report Fraud
          </p>
        </div>

        {/* Report Fraud Form */}
        <div className="w-full max-w-[800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-0">
          <div className="bg-white border border-[#e4e7e9] border-solid rounded-[12px] p-[20px] sm:p-[24px] md:p-[32px]">
            {/* Form Title */}
            <h1 className="font-['Poppins'] font-semibold text-[#191c1f] text-[24px] sm:text-[28px] md:text-[32px] mb-[32px] sm:mb-[40px]">
              Report Fraud
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] sm:gap-[40px]">
              {submitError ? (
                <div
                  className="rounded-[4px] border border-red-200 bg-red-50 px-[14px] py-[12px] font-['Poppins'] text-[14px] text-red-800"
                  role="alert"
                >
                  {submitError}
                </div>
              ) : null}

              {/* Personal Information Section */}
              <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <h2 className="font-['Poppins'] font-medium leading-[24px] text-[18px] sm:text-[20px] text-black w-full">
                  Personal Information
                </h2>
                
                {/* Full Name and Company Name */}
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Company Name (Optional)
                    </label>
                    <input 
                      type="text" 
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card Information Section */}
              <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <h2 className="font-['Poppins'] font-medium leading-[24px] text-[18px] sm:text-[20px] text-black w-full">
                  Card Information
                </h2>
                
                {/* Last 4 Digits and Card Type */}
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Last 4 Digits of Card
                    </label>
                    <input 
                      type="text" 
                      name="last4Digits"
                      value={formData.last4Digits}
                      onChange={handleChange}
                      inputMode="numeric"
                      pattern="[0-9]{4}"
                      maxLength={4}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="****"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                      Card Type
                    </label>
                    <select
                      name="cardType"
                      value={formData.cardType}
                      onChange={handleChange}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white"
                      required
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="american_express">American Express</option>
                      <option value="discover">Discover</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fraud Details Section */}
              <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <h2 className="font-['Poppins'] font-medium leading-[24px] text-[18px] sm:text-[20px] text-black w-full">
                  Fraud Details
                </h2>
                
                <div className="flex flex-col gap-[8px] w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                    Fraud Description
                  </label>
                  <textarea 
                    name="fraudDescription"
                    value={formData.fraudDescription}
                    onChange={handleChange}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full min-h-[120px] sm:min-h-[150px] resize-y"
                    placeholder="Please describe the suspicious activity, transaction date, amount, and any relevant details."
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[24px] sm:px-[32px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[14px] sm:text-[16px] w-full sm:w-auto self-start disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

