const normalizeCurrencyCode = (currency) => {
  const raw = String(currency || '').trim().toUpperCase();
  if (!raw || raw === '$') return 'USD';
  if (raw.length === 3) return raw;
  return '';
};

export const formatMoney = (value, currency) => {
  const amount = Number(value || 0);
  const code = normalizeCurrencyCode(currency);
  if (!Number.isFinite(amount)) return code ? `0.00 ${code}` : '$0.00';

  if (code) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: code === 'KWD' || code === 'BHD' || code === 'OMR' ? 3 : 2,
        maximumFractionDigits: code === 'KWD' || code === 'BHD' || code === 'OMR' ? 3 : 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${code}`;
    }
  }

  return `$${amount.toFixed(2)}`;
};
