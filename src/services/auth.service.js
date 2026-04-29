import api from './api';

export const loginRequest = async ({ login, password }) => {
  const normalizedLogin = String(login || '').trim();
  const normalizedPassword = String(password || '');
  const isEmailLogin = normalizedLogin.includes('@');

  const payload = {
    login: normalizedLogin,
    password: normalizedPassword,
  };

  if (isEmailLogin) {
    payload.email = normalizedLogin.toLowerCase();
  }

  const res = await api.post('/api/auth/login', payload);
  return res.data;
};

export const logoutRequest = async () => {
  const res = await api.post('/api/logout');
  return res.data;
};

export const registerRequest = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  passwordConfirmation,
  countryId,
}) => {
  const name = `${firstName} ${lastName}`.trim();

  const res = await api.post('/api/auth/register', {
    name,
    email,
    phone,
    password,
    password_confirmation: passwordConfirmation,
    country_id: countryId,
  });

  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/api/user');
  return res.data;
};

export const getProfileRequest = async () => {
  const res = await api.get('/api/profile');
  return res.data;
};

export const updateProfileRequest = async ({
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  country,
  zipCode,
}) => {
  const normalizedFirstName = String(firstName || '').trim();
  const normalizedLastName = String(lastName || '').trim();
  const name = `${normalizedFirstName} ${normalizedLastName}`.trim();
  const normalizedPhone = String(phone || '').trim();

  // Send a single compatibility payload (no fake fallbacks)
  // so required fields are always present regardless of key naming.
  const payload = {
    name: name || '',
    full_name: name || '',
    first_name: normalizedFirstName || '',
    last_name: normalizedLastName || '',
    firstName: normalizedFirstName || '',
    lastName: normalizedLastName || '',
    phone: normalizedPhone || '',
    mobile: normalizedPhone || '',
    phone_number: normalizedPhone || '',
    email: String(email || '').trim(),
  };

  const res = await api.put('/api/profile', payload, {
    retryOnTooManyRequests: true,
    maxRetries: 3,
  });
  return res.data;
};

export const updatePasswordRequest = async ({
  currentPassword,
  newPassword,
  newPasswordConfirmation,
}) => {
  const res = await api.put('/api/password', {
    current_password: currentPassword,
    old_password: currentPassword,
    password: newPassword,
    new_password: newPassword,
    password_confirmation: newPasswordConfirmation,
    new_password_confirmation: newPasswordConfirmation,
  });
  return res.data;
};

export const verifyEmailRequest = async ({ email, code }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedCode = String(code || '').trim();
  const res = await api.post('/api/auth/verify-email', {
    email: normalizedEmail,
    login: normalizedEmail,
    code: normalizedCode,
  });
  return res.data;
};

export const verifyPhoneRequest = async ({ phone, code }) => {
  const res = await api.post('/api/auth/verify-phone', { phone, code });
  return res.data;
};

export const resendVerificationCodeRequest = async ({ email, phone }) => {
  const payload = email ? { channel: 'email', email } : { channel: 'phone', phone };
  const res = await api.post('/api/auth/resend-verification-code', payload);
  return res.data;
};

export const resetPasswordSendCodeRequest = async ({ email }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const res = await api.post('/api/auth/reset-password/send-code', { email: normalizedEmail });
  return res.data;
};

export const resetPasswordVerifyCodeRequest = async ({ email, code }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedCode = String(code || '').trim();
  const res = await api.post('/api/auth/reset-password/verify-code', { email: normalizedEmail, code: normalizedCode });
  return res.data;
};

export const resetPasswordSetNewPasswordRequest = async ({
  email,
  code,
  resetToken,
  password,
  passwordConfirmation,
}) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedCode = String(code || '').trim();
  const normalizedResetToken = String(resetToken || '').trim();
  const tokenValue = normalizedResetToken || normalizedCode;

  const res = await api.post('/api/auth/reset-password/set-new-password', {
    email: normalizedEmail,
    code: normalizedCode,
    token: tokenValue,
    reset_token: tokenValue,
    password,
    password_confirmation: passwordConfirmation,
  });
  return res.data;
};
