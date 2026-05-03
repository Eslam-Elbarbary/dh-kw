import api from './api';

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeThreadMessage = (entry) => {
  if (entry == null) return null;
  if (typeof entry === 'string') {
    const text = entry.trim();
    return text ? { text, from: '' } : null;
  }
  const text = String(entry.message ?? entry.body ?? entry.text ?? entry.content ?? '').trim();
  if (!text) return null;
  const from = String(entry.from ?? entry.sender ?? entry.role ?? entry.user_type ?? '').trim();
  return { text, from };
};

const normalizeTicket = (ticket) => {
  const rawMessages = toArray(
    ticket?.messages
    ?? ticket?.ticket_messages
    ?? ticket?.replies
    ?? ticket?.conversations,
  );
  const threadMessages = rawMessages.map(normalizeThreadMessage).filter(Boolean);
  const supportReply = String(
    ticket?.support_response
    ?? ticket?.admin_message
    ?? ticket?.response_message
    ?? ticket?.vendor_reply
    ?? ticket?.reply
    ?? '',
  ).trim();

  return {
    id: ticket?.id ?? ticket?.ticket_id ?? null,
    subject: ticket?.subject || 'Untitled ticket',
    description: ticket?.description || ticket?.message || '',
    status: ticket?.status || 'open',
    ticketFrom: ticket?.ticket_from || ticket?.from || 'user',
    createdAt: ticket?.created_at || ticket?.date || '',
    attachments: toArray(ticket?.attachments || ticket?.files),
    vendorId: ticket?.vendor_id ?? null,
    user: ticket?.user || null,
    threadMessages,
    supportReply,
  };
};

const extractTicketList = (payload) => {
  const dataNode = payload?.data;
  const list = dataNode?.tickets
    || dataNode?.items
    || dataNode
    || payload?.tickets
    || payload?.items
    || [];
  return toArray(list).map(normalizeTicket);
};

const writeRequestConfig = {
  retryOnTooManyRequests: true,
  maxRetries: 2,
};

export const getTickets = async () => {
  const res = await api.get('/api/tickets');
  return extractTicketList(res.data);
};

export const createTicket = async ({ subject, description, message }) => {
  const normalizedDescription = String(description ?? message ?? '').trim();
  const payload = {
    subject: String(subject || '').trim(),
    description: normalizedDescription,
    message: normalizedDescription,
  };
  const res = await api.post('/api/tickets', payload, writeRequestConfig);
  return normalizeTicket(res.data?.data || res.data?.ticket || res.data);
};

export const getTicketById = async ({ ticketId }) => {
  const res = await api.get(`/api/tickets/${ticketId}`);
  return normalizeTicket(res.data?.data || res.data?.ticket || res.data);
};

export const updateTicket = async ({ ticketId, subject, description, message }) => {
  const normalizedDescription = String(description ?? message ?? '').trim();
  const payload = {
    subject: String(subject || '').trim(),
    description: normalizedDescription,
    message: normalizedDescription,
  };
  const res = await api.put(`/api/tickets/${ticketId}`, payload, writeRequestConfig);
  return normalizeTicket(res.data?.data || res.data?.ticket || res.data);
};

export const deleteTicket = async ({ ticketId }) => {
  const res = await api.delete(`/api/tickets/${ticketId}`, writeRequestConfig);
  return res.data;
};

export const addTicketMessage = async ({ ticketId, message }) => {
  const payload = { message: String(message || '').trim() };
  const res = await api.post(`/api/tickets/${ticketId}/add-message`, payload, writeRequestConfig);
  return normalizeTicket(res.data?.data || res.data?.ticket || res.data);
};

export const updateTicketStatus = async ({ ticketId, status }) => {
  const payload = { status: String(status || '').trim() };
  const res = await api.post(`/api/tickets/${ticketId}/update-status`, payload, writeRequestConfig);
  return normalizeTicket(res.data?.data || res.data?.ticket || res.data);
};

