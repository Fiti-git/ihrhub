"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatRoomTable() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const brand = {
    25: "#f9fde8",
    500: "#b7db3a",
    600: "#9ac62f",
    900: "#425408",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/conversations/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = Array.isArray(response.data) ? response.data : response.data.my_chats;
        setConversations(data || []);
      } catch (error) {
        console.error("Error calling the Chat API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to find sender info from the participants array
  const getSenderInfo = (senderId, participants) => {
    return participants.find((p) => p.id === senderId) || { email: "Unknown", first_name: "User" };
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Connecting...</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: brand[25] }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Participants</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">Recent Message</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {conversations.map((chat) => (
                <tr key={chat.conversation_id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{chat.conversation_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {chat.participants.map((p) => (
                      <div key={p.id} className="block text-xs font-semibold">{p.email}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 italic">
                    {chat.messages.length > 0 ? `${chat.messages[0].text.substring(0, 50)}...` : "No messages"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedChat(chat)}
                      style={{ backgroundColor: brand[500], color: brand[900] }}
                      className="rounded-md px-4 py-1.5 text-sm font-bold shadow-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Chat View Pane --- */}
        {selectedChat && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Chat History</h3>
                <p className="text-xs text-gray-500">Conversation ID: #{selectedChat.conversation_id}</p>
              </div>
              <button onClick={() => setSelectedChat(null)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto space-y-6 rounded-lg bg-gray-50 p-6">
              {[...selectedChat.messages].reverse().map((msg) => {
                const sender = getSenderInfo(msg.sender, selectedChat.participants);
                const isMe = msg.sender === 4; // Use your logic for auth user ID

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    {/* Name/Email Label */}
                    <span className="mb-1 px-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                      {sender.first_name || sender.email.split('@')[0]} <span className="font-normal lowercase opacity-70">({sender.email})</span>
                    </span>

                    {/* Message Bubble */}
                    <div 
                      style={isMe ? { backgroundColor: brand[500], color: brand[900] } : { backgroundColor: "#fff" }}
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm border ${isMe ? "border-transparent rounded-tr-none" : "border-gray-200 rounded-tl-none"}`}
                    >
                      <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                      <span className="mt-2 block text-[10px] opacity-60 font-bold text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}