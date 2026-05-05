import api from './api';

export const submitContactRequest = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const payload = {
    name: String(name || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    phone: String(phone || '').trim(),
    subject: String(subject || '').trim(),
    message: String(message || '').trim(),
  };

  const res = await api.post('/api/contact-us', payload);
  return res.data;
};

