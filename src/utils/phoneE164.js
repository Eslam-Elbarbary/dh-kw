/** Trim spaces; keep digits and leading + for display/storage. */
export function normalizePhoneForApi(phone) {
  return String(phone || '').trim().replace(/\s/g, '');
}

export const PENDING_VERIFICATION_DIAL_KEY = 'pendingVerificationDialCode';

/**
 * Combine API country dial code with a national number the user typed.
 * Example: dialCode "+20" + "1006573885" → "+201006573885"
 * If the user already entered a leading +, it is kept as-is (E.164).
 */
export function combineDialAndNationalPhone(dialCode, nationalInput) {
  const national = String(nationalInput || '').trim();
  if (!national) return '';
  if (/^\s*\+/.test(national)) {
    return national.replace(/\s/g, '');
  }
  const dial = String(dialCode || '').replace(/\D/g, '');
  let num = national.replace(/\D/g, '');
  if (num.startsWith('0')) num = num.slice(1);
  if (!num) return national.replace(/\s/g, '');
  if (!dial) return num;
  return `+${dial}${num}`;
}

/**
 * E.164 phone for auth APIs: register, verify-phone, resend-verification-code.
 * Sends country dial code with the number (e.g. "+201006573885").
 */
export function formatPhoneForVerificationApi(phone, dialCode) {
  return combineDialAndNationalPhone(dialCode, phone);
}
