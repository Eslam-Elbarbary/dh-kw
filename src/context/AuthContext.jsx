import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutRequest } from '../services/auth.service';
import { normalizePhoneForApi } from '../utils/phoneE164';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const resolveEmailVerified = (source) => {
    if (!source || typeof source !== 'object') return false;
    const directBoolean = source?.is_email_verified ?? source?.is_verified ?? source?.verified;
    if (typeof directBoolean === 'boolean') return directBoolean;
    const directNumber = Number(directBoolean);
    if (Number.isFinite(directNumber)) return directNumber === 1;
    return Boolean(source?.email_verified_at || source?.verified_at);
  };

  const resolvePhoneVerified = (source) => {
    if (!source || typeof source !== 'object') return false;
    const directBoolean = source?.is_phone_verified ?? source?.phone_verified;
    if (typeof directBoolean === 'boolean') return directBoolean;
    const directNumber = Number(directBoolean);
    if (Number.isFinite(directNumber)) return directNumber === 1;
    return Boolean(source?.phone_verified_at);
  };

  const normalizeUser = (rawProfile) => {
    const source = rawProfile?.user || rawProfile?.data?.user || rawProfile?.data || rawProfile || {};
    const fullName = String(source?.name || '').trim();
    const fallbackFirstName = fullName.split(' ').slice(0, 1).join(' ');
    const fallbackLastName = fullName.split(' ').slice(1).join(' ');
    const firstName = source?.firstName || source?.first_name || fallbackFirstName || '';
    const lastName = source?.lastName || source?.last_name || fallbackLastName || '';
    const normalizedName = [firstName, lastName].filter(Boolean).join(' ').trim() || fullName || '';

    return {
      ...source,
      firstName,
      lastName,
      name: normalizedName,
      email: source?.email || '',
      phone: source?.phone || '',
      country_id: source?.country_id ?? source?.countryId ?? null,
      isEmailVerified: resolveEmailVerified(source),
      isPhoneVerified: resolvePhoneVerified(source),
    };
  };

  const syncPendingPhoneVerification = (normalizedProfile) => {
    if (!normalizedProfile?.isPhoneVerified && normalizedProfile?.phone) {
      localStorage.setItem('pendingVerificationPhone', normalizePhoneForApi(normalizedProfile.phone));
    } else {
      localStorage.removeItem('pendingVerificationPhone');
    }
    localStorage.removeItem('pendingVerificationEmail');
  };

  const persistProfile = (profile) => {
    const normalizedProfile = normalizeUser(profile);
    setUser(normalizedProfile);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedProfile));
    localStorage.setItem('isAuthenticated', 'true');
    const profileCountryId = normalizedProfile?.country_id ?? normalizedProfile?.countryId;
    const countryChosenManually = localStorage.getItem('countryManuallySelected') === '1';
    if (profileCountryId && !countryChosenManually && !localStorage.getItem('selectedCountryId')) {
      localStorage.setItem('selectedCountryId', String(profileCountryId));
    }
    syncPendingPhoneVerification(normalizedProfile);
  };

  const refreshUser = async () => {
    const userResponse = await getCurrentUser();
    const profile = userResponse?.data ?? userResponse;
    if (profile) {
      persistProfile(profile);
    }
    return profile;
  };

  // Check localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      if (savedUser && isAuth) {
        setUser(normalizeUser(JSON.parse(savedUser)));
        setIsAuthenticated(true);
      }

      try {
        await refreshUser();
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    const normalizedProfile = normalizeUser(userData);
    setUser(normalizedProfile);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedProfile));
    localStorage.setItem('isAuthenticated', 'true');
    syncPendingPhoneVerification(normalizedProfile);
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('token')) {
        await logoutRequest();
      }
    } catch {
      // Ignore API logout errors and always clear local session.
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

