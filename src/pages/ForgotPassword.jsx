import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  resetPasswordSendCodeRequest,
  resetPasswordVerifyCodeRequest,
  resetPasswordSetNewPasswordRequest,
} from '../services/auth.service';

const SEND_CODE_COOLDOWN_SECONDS = 30;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendCodeCooldown, setSendCodeCooldown] = useState(0);

  useEffect(() => {
    if (sendCodeCooldown <= 0) return undefined;

    const timer = window.setInterval(() => {
      setSendCodeCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sendCodeCooldown]);

  const handleSendCode = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setResetToken('');

    if (sendCodeCooldown > 0) {
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordSendCodeRequest({ email: email.trim().toLowerCase() });
      setSuccess('Reset code sent successfully.');
      setSendCodeCooldown(SEND_CODE_COOLDOWN_SECONDS);
      setStep(2);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to send reset code.';
      setError(message);
      if (message.toLowerCase().includes('too many')) {
        setSendCodeCooldown(SEND_CODE_COOLDOWN_SECONDS);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim()) {
      setError('Please enter the reset code.');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPasswordVerifyCodeRequest({ email: email.trim(), code: code.trim() });
      const tokenFromResponse =
        response?.reset_token ||
        response?.token ||
        response?.data?.reset_token ||
        response?.data?.token ||
        response?.payload?.reset_token ||
        response?.payload?.token ||
        '';

      setResetToken(String(tokenFromResponse || '').trim());
      setSuccess('Code verified successfully.');
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!password.trim() || !passwordConfirmation.trim()) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPasswordSetNewPasswordRequest({
        email: email.trim(),
        code: code.trim(),
        resetToken,
        password,
        passwordConfirmation,
      });
      setSuccess('Password reset successfully. Please sign in.');
      navigate('/sign-in');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to set new password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f6f8] flex flex-col items-center justify-center px-[16px] sm:px-[24px] md:px-[32px] py-[32px] sm:py-[40px] md:py-[48px] min-h-screen">
      <form
        onSubmit={step === 1 ? handleSendCode : step === 2 ? handleVerifyCode : handleSetNewPassword}
        className="bg-[#fafafa] border border-[#e6e6e6] border-solid flex flex-col gap-[24px] w-full max-w-[520px] p-[20px] sm:p-[28px] md:p-[36px] rounded-[8px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)]"
      >
        <div className="flex flex-col gap-[8px] w-full">
          <h1 className="font-['Poppins'] font-semibold text-[#0e1c47] text-[32px] leading-none">Reset Password</h1>
          <p className="font-['Poppins'] font-normal text-[#121212] text-[16px]">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the code sent to your email'}
            {step === 3 && 'Set your new password'}
          </p>
        </div>

        <div className="flex flex-col gap-[16px] w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step !== 1}
            placeholder="Enter your email"
            className="border border-[#d7dbe0] h-[52px] p-[12px] rounded-[6px] font-['Poppins'] text-[#111827] text-[16px] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0e1c47] focus:ring-2 focus:ring-[#0e1c47]/10 disabled:bg-[#f1f1f1]"
          />

          {step >= 2 ? (
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter reset code"
              className="border border-[#d7dbe0] h-[52px] p-[12px] rounded-[6px] font-['Poppins'] text-[#111827] text-[16px] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0e1c47] focus:ring-2 focus:ring-[#0e1c47]/10"
            />
          ) : null}

          {step === 3 ? (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="border border-[#d7dbe0] h-[52px] p-[12px] rounded-[6px] font-['Poppins'] text-[#111827] text-[16px] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0e1c47] focus:ring-2 focus:ring-[#0e1c47]/10"
              />
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm new password"
                className="border border-[#d7dbe0] h-[52px] p-[12px] rounded-[6px] font-['Poppins'] text-[#111827] text-[16px] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0e1c47] focus:ring-2 focus:ring-[#0e1c47]/10"
              />
            </>
          ) : null}
        </div>

        {error ? <p className="text-[#8e0909] text-[14px] font-['Poppins']">{error}</p> : null}
        {success ? <p className="text-[#00a651] text-[14px] font-['Poppins']">{success}</p> : null}

        <button
          type="submit"
          disabled={loading || (step === 1 && sendCodeCooldown > 0)}
          className="bg-[#0e1c47] h-[56px] rounded-[6px] text-white font-['Poppins'] font-semibold text-[18px] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Please wait...'
            : step === 1
              ? sendCodeCooldown > 0
                ? `Send Code in ${sendCodeCooldown}s`
                : 'Send Code'
              : step === 2
                ? 'Verify Code'
                : 'Set New Password'}
        </button>

        <Link to="/sign-in" className="text-[#0e1c47] font-['Poppins'] text-[16px] underline text-center">
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}
