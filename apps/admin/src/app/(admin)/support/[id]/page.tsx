'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

/* ================= TYPES ================= */

interface Message {
  sender: "user" | "support" | "system";
  message: string;
  sender_id?: number;
  timestamp: string;
}

interface StaffUser {
  id: number;
  first_name: string;
  email: string;
}

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  ticket_type: string;
  category: string; // Added
  reference_id: number | null; // Added
  reference_title: string | null; // Added
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  reference_object: any | null;
  messages: Message[];
  assigned_to_details: {
    id: number;
    username: string;
    first_name?: string;
  } | null;
  created_at: string;
  updated_at: string;
}

/* ================= STATUS UPDATE COMPONENT ================= */

function StatusUpdateSection({ 
  ticket, 
  onUpdated 
}: { 
  ticket: Ticket; 
  onUpdated: (updatedTicket: Ticket) => void 
}) {
  const [loading, setLoading] = useState(false);

  const STATUS_CHOICES = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === ticket.status) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticket.id}/assign-ticket/`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json" 
          },
        }
      );
      onUpdated(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-theme-sm dark:bg-boxdark">
      <div className="border-b px-5 py-3 font-semibold text-lg text-black dark:text-white">Ticket Status</div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2">
          {STATUS_CHOICES.map((choice) => (
            <button
              key={choice.value}
              disabled={loading}
              onClick={() => handleStatusChange(choice.value)}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-all border
                ${ticket.status === choice.value 
                  ? "bg-brand-500 text-white border-brand-500 shadow-sm" 
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-meta-4 dark:text-white dark:border-strokedark"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STAFF ASSIGNMENT COMPONENT ================= */

function StaffAssignmentSection({ 
  ticketId, 
  currentAssignedId, 
  onAssigned 
}: { 
  ticketId: number; 
  currentAssignedId?: number; 
  onAssigned: (updatedTicket: Ticket) => void 
}) {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/staff-users/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    })
    .then(res => setStaff(res.data))
    .catch(err => console.error("Error fetching staff:", err));
  }, []);

  const handleAssign = async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/assign-ticket/`,
        { 
          assigned_to_id: userId,
          status: "in_progress" 
        },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json" 
          },
        }
      );
      onAssigned(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to assign ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-theme-sm dark:bg-boxdark">
      <div className="border-b px-5 py-3 font-semibold text-lg text-black dark:text-white">Assign Staff</div>
      <div className="p-5">
        <select 
          disabled={loading}
          onChange={(e) => handleAssign(e.target.value)}
          value={currentAssignedId || ""}
          className="w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-strokedark dark:bg-meta-4"
        >
          <option value="">Unassigned</option>
          {staff.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name || user.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ================= CONVERSATION ================= */

function TicketReplySection({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => {
        const isSupport = msg.sender === "support";
        const isSystem = msg.sender === "system";

        return (
          <div
            key={index}
            className={`flex ${isSystem ? "justify-center" : isSupport ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-3 text-sm shadow-theme-sm
                ${isSupport ? "bg-brand-500 text-white" : "bg-blue-100 text-gray-900 border border-blue-200"}
                ${isSystem ? "bg-gray-100 text-gray-500 italic text-center w-full max-w-full border-none shadow-none" : ""}
              `}
            >
              <p className="whitespace-pre-wrap">{msg.message || (msg as any).text}</p>
              {!isSystem && (
                <div className="mt-2 text-xs opacity-70 text-right">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= SUPPORT REPLY COMPOSER ================= */

function SupportReplyComposer({
  ticketId,
  onMessageSent,
}: {
  ticketId: number;
  onMessageSent: (newMessage: Message) => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/add-message/`,
        { text: message.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedTicket = response.data;
      const newMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
      onMessageSent(newMessage);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t bg-white p-4 dark:bg-boxdark">
      <div className="flex items-end gap-3">
        <textarea
          rows={3}
          placeholder="Type your reply..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none dark:border-strokedark dark:bg-meta-4"
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !message.trim()}
          className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */

export default function SupportTicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      })
      .then((res) => setTicket(res.data))
      .catch(() => setError("Failed to load ticket."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchTicket();
  }, [id]);

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTicket(updatedTicket);
  };

  const handleNewSupportMessage = (newMessage: Message) => {
    if (ticket) {
      setTicket({
        ...ticket,
        messages: [...ticket.messages, newMessage],
        status: "in_progress"
      });
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !ticket) return <div className="p-6 text-red-600">{error || "Not found"}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center rounded-lg border bg-white px-6 py-4 shadow-theme-sm dark:bg-boxdark dark:border-strokedark">
        <h2 className="text-xl font-bold text-black dark:text-white">
          <span className="text-brand-500">Ticket #{ticket.id}</span>: {ticket.subject}
        </h2>
        <span className={`px-4 py-1 text-xs font-bold rounded-full uppercase 
          ${ticket.status === 'open' ? 'bg-red-100 text-red-600' : 
            ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* CHAT AREA */}
        <div className="col-span-12 lg:col-span-8 flex flex-col rounded-lg border bg-white shadow-theme-sm dark:bg-boxdark dark:border-strokedark h-[75vh]">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <span className="font-semibold text-black dark:text-white">Conversation</span>
            <span className="text-xs text-gray-500">{ticket.user.email}</span>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <TicketReplySection messages={ticket.messages} />
          </div>
          <SupportReplyComposer ticketId={ticket.id} onMessageSent={handleNewSupportMessage} />
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <StatusUpdateSection ticket={ticket} onUpdated={handleUpdateTicket} />
          
          <StaffAssignmentSection 
            ticketId={ticket.id} 
            currentAssignedId={ticket.assigned_to_details?.id}
            onAssigned={handleUpdateTicket}
          />

          {/* ================= UPDATED TICKET INFO SIDEBAR ================= */}
<div className="rounded-lg border bg-white p-5 shadow-theme-sm dark:bg-boxdark dark:border-strokedark">
  <h3 className="font-semibold mb-4 text-black dark:text-white border-b pb-2 text-lg">Ticket Information</h3>
  
  <div className="space-y-4 text-sm">
    {/* Customer Details */}
    <div>
      <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Customer</span>
      <p className="font-medium text-black dark:text-white text-base">
        {ticket.user.first_name ? `${ticket.user.first_name} ${ticket.user.last_name}` : ticket.user.email}
      </p>
      <span className="block text-xs text-gray-400">{ticket.user.username}</span>
    </div>

    {/* Metadata Grid */}
    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100 dark:border-strokedark">
      <div>
        <span className="text-gray-500 block text-xs">Priority</span>
        <span className={`font-bold capitalize ${ticket.priority === 'high' ? 'text-red-500' : 'text-blue-500'}`}>
          {ticket.priority}
        </span>
      </div>
      <div>
        <span className="text-gray-500 block text-xs">Category</span>
        <span className="font-medium capitalize text-black dark:text-white">{ticket.category}</span>
      </div>
    </div>

    {/* Assignment */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500">Assigned To</span>
      <span className="font-medium text-brand-500">
        {ticket.assigned_to_details?.first_name || ticket.assigned_to_details?.username || "None"}
      </span>
    </div>

    {/* Reference Details (Project X / Job 123) */}
    {(ticket.reference_id || ticket.reference_title) && (
      <div className="pt-3 border-t border-gray-100 dark:border-strokedark">
        <span className="text-gray-500 block text-xs uppercase font-bold mb-2">Linked {ticket.ticket_type}</span>
        <div className="p-3 bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-100 dark:border-strokedark">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
              ID: {ticket.reference_id}
            </span>
          </div>
          <p className="font-semibold text-black dark:text-white leading-tight">
            {ticket.reference_title}
          </p>
        </div>
      </div>
    )}

    {/* Timestamps */}
    <div className="pt-2 text-[10px] text-gray-400 space-y-1 font-mono uppercase">
      <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
      <p>Updated: {new Date(ticket.updated_at).toLocaleString()}</p>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}