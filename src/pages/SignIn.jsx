import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../services/auth.service';

// Eye icon for password visibility - using inline SVG
const imgGroup = "data:image/svg+xml,%3Csvg width='20' height='13' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0C5.5 0 1.73 3.11 0 7.5c1.73 4.39 5.5 7.5 10 7.5s8.27-3.11 10-7.5C18.27 3.11 14.5 0 10 0zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' fill='%23999'/%3E%3C/svg%3E";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const getReadableError = (err) => {
    const responseData = err?.response?.data;

    if (responseData?.message) {
      return responseData.message;
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

    if (err?.response?.status === 401) {
      return 'Invalid email or password.';
    }

    if (responseData?.message === 'These credentials do not match our records.') {
      return 'Email or password is incorrect. If you just changed password, use the new one exactly and try again.';
    }

    if (!err?.response) {
      return 'Cannot reach server. Please check API URL or CORS settings.';
    }

    return 'Sign in failed. Please try again.';
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
      if (profileCountryId) {
        localStorage.setItem('selectedCountryId', String(profileCountryId));
      }
      login(profile);
      navigate('/');
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f6f8] flex flex-col items-center justify-center px-[16px] sm:px-[24px] md:px-[32px] py-[32px] sm:py-[40px] md:py-[48px] min-h-screen" data-name="Sign / Email" data-node-id="35:4702">
      <form onSubmit={handleSignIn} className="bg-[#fafafa] border border-[#e6e6e6] border-solid flex flex-col gap-[28px] sm:gap-[32px] w-full max-w-[520px] p-[20px] sm:p-[28px] md:p-[36px] rounded-[8px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)]" data-name="form" data-node-id="35:4703">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4704">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="35:4705">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#0e1c47] text-[32px] tracking-[-0.96px] w-full" data-node-id="35:4706">
              <p className="leading-none whitespace-pre-wrap" dir="auto">
                Sign in
              </p>
            </div>
            <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#121212] text-[16px] w-full" data-node-id="35:4707">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Enter your email to sign in
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4708">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4709">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Email
              </p>
            </div>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="border border-[#d7dbe0] border-solid flex h-[52px] items-start justify-center p-[12px] rounded-[6px] font-['Poppins'] font-normal text-[#111827] text-[16px] w-full placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0e1c47] focus:ring-2 focus:ring-[#0e1c47]/10 transition-colors"
              placeholder="Enter your email"
              autoComplete="email"
              data-node-id="35:4721"
            />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4723">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4724">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Password
              </p>
            </div>
            <div className="border border-[#e6e6e6] border-solid content-stretch flex h-[48px] items-center justify-between p-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4725">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111827] text-[16px] placeholder:text-[#9ca3af] flex-1 outline-none border-none bg-transparent" placeholder="Enter your password" autoComplete="current-password" data-node-id="35:4726" />
              <div className="h-[13px] overflow-clip relative shrink-0 w-[20px]" data-name="Frame" data-node-id="35:4727">
                <div className="absolute contents inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4728">
                  <div className="absolute inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4729">
                    <img alt="" className="block max-w-none size-full" src={imgGroup} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="cta" data-node-id="35:4731">
          <Link to="/forgot-password" className="text-[#0e1c47] font-['Poppins'] text-[14px] underline w-full text-right">
            Forgot password?
          </Link>
          {error ? (
            <div className="text-[#8e0909] text-[14px] font-['Poppins'] w-full">{error}</div>
          ) : null}
          <button type="submit" disabled={loading} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[6px] shrink-0 w-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed" data-name="btn-01" data-node-id="35:4732">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4733">
              <p className="leading-[1.2]" dir="auto">
                {loading ? 'Signing in...' : 'Sign in'}
              </p>
            </div>
          </button>
          <Link to="/sign-up" className="content-stretch flex items-center justify-center p-[12px] relative rounded-[4px] shrink-0 w-full hover:opacity-80 transition-opacity" data-name="btn-02" data-node-id="35:4734">
            <div className="capitalize flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] text-[16px] tracking-[-0.16px] whitespace-nowrap" data-node-id="35:4735">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.2] underline">Don't have an account? Sign up</p>
            </div>
          </Link>
        </div>
      </form>
    </div>
  );
}

