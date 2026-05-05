import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { registerRequest, resendVerificationCodeRequest } from '../services/auth.service';
import { getCountries } from '../services/meta.service';
import { combineDialAndNationalPhone } from '../utils/phoneE164';

// Import assets
import flagIcon from '../assets/Layer 1.svg';

const imgLayer1 = flagIcon;

function PasswordVisibilityToggle({ visible, onToggle, labelShow, labelHide }) {
  return (
    <button
      type="button"
      className="shrink-0 flex items-center justify-center size-[36px] rounded-[4px] text-[#999] hover:text-[#0e1c47] hover:bg-[#f5f5f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e1c47]/25 transition-colors"
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
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setSuccess('');

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim() || !countryId) {
      setError('Please fill all required fields.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    try {
      setLoading(true);
      await registerRequest({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: combineDialAndNationalPhone(selectedCountry?.dialCode, phone),
        email: email.trim(),
        password,
        passwordConfirmation,
        countryId: Number(countryId),
      });
      localStorage.setItem('selectedCountryId', String(countryId));
      const normalizedEmail = email.trim().toLowerCase();
      localStorage.setItem('pendingVerificationEmail', normalizedEmail);
      localStorage.removeItem('pendingVerificationPhone');
      sessionStorage.setItem('postSignupPendingEmail', normalizedEmail);
      await resendVerificationCodeRequest({ email: normalizedEmail });
      setSuccess('Account created successfully. You can verify your email now or do it later from sign in.');
    } catch (err) {
      const message = err?.response?.data?.message || 'Sign up failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] border border-[#e6e6e6] border-solid content-stretch flex flex-col items-start justify-center px-[64px] py-[48px] relative rounded-[4px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] size-full min-h-screen" data-name="Sign / Phone" data-node-id="35:4736">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-[382px] mx-auto" data-name="form" data-node-id="35:4737">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4738">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="35:4739">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#0e1c47] text-[32px] tracking-[-0.96px] w-full" data-node-id="35:4740">
              <p className="leading-none whitespace-pre-wrap" dir="auto">
                Sign up
              </p>
            </div>
            <div className="flex flex-col font-['Poppins'] font-normal justify-center min-h-[32px] relative shrink-0 text-[#121212] text-[16px] w-full" data-node-id="35:4741">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Create your account — we&apos;ll send a verification code to your email.
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4742">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4743">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                first Name
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="35:4744">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your first name" data-node-id="35:4745" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="39:3229">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="39:3230">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                last Name
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="39:3231">
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your last name" data-node-id="39:3232" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Country
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full">
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full font-['Poppins'] font-normal text-[#999] text-[16px] bg-white"
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
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4748">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Phone Number
              </p>
            </div>
            <p className="font-['Poppins'] text-[12px] text-[#666] w-full -mt-[4px] mb-[2px]">
              Code matches your selected country. Enter your number without the country code (a leading 0 is optional).
            </p>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="35:4749">
              <div
                className="border border-[#e6e6e6] border-solid content-stretch flex gap-[8px] items-center px-[10px] py-[8px] relative rounded-[4px] shrink-0 min-w-[108px]"
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
                <span className="font-['Poppins'] font-normal text-[#121212] text-[16px] whitespace-nowrap tabular-nums" data-node-id="35:4759">
                  {selectedCountry?.dialCode || '—'}
                </span>
              </div>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 font-['Poppins'] font-normal text-[#121212] text-[16px] placeholder:text-[#999]"
                placeholder="e.g. 5xxxxxxxx"
                data-node-id="35:4760"
              />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4762">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4763">
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
                className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full font-['Poppins'] font-normal text-[#121212] text-[16px] placeholder:text-[#999]"
                placeholder="Enter your email"
                data-node-id="35:4765"
              />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4767">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4768">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Password
              </p>
            </div>
            <div className="border border-[#e6e6e6] border-solid content-stretch flex h-[48px] items-center gap-[4px] pr-[4px] pl-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4769">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="font-['Poppins'] font-normal text-[#121212] text-[16px] flex-1 min-w-0 outline-none border-none bg-transparent placeholder:text-[#999]"
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
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4776">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Confirm password
              </p>
            </div>
            <div className="border border-[#e6e6e6] border-solid content-stretch flex h-[48px] items-center gap-[4px] pr-[4px] pl-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4777">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                className="font-['Poppins'] font-normal text-[#121212] text-[16px] flex-1 min-w-0 outline-none border-none bg-transparent placeholder:text-[#999]"
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
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-node-id="35:4783">
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="35:4784">
              <input type="checkbox" className="border border-black border-solid rounded-[2px] shrink-0 size-[16px]" data-node-id="35:4785" />
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] text-[12px] whitespace-nowrap" data-node-id="35:4786">
                <p className="leading-[normal]">
                  <span className="text-black">I agree to the</span> <span className="[text-underline-position:from-font] decoration-solid text-[#0e1c47] underline">Terms</span>
                  <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid underline">{` & `}</span>
                  <span className="[text-underline-position:from-font] decoration-solid text-[#0e1c47] underline">Conditions</span>
                </p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="35:4787">
              <input type="checkbox" className="border border-black border-solid rounded-[2px] shrink-0 size-[16px]" data-node-id="35:4788" />
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap" data-node-id="35:4789">
                <p className="leading-[normal]">I agree to receive marketing emails and newsletters.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="cta" data-node-id="35:4790">
          {error ? (
            <div className="text-[#8e0909] text-[14px] font-['Poppins'] w-full">{error}</div>
          ) : null}
          {success ? (
            <div className="text-[#00a651] text-[14px] font-['Poppins'] w-full">{success}</div>
          ) : null}
          <button onClick={handleSignUp} disabled={loading} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed" data-name="btn-01" data-node-id="35:4791">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4792">
              <p className="leading-[1.2]" dir="auto">
                {loading ? 'Signing up...' : 'Sign up'}
              </p>
            </div>
          </button>
          {success ? (
            <button
              type="button"
              onClick={() => navigate('/verification')}
              className="bg-white border border-[#0e1c47] text-[#0e1c47] content-stretch cursor-pointer flex h-[50px] items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:bg-[#f7f9fc] transition-colors"
            >
              Verify email now
            </button>
          ) : null}
          <Link to="/sign-in" className="content-stretch flex items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-80 transition-opacity">
            <div className="capitalize flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] text-[16px] tracking-[-0.16px] whitespace-nowrap">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.2] underline">{success ? 'Verify later? Continue to sign in' : 'Already have an account? Sign in'}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

