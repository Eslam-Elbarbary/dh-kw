/**
 * Combine API country dial code with a national number the user typed.
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
