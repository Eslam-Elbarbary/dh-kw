import api from './api';

const toText = (value, fallback = '') => {
  const v = String(value ?? '').trim();
  return v || fallback;
};

/** Build https://wa.me/… from API phone strings (+965 9942 8171, etc.). */
export const buildWhatsAppUrl = (phone) => {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}`;
};

const normalizeSettings = (raw = {}) => {
  const contactPhone = toText(raw?.contact_phone, '');
  const contactWhatsapp = toText(raw?.contact_whatsapp, '');
  const whatsappPhone = contactPhone || contactWhatsapp;

  return {
    appName: toText(raw?.app_name, 'DH'),
    appLogo: toText(raw?.app_logo, ''),
    appIcon: toText(raw?.app_icon, ''),
    profileType: toText(raw?.profile_type, ''),
    prefixValue: toText(raw?.prefix_value, ''),
    currencyUnit: toText(raw?.currency_unit, ''),
    referralPoints: Number(raw?.referral_points ?? 0) || 0,
    cashbackPointsRate: Number(raw?.cache_back_points_rate ?? 0) || 0,
    contactWhatsapp,
    contactWhatsappUrl: buildWhatsAppUrl(whatsappPhone),
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
    contactPhone,
  };
};

export const getSettings = async () => {
  const res = await api.get('/api/settings');
  const payload = res?.data;
  const settings = payload?.data?.settings || payload?.settings || payload?.data || {};
  return normalizeSettings(settings);
};

