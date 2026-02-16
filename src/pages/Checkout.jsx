// Checkout page - exact Figma implementation
// Based on Figma design - Checkout Page

import { Link } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

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
import currencyDollarIcon from '../assets/CurrencyDollar.svg';
import creditCardIcon from '../assets/CreditCard.svg';
import amazonIcon from '../assets/amazon-icon-1 1.svg';
import paypalIcon from '../assets/paypal.png';
import venmoIcon from '../assets/venmo.svg';
import productImage1 from '../assets/04eed14fc3631917a17e9d14491e48383aa02358.png';
import productImage2 from '../assets/0e25c65909ff9d8fdace00ffb430dbc3cbf9784b.png';

// Arrow icon for breadcrumbs
const imgArrowDown = arrowDownIcon;

// Payment method icons
const imgCashOnDelivery = currencyDollarIcon;
const imgVenmo = venmoIcon;
const imgPayPal = paypalIcon;
const imgAmazonPay = amazonIcon;
const imgCreditCard = creditCardIcon;

// Arrow right icon for button
const imgArrowRight = arrowRightIcon;

// Product images for order summary
const imgCamera = productImage1;
const imgHeadphones = productImage2;

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
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [address, setAddress] = useState('');
  const [mapPosition, setMapPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState('');
  const [country, setCountry] = useState('');
  const [regionState, setRegionState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [addressType, setAddressType] = useState('house');
  const [buildingHouseNo, setBuildingHouseNo] = useState('');
  const [paciNumber, setPaciNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [jaddaAvenue, setJaddaAvenue] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [block, setBlock] = useState('');

  const handleLocationSelect = useCallback(async (lat, lng) => {
    setMapPosition([lat, lng]);
    setMapError('');
    try {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr.addressLine);
      setCountry(addr.country);
      setRegionState(addr.state);
      setCity(addr.city);
      setZipCode(addr.zipCode);
      setArea(addr.area || '');
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
          setCountry(addr.country);
          setRegionState(addr.state);
          setCity(addr.city);
          setZipCode(addr.zipCode);
          setArea(addr.area || '');
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
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="First name"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Last name</label>
                  <input 
                    type="text" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-[8px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Company Name (Optional)</label>
                <input 
                  type="text" 
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                  placeholder="Company Name"
                />
              </div>

              {/* Address with map */}
              <div className="flex flex-col gap-[12px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                  placeholder="Enter address or pick on map below"
                />
                <div className="flex flex-col gap-[10px] w-full">
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
                </div>
              </div>

              {/* Address Type & Details */}
              <div className="flex flex-col gap-[20px] w-full">
                <div className="flex flex-col gap-[10px] w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Address Type</label>
                  <div className="flex flex-wrap gap-[16px] sm:gap-[24px] items-center">
                    {['house', 'apartment', 'office'].map((type) => (
                      <label key={type} className="flex items-center gap-[8px] cursor-pointer">
                        <input
                          type="radio"
                          name="addressType"
                          value={type}
                          checked={addressType === type}
                          onChange={(e) => setAddressType(e.target.value)}
                          className="w-[16px] h-[16px] accent-[#0e1c47] cursor-pointer"
                        />
                        <span className="font-['Poppins'] font-normal text-[14px] text-[#333] capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Building Name / House No <span className="text-[#eea137]">*</span></label>
                    <input
                      type="text"
                      value={buildingHouseNo}
                      onChange={(e) => setBuildingHouseNo(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Building Name / House No"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">PACI Number (optional)</label>
                    <input
                      type="text"
                      value={paciNumber}
                      onChange={(e) => setPaciNumber(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="PACI Number (optional)"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Street Name <span className="text-[#eea137]">*</span></label>
                    <input
                      type="text"
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Street Name"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Jadda/Avenue (optional)</label>
                    <input
                      type="text"
                      value={jaddaAvenue}
                      onChange={(e) => setJaddaAvenue(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Jadda/Avenue (optional)"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[8px] w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Landmark (optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Landmark (optional)"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Area</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white"
                      placeholder="Area"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] flex-1 w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Block</label>
                    <input
                      type="text"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Block"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details – filled from map when you use Locate my position or click on the map */}
              <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="kuwait">Kuwait</option>
                    <option value="saudi">Saudi Arabia</option>
                    <option value="uae">UAE</option>
                    {country && !['kuwait', 'saudi', 'uae'].includes(country) && (
                      <option value={country}>{country}</option>
                    )}
                  </select>
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Region/State</label>
                  <input
                    type="text"
                    value={regionState}
                    onChange={(e) => setRegionState(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white"
                    placeholder="Region/State"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full bg-white"
                    placeholder="City"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Zip Code"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Email</label>
                  <input 
                    type="email" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Email"
                  />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 w-full">
                  <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Phone Number</label>
                  <input 
                    type="tel" 
                    className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Shipping Option */}
              <div className="flex items-center gap-[8px] w-full">
                <input 
                  type="checkbox" 
                  id="shipDifferent"
                  checked={shipToDifferentAddress}
                  onChange={(e) => setShipToDifferentAddress(e.target.checked)}
                  className="w-[16px] h-[16px] cursor-pointer"
                />
                <label htmlFor="shipDifferent" className="font-['Poppins'] font-normal text-[14px] text-[#333] cursor-pointer">
                  Ship into different address
                </label>
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
                  { id: 'cash', label: 'Cash on Delivery', icon: imgCashOnDelivery },
                  { id: 'venmo', label: 'Venmo', icon: imgVenmo },
                  { id: 'paypal', label: 'Paypal', icon: imgPayPal },
                  { id: 'amazon', label: 'Amazon Pay', icon: imgAmazonPay },
                  { id: 'card', label: 'Debit/Credit Card', icon: imgCreditCard }
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
                        {method.id === 'cash' ? (
                          <div className="text-[24px] sm:text-[28px]">$</div>
                        ) : (
                          <img 
                            src={method.icon} 
                            alt={method.label} 
                            className="max-w-full max-h-full w-auto h-auto object-contain"
                            loading="eager"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop';
                            }}
                          />
                        )}
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

              {/* Card Details - Show when Debit/Credit Card is selected */}
              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-[16px] sm:gap-[20px] w-full mt-[8px]">
                  <div className="flex flex-col gap-[8px] w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Name on Card</label>
                    <input 
                      type="text" 
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Name on Card"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px] w-full">
                    <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Card Number</label>
                    <input 
                      type="text" 
                      className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                      placeholder="Card Number"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] w-full">
                    <div className="flex flex-col gap-[8px] flex-1 w-full">
                      <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Expire Date</label>
                      <input 
                        type="text" 
                        className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                        placeholder="DD/YY"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px] flex-1 w-full">
                      <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">CVC</label>
                      <input 
                        type="text" 
                        className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full"
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Information */}
            <div className="flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Additional Information" data-node-id="35:5250">
              <p className="font-['Poppins'] font-medium leading-[24px] not-italic relative shrink-0 text-[18px] sm:text-[20px] text-black w-full" data-node-id="35:5251">
                Additional Information
              </p>
              <div className="flex flex-col gap-[8px] w-full">
                <label className="font-['Poppins'] font-normal text-[14px] text-[#333]">Order Notes (Optional)</label>
                <textarea 
                  className="border border-[#e4e7e9] border-solid rounded-[4px] px-[12px] sm:px-[16px] py-[10px] sm:py-[12px] font-['Poppins'] font-normal text-[14px] text-[#333] outline-none focus:border-[#0e1c47] transition-colors w-full min-h-[100px] resize-y"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
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
              {/* Item 1 */}
              <div className="flex gap-[12px] items-start w-full">
                <div className="relative size-[80px] sm:size-[100px] shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5]">
                  <img 
                    src={imgCamera} 
                    alt="Canon EOS 1500D DSLR Camera" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-['Poppins'] font-normal text-[14px] text-[#333] line-clamp-2">
                    Canon EOS 1500D DSLR Camera Body+ 18-...
                  </p>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#333]">
                    1 x $70
                  </p>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex gap-[12px] items-start w-full">
                <div className="relative size-[80px] sm:size-[100px] shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5]">
                  <img 
                    src={imgHeadphones} 
                    alt="Wired Over-Ear Gaming Headphones" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-['Poppins'] font-normal text-[14px] text-[#333] line-clamp-2">
                    Wired Over-Ear Gaming Headphones with U...
                  </p>
                  <p className="font-['Poppins'] font-medium text-[14px] text-[#333]">
                    3 x $250
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="flex flex-col gap-[12px] w-full border-t border-[#e4e7e9] pt-[16px]">
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Sub-total</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">$320</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Shipping</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">Free</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Discount</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">$24</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="font-['Poppins'] font-normal text-[14px] text-[#666]">Tax</p>
                <p className="font-['Poppins'] font-normal text-[14px] text-[#333]">$61.99</p>
              </div>
              <div className="flex justify-between items-center w-full border-t border-[#e4e7e9] pt-[12px] mt-[4px]">
                <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#333]">Total</p>
                <p className="font-['Poppins'] font-semibold text-[16px] sm:text-[18px] text-[#333]">$357.99 USD</p>
              </div>
            </div>

            {/* Process To Check Button */}
            <button className="bg-[#0e1c47] text-white font-['Poppins'] font-semibold py-[12px] sm:py-[14px] px-[20px] sm:px-[24px] rounded-[4px] hover:bg-[#1a2f5c] transition-colors text-[14px] sm:text-[16px] w-full flex items-center justify-center gap-[8px] cursor-pointer">
              <span>Process To Check</span>
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
