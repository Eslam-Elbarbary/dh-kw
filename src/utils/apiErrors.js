/**
 * Extract a user-facing message from axios / Laravel API errors.
 */
export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const responseData = err?.response?.data;
  const directMessage = String(responseData?.message || err?.message || '').trim();

  if (directMessage && !directMessage.startsWith('Request failed with status code')) {
    return directMessage;
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error.trim();
  }

  if (responseData?.errors && typeof responseData.errors === 'object') {
    for (const value of Object.values(responseData.errors)) {
      if (Array.isArray(value) && value[0]) {
        return String(value[0]);
      }
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
  }

  if (!err?.response) {
    return 'Cannot reach server. Please check your connection and try again.';
  }

  const status = err.response?.status;
  if (status === 422 || status === 400) {
    return fallback;
  }

  return fallback;
}

export function isInvalidVerificationCodeMessage(message) {
  const normalized = String(message || '').toLowerCase();
  return (
    normalized.includes('invalid verification code')
    || normalized.includes('invalid code')
    || normalized.includes('incorrect code')
    || normalized.includes('wrong code')
    || normalized.includes('code is invalid')
    || normalized.includes('code does not match')
    || normalized.includes('verification code is invalid')
    || normalized.includes('expired')
    || (normalized.includes('invalid') && normalized.includes('code'))
    || (normalized.includes('incorrect') && normalized.includes('code'))
  );
}

export function isAlreadyVerifiedMessage(message) {
  if (isInvalidVerificationCodeMessage(message)) {
    return false;
  }
  const normalized = String(message || '').toLowerCase();
  return (
    normalized.includes('already verified')
    || normalized.includes('phone is verified')
    || normalized.includes('phone has been verified')
    || normalized.includes('account is verified')
  );
}

const PUBLIC_AUTH_API_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-phone',
  '/api/auth/verify-email',
  '/api/auth/resend-verification-code',
  '/api/auth/reset-password',
];

export function isPublicAuthApiRequest(config) {
  const url = String(config?.url || '');
  return PUBLIC_AUTH_API_PATHS.some((path) => url.includes(path));
}
