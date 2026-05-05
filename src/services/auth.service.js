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
  const normalizedEmail = String(email || '').trim().toLowerCase();

  const res = await api.post('/api/auth/register', {
    name,
    email: normalizedEmail,
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

const appendImageField = (formData, fieldName, value) => {
  if (value == null) return;
  if (typeof File !== 'undefined' && value instanceof File) {
    const name = value.name && String(value.name).trim() ? value.name : `${fieldName}.jpg`;
    formData.append(fieldName, value, name);
    return;
  }
  if (typeof Blob !== 'undefined' && value instanceof Blob && value.size > 0) {
    formData.append(fieldName, value, `${fieldName}.jpg`);
  }
};

/**
 * KYC + ID images for digital orders. Must be multipart (not JSON): POST `/api/profile` with
 * `_method: PUT` so Laravel can read uploaded files. Uses shared axios instance — request
 * interceptor removes default `Content-Type` for FormData so the boundary is set correctly.
 */
export const updateProfileDigitalVerificationRequest = async ({
  gender,
  birthDate,
  nationalNumber,
  nationalIdExpireDate,
  homeAddress,
  nationalCardFrontImage,
  nationalCardBackImage,
  firstName,
  lastName,
  email,
  phone,
} = {}) => {
  const normalizedFirstName = String(firstName ?? '').trim();
  const normalizedLastName = String(lastName ?? '').trim();
  const name = `${normalizedFirstName} ${normalizedLastName}`.trim();
  const normalizedPhone = String(phone ?? '').trim();

  const fd = new FormData();
  if (name) {
    fd.append('name', name);
    fd.append('full_name', name);
  }
  if (normalizedFirstName) {
    fd.append('first_name', normalizedFirstName);
    fd.append('firstName', normalizedFirstName);
  }
  if (normalizedLastName) {
    fd.append('last_name', normalizedLastName);
    fd.append('lastName', normalizedLastName);
  }
  const em = String(email ?? '').trim();
  if (em) fd.append('email', em);
  if (normalizedPhone) {
    fd.append('phone', normalizedPhone);
    fd.append('mobile', normalizedPhone);
    fd.append('phone_number', normalizedPhone);
  }

  const g = String(gender ?? '').trim();
  if (g) fd.append('gender', g);
  if (birthDate) fd.append('birth_date', String(birthDate).trim());
  const nn = String(nationalNumber ?? '').trim();
  if (nn) fd.append('national_number', nn);
  if (nationalIdExpireDate) fd.append('national_id_expire_date', String(nationalIdExpireDate).trim());
  const ha = String(homeAddress ?? '').trim();
  if (ha) fd.append('home_address', ha);

  appendImageField(fd, 'national_cart_front_image', nationalCardFrontImage);
  appendImageField(fd, 'national_cart_back_image', nationalCardBackImage);

  fd.append('_method', 'PUT');

  const res = await api.post('/api/profile', fd, {
    retryOnTooManyRequests: true,
    maxRetries: 2,
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

/**
 * POST {baseURL}/api/auth/verify-email — JSON body: { "email": string, "code": string }
 * (same contract as API clients / Thunder / Postman).
 */
export const verifyEmailRequest = async ({ email, code, user }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedCode = String(code || '').trim();
  const normalizedUser = String(user || '').trim();
  const res = await api.post('/api/auth/verify-email', {
    email: normalizedEmail,
    code: normalizedCode,
    user: normalizedUser || normalizedEmail,
  });
  return res.data;
};

export const resendVerificationCodeRequest = async ({ email } = {}) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Missing email for verification resend.');
  }

  const res = await api.post('/api/auth/resend-verification-code', {
    channel: 'email',
    email: normalizedEmail,
  });
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
