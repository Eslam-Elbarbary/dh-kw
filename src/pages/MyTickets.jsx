import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  addTicketMessage,
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
  updateTicketStatus,
} from '../services/tickets.service';
import arrowDownIcon from '../assets/ArrowRight.svg';

const imgArrowDown = arrowDownIcon;

export default function MyTickets() {
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketBusy, setTicketBusy] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [createForm, setCreateForm] = useState({ subject: '', description: '' });
  const [editForm, setEditForm] = useState({ subject: '', description: '' });
  const [addMessageText, setAddMessageText] = useState('');
  const [statusValue, setStatusValue] = useState('open');
  const [nextTicketActionAt, setNextTicketActionAt] = useState(0);

  const toProfessionalTicketError = (error, fallbackMessage) => {
    const status = error?.response?.status;
    const responseData = error?.response?.data;
    const validationErrors = responseData?.errors && typeof responseData.errors === 'object'
      ? Object.values(responseData.errors).flat().filter(Boolean)
      : [];
    const rawMessage = validationErrors.length > 0
      ? validationErrors.join(' ')
      : (responseData?.message || fallbackMessage);
    const lower = String(rawMessage).toLowerCase();
    if (status === 429 || lower.includes('too many attempts')) {
      setNextTicketActionAt(Date.now() + 15000);
      return 'Too many attempts. Please wait 15 seconds and try again.';
    }
    return rawMessage;
  };

  const loadTickets = async () => {
    if (!isAuthenticated) return;
    try {
      setTicketLoading(true);
      setTicketError('');
      const list = await getTickets();
      setTickets(list);
      if (selectedTicketId && !list.some((item) => String(item.id) === String(selectedTicketId))) {
        setSelectedTicketId(null);
        setSelectedTicket(null);
      }
    } catch (error) {
      setTicketError(error?.response?.data?.message || 'Unable to load tickets right now.');
    } finally {
      setTicketLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    const loadSingleTicket = async () => {
      if (!isAuthenticated || !selectedTicketId) {
        setSelectedTicket(null);
        return;
      }
      try {
        setTicketBusy(true);
        setTicketError('');
        const ticket = await getTicketById({ ticketId: selectedTicketId });
        setSelectedTicket(ticket);
        setEditForm({
          subject: ticket.subject || '',
          description: ticket.description || '',
        });
        setStatusValue(ticket.status || 'open');
      } catch (error) {
        const fallbackFromList = tickets.find((item) => String(item.id) === String(selectedTicketId)) || null;
        if (fallbackFromList) {
          setSelectedTicket(fallbackFromList);
          setEditForm({
            subject: fallbackFromList.subject || '',
            description: fallbackFromList.description || '',
          });
          setStatusValue(fallbackFromList.status || 'open');
        }
        setTicketError(error?.response?.data?.message || 'Unable to load ticket details.');
      } finally {
        setTicketBusy(false);
      }
    };
    loadSingleTicket();
  }, [isAuthenticated, selectedTicketId, tickets]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicketId(ticket.id);
    // Immediately show selected data from index endpoint, then try show endpoint in effect.
    setSelectedTicket(ticket);
    setEditForm({
      subject: ticket.subject || '',
      description: ticket.description || '',
    });
    setStatusValue(ticket.status || 'open');
    setTicketError('');
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (Date.now() < nextTicketActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextTicketActionAt - Date.now()) / 1000));
      setTicketError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      setTicketSuccess('');
      return;
    }
    const subject = String(createForm.subject || '').trim();
    const description = String(createForm.description || '').trim();
    if (!subject || !description) {
      setTicketError('Subject and description are required.');
      setTicketSuccess('');
      return;
    }
    try {
      setTicketBusy(true);
      setTicketError('');
      setTicketSuccess('');
      const created = await createTicket({ subject, description });
      setCreateForm({ subject: '', description: '' });
      setTicketSuccess('Ticket created successfully.');
      await loadTickets();
      if (created?.id) setSelectedTicketId(created.id);
    } catch (error) {
      setTicketError(toProfessionalTicketError(error, 'Failed to create ticket.'));
    } finally {
      setTicketBusy(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (Date.now() < nextTicketActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextTicketActionAt - Date.now()) / 1000));
      setTicketError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      setTicketSuccess('');
      return;
    }
    if (!selectedTicketId) return;
    const subject = String(editForm.subject || '').trim();
    const description = String(editForm.description || '').trim();
    if (!subject || !description) {
      setTicketError('Subject and description are required to update ticket.');
      setTicketSuccess('');
      return;
    }
    try {
      setTicketBusy(true);
      setTicketError('');
      setTicketSuccess('');
      await updateTicket({ ticketId: selectedTicketId, subject, description });
      setTicketSuccess('Ticket updated successfully.');
      await loadTickets();
      const refreshed = await getTicketById({ ticketId: selectedTicketId });
      setSelectedTicket(refreshed);
    } catch (error) {
      setTicketError(toProfessionalTicketError(error, 'Failed to update ticket.'));
    } finally {
      setTicketBusy(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicketId) return;
    if (Date.now() < nextTicketActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextTicketActionAt - Date.now()) / 1000));
      setTicketError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      setTicketSuccess('');
      return;
    }
    try {
      setTicketBusy(true);
      setTicketError('');
      setTicketSuccess('');
      await deleteTicket({ ticketId: selectedTicketId });
      setTicketSuccess('Ticket deleted successfully.');
      setSelectedTicketId(null);
      setSelectedTicket(null);
      setEditForm({ subject: '', description: '' });
      await loadTickets();
    } catch (error) {
      setTicketError(toProfessionalTicketError(error, 'Failed to delete ticket.'));
    } finally {
      setTicketBusy(false);
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (Date.now() < nextTicketActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextTicketActionAt - Date.now()) / 1000));
      setTicketError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      setTicketSuccess('');
      return;
    }
    if (!selectedTicketId) return;
    const message = String(addMessageText || '').trim();
    if (!message) {
      setTicketError('Please write a message before sending.');
      setTicketSuccess('');
      return;
    }
    try {
      setTicketBusy(true);
      setTicketError('');
      setTicketSuccess('');
      const updated = await addTicketMessage({ ticketId: selectedTicketId, message });
      setSelectedTicket(updated);
      setAddMessageText('');
      setTicketSuccess('Message added successfully.');
      await loadTickets();
    } catch (error) {
      setTicketError(toProfessionalTicketError(error, 'Failed to add ticket message.'));
    } finally {
      setTicketBusy(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (Date.now() < nextTicketActionAt) {
      const waitSeconds = Math.max(1, Math.ceil((nextTicketActionAt - Date.now()) / 1000));
      setTicketError(`Too many attempts. Please wait ${waitSeconds}s before trying again.`);
      setTicketSuccess('');
      return;
    }
    if (!selectedTicketId) return;
    const status = String(statusValue || '').trim();
    if (!status) {
      setTicketError('Please select a status.');
      setTicketSuccess('');
      return;
    }
    try {
      setTicketBusy(true);
      setTicketError('');
      setTicketSuccess('');
      const updated = await updateTicketStatus({ ticketId: selectedTicketId, status });
      setSelectedTicket(updated);
      setTicketSuccess('Ticket status updated successfully.');
      await loadTickets();
    } catch (error) {
      setTicketError(toProfessionalTicketError(error, 'Failed to update ticket status.'));
    } finally {
      setTicketBusy(false);
    }
  };

  return (
    <div className="bg-white relative w-full min-h-screen">
      <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] items-start relative w-full max-w-[1240px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-[12px] sm:px-[16px] md:px-[24px] lg:px-[40px] xl:px-[100px] py-[24px] sm:py-[32px] md:py-[40px]">
        <div className="flex gap-[8px] items-center relative w-full">
          <Link to="/" className="font-['Poppins'] font-normal leading-[20px] text-[#666] text-[14px] hover:text-[#eea137] transition-colors">
            Home
          </Link>
          <div className="flex items-center justify-center relative size-[18px]">
            <div className="flex-none rotate-[270deg]">
              <div className="relative size-[18px]">
                <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
              </div>
            </div>
          </div>
          <span className="font-['Poppins'] font-normal leading-[20px] text-[#eea137] text-[14px]">
            My Tickets
          </span>
        </div>

        <div className="w-full">
          <h1 className="font-['Poppins'] font-bold text-[32px] sm:text-[40px] md:text-[48px] text-[#0e1c47] mb-[8px]">
            My Tickets
          </h1>
          <p className="font-['Poppins'] font-normal text-[16px] text-[#666]">
            Create and manage your support tickets with real-time API updates.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="w-full bg-[#0e1c47] rounded-[4px] p-[28px] text-center">
            <p className="font-['Poppins'] text-white text-[16px] mb-[12px]">Please sign in to access your tickets.</p>
            <Link to="/sign-in" className="inline-block bg-[#eea137] text-white font-['Poppins'] font-semibold px-[20px] py-[10px] rounded-[4px]">
              Sign In
            </Link>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-[16px]">
            <div className="border border-[#e6e6e6] rounded-[4px] p-[12px]">
              <h3 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[10px]">Create Ticket</h3>
              <form onSubmit={handleCreateTicket} className="space-y-[10px]">
                <input
                  type="text"
                  value={createForm.subject}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Subject"
                  className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] font-['Poppins'] text-[13px]"
                />
                <textarea
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your issue"
                  className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] font-['Poppins'] text-[13px]"
                />
                <button
                  type="submit"
                  disabled={ticketBusy || Date.now() < nextTicketActionAt}
                  className="bg-[#0e1c47] text-white px-[14px] py-[8px] rounded-[4px] font-['Poppins'] text-[13px] font-semibold disabled:opacity-60"
                >
                  {ticketBusy ? 'Submitting...' : 'Create Ticket'}
                </button>
              </form>
            </div>

            <div className="border border-[#e6e6e6] rounded-[4px] p-[12px]">
              <h3 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[10px]">Your Tickets</h3>
              {ticketLoading ? (
                <p className="font-['Poppins'] text-[13px] text-[#666]">Loading tickets...</p>
              ) : (
                <div className="space-y-[8px] max-h-[360px] overflow-auto pr-[4px]">
                  {tickets.length > 0 ? tickets.map((ticket) => (
                    <button
                      type="button"
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`w-full text-left border rounded-[4px] p-[10px] ${
                        selectedTicketId === ticket.id ? 'border-[#0e1c47] bg-[#f8fbff]' : 'border-[#e6e6e6]'
                      }`}
                    >
                      <p className="font-['Poppins'] font-semibold text-[13px] text-[#0e1c47]">{ticket.subject}</p>
                      <p className="font-['Poppins'] text-[12px] text-[#666] capitalize">Status: {ticket.status}</p>
                    </button>
                  )) : (
                    <p className="font-['Poppins'] text-[13px] text-[#666]">No tickets found.</p>
                  )}
                </div>
              )}
            </div>

            <div className="border border-[#e6e6e6] rounded-[4px] p-[12px]">
              <h3 className="font-['Poppins'] font-semibold text-[16px] text-[#0e1c47] mb-[10px]">Ticket Details</h3>
              {selectedTicket ? (
                <div className="space-y-[12px]">
                  <form onSubmit={handleUpdateTicket} className="space-y-[8px]">
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, subject: e.target.value }))}
                      className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] font-['Poppins'] text-[13px]"
                    />
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] font-['Poppins'] text-[13px]"
                    />
                    <div className="flex gap-[8px]">
                      <button type="submit" disabled={ticketBusy || Date.now() < nextTicketActionAt} className="bg-[#0e1c47] text-white px-[12px] py-[7px] rounded-[4px] text-[12px] font-['Poppins'] font-semibold disabled:opacity-60">Update</button>
                      <button type="button" onClick={handleDeleteTicket} disabled={ticketBusy || Date.now() < nextTicketActionAt} className="bg-[#b91c1c] text-white px-[12px] py-[7px] rounded-[4px] text-[12px] font-['Poppins'] font-semibold disabled:opacity-60">Delete</button>
                    </div>
                  </form>

                  <form onSubmit={handleAddMessage} className="space-y-[8px]">
                    <textarea
                      rows={2}
                      value={addMessageText}
                      onChange={(e) => setAddMessageText(e.target.value)}
                      placeholder="Add message"
                      className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] font-['Poppins'] text-[13px]"
                    />
                    <button type="submit" disabled={ticketBusy || Date.now() < nextTicketActionAt} className="bg-[#eea137] text-white px-[12px] py-[7px] rounded-[4px] text-[12px] font-['Poppins'] font-semibold disabled:opacity-60">Add Message</button>
                  </form>

                  <form onSubmit={handleUpdateStatus} className="space-y-[8px]">
                    <select
                      value={statusValue}
                      onChange={(e) => setStatusValue(e.target.value)}
                      className="w-full border border-[#d0d7de] rounded-[6px] px-[10px] py-[8px] font-['Poppins'] text-[13px]"
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button type="submit" disabled={ticketBusy || Date.now() < nextTicketActionAt} className="bg-[#0e1c47] text-white px-[12px] py-[7px] rounded-[4px] text-[12px] font-['Poppins'] font-semibold disabled:opacity-60">Update Status</button>
                  </form>
                </div>
              ) : (
                <p className="font-['Poppins'] text-[13px] text-[#666]">Select a ticket to view details.</p>
              )}
            </div>
          </div>
        )}

        {ticketError ? (
          <p className="font-['Poppins'] font-normal text-[13px] text-[#8e0909]">{ticketError}</p>
        ) : null}
        {ticketSuccess ? (
          <p className="font-['Poppins'] font-normal text-[13px] text-[#00a651]">{ticketSuccess}</p>
        ) : null}
      </div>
    </div>
  );
}

