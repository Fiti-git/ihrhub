"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiMail, FiUser, FiCalendar, FiMessageSquare, FiTrash2, FiEye, FiX } from "react-icons/fi";

export default function ContactMessageTable() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for the View Modal
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact-messages/`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = Array.isArray(response.data) ? response.data : response.data.results;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const openMessage = (msg) => {
    setSelectedMsg(msg);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact-messages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex h-40 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-[#b7db3a]"></div>
    </div>
  );

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">Sender</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">Subject</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500 tracking-wider">Date</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase text-gray-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <FiUser className="text-gray-400" /> {msg.name}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <FiMail className="text-gray-400" /> {msg.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-600 truncate max-w-[200px] block">
                    {msg.subject || "General Inquiry"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                    <FiCalendar size={14} /> {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => openMessage(msg)}
                      className="flex items-center gap-2 rounded-lg bg-[#f9fde8] px-3 py-1.5 text-xs font-bold text-[#b7db3a] transition-all hover:bg-[#b7db3a] hover:text-white"
                    >
                      <FiEye /> View
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MESSAGE MODAL */}
      {showViewModal && selectedMsg && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          
          <div className="relative w-full max-w-lg overflow-hidden rounded-[1.0rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 px-8 py-6">
              <div>
                <h2 className="text-xl font-black text-slate-800">Message Details</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Received {new Date(selectedMsg.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="rounded-full bg-white p-2 text-gray-400 shadow-sm hover:text-black">
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">From</p>
                  <p className="text-sm font-bold text-slate-700">{selectedMsg.name}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email</p>
                  <p className="text-sm font-bold text-slate-700">{selectedMsg.email}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Subject</p>
                <div className="rounded-2xl border border-gray-100 p-4 text-sm font-bold text-slate-800">
                  {selectedMsg.subject || "No Subject Provided"}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Full Message</p>
                <div className="max-h-[300px] overflow-y-auto rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 italic border border-slate-100">
                  "{selectedMsg.message}"
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-50 px-8 py-6 flex gap-3">
              <a 
                href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                className="flex-1 rounded-xl bg-[#b7db3a] py-3 text-center text-xs font-black uppercase tracking-widest text-[#425408] transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#b7db3a]/20"
              >
                Reply via Email
              </a>
              <button 
                onClick={() => setShowViewModal(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <FiMessageSquare size={48} className="text-gray-100 mb-4" />
          <p className="text-gray-400 font-medium">Your inbox is empty</p>
        </div>
      )}
    </div>
  );
}