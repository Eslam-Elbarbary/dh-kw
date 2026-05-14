import api from './api';

/**
 * POST /api/fraud-reports
 * @param {Object} params
 * @param {string} params.full_name
 * @param {string} [params.company_name]
 * @param {string} params.email
 * @param {string} params.phone_number
 * @param {string} params.card_last4 — exactly 4 digits
 * @param {'visa'|'mastercard'|'american_express'|'discover'} params.card_type
 * @param {string} params.fraud_description
 */
export const submitFraudReport = async ({
  full_name,
  company_name,
  email,
  phone_number,
  card_last4,
  card_type,
  fraud_description,
}) => {
  const company = String(company_name || '').trim();
  const payload = {
    full_name: String(full_name || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    phone_number: String(phone_number || '').trim(),
    card_last4: String(card_last4 || '').replace(/\D/g, '').slice(0, 4),
    card_type,
    fraud_description: String(fraud_description || '').trim(),
  };
  if (company) {
    payload.company_name = company;
  }

  const res = await api.post('/api/fraud-reports', payload);
  return res.data;
};
