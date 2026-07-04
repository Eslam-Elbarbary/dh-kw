import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { registerRequest, resendVerificationCodeRequest } from '../services/auth.service';
import { getCountries } from '../services/meta.service';
import { formatPhoneForVerificationApi, PENDING_VERIFICATION_DIAL_KEY } from '../utils/phoneE164';

// Import assets
import flagIcon from '../assets/Layer 1.svg';

const imgLayer1 = flagIcon;

function PasswordVisibilityToggle({ visible, onToggle, labelShow, labelHide }) {
  return (
    <button
      type="button"
      className="shrink-0 flex items-center justify-center size-[36px] rounded-[4px] text-[#999] dark:text-[#94a3b8] hover:text-[#0e1c47] dark:hover:text-[#eea137] hover:bg-[#f5f5f5] dark:hover:bg-[#334155] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e1c47]/25 dark:focus-visible:ring-[#eea137]/25 transition-colors"
      onClick={onToggle}
      aria-label={visible ? labelHide : labelShow}
    >
      {visible ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const list = await getCountries();
        setCountries(list);
        if (list.length > 0) {
          const saved = localStorage.getItem('selectedCountryId');
          const savedOk = saved && list.some((c) => String(c.id) === String(saved));
          setCountryId(savedOk ? String(saved) : String(list[0].id));
        }
      } catch {
        setCountries([]);
      }
    };

    loadCountries();
  }, []);

  const selectedCountry = useMemo(
    () => countries.find((c) => String(c.id) === String(countryId)),
    [countries, countryId],
  );

  const handleSignUp = async () => {
    setError('');

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim() || !countryId) {
      setError('Please fill all required fields.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions to create an account.');
      return;
    }

    try {
      setLoading(true);
      const dialCode = selectedCountry?.dialCode || '';
      const registeredPhone = formatPhoneForVerificationApi(phone, dialCode);
      const registerResult = await registerRequest({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: registeredPhone,
        email: email.trim(),
        password,
        passwordConfirmation,
        countryId: Number(countryId),
      });
      localStorage.setItem('selectedCountryId', String(countryId));
      localStorage.setItem('countryManuallySelected', '1');
      const storedPhone = registerResult?.data?.user?.phone || registeredPhone;
      localStorage.setItem('pendingVerificationPhone', storedPhone);
      if (dialCode) {
        localStorage.setItem(PENDING_VERIFICATION_DIAL_KEY, dialCode);
      } else {
        localStorage.removeItem(PENDING_VERIFICATION_DIAL_KEY);
      }
      localStorage.removeItem('pendingVerificationEmail');
      try {
        await resendVerificationCodeRequest({ phone: storedPhone, dialCode });
      } catch {
        // Register already dispatches verification; continue even if resend fails (e.g. SMS provider).
      }
      sessionStorage.setItem('justSignedUp', '1');
      navigate('/verification', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Sign up failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fieldInput =
    'border border-[#e6e6e6] dark:border-[#334155] bg-white dark:bg-[#0f172a] dark:text-white border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full font-[\'Poppins\'] font-normal text-[#121212] text-[16px] placeholder:text-[#999] dark:placeholder:text-[#64748b] focus:outline-none focus:border-[#0e1c47] dark:focus:border-[#eea137] transition-colors';

  return (
    <div className="bg-[#f5f6f8] dark:bg-[#0f172a] flex flex-col items-center justify-center px-[16px] sm:px-[24px] md:px-[64px] py-[32px] sm:py-[48px] min-h-screen transition-colors duration-300" data-name="Sign / Phone" data-node-id="35:4736">
      <div className="bg-[#fafafa] dark:bg-[#1e293b] border border-[#e6e6e6] dark:border-[#334155] border-solid content-stretch flex flex-col items-start justify-center px-[20px] sm:px-[28px] md:px-[36px] py-[28px] sm:py-[36px] relative rounded-[8px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] dark:shadow-[0px_0px_44px_0px_rgba(0,0,0,0.35)] w-full max-w-[520px] transition-colors duration-300">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="form" data-node-id="35:4737">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4738">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="35:4739">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#0e1c47] dark:text-white text-[32px] tracking-[-0.96px] w-full" data-node-id="35:4740">
              <p className="leading-none whitespace-pre-wrap" dir="auto">
                Sign up
              </p>
            </div>
            <div className="flex flex-col font-['Poppins'] font-normal justify-center min-h-[32px] relative shrink-0 text-[#121212] dark:text-[#cbd5e1] text-[16px] w-full" data-node-id="35:4741">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Create your account — we&apos;ll send a verification code to your phone.
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4742">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4743">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                first Name
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="35:4744">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${fieldInput} capitalize`} placeholder="Enter your first name" data-node-id="35:4745" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="39:3229">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="39:3230">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                last Name
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="39:3231">
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${fieldInput} capitalize`} placeholder="Enter your last name" data-node-id="39:3232" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Country
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full">
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className={fieldInput}
                aria-label="Country"
              >
                {countries.length === 0 ? (
                  <option value="">No countries available</option>
                ) : (
                  countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.dialCode ? `${country.name} (${country.dialCode})` : country.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4747">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4748">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Phone Number
              </p>
            </div>
            <p className="font-['Poppins'] text-[12px] text-[#666] dark:text-[#94a3b8] w-full -mt-[4px] mb-[2px]">
              Code matches your selected country. Enter your number without the country code (a leading 0 is optional).
            </p>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="35:4749">
              <div
                className="border border-[#e6e6e6] dark:border-[#334155] bg-white dark:bg-[#0f172a] border-solid content-stretch flex gap-[8px] items-center px-[10px] py-[8px] relative rounded-[4px] shrink-0 min-w-[108px]"
                data-node-id="35:4750"
                title={selectedCountry?.name ? `Dial code for ${selectedCountry.name}` : 'Country code'}
              >
                <div className="content-stretch flex items-center overflow-hidden rounded-[2px] shrink-0 size-[30px] bg-[#f5f5f5]" data-name="svg2" data-node-id="35:4751">
                  <img
                    alt=""
                    className="block size-[30px] object-cover"
                    src={selectedCountry?.flagUrl || imgLayer1}
                    onError={(e) => {
                      e.target.src = imgLayer1;
                    }}
                  />
                </div>
                <span className="font-['Poppins'] font-normal text-[#121212] dark:text-white text-[16px] whitespace-nowrap tabular-nums" data-node-id="35:4759">
                  {selectedCountry?.dialCode || '—'}
                </span>
              </div>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldInput}
                placeholder="e.g. 5xxxxxxxx"
                data-node-id="35:4760"
              />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4762">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4763">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Email
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="35:4764">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                autoComplete="email"
                className={fieldInput}
                placeholder="Enter your email"
                data-node-id="35:4765"
              />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4767">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4768">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Password
              </p>
            </div>
            <div className="border border-[#e6e6e6] dark:border-[#334155] bg-white dark:bg-[#0f172a] border-solid content-stretch flex h-[48px] items-center gap-[4px] pr-[4px] pl-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4769">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="font-['Poppins'] font-normal text-[#121212] dark:text-white text-[16px] flex-1 min-w-0 outline-none border-none bg-transparent placeholder:text-[#999] dark:placeholder:text-[#64748b]"
                placeholder="Enter your password"
                data-node-id="35:4770"
              />
              <PasswordVisibilityToggle
                visible={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
                labelShow="Show password"
                labelHide="Hide password"
              />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4775">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] dark:text-[#e5e7eb] text-[18px] w-full" data-node-id="35:4776">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Confirm password
              </p>
            </div>
            <div className="border border-[#e6e6e6] dark:border-[#334155] bg-white dark:bg-[#0f172a] border-solid content-stretch flex h-[48px] items-center gap-[4px] pr-[4px] pl-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4777">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                className="font-['Poppins'] font-normal text-[#121212] dark:text-white text-[16px] flex-1 min-w-0 outline-none border-none bg-transparent placeholder:text-[#999] dark:placeholder:text-[#64748b]"
                placeholder="Confirm your password"
                data-node-id="35:4778"
              />
              <PasswordVisibilityToggle
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((v) => !v)}
                labelShow="Show confirm password"
                labelHide="Hide confirm password"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[16px] items-start w-full" data-node-id="35:4783">
            <div className="flex gap-[8px] items-start w-full" data-node-id="35:4784">
              <input
                id="signup-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
                className="border border-black dark:border-[#64748b] dark:bg-[#0f172a] border-solid rounded-[2px] shrink-0 size-[16px] mt-[3px] cursor-pointer accent-[#0e1c47]"
                data-node-id="35:4785"
              />
              <label
                htmlFor="signup-terms"
                className="flex-1 min-w-0 font-['Poppins'] font-normal leading-[1.5] text-[12px] text-[#0e1c47] dark:text-[#cbd5e1] cursor-pointer"
                data-node-id="35:4786"
              >
                <span className="text-black dark:text-[#e5e7eb]">I agree to the </span>
                <span className="text-[#0e1c47] dark:text-[#93c5fd] underline">Terms & Conditions</span>
                <span className="text-[#8e0909]"> *</span>
              </label>
            </div>
            <div className="flex gap-[8px] items-start w-full" data-node-id="35:4787">
              <input
                id="signup-marketing"
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="border border-black dark:border-[#64748b] dark:bg-[#0f172a] border-solid rounded-[2px] shrink-0 size-[16px] mt-[3px] cursor-pointer accent-[#0e1c47]"
                data-node-id="35:4788"
              />
              <label
                htmlFor="signup-marketing"
                className="flex-1 min-w-0 font-['Poppins'] font-normal leading-[1.5] text-[12px] text-black dark:text-[#e5e7eb] cursor-pointer"
                data-node-id="35:4789"
              >
                I agree to receive marketing emails and newsletters.
              </label>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="cta" data-node-id="35:4790">
          {error ? (
            <div className="text-[#8e0909] text-[14px] font-['Poppins'] w-full">{error}</div>
          ) : null}
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading || !agreedToTerms}
            className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            data-name="btn-01"
            data-node-id="35:4791"
          >
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4792">
              <p className="leading-[1.2]" dir="auto">
                {loading ? 'Signing up...' : 'Sign up'}
              </p>
            </div>
          </button>
          <Link to="/sign-in" className="content-stretch flex items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-80 transition-opacity">
            <div className="capitalize flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] dark:text-[#93c5fd] text-[16px] tracking-[-0.16px] whitespace-nowrap">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.2] underline">Already have an account? Sign in</p>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

