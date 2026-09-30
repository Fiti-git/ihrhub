// src/components/user-profile/TicketInfo.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Textarea from "../form/Textarea.tsx"; // Assuming you have a Textarea component

// --- TYPE DEFINITIONS ---
interface SimpleUser {
  id: number;
  username: string;
}

interface StaffUser extends SimpleUser {
  // Can add more fields if needed
}

interface ChatMessage {
  sender: 'user' | 'support' | 'system';
  message: string;
  sender_id: number;
  timestamp: string;
  sender_name?: string; // We added this in our backend serializer
}

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  user: SimpleUser;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assigned_to_details: SimpleUser | null;
  assigned_to: number | null; // The ID for writing
  created_at: string;
  messages: ChatMessage[];
  reference_title: string;
  ticket_type: string;
}

// --- MAIN COMPONENT ---
export default function TicketDetailCard({ ticketId }: { ticketId: string }) {
  // --- STATE MANAGEMENT ---
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  
  // State for editable fields
  const [selectedStatus, setSelectedStatus] = useState<SupportTicket['status']>('open');
  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // Store ID as string for select
  
  // State for chat
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      if (!ticketId) return;
      
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch ticket details and staff users in parallel
        const [ticketRes, staffRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/?is_staff=true`, { headers }) // Assuming this endpoint exists and filters staff
        ]);
        
        const fetchedTicket = ticketRes.data;
        setTicket(fetchedTicket);
        setStaffUsers(staffRes.data);

        // Initialize the dropdowns with current ticket data
        setSelectedStatus(fetchedTicket.status);
        setSelectedAssignee(fetchedTicket.assigned_to_details?.id?.toString() || "");

      } catch (error) {
        console.error("Failed to fetch ticket data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId]);

  // --- CHAT SCROLLING ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);


  // --- EVENT HANDLERS ---
  const handleSave = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const payload = {
            status: selectedStatus,
            assigned_to: selectedAssignee ? parseInt(selectedAssignee, 10) : null,
        };

        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setTicket(response.data); // Update state with the response
        alert("Ticket updated successfully!");

    } catch (error) {
        console.error("Failed to update ticket:", error);
        alert("Update failed. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);

    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/add-message/`,
            { text: newMessage },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // The API returns the full updated ticket, which is perfect!
        setTicket(response.data);
        setNewMessage(""); // Clear the input

    } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message.");
    } finally {
        setIsSending(false);
    }
  };


  // --- RENDER LOGIC ---
  if (loading) return <div className="p-10 text-center">Loading ticket details...</div>;
  if (!ticket) return <div className="p-10 text-center text-red-500">Ticket not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left Column: Chat and Description */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            #{ticket.id} - {ticket.subject}
        </h3>
        
        {/* Description Box */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Chat Interface */}
        <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4">Conversation</h4>
            <div className="h-96 overflow-y-auto space-y-4 pr-2 flex flex-col">
                {ticket.messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                            msg.sender === 'support' || msg.sender === 'system'
                            ? 'bg-blue-500 text-white self-end'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white self-start'
                        }`}
                    >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 opacity-75 ${msg.sender === 'support' ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleString()}
                        </p>
                    </div>
                ))}
                 <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="mt-4 flex gap-2">
                <Textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-grow"
                    rows={2}
                />
                <Button onClick={handleSendMessage} disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send'}
                </Button>
            </div>
        </div>
      </div>

      {/* Right Column: Details and Actions */}
      <div className="space-y-6">
          {/* Ticket Info Card */}
          <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-4">Ticket Details</h4>
              <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                      <span className="text-gray-500">Submitted by:</span>
                      <span className="font-medium">{ticket.user.username}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-medium capitalize">{ticket.ticket_type}: {ticket.reference_title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-gray-500">Priority:</span>
                      <Badge color={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'success'}>
                          {ticket.priority}
                      </Badge>
                  </div>
              </div>
          </div>
          
          {/* Actions Card */}
          <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-4">Actions</h4>
              <div className="space-y-4">
                  {/* Assignee Dropdown */}
                  <div>
                      <Label htmlFor="assignee">Assign To</Label>
                      <select 
                        id="assignee"
                        value={selectedAssignee}
                        onChange={(e) => setSelectedAssignee(e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                      >
                          <option value="">Unassigned</option>
                          {staffUsers.map(user => (
                              <option key={user.id} value={user.id}>{user.username}</option>
                          ))}
                      </select>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                      <Label htmlFor="status">Status</Label>
                      <select 
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as SupportTicket['status'])}
                        className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                      >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                      </select>
                  </div>

                  <Button onClick={handleSave} className="w-full">Save Changes</Button>
              </div>
          </div>
      </div>
    </div>
  );
}