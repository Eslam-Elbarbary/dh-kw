import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildSavedAddressLine,
  createAddress,
  deleteAddress,
  formatAddressPreview,
  getAddresses,
  matchRegionId,
  parseSavedAddressLine,
  sanitizeStreetForForm,
} from '../services/address.service';
import { useCountry } from '../context/CountryContext';
import { getCountries } from '../services/meta.service';
import { getShippingStates, getShippingCities } from '../services/shipping.service';

const LABEL_OPTIONS = ['Home', 'Office', 'Other'];

const inputClass =
  'w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[14px] py-[12px] font-[\'Poppins\'] font-normal text-[14px] text-[#0e1c47] bg-white focus:outline-none focus:border-[#eea137] transition-colors';

const selectClass =
  'w-full border border-[#e6e6e6] border-solid rounded-[4px] px-[14px] py-[12px] font-[\'Poppins\'] font-normal text-[14px] text-[#0e1c47] bg-white focus:outline-none focus:border-[#eea137] transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const emptyForm = (phoneFallback = '') => ({
  name: 'Home',
  phone: phoneFallback,
  stateId: '',
  cityId: '',
  town: '',
  street: '',
  flatNum: '',
});

const displayNameLabel = (name) => {
  const raw = String(name || '').trim();
  if (!raw) return 'Address';
  if (LABEL_OPTIONS.includes(raw)) return raw;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

export default function AddressBookSection({ defaultPhone = '' }) {
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveAddressLoading, setSaveAddressLoading] = useState(false);
  const [nextAddressSaveAt, setNextAddressSaveAt] = useState(0);
  const [deleteAddressLoadingId, setDeleteAddressLoadingId] = useState(null);
  const [addressForm, setAddressForm] = useState(() => emptyForm(defaultPhone));
  const [countriesMeta, setCountriesMeta] = useState([]);
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [shippingRegionsError, setShippingRegionsError] = useState('');
  const [pendingCityMatch, setPendingCityMatch] = useState('');
  const [addressesLoading, setAddressesLoading] = useState(true);

  const { countryId: activeCountryId } = useCountry();
  const activeCountry = useMemo(
    () => countriesMeta.find((c) => String(c.id) === String(activeCountryId)),
    [countriesMeta, activeCountryId],
  );
  const shippingCountryCode = useMemo(
    () => (activeCountry?.code ? String(activeCountry.code).toLowerCase() : ''),
    [activeCountry],
  );

  const selectedStateName = useMemo(
    () => shippingStates.find((s) => String(s.id) === String(addressForm.stateId))?.name || '',
    [shippingStates, addressForm.stateId],
  );
  const selectedCityName = useMemo(
    () => shippingCities.find((c) => String(c.id) === String(addressForm.cityId))?.name || '',
    [shippingCities, addressForm.cityId],
  );

  const countryCodeForApi = activeCountry?.code || shippingCountryCode;

  const fullAddressPreview = useMemo(
    () => buildSavedAddressLine({
      name: displayNameLabel(addressForm.name),
      street: addressForm.street,
      stateName: selectedStateName,
      cityName: selectedCityName || addressForm.town,
    }),
    [addressForm.name, addressForm.street, addressForm.town, selectedStateName, selectedCityName],
  );

  const addressPreviewLines = useMemo(
    () => formatAddressPreview({
      label: displayNameLabel(addressForm.name),
      phone: addressForm.phone,
      town: addressForm.town,
      street: addressForm.street,
      flatNum: addressForm.flatNum,
      stateName: selectedStateName,
      cityName: selectedCityName,
      countryName: activeCountry?.name || '',
      fullAddress: fullAddressPreview,
    }),
    [
      addressForm.name,
      addressForm.phone,
      addressForm.town,
      addressForm.street,
      addressForm.flatNum,
      selectedStateName,
      selectedCityName,
      activeCountry?.name,
      fullAddressPreview,
    ],
  );

  const loadAddresses = useCallback(async () => {
    if (!countryCodeForApi) return [];
    try {
      setAddressesLoading(true);
      const list = await getAddresses({ countryCode: countryCodeForApi });
      setSavedAddresses(list);
      return list;
    } catch {
      setSavedAddresses([]);
      return [];
    } finally {
      setAddressesLoading(false);
    }
  }, [countryCodeForApi]);

  const applyParsedAddressToForm = useCallback((item) => {
    const parsed = item.governorateLabel != null
      ? {
          street: item.street || '',
          governorate: item.governorateLabel,
          area: item.areaLabel,
          nameFromBracket: '',
        }
      : parseSavedAddressLine(item.address || '');
    const stateId = item.stateId || matchRegionId(shippingStates, parsed.governorate);
    const cleanStreet = sanitizeStreetForForm(
      item.street || parsed.street,
      parsed.governorate || item.governorateLabel,
      parsed.area || item.areaLabel,
    );
    const townLabel = item.town || parsed.area || item.areaLabel || '';
    setAddressForm({
      name: LABEL_OPTIONS.includes(item.name) ? item.name : displayNameLabel(item.name || parsed.nameFromBracket || 'Home'),
      phone: item.phone || defaultPhone || '',
      stateId,
      cityId: item.cityId || '',
      town: townLabel,
      street: cleanStreet,
      flatNum: item.flatNum || '',
    });
    setPendingCityMatch(item.cityId ? '' : townLabel);
  }, [shippingStates, defaultPhone]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getCountries();
        if (!cancelled) setCountriesMeta(list);
      } catch {
        if (!cancelled) setCountriesMeta([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!shippingCountryCode) {
      setShippingStates([]);
      setShippingCities([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setStatesLoading(true);
      setShippingRegionsError('');
      try {
        const states = await getShippingStates(shippingCountryCode);
        if (!cancelled) setShippingStates(states);
      } catch {
        if (!cancelled) {
          setShippingStates([]);
          setShippingRegionsError('Could not load regions. Try again in a moment.');
        }
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shippingCountryCode]);

  useEffect(() => {
    if (!shippingCountryCode || !addressForm.stateId) {
      setShippingCities([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setCitiesLoading(true);
      try {
        const cities = await getShippingCities({
          countryCode: shippingCountryCode,
          stateId: addressForm.stateId,
        });
        if (!cancelled) setShippingCities(cities);
      } catch {
        if (!cancelled) setShippingCities([]);
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shippingCountryCode, addressForm.stateId]);

  useEffect(() => {
    if (!pendingCityMatch || !shippingCities.length) return;
    const cityId = matchRegionId(shippingCities, pendingCityMatch);
    if (cityId) {
      setAddressForm((prev) => ({ ...prev, cityId }));
      setPendingCityMatch('');
    }
  }, [pendingCityMatch, shippingCities]);

  useEffect(() => {
    if (!defaultPhone) return;
    setAddressForm((prev) => (prev.phone ? prev : { ...prev, phone: defaultPhone }));
  }, [defaultPhone]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await loadAddresses();
      if (cancelled || list.length === 0) return;
      setSelectedAddressId(list[0].id);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAddresses]);

  useEffect(() => {
    if (!savedAddresses.length || !shippingStates.length) return;
    const selected = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
    if (selected && selectedAddressId !== selected.id) {
      setSelectedAddressId(selected.id);
    }
    if (selected) applyParsedAddressToForm(selected);
  }, [shippingStates.length]); // eslint-disable-line react-hooks/exhaustive-deps -- hydrate once regions load

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => {
      if (name === 'stateId') {
        return { ...prev, stateId: value, cityId: '', town: '' };
      }
      if (name === 'cityId') {
        const cityName = shippingCities.find((c) => String(c.id) === String(value))?.name || '';
        return { ...prev, cityId: value, town: cityName };
      }
      return { ...prev, [name]: value };
    });
    if (addressError) setAddressError('');
    if (addressSuccess) setAddressSuccess('');
  };

  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleClearForm = () => {
    setAddressForm(emptyForm(defaultPhone));
    setSelectedAddressId(null);
    setPendingCityMatch('');
    setAddressError('');
    setAddressSuccess('');
  };

  const handleSaveAddress = async () => {
    if (Date.now() < nextAddressSaveAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextAddressSaveAt - Date.now()) / 1000));
      setAddressError(`Please wait ${waitSeconds}s before trying again.`);
      return;
    }

    if (!countryCodeForApi) {
      setAddressError('Please select your delivery country from the site header first.');
      return;
    }

    const name = String(addressForm.name || '').trim();
    const phone = String(addressForm.phone || '').trim();
    const town = String(addressForm.town || selectedCityName || '').trim();
    const street = String(addressForm.street || '').trim();
    const flatNum = String(addressForm.flatNum || '').trim();

    if (!name || !phone || !street) {
      setAddressError('Please fill in address type, phone, and street.');
      return;
    }
    if (shippingStates.length > 0 && !addressForm.stateId) {
      setAddressError('Please select your governorate.');
      return;
    }
    if (shippingStates.length > 0 && addressForm.stateId && shippingCities.length > 0 && !addressForm.cityId) {
      setAddressError('Please select your area.');
      return;
    }

    const fullAddress = buildSavedAddressLine({
      name: displayNameLabel(name),
      street,
      stateName: selectedStateName,
      cityName: selectedCityName || town,
    });

    try {
      setSaveAddressLoading(true);
      setAddressError('');
      setAddressSuccess('');
      const created = await createAddress({
        name,
        phone,
        street,
        stateId: addressForm.stateId,
        cityId: addressForm.cityId,
        town,
        flatNum,
        address: fullAddress,
        countryCode: countryCodeForApi,
      });
      const list = await loadAddresses();
      const createdId = created?.data?.id || created?.id || created?.data?.address?.id;
      if (createdId) setSelectedAddressId(createdId);
      else if (list[0]) setSelectedAddressId(list[0].id);
      setAddressForm(emptyForm(defaultPhone));
      setPendingCityMatch('');
      setAddressSuccess('Address saved.');
    } catch (error) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
        ? Object.values(responseData.errors).flat().filter(Boolean)
        : [];
      let message = validationErrors.length > 0
        ? validationErrors.join(' ')
        : (responseData?.message || 'Could not save this address.');
      if (error?.response?.status === 429 || String(message).toLowerCase().includes('too many attempts')) {
        setNextAddressSaveAt(Date.now() + 15000);
        message = 'Too many attempts. Please wait 15 seconds and try again.';
      }
      setAddressError(message);
    } finally {
      setSaveAddressLoading(false);
    }
  };

  const handleSelectAddress = (item) => {
    setSelectedAddressId(item.id);
    applyParsedAddressToForm(item);
    setAddressError('');
    setAddressSuccess('');
  };

  const handleDeleteAddress = async (item) => {
    const addressId = item?.backendId ?? item?.id;
    if (!addressId || String(addressId).startsWith('address-')) {
      setAddressError('This address cannot be removed.');
      return;
    }
    try {
      setDeleteAddressLoadingId(item.id);
      setAddressError('');
      await deleteAddress({ addressId, countryCode: countryCodeForApi });
      const list = await loadAddresses();
      if (selectedAddressId === item.id) {
        setSelectedAddressId(null);
        setAddressForm(emptyForm(defaultPhone));
        setPendingCityMatch('');
      } else if (list[0] && selectedAddressId === null) {
        setSelectedAddressId(list[0].id);
        applyParsedAddressToForm(list[0]);
      }
      setAddressSuccess('Address removed.');
    } catch (error) {
      setAddressError(error?.response?.data?.message || 'Could not delete this address.');
    } finally {
      setDeleteAddressLoadingId(null);
    }
  };

  return (
    <div className="border border-[#e6e6e6] rounded-[8px] p-[20px] sm:p-[24px] bg-[#fafbfc]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[12px] mb-[20px]">
        <div>
          <h3 className="font-['Poppins'] font-semibold text-[17px] text-[#0e1c47]">Delivery addresses</h3>
          <p className="font-['Poppins'] text-[13px] text-[#64748b] mt-[4px] max-w-[520px] leading-relaxed">
            Save delivery locations for faster checkout
            {activeCountry?.name ? (
              <>
                {' '}
                in <span className="font-semibold text-[#0e1c47]">{activeCountry.name}</span>
              </>
            ) : null}
            . Choose your region, then add street and apartment details.
          </p>
        </div>
        {activeCountry?.flagUrl ? (
          <img
            src={activeCountry.flagUrl}
            alt=""
            className="size-[36px] rounded-[4px] object-cover border border-[#e6e6e6] shrink-0"
          />
        ) : null}
      </div>

      {addressError ? (
        <p className="font-['Poppins'] text-[13px] text-[#8e0909] mb-[12px] rounded-[4px] bg-[#fef2f2] border border-[#fecaca] px-[12px] py-[8px]">
          {addressError}
        </p>
      ) : null}
      {addressSuccess ? (
        <p className="font-['Poppins'] text-[13px] text-[#00a651] mb-[12px] rounded-[4px] bg-[#ecfdf5] border border-[#bbf7d0] px-[12px] py-[8px]">
          {addressSuccess}
        </p>
      ) : null}

      <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-[18px] sm:p-[20px]">
        <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47] mb-[14px]">
          Add new address
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
          <div>
            <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
              Address label
            </label>
            <select
              name="name"
              value={LABEL_OPTIONS.includes(addressForm.name) ? addressForm.name : 'Other'}
              onChange={handleFormChange}
              className={selectClass}
            >
              {LABEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
              Mobile number
            </label>
            <input
              type="tel"
              name="phone"
              value={addressForm.phone}
              onChange={handleFormChange}
              onKeyDown={preventEnterSubmit}
              className={inputClass}
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
          <div>
            <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
              Governorate
            </label>
            <select
              name="stateId"
              value={addressForm.stateId}
              onChange={handleFormChange}
              disabled={statesLoading || !shippingStates.length}
              className={selectClass}
            >
              <option value="">
                {statesLoading ? 'Loading…' : 'Select governorate'}
              </option>
              {shippingStates.map((state) => (
                <option key={String(state.id)} value={String(state.id)}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
              City / area
            </label>
            <select
              name="cityId"
              value={addressForm.cityId}
              onChange={handleFormChange}
              disabled={!addressForm.stateId || citiesLoading || !shippingCities.length}
              className={selectClass}
            >
              <option value="">
                {!addressForm.stateId
                  ? 'Select governorate first'
                  : citiesLoading
                    ? 'Loading…'
                    : 'Select city / area'}
              </option>
              {shippingCities.map((city) => (
                <option key={String(city.id)} value={String(city.id)}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {shippingRegionsError ? (
          <p className="font-['Poppins'] text-[12px] text-[#b45309] mb-[12px]">{shippingRegionsError}</p>
        ) : null}

        <div className="mb-[14px]">
          <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
            District
          </label>
          <input
            type="text"
            name="town"
            value={addressForm.town}
            onChange={handleFormChange}
            onKeyDown={preventEnterSubmit}
            className={inputClass}
            placeholder="Auto-filled from city — edit if needed"
          />
        </div>

        <div className="mb-[14px]">
          <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
            Street & building details
          </label>
          <textarea
            name="street"
            value={addressForm.street}
            onChange={handleFormChange}
            onKeyDown={preventEnterSubmit}
            rows={2}
            className={`${inputClass} resize-y min-h-[72px]`}
            placeholder="e.g. Building 12, Block 8, landmark"
          />
          <p className="font-['Poppins'] text-[11px] text-[#94a3b8] mt-[6px]">
            Do not repeat governorate or country here — those are selected above.
          </p>
        </div>

        <div className="mb-[16px]">
          <label className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[6px] block">
            Apartment / unit no.
          </label>
          <input
            type="text"
            name="flatNum"
            value={addressForm.flatNum}
            onChange={handleFormChange}
            onKeyDown={preventEnterSubmit}
            className={inputClass}
            placeholder="e.g. 5"
            inputMode="numeric"
          />
        </div>

        {addressPreviewLines.length > 0 ? (
          <div className="mb-[16px] rounded-[6px] border border-[#e2e8f0] bg-[#f8fafc] px-[14px] py-[12px]">
            <p className="font-['Poppins'] font-medium text-[13px] text-[#0e1c47] mb-[8px]">
              Delivery preview
            </p>
            {fullAddressPreview ? (
              <p className="font-['Poppins'] text-[13px] text-[#475569] mb-[8px] leading-relaxed break-words">
                {fullAddressPreview}
              </p>
            ) : null}
            {addressPreviewLines.map((line, index) => (
              <p key={`${line}-${index}`} className="font-['Poppins'] text-[13px] text-[#0e1c47] leading-snug">
                {line}
              </p>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-[10px] justify-end">
          <button
            type="button"
            onClick={handleClearForm}
            className="font-['Poppins'] font-medium text-[13px] px-[16px] py-[10px] rounded-[4px] border border-[#e6e6e6] text-[#475569] hover:bg-[#f1f5f9] transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSaveAddress}
            disabled={saveAddressLoading || Date.now() < nextAddressSaveAt}
            className="font-['Poppins'] font-semibold text-[13px] px-[22px] py-[10px] rounded-[4px] bg-[#0e1c47] text-white hover:bg-[#1a2d5a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saveAddressLoading ? 'Saving…' : 'Save address'}
          </button>
        </div>
      </div>

      <div className="mt-[20px]">
        <p className="font-['Poppins'] font-medium text-[13px] text-[#334155] mb-[10px]">
          Saved addresses
          {savedAddresses.length > 0 ? ` (${savedAddresses.length})` : ''}
        </p>
        {addressesLoading ? (
          <p className="font-['Poppins'] text-[13px] text-[#94a3b8]">Loading addresses…</p>
        ) : savedAddresses.length === 0 ? (
          <p className="font-['Poppins'] text-[13px] text-[#94a3b8]">No saved addresses yet.</p>
        ) : (
          <ul className="space-y-[10px]">
            {savedAddresses.map((item) => {
              const streetLine = item.street
                || sanitizeStreetForForm(parseSavedAddressLine(item.address).street, item.governorateLabel, item.areaLabel);
              const regionLine = [
                item.governorateLabel,
                item.areaLabel,
                activeCountry?.name,
              ].filter(Boolean).join(' · ');
              const isSelected = selectedAddressId === item.id;
              return (
                <li
                  key={item.id}
                  className={`rounded-[8px] border px-[14px] py-[12px] flex items-start justify-between gap-[12px] transition-colors ${
                    isSelected ? 'border-[#0e1c47] bg-[#f0f7ff]' : 'border-[#e6e6e6] bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAddress(item)}
                    className="text-left flex-1 min-w-0"
                  >
                    <p className="font-['Poppins'] font-semibold text-[14px] text-[#0e1c47]">
                      {item.name || 'Address'}
                      {item.phone ? (
                        <span className="font-normal text-[#64748b]"> · {item.phone}</span>
                      ) : null}
                    </p>
                    {streetLine ? (
                      <p className="font-['Poppins'] text-[13px] text-[#475569] mt-[4px] leading-relaxed break-words">
                        {streetLine}
                      </p>
                    ) : null}
                    {regionLine ? (
                      <p className="font-['Poppins'] text-[12px] text-[#0e1c47] mt-[6px]">
                        {regionLine}
                      </p>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(item)}
                    disabled={deleteAddressLoadingId === item.id}
                    className="shrink-0 font-['Poppins'] font-medium text-[12px] text-[#dc2626] hover:underline disabled:opacity-50"
                  >
                    {deleteAddressLoadingId === item.id ? 'Removing…' : 'Remove'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
