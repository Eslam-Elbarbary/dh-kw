import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);

const pickTranslation = (translations = {}, fallback = '') => {
  const en = String(translations?.en || '').trim();
  const ar = String(translations?.ar || '').trim();
  return en || ar || String(fallback || '').trim();
};

const normalizeFaq = (item) => {
  const question = pickTranslation(item?.question_translations, item?.question);
  const answer = pickTranslation(item?.answer_translations, item?.answer);
  return {
    id: item?.id ?? item?.faq_id ?? null,
    category: item?.category || item?.type || 'General',
    question: question || 'Question',
    answer: answer || 'Answer',
  };
};

export const getFaqs = async () => {
  const res = await api.get('/api/faqs');
  const payload = res.data;
  const list = payload?.data?.faqs || payload?.data || payload?.faqs || [];
  return toArray(list).map(normalizeFaq).filter((item) => item.id != null);
};

