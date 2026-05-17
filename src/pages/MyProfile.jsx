// My Profile page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  extractProfileIp,
  getProfileRequest,
  normalizeProfileFromResponse,
  updatePasswordRequest,
  updateProfileRequest,
  updateProfileDigitalVerificationRequest,
} from '../services/auth.service';
import { getPointsHistory, getWalletHistory } from '../services/transactions.service';
import AddressBookSection from '../components/AddressBookSection';
import ProfileSecurityCard from '../components/ProfileSecurityCard';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function MyProfile() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [savePasswordLoading, setSavePasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [nextProfileSaveAt, setNextProfileSaveAt] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [walletHistory, setWalletHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [digitalForm, setDigitalForm] = useState({
    gender: '',
    birthDate: '',
    nationalNumber: '',
    nationalIdExpireDate: '',
    homeAddress: '',
  });
  const [digitalFrontFile, setDigitalFrontFile] = useState(null);
  const [digitalBackFile, setDigitalBackFile] = useState(null);
  const [digitalSaveLoading, setDigitalSaveLoading] = useState(false);
  const [digitalError, setDigitalError] = useState('');
  const [digitalSuccess, setDigitalSuccess] = useState('');
  const [digitalFileInputsKey, setDigitalFileInputsKey] = useState(0);
  const [profileIp, setProfileIp] = useState('');
  const [ipCopied, setIpCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setProfileError('');
        const response = await getProfileRequest();
        const profile = normalizeProfileFromResponse(response);
        const fullName = String(profile?.name || '').trim();
        const firstName = profile?.first_name || user?.firstName || fullName.split(' ').slice(0, 1).join(' ') || '';
        const lastName = profile?.last_name || user?.lastName || fullName.split(' ').slice(1).join(' ') || '';
        setFormData({
          firstName,
          lastName,
          email: profile?.email || user?.email || '',
          phone: profile?.phone || user?.phone || '',
          address: profile?.address || '',
          city: profile?.city || '',
          country: profile?.country || '',
          zipCode: profile?.zip_code || profile?.zipCode || '',
        });

        const birthRaw = profile?.birth_date ?? profile?.birthDate;
        const expireRaw = profile?.national_id_expire_date ?? profile?.nationalIdExpireDate;
        setDigitalForm({
          gender: profile?.gender != null ? String(profile.gender) : '',
          birthDate: birthRaw ? String(birthRaw).slice(0, 10) : '',
          nationalNumber: profile?.national_number != null ? String(profile.national_number) : '',
          nationalIdExpireDate: expireRaw ? String(expireRaw).slice(0, 10) : '',
          homeAddress: profile?.home_address != null ? String(profile.home_address) : '',
        });
        setDigitalFrontFile(null);
        setDigitalBackFile(null);
        setProfileIp(extractProfileIp(response, profile));
      } catch (error) {
        setProfileError(error?.response?.data?.message || 'Failed to load profile.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user?.firstName, user?.lastName, user?.email, user?.phone]);

  useEffect(() => {
    if (!isAuthenticated || isLoadingProfile) return;
    if (searchParams.get('focus') !== 'digital-order') return;
    const el = document.getElementById('digital-order-profile');
    if (el) {
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [isAuthenticated, isLoadingProfile, searchParams]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadTransactions = async () => {
      try {
        setTransactionsLoading(true);
        setTransactionsError('');
        const [wallet, points] = await Promise.all([
          getWalletHistory(),
          getPointsHistory(),
        ]);
        setWalletHistory(wallet);
        setPointsHistory(points);
      } catch (error) {
        setTransactionsError(error?.response?.data?.message || 'Unable to load transaction history right now.');
      } finally {
        setTransactionsLoading(false);
      }
    };

    loadTransactions();
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDigitalFormChange = (e) => {
    const { name, value } = e.target;
    setDigitalForm((prev) => ({ ...prev, [name]: value }));
    if (digitalError) setDigitalError('');
    if (digitalSuccess) setDigitalSuccess('');
  };

  const handleDigitalVerificationSave = async (e) => {
    e.preventDefault();
    try {
      setDigitalSaveLoading(true);
      setDigitalError('');
      setDigitalSuccess('');
      await updateProfileDigitalVerificationRequest({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: digitalForm.gender,
        birthDate: digitalForm.birthDate,
        nationalNumber: digitalForm.nationalNumber,
        nationalIdExpireDate: digitalForm.nationalIdExpireDate,
        homeAddress: digitalForm.homeAddress,
        nationalCardFrontImage: digitalFrontFile,
        nationalCardBackImage: digitalBackFile,
      });
      await refreshUser();
      setDigitalSuccess('Verification details saved. You can place your digital order now.');
      setDigitalFrontFile(null);
      setDigitalBackFile(null);
      setDigitalFileInputsKey((k) => k + 1);
    } catch (error) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
        ? Object.values(responseData.errors).flat().filter(Boolean)
        : [];
      setDigitalError(
        validationErrors.length > 0
          ? validationErrors.join(' ')
          : (responseData?.message || 'Could not save verification details.'),
      );
    } finally {
      setDigitalSaveLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Date.now() < nextProfileSaveAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextProfileSaveAt - Date.now()) / 1000));
      setProfileError(`Please wait ${waitSeconds}s before trying again.`);
      return;
    }
    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
    const normalizedPhone = String(formData.phone || '').trim();
    if (!fullName) {
      setProfileError('First name and last name are required.');
      return;
    }
    if (!normalizedPhone) {
      setProfileError('Phone number is required.');
      return;
    }
    try {
      setSaveProfileLoading(true);
      setProfileError('');
      setAddressError('');
      setProfileSuccess('');
      await updateProfileRequest(formData);
      await refreshUser();
      setProfileSuccess('Profile updated successfully.');
    } catch (error) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
        ? Object.values(responseData.errors).flat().filter(Boolean)
        : [];
      const message = validationErrors.length > 0
        ? validationErrors.join(' ')
        : (responseData?.message || 'Failed to update profile.');
      const status = error?.response?.status;
      if (status === 429 || String(message).toLowerCase().includes('too many attempts')) {
        setNextProfileSaveAt(Date.now() + 15000);
        setProfileError('Too many attempts. Please wait 15 seconds and try again.');
      } else {
        setProfileError(message);
      }
      if (String(message).toLowerCase().includes('address')) {
        setAddressError(message);
      }
    } finally {
      setSaveProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      setPasswordSuccess('');
      return;
    }

    try {
      setSavePasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');
      await updatePasswordRequest({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPasswordConfirmation: passwordData.confirmNewPassword,
      });
      setPasswordSuccess('Password updated successfully.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setPasswordError(error?.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavePasswordLoading(false);
    }
  };

  const formatMoney = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '-';
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  };

  const handleCopyIp = async () => {
    if (!profileIp) return;
    try {
      await navigator.clipboard.writeText(profileIp);
      setIpCopied(true);
      window.setTimeout(() => setIpCopied(false), 2000);
    } catch {
      setIpCopied(false);
    }
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
            My Profile
          </p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center w-full gap-[16px] sm:gap-[20px]">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] text-[#0e1c47]">
            My Profile
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-[#666] max-w-[700px]">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Main Content */}
        {isAuthenticated ? (
          <div className="w-full flex flex-col gap-[32px] sm:gap-[40px]">
            {/* Profile Form */}
            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[20px] sm:mb-[24px]">
                Personal Information
              </h2>

              <ProfileSecurityCard
                profileIp={profileIp}
                isLoading={isLoadingProfile}
                ipCopied={ipCopied}
                onCopyIp={handleCopyIp}
              />

              {isLoadingProfile ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666] mb-[16px]">Loading profile...</p>
              ) : null}
              {profileError ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#8e0909] mb-[16px]">{profileError}</p>
              ) : null}
              {profileSuccess ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#00a651] mb-[16px]">{profileSuccess}</p>
              ) : null}
              <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] sm:gap-[24px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[24px]">
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <AddressBookSection defaultPhone={formData.phone || user?.phone || ''} />
                <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] justify-end mt-[8px]">
                  <button
                    type="submit"
                    disabled={saveProfileLoading || Date.now() < nextProfileSaveAt}
                    className="bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saveProfileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div
              id="digital-order-profile"
              className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm scroll-mt-[24px]"
            >
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[8px]">
                Digital order verification
              </h2>
              <p className="font-['Poppins'] text-[14px] text-[#666] mb-[20px] max-w-[720px] leading-relaxed">
                Digital products require these details on your account. They match what the server checks before creating a digital order (national ID images, home address, etc.).
              </p>
              {digitalError ? (
                <p className="font-['Poppins'] text-[14px] text-[#8e0909] mb-[16px]" role="alert">{digitalError}</p>
              ) : null}
              {digitalSuccess ? (
                <p className="font-['Poppins'] text-[14px] text-[#00a651] mb-[16px]" role="status">{digitalSuccess}</p>
              ) : null}
              <form onSubmit={handleDigitalVerificationSave} className="flex flex-col gap-[18px] sm:gap-[20px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] sm:gap-[20px]">
                  <div>
                    <label htmlFor="digital-gender" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                      Gender
                    </label>
                    <select
                      id="digital-gender"
                      name="gender"
                      value={digitalForm.gender}
                      onChange={handleDigitalFormChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] bg-white"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="digital-birth" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                      Date of birth
                    </label>
                    <input
                      id="digital-birth"
                      type="date"
                      name="birthDate"
                      value={digitalForm.birthDate}
                      onChange={handleDigitalFormChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137]"
                    />
                  </div>
                  <div>
                    <label htmlFor="digital-national" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                      National ID number
                    </label>
                    <input
                      id="digital-national"
                      type="text"
                      name="nationalNumber"
                      value={digitalForm.nationalNumber}
                      onChange={handleDigitalFormChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137]"
                      placeholder="National ID number"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="digital-id-expire" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                      National ID expiry
                    </label>
                    <input
                      id="digital-id-expire"
                      type="date"
                      name="nationalIdExpireDate"
                      value={digitalForm.nationalIdExpireDate}
                      onChange={handleDigitalFormChange}
                      className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="digital-home-address" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                    Home address
                  </label>
                  <textarea
                    id="digital-home-address"
                    name="homeAddress"
                    rows={3}
                    value={digitalForm.homeAddress}
                    onChange={handleDigitalFormChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] resize-y min-h-[88px]"
                    placeholder="Full home address as on your ID"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]" key={digitalFileInputsKey}>
                  <div>
                    <label htmlFor="digital-id-front" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                      National ID â€” front
                    </label>
                    <input
                      id="digital-id-front"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setDigitalFrontFile(e.target.files?.[0] || null);
                        if (digitalError) setDigitalError('');
                      }}
                      className="w-full font-['Poppins'] text-[13px] text-[#0e1c47] file:mr-[12px] file:rounded-[4px] file:border-0 file:bg-[#0e1c47] file:px-[14px] file:py-[8px] file:font-semibold file:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="digital-id-back" className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                      National ID â€” back
                    </label>
                    <input
                      id="digital-id-back"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setDigitalBackFile(e.target.files?.[0] || null);
                        if (digitalError) setDigitalError('');
                      }}
                      className="w-full font-['Poppins'] text-[13px] text-[#0e1c47] file:mr-[12px] file:rounded-[4px] file:border-0 file:bg-[#0e1c47] file:px-[14px] file:py-[8px] file:font-semibold file:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={digitalSaveLoading}
                    className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold px-[28px] py-[12px] rounded-[4px] hover:bg-[#1a2d5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {digitalSaveLoading ? 'Savingâ€¦' : 'Save verification details'}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Security */}
            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
                Account Security
              </h2>
              {passwordError ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#8e0909] mb-[16px]">{passwordError}</p>
              ) : null}
              {passwordSuccess ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#00a651] mb-[16px]">{passwordSuccess}</p>
              ) : null}
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-[16px] sm:gap-[20px]">
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Enter a new password"
                  />
                </div>
                <div>
                  <label className="font-['Poppins'] font-medium text-[14px] sm:text-[16px] text-[#0e1c47] mb-[8px] block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] sm:text-[16px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                    placeholder="Confirm your new password"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savePasswordLoading}
                    className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold px-[24px] py-[12px] rounded-[4px] hover:bg-[#1a2d5a] transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savePasswordLoading ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-[#e6e6e6] border-solid rounded-[4px] p-[24px] sm:p-[32px] md:p-[40px] shadow-sm">
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[10px]">
                Transactions
              </h2>
              <p className="font-['Poppins'] font-normal text-[14px] text-[#666] mb-[20px]">
                Wallet and points activity synced from your account APIs.
              </p>
              {transactionsLoading ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666] mb-[16px]">Loading transaction history...</p>
              ) : null}
              {transactionsError ? (
                <p className="font-['Poppins'] font-normal text-[14px] text-[#8e0909] mb-[16px]">{transactionsError}</p>
              ) : null}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-[20px]">
                <div className="border border-[#e6e6e6] rounded-[4px] p-[16px]">
                  <h3 className="font-['Poppins'] font-semibold text-[18px] text-[#0e1c47] mb-[12px]">
                    Wallet History
                  </h3>
                  <div className="space-y-[8px] max-h-[300px] overflow-auto pr-[4px]">
                    {walletHistory.length > 0 ? walletHistory.map((item) => (
                      <div key={`wallet-${item.id || item.createdAt}`} className="border border-[#eef1f4] rounded-[4px] p-[10px]">
                        <div className="flex items-center justify-between gap-[12px]">
                          <p className="font-['Poppins'] font-semibold text-[13px] text-[#0e1c47]">{item.type}</p>
                          <p className={`font-['Poppins'] font-semibold text-[13px] ${item.amount >= 0 ? 'text-[#00a651]' : 'text-[#d14343]'}`}>
                            {item.amount >= 0 ? '+' : ''}{formatMoney(item.amount)}
                          </p>
                        </div>
                        <p className="font-['Poppins'] font-normal text-[12px] text-[#666] mt-[2px]">
                          {item.description || 'Wallet transaction'}
                        </p>
                        <p className="font-['Poppins'] font-normal text-[11px] text-[#888] mt-[4px]">
                          {formatDate(item.createdAt)}
                        </p>
                        {item.balance !== null ? (
                          <p className="font-['Poppins'] font-normal text-[11px] text-[#888] mt-[2px]">
                            Balance: {formatMoney(item.balance)}
                          </p>
                        ) : null}
                      </div>
                    )) : (
                      <p className="font-['Poppins'] font-normal text-[13px] text-[#666]">No wallet history yet.</p>
                    )}
                  </div>
                </div>

                <div className="border border-[#e6e6e6] rounded-[4px] p-[16px]">
                  <h3 className="font-['Poppins'] font-semibold text-[18px] text-[#0e1c47] mb-[12px]">
                    Points History
                  </h3>
                  <div className="space-y-[8px] max-h-[300px] overflow-auto pr-[4px]">
                    {pointsHistory.length > 0 ? pointsHistory.map((item) => (
                      <div key={`points-${item.id || item.createdAt}`} className="border border-[#eef1f4] rounded-[4px] p-[10px]">
                        <div className="flex items-center justify-between gap-[12px]">
                          <p className="font-['Poppins'] font-semibold text-[13px] text-[#0e1c47]">{item.type}</p>
                          <p className={`font-['Poppins'] font-semibold text-[13px] ${item.amount >= 0 ? 'text-[#00a651]' : 'text-[#d14343]'}`}>
                            {item.amount >= 0 ? '+' : ''}{formatMoney(item.amount)}
                          </p>
                        </div>
                        <p className="font-['Poppins'] font-normal text-[12px] text-[#666] mt-[2px]">
                          {item.description || 'Points transaction'}
                        </p>
                        <p className="font-['Poppins'] font-normal text-[11px] text-[#888] mt-[4px]">
                          {formatDate(item.createdAt)}
                        </p>
                        {item.status ? (
                          <p className="font-['Poppins'] font-normal text-[11px] text-[#888] mt-[2px]">
                            Status: {item.status}
                          </p>
                        ) : null}
                      </div>
                    )) : (
                      <p className="font-['Poppins'] font-normal text-[13px] text-[#666]">No points history yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-[#0e1c47] rounded-[4px] p-[32px] sm:p-[40px] md:p-[48px] text-center">
            <h2 className="font-['Poppins'] font-bold text-[24px] sm:text-[28px] md:text-[32px] text-white mb-[12px] sm:mb-[16px]">
              Please Sign In
            </h2>
            <p className="font-['Poppins'] font-normal text-[16px] sm:text-[18px] text-white/90 mb-[24px] sm:mb-[32px] max-w-[600px] mx-auto">
              You need to be signed in to access your profile. Sign in to view and edit your personal information.
            </p>
            <Link
              to="/sign-in"
              className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[32px] py-[14px] rounded-[4px] hover:bg-[#d8902f] transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

