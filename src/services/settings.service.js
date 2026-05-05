import api from './api';

const toText = (value, fallback = '') => {
  const v = String(value ?? '').trim();
  return v || fallback;
};

const normalizeSettings = (raw = {}) => ({
  appName: toText(raw?.app_name, 'DH'),
  appLogo: toText(raw?.app_logo, ''),
  appIcon: toText(raw?.app_icon, ''),
  profileType: toText(raw?.profile_type, ''),
  prefixValue: toText(raw?.prefix_value, ''),
  currencyUnit: toText(raw?.currency_unit, ''),
  referralPoints: Number(raw?.referral_points ?? 0) || 0,
  cashbackPointsRate: Number(raw?.cache_back_points_rate ?? 0) || 0,
  contactWhatsapp: toText(raw?.contact_whatsapp, ''),
  contactFacebook: toText(raw?.contact_facebook, ''),
  contactInstagram: toText(raw?.contact_instagram, ''),
  contactLinkedin: toText(raw?.contact_linkedin, ''),
  contactTwitter: toText(
    raw?.contact_twitter
      ?? raw?.contact_x
      ?? raw?.contact_twitter_url
      ?? raw?.twitter,
    ''
  ),
  contactEmail: toText(raw?.contact_email, ''),
  contactPhone: toText(raw?.contact_phone, ''),
});

export const getSettings = async () => {
  const res = await api.get('/api/settings');
  const payload = res?.data;
  const settings = payload?.data?.settings || payload?.settings || payload?.data || {};
  return normalizeSettings(settings);
};

