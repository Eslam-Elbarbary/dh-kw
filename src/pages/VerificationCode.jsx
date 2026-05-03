import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmailRequest, resendVerificationCodeRequest } from '../services/auth.service';

const RESEND_SECONDS = 30;

export default function VerificationCode() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const pendingEmail = useMemo(() => {
    const raw = localStorage.getItem('pendingVerificationEmail');
    return raw ? String(raw).trim().toLowerCase() : '';
  }, []);
  const inputRefs = useRef([]);

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

    if (!pendingEmail) {
      setError('Missing email for verification. Please sign up again.');
      return;
    }

    const code = digits.join('').trim();
    if (code.length < 6) {
      setError('Please enter the full verification code.');
      return;
    }

    try {
      setLoading(true);
      await verifyEmailRequest({ email: pendingEmail.trim().toLowerCase(), code });
      localStorage.removeItem('pendingVerificationEmail');
      setSuccess('Email verified successfully. Please sign in.');
      navigate('/sign-in');
    } catch (err) {
      const message = err?.response?.data?.message || 'Verification failed. Please try again.';
      if (message.toLowerCase().includes('invalid verification code')) {
        setError('Invalid verification code. Please tap "Resend code" and use the latest code only.');
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');

    if (resendCooldown > 0) {
      return;
    }

    if (!pendingEmail) {
      setError('Missing email for verification. Please sign up again.');
      return;
    }

    try {
      setResending(true);
      await resendVerificationCodeRequest({ email: pendingEmail });
      setSuccess('Verification code sent again.');
      setResendCooldown(RESEND_SECONDS);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to resend verification code.';
      setError(message);
      if (message.toLowerCase().includes('too many')) {
        setResendCooldown(RESEND_SECONDS);
      }
    } finally {
      setResending(false);
    }
  };

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
    <div className="bg-[#f5f6f8] flex flex-col items-center justify-center px-[16px] sm:px-[24px] md:px-[32px] py-[32px] sm:py-[40px] md:py-[48px] min-h-screen" data-name="Container" data-node-id="35:4793">
      <div className="bg-[#fafafa] border border-[#e6e6e6] border-solid flex flex-col gap-[28px] sm:gap-[32px] w-full max-w-[620px] p-[20px] sm:p-[28px] md:p-[36px] rounded-[8px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)]" data-name="form" data-node-id="35:4794">
        <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0" data-node-id="35:4795">
          <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center min-w-full relative shrink-0 text-[#0e1c47] text-[32px] tracking-[-0.96px] w-[min-content]" data-node-id="35:4796">
            <p className="leading-none whitespace-pre-wrap" dir="auto">
              Email verification
            </p>
          </div>
          <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#121212] text-[16px] whitespace-nowrap" data-node-id="35:4797">
            <p className="leading-[normal]" dir="auto">
              Enter the verification code sent to your email
            </p>
          </div>
          {pendingEmail ? (
            <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#666] text-[14px] whitespace-nowrap">
              <p className="leading-[normal]" dir="auto">{pendingEmail}</p>
            </div>
          ) : null}
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4798">
          <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4799">
            <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
              Code
            </p>
          </div>
          <div className="content-stretch flex gap-[8px] sm:gap-[10px] items-start relative shrink-0 w-full" data-node-id="35:4800" onPaste={handlePaste}>
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
                autoFocus={index === 0}
                value={digit}
                onChange={(e) => handleCodeInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="border border-[#d7dbe0] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center h-[68px] min-h-px min-w-px px-[8px] py-[8px] relative rounded-[14px] shrink-0 font-['Poppins'] font-semibold text-[#121212] text-[28px] text-center focus:outline-none focus:border-[#0e1c47] focus:ring-2 focus:ring-[#0e1c47]/10 transition-colors"
              />
            ))}
          </div>
        </div>
        {error ? <p className="text-[#8e0909] font-['Poppins'] text-[14px]">{error}</p> : null}
        {success ? <p className="text-[#00a651] font-['Poppins'] text-[14px]">{success}</p> : null}
        <button onClick={handleVerify} disabled={loading} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[6px] shrink-0 w-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed" data-name="cta" data-node-id="35:4809">
          <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4811">
            <p className="leading-[1.2]" dir="auto">{loading ? 'Verifying...' : 'Verify'}</p>
          </div>
        </button>
        <button onClick={handleResend} disabled={resending || resendCooldown > 0} className="text-[#0e1c47] font-['Poppins'] font-medium text-[14px] underline disabled:opacity-60 disabled:cursor-not-allowed">
          {resending ? 'Resending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  );
}

