// My Profile page - professional design matching site's visual identity
// Maintains colors, fonts, styles, and icons from the site

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileRequest, updatePasswordRequest, updateProfileRequest } from '../services/auth.service';
import { createAddress, deleteAddress, getAddresses } from '../services/address.service';
import { getPointsHistory, getWalletHistory } from '../services/transactions.service';

// Icon Assets
// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function MyProfile() {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [savePasswordLoading, setSavePasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [nextProfileSaveAt, setNextProfileSaveAt] = useState(0);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddressLoading, setSaveAddressLoading] = useState(false);
  const [nextAddressSaveAt, setNextAddressSaveAt] = useState(0);
  const [deleteAddressLoadingId, setDeleteAddressLoadingId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: 'Home',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
  });
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

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setProfileError('');
        const response = await getProfileRequest();
        const profile = response?.data ?? response ?? {};
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

        try {
          const addresses = await getAddresses();
          setSavedAddresses(addresses);
          if (addresses.length > 0) {
            const primaryAddress = addresses[0];
            setSelectedAddressId(primaryAddress.id);
            setAddressForm({
              name: primaryAddress.name || primaryAddress.title || 'Home',
              phone: primaryAddress.phone || user?.phone || '',
              address: primaryAddress.address || '',
              latitude: primaryAddress.latitude ?? '',
              longitude: primaryAddress.longitude ?? '',
            });
          }
        } catch {
          // Keep profile values if addresses fail to load.
        }
      } catch (error) {
        setProfileError(error?.response?.data?.message || 'Failed to load profile.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user?.firstName, user?.lastName, user?.email, user?.phone]);

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

  const handleAddressFormChange = (e) => {
    setAddressForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const preventProfileSubmitFromAddressInputs = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSaveAddress = async () => {
    if (Date.now() < nextAddressSaveAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextAddressSaveAt - Date.now()) / 1000));
      setAddressError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      setAddressSuccess('');
      return;
    }

    const normalizedName = String(addressForm.name || '').trim();
    const normalizedPhone = String(addressForm.phone || '').trim();
    const normalizedAddress = String(addressForm.address || '').trim();
    if (!normalizedName || !normalizedPhone || !normalizedAddress) {
      setAddressError('Address name, phone and address are required.');
      setAddressSuccess('');
      return;
    }

    const rawLatitude = String(addressForm.latitude ?? '').trim();
    const rawLongitude = String(addressForm.longitude ?? '').trim();
    const parsedLat = rawLatitude ? Number(rawLatitude) : undefined;
    const parsedLng = rawLongitude ? Number(rawLongitude) : undefined;
    const latitude = Number.isFinite(parsedLat) ? parsedLat : undefined;
    const longitude = Number.isFinite(parsedLng) ? parsedLng : undefined;

    try {
      setSaveAddressLoading(true);
      setAddressError('');
      setAddressSuccess('');

      const created = await createAddress({
        name: normalizedName,
        phone: normalizedPhone,
        address: normalizedAddress,
        latitude,
        longitude,
      });

      const createdAddressId = created?.data?.id || created?.id || created?.data?.address?.id || null;
      const nextAddresses = await getAddresses();
      setSavedAddresses(nextAddresses);
      if (createdAddressId) {
        setSelectedAddressId(createdAddressId);
      }
      setAddressSuccess('Address saved successfully.');
    } catch (error) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
        ? Object.values(responseData.errors).flat().filter(Boolean)
        : [];
      let message = validationErrors.length > 0
        ? validationErrors.join(' ')
        : (responseData?.message || 'Failed to save address.');
      const status = error?.response?.status;
      const lowerMessage = String(message).toLowerCase();
      if (status === 429 || lowerMessage.includes('too many attempts')) {
        setNextAddressSaveAt(Date.now() + 15000);
        message = 'Too many attempts. Please wait 15 seconds and try again.';
      }
      if (lowerMessage.includes('name field is required') || lowerMessage.includes('phone field is required')) {
        message = 'Address endpoint rejected the payload. Please enter name, phone and address, then try again.';
      }
      setAddressError(message);
      setAddressSuccess('');
    } finally {
      setSaveAddressLoading(false);
    }
  };

  const handleSelectAddress = (item) => {
    setSelectedAddressId(item.id);
    setAddressForm({
      name: item.name || item.title || 'Home',
      phone: item.phone || '',
      address: item.address || '',
      latitude: item.latitude ?? '',
      longitude: item.longitude ?? '',
    });
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setDeleteAddressLoadingId(addressId);
      setAddressError('');
      setAddressSuccess('');
      await deleteAddress({ addressId });
      const nextAddresses = await getAddresses();
      setSavedAddresses(nextAddresses);
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
        setAddressForm({
          name: 'Home',
          phone: '',
          address: '',
          latitude: '',
          longitude: '',
        });
      }
      setAddressSuccess('Address deleted successfully.');
    } catch (error) {
      setAddressError(error?.response?.data?.message || 'Failed to delete address.');
    } finally {
      setDeleteAddressLoadingId(null);
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
              <h2 className="font-['Poppins'] font-semibold text-[24px] sm:text-[28px] md:text-[32px] text-[#0e1c47] mb-[24px] sm:mb-[32px]">
                Personal Information
              </h2>
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
                <div className="border border-[#e6e6e6] rounded-[4px] p-[16px] sm:p-[20px]">
                  <p className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[12px]">Address Book (API)</p>
                  {addressError ? (
                    <p className="font-['Poppins'] font-normal text-[13px] text-[#8e0909] mb-[10px]">{addressError}</p>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div>
                      <label className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={addressForm.name}
                        onChange={handleAddressFormChange}
                        onKeyDown={preventProfileSubmitFromAddressInputs}
                        className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                        placeholder="Home / Office"
                      />
                    </div>
                    <div>
                      <label className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressFormChange}
                        onKeyDown={preventProfileSubmitFromAddressInputs}
                        className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-[16px] mt-[16px]">
                    <div>
                      <label className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={addressForm.address}
                        onChange={handleAddressFormChange}
                        onKeyDown={preventProfileSubmitFromAddressInputs}
                        className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                        placeholder="Street, Area, Building"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mt-[16px]">
                    <div>
                      <label className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={addressForm.latitude}
                        onChange={handleAddressFormChange}
                        onKeyDown={preventProfileSubmitFromAddressInputs}
                        className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                        placeholder="29.3"
                      />
                    </div>
                    <div>
                      <label className="font-['Poppins'] font-medium text-[14px] text-[#0e1c47] mb-[8px] block">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={addressForm.longitude}
                        onChange={handleAddressFormChange}
                        onKeyDown={preventProfileSubmitFromAddressInputs}
                        className="w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[16px] py-[12px] font-['Poppins'] font-normal text-[14px] text-[#0e1c47] focus:outline-none focus:border-[#eea137] transition-colors"
                        placeholder="47.9"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[12px] justify-end mt-[16px]">
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      disabled={saveAddressLoading || Date.now() < nextAddressSaveAt}
                      className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold px-[22px] py-[10px] rounded-[4px] hover:bg-[#1a2d5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saveAddressLoading ? 'Saving Address...' : 'Save Address'}
                    </button>
                  </div>
                  {addressSuccess ? (
                    <p className="font-['Poppins'] font-normal text-[13px] text-[#00a651] mt-[10px]">{addressSuccess}</p>
                  ) : null}
                  <div className="mt-[16px] space-y-[8px]">
                    {savedAddresses.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-[4px] px-[12px] py-[10px] flex items-start justify-between gap-[10px] ${
                          selectedAddressId === item.id ? 'border-[#0e1c47] bg-[#f8fbff]' : 'border-[#e6e6e6]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectAddress(item)}
                          className="text-left flex-1 min-w-0 cursor-pointer"
                        >
                          <p className="font-['Poppins'] font-semibold text-[13px] text-[#0e1c47]">{item.name || item.title}</p>
                          {item.phone ? (
                            <p className="font-['Poppins'] font-normal text-[12px] text-[#555] break-words">{item.phone}</p>
                          ) : null}
                          <p className="font-['Poppins'] font-normal text-[12px] text-[#555] break-words">{item.address}</p>
                          {(item.latitude || item.longitude) ? (
                            <p className="font-['Poppins'] font-normal text-[11px] text-[#888] mt-[3px]">
                              {item.latitude ?? '-'}, {item.longitude ?? '-'}
                            </p>
                          ) : null}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(item.id)}
                          disabled={deleteAddressLoadingId === item.id}
                          className="text-[#dc2626] font-['Poppins'] font-semibold text-[12px] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {deleteAddressLoadingId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    ))}
                    {savedAddresses.length === 0 ? (
                      <p className="font-['Poppins'] font-normal text-[12px] text-[#666]">No saved addresses yet.</p>
                    ) : null}
                  </div>
                </div>
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

