import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verifyPhoneRequest, resendVerificationCodeRequest } from '../services/auth.service';
import {
  getApiErrorMessage,
  isAlreadyVerifiedMessage,
  isInvalidVerificationCodeMessage,
} from '../utils/apiErrors';
import { normalizePhoneForApi, PENDING_VERIFICATION_DIAL_KEY } from '../utils/phoneE164';

const RESEND_SECONDS = 30;

function maskPhoneDisplay(phone) {
  const normalized = normalizePhoneForApi(phone);
  if (!normalized) return '';
  if (normalized.length <= 6) {
    return `${normalized.slice(0, 2)}•••${normalized.slice(-2)}`;
  }
  return `${normalized.slice(0, 4)} ••• •• ${normalized.slice(-3)}`;
}

function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

export default function VerificationCode() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(() => (
    sessionStorage.getItem('justSignedUp') === '1' ? RESEND_SECONDS : 0
  ));
  const phone = useMemo(() => {
    const raw = localStorage.getItem('pendingVerificationPhone');
    return raw ? normalizePhoneForApi(raw) : '';
  }, []);
  const verificationDialCode = useMemo(
    () => localStorage.getItem(PENDING_VERIFICATION_DIAL_KEY) || '',
    [],
  );
  const inputRefs = useRef([]);
  const alertRef = useRef(null);
  const phoneHint = maskPhoneDisplay(phone);

  const handleCodeInput = (index, value) => {
    const cleanedValue = value.replace(/\D/g, '');
    const next = [...digits];

    next[index] = cleanedValue.slice(-1);
    setDigits(next);

    if (cleanedValue && index < digits.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...digits];
    for (let i = 0; i < 6; i += 1) {
      next[i] = pasted[i] || '';
    }
    setDigits(next);

    const nextFocusIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleVerify = async () => {
    setError('');
    setSuccess('');

    const normalizedPhone = phone;
    if (!normalizedPhone) {
      setError('No phone number on file. Please sign up or sign in again.');
      return;
    }

    const code = digits.join('').trim();
    if (code.length < 6) {
      setError('Please enter the full verification code.');
      return;
    }

    try {
      setLoading(true);
      await verifyPhoneRequest({ phone: normalizedPhone, code, dialCode: verificationDialCode });
      localStorage.removeItem('pendingVerificationPhone');
      localStorage.removeItem(PENDING_VERIFICATION_DIAL_KEY);
      localStorage.removeItem('pendingVerificationEmail');
      setSuccess('Phone verified successfully. Please sign in.');
      navigate('/sign-in');
    } catch (err) {
      const message = getApiErrorMessage(err, 'Verification failed. Please try again.');

      if (isInvalidVerificationCodeMessage(message)) {
        setSuccess('');
        setError('The verification code is incorrect. Please check the code and try again, or tap "Resend SMS code".');
        setDigits(['', '', '', '', '', '']);
        window.requestAnimationFrame(() => {
          inputRefs.current[0]?.focus();
          alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        return;
      }

      if (isAlreadyVerifiedMessage(message)) {
        localStorage.removeItem('pendingVerificationPhone');
        localStorage.removeItem(PENDING_VERIFICATION_DIAL_KEY);
        localStorage.removeItem('pendingVerificationEmail');
        setError('');
        setSuccess('This phone number is already verified. You can sign in now.');
        window.setTimeout(() => navigate('/sign-in'), 2000);
        return;
      }

      setError(message);
      window.requestAnimationFrame(() => {
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (resending) {
      return;
    }

    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown}s before requesting another SMS code.`);
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');

    const normalizedPhone = phone;
    if (!normalizedPhone) {
      setError('No phone number on file. Please sign up or sign in again.');
      return;
    }

    try {
      setResending(true);
      const response = await resendVerificationCodeRequest({
        phone: normalizedPhone,
        dialCode: verificationDialCode,
      });
      localStorage.setItem('pendingVerificationPhone', normalizedPhone);
      const resendMessage = response?.message || 'Verification instructions sent successfully.';
      setSuccess(resendMessage);
      setResendCooldown(RESEND_SECONDS);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to resend verification code.');
      setError(message);
      window.requestAnimationFrame(() => {
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      if (message.toLowerCase().includes('too many')) {
        setResendCooldown(RESEND_SECONDS);
      }
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('justSignedUp') === '1') {
      sessionStorage.removeItem('justSignedUp');
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="bg-[#f5f6f8] dark:bg-[#0f172a] flex flex-col items-center justify-center px-[16px] sm:px-[24px] md:px-[32px] py-[32px] sm:py-[40px] md:py-[48px] min-h-screen transition-colors duration-300">
      <div className="bg-[#fafafa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid flex flex-col gap-[28px] sm:gap-[32px] w-full max-w-[520px] p-[20px] sm:p-[28px] md:p-[36px] rounded-[8px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] dark:shadow-[0px_0px_44px_0px_rgba(0,0,0,0.35)] transition-colors duration-300">
        <div className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[12px]">
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#eef4ff] dark:bg-[#1e3a5f] text-[#0e1c47] dark:text-[#93c5fd]">
                <PhoneIcon />
              </span>
              <h1 className="font-['Poppins'] font-semibold text-[#0e1c47] dark:text-white text-[28px] sm:text-[32px] tracking-[-0.96px] leading-none capitalize">
                Phone Verification
              </h1>
            </div>
            <p className="font-['Poppins'] font-normal text-[#121212] dark:text-[#cbd5e1] text-[15px] sm:text-[16px] leading-[1.45]">
              {phoneHint
                ? (
                  <>
                    Enter the 6-digit code we sent by SMS to{' '}
                    <span className="font-semibold text-[#0e1c47] dark:text-[#93c5fd] tabular-nums">{phoneHint}</span>.
                  </>
                )
                : 'Enter the 6-digit code we sent to your phone by SMS.'}
            </p>
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <p className="font-['Poppins'] font-semibold text-[#121212] dark:text-[#e5e7eb] text-[18px]">
              SMS Code
            </p>
            <div className="flex gap-[8px] sm:gap-[10px] w-full" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoFocus={index === 0 && Boolean(phone)}
                  aria-label={`Digit ${index + 1} of 6`}
                  value={digit}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="border border-[#d7dbe0] dark:border-[#334155] bg-white dark:bg-[#0f172a] dark:text-white border-solid flex flex-[1_0_0] items-center justify-center h-[68px] min-w-0 px-[8px] rounded-[14px] font-['Poppins'] font-semibold text-[#121212] dark:text-white text-[28px] text-center focus:outline-none focus:border-[#0e1c47] dark:focus:border-[#eea137] focus:ring-2 focus:ring-[#0e1c47]/10 dark:focus:ring-[#eea137]/20 transition-colors"
                />
              ))}
            </div>
          </div>

          <div ref={alertRef} className="w-full" aria-live="polite">
            {error ? (
              <p
                role="alert"
                className="rounded-[6px] border border-[#fecaca] bg-[#fef2f2] dark:bg-[#450a0a]/30 dark:border-[#7f1d1d] px-[12px] py-[10px] text-[#8e0909] dark:text-[#fecaca] font-['Poppins'] text-[14px] leading-[1.45]"
              >
                {error}
              </p>
            ) : null}
            {!error && success ? (
              <p
                role="status"
                className="rounded-[6px] border border-[#bbf7d0] bg-[#f0fdf4] dark:bg-[#14532d]/30 dark:border-[#166534] px-[12px] py-[10px] text-[#00a651] dark:text-[#86efac] font-['Poppins'] text-[14px] leading-[1.45]"
              >
                {success}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className="bg-[#0e1c47] cursor-pointer flex h-[56px] items-center justify-center p-[16px] rounded-[6px] w-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="font-['Poppins'] font-semibold text-[18px] text-white capitalize">
            {loading ? 'Verifying...' : 'Verify phone'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          aria-label="Resend SMS verification code"
          className="relative z-10 w-full min-h-[48px] py-[12px] px-[8px] text-[#0e1c47] dark:text-[#93c5fd] font-['Poppins'] font-medium text-[14px] underline text-center cursor-pointer bg-transparent border-0 rounded-[6px] hover:bg-[#eef4ff] dark:hover:bg-[#1e3a5f]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e1c47]/30 dark:focus-visible:ring-[#93c5fd]/40 transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          {resending ? 'Sending SMS...' : resendCooldown > 0 ? `Resend SMS in ${resendCooldown}s` : 'Resend SMS code'}
        </button>

        <Link
          to="/sign-in"
          className="w-full text-center text-[#64748b] dark:text-[#94a3b8] hover:text-[#0e1c47] dark:hover:text-[#93c5fd] font-['Poppins'] text-[14px] underline transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
