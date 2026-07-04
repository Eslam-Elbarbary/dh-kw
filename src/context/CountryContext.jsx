import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { resolveCountryId } from '../services/catalog.service';
import { getCountries } from '../services/meta.service';

const STORAGE_KEY = 'selectedCountryId';
const MANUAL_KEY = 'countryManuallySelected';

const CountryContext = createContext(null);

export function CountryProvider({ children }) {
  const { user, isAuthLoading } = useAuth();
  const [countryId, setCountryIdState] = useState(() => resolveCountryId(1));
  const [countries, setCountries] = useState([]);

  const applyCountryId = useCallback((id, { manual = false } = {}) => {
    const parsed = Number(id);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    localStorage.setItem(STORAGE_KEY, String(parsed));
    if (manual) localStorage.setItem(MANUAL_KEY, '1');
    setCountryIdState(parsed);
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const isManual = localStorage.getItem(MANUAL_KEY) === '1';

    if (stored && isManual) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed > 0) {
        setCountryIdState(parsed);
      }
      return;
    }

    if (stored) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed > 0) {
        setCountryIdState(parsed);
        return;
      }
    }

    const profileCountry = user?.country_id ?? user?.countryId;
    if (profileCountry) {
      const parsed = Number(profileCountry);
      if (Number.isFinite(parsed) && parsed > 0) {
        setCountryIdState(parsed);
        localStorage.setItem(STORAGE_KEY, String(parsed));
      }
    }
  }, [isAuthLoading, user?.country_id, user?.countryId]);

  const setCountryId = useCallback(
    (id) => applyCountryId(id, { manual: true }),
    [applyCountryId],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getCountries();
        if (!cancelled) setCountries(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setCountries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCountry = useMemo(
    () => countries.find((c) => String(c.id) === String(countryId)) || null,
    [countries, countryId],
  );

  const countryCode = activeCountry?.code || '';
  const countryCurrencyCode = activeCountry?.currencyCode || '';

  const value = useMemo(
    () => ({ countryId, countryCode, countryCurrencyCode, countries, setCountryId }),
    [countryId, countryCode, countryCurrencyCode, countries, setCountryId],
  );

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error('useCountry must be used within CountryProvider');
  }
  return ctx;
}
