// Checkout page - exact Figma implementation
// Based on Figma design - Checkout Page

import { Link, useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createAddress, deleteAddress, getAddresses } from '../services/address.service';
import {
  calculateOrderShipping,
  createOrder,
  payOrder,
  extractOrderPaymentUrl,
  navigateToPaymentGateway,
  openPaymentGatewayPlaceholderTab,
} from '../services/orders.service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Fix default marker icon in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Import assets
import arrowDownIcon from '../assets/ArrowRight.svg';
import arrowRightIcon from '../assets/ArrowRight.svg';
import creditCardIcon from '../assets/CreditCard.svg';
// Arrow icon for breadcrumbs
const imgArrowDown = arrowDownIcon;

const imgCreditCard = creditCardIcon;

// Arrow right icon for button
const imgArrowRight = arrowRightIcon;

// Default map center (Kuwait City)
const DEFAULT_CENTER = [29.3759, 47.9774];
const DEFAULT_ZOOM = 12;

// Map Nominatim country name to form select value
function countryToValue(name) {
  if (!name) return '';
  const n = name.toLowerCase();
  if (n.includes('kuwait')) return 'kuwait';
  if (n.includes('saudi')) return 'saudi';
  if (n.includes('uae') || n.includes('emirates') || n.includes('united arab')) return 'uae';
  return name;
}

// Reverse geocode using Nominatim (OpenStreetMap); returns { addressLine, country, state, city, zipCode }
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    const parts = [
      addr.road,
      addr.house_number,
      addr.suburb || addr.neighbourhood,
      addr.city_district || addr.city || addr.town || addr.village,
      addr.state,
      addr.country
    ].filter(Boolean);
    const addressLine = parts.length ? parts.join(', ') : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const countryValue = countryToValue(addr.country || '');
    const state = addr.state || addr.region || '';
    const city = addr.city || addr.town || addr.village || addr.county || addr.state || '';
    const zipCode = addr.postcode || '';
    const area = addr.suburb || addr.neighbourhood || addr.city_district || '';
    return { addressLine, country: countryValue, state, city, zipCode, area };
  } catch {
    const addressLine = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    return { addressLine, country: '', state: '', city: '', zipCode: '', area: '' };
  }
}

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Center map when position changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom ?? 16);
  }, [center, zoom, map]);
  return null;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loadingCart, loadCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('sadad');
  const [address, setAddress] = useState('');
  const [mapPosition, setMapPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState('');
  const [addressType, setAddressType] = useState('house');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressesError, setAddressesError] = useState('');
  const [addressActionLoading, setAddressActionLoading] = useState(false);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState(null);
  const [contactPhone, setContactPhone] = useState('');
  const [nextAddressActionAt, setNextAddressActionAt] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [shippingQuote, setShippingQuote] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutWarning, setCheckoutWarning] = useState('');
  const [nextCheckoutAttemptAt, setNextCheckoutAttemptAt] = useState(0);

  const normalizeAddressType = (type) => {
    const raw = String(type || '').trim().toLowerCase();
    if (!raw) return 'house';
    return raw;
  };

  const formatAddressTypeLabel = (type) => {
    const normalizedType = normalizeAddressType(type);
    return normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);
  };

  const buildConcatenatedAddress = useCallback(() => {
    const typeLabel = formatAddressTypeLabel(addressType);
    const normalizedAddress = String(address || '').trim();
    if (!normalizedAddress) return '';
    return `[${typeLabel}] ${normalizedAddress}`;
  }, [addressType, address]);

  const toProfessionalAddressError = (error, fallbackMessage) => {
    const status = error?.response?.status;
    const rawMessage = String(error?.response?.data?.message || fallbackMessage || '').trim();
    const lower = rawMessage.toLowerCase();

    if (status === 429 || lower.includes('too many attempts')) {
      return 'Too many requests right now. Please wait 15 seconds and try again.';
    }
    if (status === 422 || lower.includes('unprocessable')) {
      return 'Please review your address details and try again.';
    }
    if (status >= 500 || lower.includes('sqlstate') || lower.includes('general error') || lower.includes('database')) {
      return 'We could not process your address at the moment. Please try again shortly.';
    }
    if (!rawMessage) {
      return fallbackMessage || 'Something went wrong. Please try again.';
    }

    return rawMessage;
  };

  const loadAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      setAddressesError('');
      const list = await getAddresses();
      setSavedAddresses(list);
    } catch (error) {
      setSavedAddresses([]);
      if (error?.response?.status !== 401) {
        const status = error?.response?.status;
        const rawMessage = String(error?.response?.data?.message || '').toLowerCase();
        if (status === 429 || rawMessage.includes('too many attempts')) {
          setNextAddressActionAt(Date.now() + 15000);
          setAddressesError('Too many requests right now. Please wait 15 seconds and try again.');
        } else {
          setAddressesError(toProfessionalAddressError(error, 'Unable to load saved addresses right now.'));
        }
      }
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (!selectedSavedAddressId && savedAddresses.length) {
      applySavedAddress(savedAddresses[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddresses, selectedSavedAddressId]);

  useEffect(() => {
    const fullName = String(user?.name || '').trim();
    const parts = fullName.split(' ').filter(Boolean);
    setFirstName(user?.firstName || parts[0] || '');
    setLastName(user?.lastName || parts.slice(1).join(' ') || '');
    if (user?.phone) {
      setContactPhone((prev) => prev || user.phone);
    }
  }, [user]);

  const normalizeShippingQuote = useCallback((payload) => {
    const data = payload?.data || payload || {};
    return {
      shipping: Number(data?.total_shipping ?? data?.shipping ?? 0) || 0,
      discount: Number(data?.discount ?? data?.coupon_discount ?? 0) || 0,
      total: Number(data?.total ?? data?.grand_total ?? cart.summary?.total ?? 0) || 0,
    };
  }, [cart.summary?.total]);

  useEffect(() => {
    const loadShipping = async () => {
      if (!selectedSavedAddressId || !cart.items.length) {
        setShippingQuote(null);
        return;
      }
      try {
        setShippingLoading(true);
        const quote = await calculateOrderShipping({ addressId: selectedSavedAddressId });
        setShippingQuote(normalizeShippingQuote(quote));
      } catch (error) {
        const status = error?.response?.status;
        const message = String(error?.response?.data?.message || '').toLowerCase();
        const isCartEmptyCase = status === 422 && message.includes('cart is empty');
        if (isCartEmptyCase) {
          // Backend can briefly report empty cart due to session sync timing.
          // Keep checkout usable by falling back to current cart summary.
          setShippingQuote({
            shipping: Number(cart.summary?.shipping || 0),
            discount: Number(cart.summary?.discount || 0),
            total: Number(cart.summary?.total || 0),
          });
          return;
        }
        setShippingQuote(null);
      } finally {
        setShippingLoading(false);
      }
    };
    loadShipping();
  }, [
    selectedSavedAddressId,
    normalizeShippingQuote,
    cart.items.length,
    cart.summary?.shipping,
    cart.summary?.discount,
    cart.summary?.total,
  ]);

  const handleLocationSelect = useCallback(async (lat, lng) => {
    setMapPosition([lat, lng]);
    setMapError('');
    try {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr.addressLine);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  }, []);

  const handleLocateMe = useCallback(() => {
    setMapError('');
    setLocating(true);
    if (!navigator.geolocation) {
      setMapError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapPosition([latitude, longitude]);
        try {
          const addr = await reverseGeocode(latitude, longitude);
          setAddress(addr.addressLine);
        } catch {
          setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setLocating(false);
      },
      () => {
        setMapError('Unable to get your location. Please allow location access or pick a point on the map.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const applySavedAddress = (item) => {
    if (!item) return;
    setSelectedSavedAddressId(item.backendId ?? item.id ?? null);
    setAddress(item.address || '');
    setAddressType(normalizeAddressType(item.name || item.title || 'house'));
    setContactPhone(item.phone || '');
    if (item.latitude && item.longitude) {
      setMapPosition([item.latitude, item.longitude]);
    }
  };

  const mapPaymentMethodToApi = (method) => {
    if (method === 'tabby') return 'tabby';
    return 'sadad';
  };

  const extractOrderIdFromCreateResponse = (response) => (
    response?.data?.order?.id
    || response?.data?.id
    || response?.order?.id
    || response?.id
    || null
  );

  const persistOrderDraft = ({ orderId, latestCartSnapshot }) => {
    if (!orderId || !latestCartSnapshot) return;
    const key = `orderDraft:${orderId}`;
    const payload = {
      orderId: String(orderId),
      createdAt: new Date().toISOString(),
      items: Array.isArray(latestCartSnapshot.items) ? latestCartSnapshot.items : [],
      summary: latestCartSnapshot.summary || null,
      selectedAddressId: selectedSavedAddressId,
      notes: orderNotes || '',
      paymentMethod,
    };
    sessionStorage.setItem(key, JSON.stringify(payload));
  };

  const handlePlaceOrder = async () => {
    if (Date.now() < nextCheckoutAttemptAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextCheckoutAttemptAt - Date.now()) / 1000));
      setCheckoutError(`Too many attempts. Please wait ${waitSeconds}s and try again.`);
      return;
    }

    if (!cart.items.length) {
      setCheckoutError('Your cart is empty.');
      return;
    }
    const numericAddressId = Number(selectedSavedAddressId);
    if (!Number.isFinite(numericAddressId) || numericAddressId <= 0) {
      setCheckoutError('Please select a saved address.');
      return;
    }
    if (!String(contactPhone || '').trim()) {
      setCheckoutError('Please provide a contact phone number.');
      return;
    }

    const paymentTab = openPaymentGatewayPlaceholderTab();

    try {
      setCheckoutLoading(true);
      setCheckoutError('');
      setCheckoutWarning('');

      let latestCart = await loadCart({ force: true }).catch(() => cart);

      if (!latestCart?.items?.length) {
        paymentTab?.close();
        setCheckoutError('Your cart is empty on server. Please go back to cart and refresh it, then retry checkout.');
        return;
      }

      const orderResponse = await createOrder({
        addressId: numericAddressId,
        couponId: latestCart?.coupon?.id ?? cart?.coupon?.id ?? null,
        useWallet,
        usePoints,
        notes: orderNotes,
      });
      const orderId = extractOrderIdFromCreateResponse(orderResponse);
      if (!orderId) {
        throw new Error('Order created but order id was not returned.');
      }

      persistOrderDraft({
        orderId,
        latestCartSnapshot: latestCart,
      });

      try {
        const payResponse = await payOrder({
          orderId,
          paymentMethod: mapPaymentMethodToApi(paymentMethod),
        });
        const paymentUrl = extractOrderPaymentUrl(payResponse);
        await loadCart({ force: true }).catch(() => {});
        if (paymentUrl) {
          navigateToPaymentGateway(paymentUrl, paymentTab);
          navigate(`/track-order?orderId=${encodeURIComponent(orderId)}`);
          return;
        }
        paymentTab?.close();
        sessionStorage.setItem(
          'checkoutPaymentWarning',
          'Order placed successfully, but no payment link was returned. You can retry payment from My Orders.'
        );
      } catch (paymentError) {
        paymentTab?.close();
        const paymentMessage = paymentError?.response?.data?.message || '';
        sessionStorage.setItem(
          'checkoutPaymentWarning',
          paymentMessage || 'Order placed successfully, but payment initialization failed. You can retry payment from My Orders.'
        );
      }

      await loadCart({ force: true }).catch(() => {});
      navigate(`/track-order?orderId=${encodeURIComponent(orderId)}`);
    } catch (error) {
      paymentTab?.close();
      const backendMessage = error?.response?.data?.message || error?.message || 'Failed to place order.';
      const errors = error?.response?.data?.errors;
      const firstValidationMessage = errors && typeof errors === 'object'
        ? Object.values(errors).flat().find(Boolean)
        : '';
      const lowerMessage = String(firstValidationMessage || backendMessage).toLowerCase();
      const isTooManyAttempts = error?.response?.status === 429 || lowerMessage.includes('too many attempts');
      if (isTooManyAttempts) {
        setNextCheckoutAttemptAt(Date.now() + 20000);
        setCheckoutError('Too many attempts from server. Please wait 20 seconds and try again.');
      } else {
        setCheckoutError(firstValidationMessage || backendMessage);
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    const warning = sessionStorage.getItem('checkoutPaymentWarning');
    if (warning) {
      setCheckoutWarning(warning);
      sessionStorage.removeItem('checkoutPaymentWarning');
    }
  }, []);

  const handleSaveCurrentAddress = async () => {
    if (Date.now() < nextAddressActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextAddressActionAt - Date.now()) / 1000));
      setAddressesError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      return;
    }

    const concatenatedAddress = buildConcatenatedAddress();
    if (!concatenatedAddress) {
      setAddressesError('Please enter address before saving.');
      return;
    }
    if (!String(contactPhone || '').trim()) {
      setAddressesError('Please enter phone number before saving.');
      return;
    }
    try {
      setAddressActionLoading(true);
      setAddressesError('');
      await createAddress({
        name: formatAddressTypeLabel(addressType),
        phone: contactPhone,
        address: concatenatedAddress,
        latitude: mapPosition?.[0] ?? null,
        longitude: mapPosition?.[1] ?? null,
      });
      await loadAddresses();
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || 'Unable to save address.';
      if (status === 429 || String(message).toLowerCase().includes('too many attempts')) {
        setNextAddressActionAt(Date.now() + 15000);
        setAddressesError('Too many requests right now. Please wait 15 seconds and try again.');
      } else {
        setAddressesError(toProfessionalAddressError(error, 'Unable to save address right now.'));
      }
    } finally {
      setAddressActionLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (Date.now() < nextAddressActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextAddressActionAt - Date.now()) / 1000));
      setAddressesError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      return;
    }

    try {
      setAddressActionLoading(true);
      setAddressesError('');
      await deleteAddress({ addressId });
      if (selectedSavedAddressId === addressId) {
        setSelectedSavedAddressId(null);
      }
      await loadAddresses();
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || 'Unable to delete address.';
      if (status === 429 || String(message).toLowerCase().includes('too many attempts')) {
        setNextAddressActionAt(Date.now() + 15000);
        setAddressesError('Too many requests right now. Please wait 15 seconds and try again.');
      } else {
        setAddressesError(toProfessionalAddressError(error, 'Unable to delete address right now.'));
      }
    } finally {
      setAddressActionLoading(false);
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen" data-name="Checkout" data-node-id="35:5064">
      <div className="flex flex-col gap-[40px] sm:gap-[50px] md:gap-[60px] items-center relative w-full px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[20px] sm:py-[30px] md:py-[40px]">
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center relative w-full max-w-[1240px] px-[12px] sm:px-[16px] md:px-[24px] lg:px-0" data-name="Breadcrumb" data-node-id="35:5125">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] not-italic relative shrink-0 text-[#666] text-[14px] hover:text-[#eea137] transition-colors cursor-pointer" data-node-id="35:5126">
            Home
          </Link>
          <div className="flex items-center justify-center relative shrink-0 size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]" data-name="arrow-down" data-node-id="35:5127">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            </div>
          </div>
          <Link to="/shopping-cart" className="font-['Poppins'] font-medium leading-[20px] not-italic relative shrink-0 text-[#eea137] text-[14px] hover:opacity-80 transition-opacity cursor-pointer" data-node-id="35:5136">
            Shopping Card
          </Link>
        </div>
        
        {/* Checkout Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-[24px] sm:gap-[32px] relative w-full max-w-[1240px]" data-node-id="35:5141">
          {/* Left Column - Checkout Information */}
          <div className="flex flex-col gap-[40px] sm:gap-[50px] items-start relative shrink-0 flex-1 w-full lg:min-w-0" data-name="Checkout Information" data-node-id="35:5142">
            {/* Billing Information */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Billing Information" data-node-id="35:5143">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5144">
                Billing Information
              </p>
              
              {/* Name Fields */}
              <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">First name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="First name"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Last name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Address with map */}
              <div className="flex flex-col gap-[12px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Address</label>
                <p className="font-['Poppins'] text-[12px] text-[#666]">
                  Add your delivery address details below. We will save it securely to your address book.
                </p>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                  placeholder="Enter address or pick on map below"
                />
                <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-[12px]">
                  <div className="flex flex-col gap-[6px] w-full sm:w-1/2">
                    <label className="font-['Poppins'] font-normal text-[13px] text-[#333]">Address Name</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] py-[10px] font-['Poppins'] font-normal text-[13px] text-[#333] bg-white outline-none focus:border-[#0e1c47] transition-colors w-full"
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="office">Office</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-[6px] w-full sm:w-1/2">
                    <label className="font-['Poppins'] font-normal text-[13px] text-[#333]">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] py-[10px] font-['Poppins'] font-normal text-[13px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[10px] w-full">
                  <div className="flex items-center justify-between gap-[12px]">
                    <p className="font-['Poppins'] font-medium text-[13px] text-[#0e1c47]">Saved Addresses</p>
                    <button
                      type="button"
                      onClick={handleSaveCurrentAddress}
                      disabled={addressActionLoading || Date.now() < nextAddressActionAt}
                      className="inline-flex items-center justify-center px-[12px] py-[8px] rounded-[4px] bg-[#eea137] text-white font-['Poppins'] font-medium text-[12px] hover:bg-[#d8902f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {addressActionLoading ? 'Saving...' : 'Save current address'}
                    </button>
                  </div>
                  {loadingAddresses ? (
                    <p className="font-['Poppins'] text-[12px] text-[#666]">Loading saved addresses...</p>
                  ) : savedAddresses.length > 0 ? (
                    <div className="flex flex-col gap-[8px]">
                      {savedAddresses.map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-[6px] p-[10px] flex items-center justify-between gap-[10px] ${
                            selectedSavedAddressId === item.id ? 'border-[#0e1c47] bg-[#f8fbff]' : 'border-[#e4e7e9] bg-white'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => applySavedAddress(item)}
                            className="text-left flex-1 min-w-0 cursor-pointer"
                          >
                            <p className="font-['Poppins'] font-semibold text-[12px] text-[#0e1c47] truncate">{item.name || item.title}</p>
                            {item.phone ? (
                              <p className="font-['Poppins'] font-normal text-[12px] text-[#666] truncate">{item.phone}</p>
                            ) : null}
                            <p className="font-['Poppins'] font-normal text-[12px] text-[#666] truncate">{item.address}</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(item.backendId ?? item.id)}
                            disabled={addressActionLoading || Date.now() < nextAddressActionAt}
                            className="text-[#dc2626] font-['Poppins'] font-medium text-[12px] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-['Poppins'] text-[12px] text-[#666]">No saved addresses yet.</p>
                  )}
                  {addressesError ? (
                    <div className="rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-[10px] py-[8px]">
                      <p className="font-['Poppins'] text-[12px] text-[#b42318]">{addressesError}</p>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={locating}
                    className="inline-flex items-center justify-center gap-[8px] px-[14px] py-[10px] rounded-[4px] bg-[#0e1c47] text-white font-['Poppins'] font-medium text-[13px] sm:text-[14px] hover:bg-[#1a2f5c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {locating ? (
                      <>
                        <span className="inline-block size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Locating…
                      </>
                    ) : (
                      <>
                        <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Locate my position
                      </>
                    )}
                  </button>
                  {mapError && (
                    <p className="font-['Poppins'] text-[13px] text-amber-600">{mapError}</p>
                  )}
                  <div className="rounded-[8px] overflow-hidden border border-[#e4e7e9] bg-[#f9fafb] h-[240px] sm:h-[280px] w-full">
                    <MapContainer
                      center={mapPosition || DEFAULT_CENTER}
                      zoom={mapPosition ? 16 : DEFAULT_ZOOM}
                      className="h-full w-full z-0"
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler onLocationSelect={handleLocationSelect} />
                      {mapPosition && <ChangeView center={mapPosition} zoom={16} />}
                      {mapPosition && (
                        <Marker position={mapPosition}>
                          <Popup>Delivery address</Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                  <p className="font-['Poppins'] text-[12px] text-[#666]">
                    Click on the map to set your delivery address, or use &quot;Locate my position&quot; to use your current location.
                  </p>
                  <p className="font-['Poppins'] text-[12px] text-[#0e1c47] bg-[#f6f8fc] border border-[#e4e7e9] rounded-[4px] px-[10px] py-[8px]">
                    Delivery address summary: {buildConcatenatedAddress() || '-'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment Option */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:5194">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5195">
                Payment Option
              </p>
              
              {/* Payment Methods */}
              <div className="flex flex-wrap gap-[12px] sm:gap-[16px] w-full">
                {[
                  { id: 'sadad', label: 'Sadad', icon: imgCreditCard },
                  { id: 'tabby', label: 'Tabby', icon: imgCreditCard },
                ].map((method) => (
                  <div key={method.id} className="flex flex-col items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`border border-[#e4e7e9] border-solid rounded-[8px] p-[12px] sm:p-[16px] flex flex-col items-center justify-center gap-[8px] w-[100px] sm:w-[120px] h-[120px] sm:h-[140px] cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'border-[#eea137] bg-[#fff9f0]' 
                          : 'hover:border-[#0e1c47]'
                      }`}
                    >
                      <div className="relative size-[40px] sm:size-[48px] min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0">
                        <img
                          src={method.icon}
                          alt={method.label}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                          loading="eager"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop';
                          }}
                        />
                      </div>
                      <p className="font-['Poppins'] font-normal text-[12px] sm:text-[13px] text-[#333] text-center leading-tight">
                        {method.label}
                      </p>
                    </button>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="w-[16px] h-[16px] cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <p className="font-['Poppins'] text-[13px] sm:text-[14px] text-[#666] w-full mt-[4px] max-w-[520px]">
                After you place the order, you will be redirected to{' '}
                {paymentMethod === 'tabby' ? 'Tabby' : 'Sadad'} to complete payment securely.
              </p>
            </div>
            
            {/* Additional Information */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Additional Information" data-node-id="35:5250">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5251">
                Additional Information
              </p>
              <div className="flex flex-col gap-[8px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Order Notes (Optional)</label>
                <textarea 
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full min-h-[100px] resize-y"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-[12px]">
                <label className="inline-flex items-center gap-[8px] font-['Poppins'] text-[14px] text-[#333]">
                  <input type="checkbox" checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} />
                  Use wallet balance
                </label>
                <label className="inline-flex items-center gap-[8px] font-['Poppins'] text-[14px] text-[#333]">
                  <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
                  Use reward points
                </label>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="bg-white border border-[#e6e6e6] border-solid flex flex-col gap-[24px] items-start justify-start p-[20px] sm:p-[24px] rounded-[12px] shrink-0 w-full lg:w-[400px] lg:sticky lg:top-[100px] lg:self-start" data-name="Order Summery" data-node-id="35:5256">
            <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5257">
              Order Summery
            </p>
            
            {/* Order Items */}
            <div className="flex flex-col gap-[16px] w-full">
              {loadingCart ? (
                <p className="font-['Poppins'] text-[13px] text-[#666]">Loading cart items...</p>
              ) : cart.items.length === 0 ? (
                <p className="font-['Poppins'] text-[13px] text-[#666]">Your cart is empty.</p>
              ) : cart.items.map((item) => (
                <div key={`${item.id}-${item.productId}`} className="flex gap-[12px] items-start w-full">
                  <div className="relative size-[80px] sm:size-[100px] shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                    <p className="font-['Poppins'] font-normal text-[14px] text-[#333] line-clamp-2">
                      {item.name}
                    </p>
                    <p className="font-['Poppins'] font-medium text-[14px] text-[#333]">
                      {item.quantity} x ${Number(item.unitPrice || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-[12px] w-full border-t border-[#e4e7e9] pt-[16px]">
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Sub-total</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">${Number(cart.summary?.subtotal || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Shipping</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                  {shippingLoading
                    ? 'Calculating...'
                    : Number(shippingQuote?.shipping ?? cart.summary?.shipping ?? 0) > 0
                      ? `$${Number(shippingQuote?.shipping ?? cart.summary?.shipping ?? 0).toFixed(2)}`
                      : 'Free'}
                </p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Discount</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">
                  ${Number(shippingQuote?.discount ?? cart.summary?.discount ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Tax</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">${Number(cart.summary?.tax || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center w-full border-t border-[#e4e7e9] pt-[12px] mt-[4px]">
                <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#333]">Total</p>
                <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#333]">
                  ${Number(shippingQuote?.total ?? cart.summary?.total ?? 0).toFixed(2)} USD
                </p>
              </div>
            </div>

            {checkoutError ? (
              <div className="rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-[10px] py-[8px] w-full">
                <p className="font-['Poppins'] text-[12px] text-[#b42318]">{checkoutError}</p>
              </div>
            ) : null}

            {checkoutWarning ? (
              <div className="rounded-[6px] border border-[#fde68a] bg-[#fffbeb] px-[10px] py-[8px] w-full">
                <p className="font-['Poppins'] text-[12px] text-[#92400e]">{checkoutWarning}</p>
              </div>
            ) : null}

            {/* Process To Check Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={checkoutLoading || loadingCart || !cart.items.length}
              className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[14px] sm:text-[16px] w-full flex items-center justify-center gap-[8px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{checkoutLoading ? 'Placing Order...' : 'Process To Check'}</span>
              <div className="relative size-[16px] sm:size-[18px]">
                <img 
                  src={imgArrowRight} 
                  alt="Arrow" 
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
