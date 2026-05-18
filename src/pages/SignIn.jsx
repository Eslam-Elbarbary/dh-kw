import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../services/auth.service';

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerificationPhone, setPendingVerificationPhone] = useState('');
  const [hidePendingNotice, setHidePendingNotice] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const pendingFromSignup = sessionStorage.getItem('postSignupPendingPhone');
    if (pendingFromSignup) {
      const normalized = String(pendingFromSignup).trim();
      setPendingVerificationPhone(normalized);
      sessionStorage.removeItem('postSignupPendingPhone');
      return;
    }
    const pendingStored = localStorage.getItem('pendingVerificationPhone');
    if (pendingStored) {
      setPendingVerificationPhone(String(pendingStored).trim());
    }
  }, []);

  const getReadableError = (err) => {
    const responseData = err?.response?.data;
    const rawMessage = String(responseData?.message || '').trim();
    const normalizedMessage = rawMessage.toLowerCase();

    if (
      normalizedMessage.includes('credentials do not match')
      || normalizedMessage.includes('invalid email or password')
      || err?.response?.status === 401
    ) {
      return 'The email or password you entered is incorrect. Please try again.';
    }

    if (rawMessage) {
      return rawMessage;
    }

    if (typeof responseData?.error === 'string') {
      return responseData.error;
    }

    if (responseData?.errors && typeof responseData.errors === 'object') {
      const firstErrorGroup = Object.values(responseData.errors)[0];
      if (Array.isArray(firstErrorGroup) && firstErrorGroup[0]) {
        return firstErrorGroup[0];
      }
    }

    if (!err?.response) {
      return 'Cannot reach server. Please check API URL or CORS settings.';
    }

    return 'Sign in failed. Please try again.';
  };

  const isUnverifiedAccountError = (message) => {
    const normalized = String(message || '').toLowerCase();
    return normalized.includes('not verified')
      || normalized.includes('verify your account')
      || normalized.includes('verify your email')
      || normalized.includes('verify your phone')
      || normalized.includes('email is not verified')
      || normalized.includes('phone is not verified')
      || normalized.includes('phone not verified');
  };

  const goToPhoneVerification = () => {
    const storedPhone = localStorage.getItem('pendingVerificationPhone');
    if (storedPhone) {
      localStorage.setItem('pendingVerificationPhone', String(storedPhone).trim());
    }
    navigate('/verification');
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError('');

    if (!apiBaseUrl) {
      setError('API base URL is missing. Add VITE_API_BASE_URL in your .env file.');
      return;
    }

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await loginRequest({
        login: identifier.trim().toLowerCase(),
        password,
      });

      const token = response?.token || response?.access_token || response?.data?.token || response?.data?.access_token;

      if (!token) {
        throw new Error('No token returned from login endpoint.');
      }

      localStorage.setItem('token', token);
      const profile = response?.user || response?.data?.user || { email: identifier.trim().toLowerCase() };
      const profileCountryId = profile?.country_id ?? profile?.countryId;
      if (profileCountryId && localStorage.getItem('countryManuallySelected') !== '1') {
        localStorage.setItem('selectedCountryId', String(profileCountryId));
      }
      login(profile);
      const redirectTarget = sessionStorage.getItem('signInRedirect');
      if (redirectTarget) {
        sessionStorage.removeItem('signInRedirect');
        navigate(redirectTarget);
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = getReadableError(err);
      setError(message);
      if (isUnverifiedAccountError(message)) {
        const storedPhone = localStorage.getItem('pendingVerificationPhone');
        if (storedPhone) {
          setPendingVerificationPhone(String(storedPhone).trim());
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'border border-[#d7dbe0] dark:border-[#334155] bg-white dark:bg-[#0f172a] dark:text-white border-solid flex h-[52px] items-start justify-center p-[12px] rounded-[6px] font-[\'Poppins\'] font-normal text-[#111827] text-[16px] w-full placeholder:text-[#9ca3af] dark:placeholder:text-[#64748b] focus:outline-none focus:border-[#0e1c47] dark:focus:border-[#eea137] focus:ring-2 focus:ring-[#0e1c47]/10 dark:focus:ring-[#eea137]/20 transition-colors';

  return (
    <div
      className="bg-[#f5f6f8] dark:bg-[#0f172a] flex flex-col items-center justify-center px-[16px] sm:px-[24px] md:px-[32px] py-[32px] sm:py-[40px] md:py-[48px] min-h-screen transition-colors duration-300"
      data-name="Sign / Email"
      data-node-id="35:4702"
    >
      <form
        onSubmit={handleSignIn}
        className="bg-[#fafafa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid flex flex-col gap-[28px] sm:gap-[32px] w-full max-w-[520px] p-[20px] sm:p-[28px] md:p-[36px] rounded-[8px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] dark:shadow-[0px_0px_44px_0px_rgba(0,0,0,0.35)] transition-colors duration-300"
        data-name="form"
        data-node-id="35:4703"
      >
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4704">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="35:4705">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#0e1c47] dark:text-white text-[32px] tracking-[-0.96px] w-full" data-node-id="35:4706">
              <p className="leading-none whitespace-pre-wrap" dir="auto">
                Sign in
              </p>
            </div>
            <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#121212] dark:text-[#cbd5e1] text-[16px] w-full" data-node-id="35:4707">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Enter your email to sign in
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4708">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4709">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Email
              </p>
            </div>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={inputClass}
              placeholder="Enter your email"
              autoComplete="email"
              data-node-id="35:4721"
            />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4723">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4724">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Password
              </p>
            </div>
            <div className="border border-[#e6e6e6] dark:border-[#334155] bg-white dark:bg-[#0f172a] border-solid content-stretch flex h-[48px] items-center justify-between px-[8px] relative rounded-[4px] shrink-0 w-full focus-within:border-[#0e1c47] dark:focus-within:border-[#eea137] focus-within:ring-2 focus-within:ring-[#0e1c47]/10 dark:focus-within:ring-[#eea137]/20 transition-colors" data-node-id="35:4725">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111827] dark:text-white text-[16px] placeholder:text-[#9ca3af] dark:placeholder:text-[#64748b] flex-1 outline-none border-none bg-transparent"
                placeholder="Enter your password"
                autoComplete="current-password"
                data-node-id="35:4726"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="shrink-0 flex items-center justify-center size-[32px] rounded-[6px] text-[#94a3b8] dark:text-[#94a3b8] hover:text-[#0e1c47] dark:hover:text-[#eea137] hover:bg-[#f8fafc] dark:hover:bg-[#334155] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e1c47]/25 dark:focus-visible:ring-[#eea137]/25 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 01-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="cta" data-node-id="35:4731">
          {pendingVerificationPhone && !hidePendingNotice ? (
            <div className="w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[8px] px-[12px] py-[10px] font-['Poppins'] text-[13px] text-[#334155] dark:text-[#cbd5e1] leading-[1.45] flex items-start justify-between gap-[10px]">
              <div>
                <p>
                  Phone verification pending for <span className="font-semibold text-[#0f172a] dark:text-white">{pendingVerificationPhone}</span>.
                </p>
                <button
                  type="button"
                  onClick={goToPhoneVerification}
                  className="mt-[4px] text-[#0e1c47] dark:text-[#93c5fd] font-semibold underline hover:opacity-80 transition-opacity"
                >
                  Verify now
                </button>
              </div>
              <button
                type="button"
                onClick={() => setHidePendingNotice(true)}
                className="text-[#94a3b8] hover:text-[#64748b] transition-colors leading-none pt-[2px]"
                aria-label="Dismiss verification reminder"
              >
                ×
              </button>
            </div>
          ) : null}
          <Link to="/forgot-password" className="text-[#0e1c47] dark:text-[#93c5fd] font-['Poppins'] text-[14px] underline w-full text-right">
            Forgot password?
          </Link>
          {error ? (
            <div className="text-[#8e0909] text-[14px] font-['Poppins'] w-full">{error}</div>
          ) : null}
          {error && isUnverifiedAccountError(error) ? (
            <button
              type="button"
              onClick={goToPhoneVerification}
              className="w-full bg-[#eef4ff] dark:bg-[#1e3a5f] border border-[#bfdbfe] dark:border-[#334155] text-[#0e1c47] dark:text-[#93c5fd] rounded-[6px] px-[12px] py-[10px] text-left font-['Poppins'] text-[13px] hover:bg-[#e6efff] dark:hover:bg-[#1e40af] transition-colors"
            >
              Verify your phone now
            </button>
          ) : null}
          <button
            type="button"
            onClick={goToPhoneVerification}
            className="w-full border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-[#0e1c47] dark:text-[#93c5fd] rounded-[6px] px-[12px] py-[12px] font-['Poppins'] text-[14px] font-medium hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors"
          >
            Verify your phone (SMS code)
          </button>
          <button type="submit" disabled={loading} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[6px] shrink-0 w-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed" data-name="btn-01" data-node-id="35:4732">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4733">
              <p className="leading-[1.2]" dir="auto">
                {loading ? 'Signing in...' : 'Sign in'}
              </p>
            </div>
          </button>
          <Link to="/sign-up" className="content-stretch flex items-center justify-center p-[12px] relative rounded-[4px] shrink-0 w-full hover:opacity-80 transition-opacity" data-name="btn-02" data-node-id="35:4734">
            <div className="capitalize flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] dark:text-[#93c5fd] text-[16px] tracking-[-0.16px] whitespace-nowrap" data-node-id="35:4735">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.2] underline">Don&apos;t have an account? Sign up</p>
            </div>
          </Link>
        </div>
      </form>
    </div>
  );
}

