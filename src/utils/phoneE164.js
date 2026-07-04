/**
 * Combine API country dial code with a national number the user typed.
 * If the user already entered a leading +, it is kept as-is (E.164).
 */
/** Trim spaces; keep digits and leading + for display/storage. */
export function normalizePhoneForApi(phone) {
  return String(phone || '').trim().replace(/\s/g, '');
}

/**
 * National digits for auth APIs: register, verify-phone, resend-verification-code.
 * Backend stores and looks up phones in this format (e.g. "01554774574"), not E.164 (+20…).
 */
export function formatPhoneForVerificationApi(phone, dialCode) {
  const raw = normalizePhoneForApi(phone);
  if (!raw) return '';

  if (!raw.startsWith('+')) {
    return raw.replace(/\D/g, '');
  }

  const dial = String(dialCode || '').replace(/\D/g, '');
  let digits = raw.slice(1).replace(/\D/g, '');
  if (!dial) return digits;

  if (digits.startsWith(dial)) {
    const national = digits.slice(dial.length);
    if (!national) return digits;
    return national.startsWith('0') ? national : `0${national}`;
  }

  return digits;
}

export const PENDING_VERIFICATION_DIAL_KEY = 'pendingVerificationDialCode';

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
