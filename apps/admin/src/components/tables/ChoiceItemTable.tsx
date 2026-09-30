"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiCheck, FiX, FiLayers, FiList } from "react-icons/fi";

export default function ChoiceItemTable({ groupId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Add/Edit
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ label: "", value: "", sort_order: 0 });

  // Brand Colors mapped from your variables
  const brand = {
    25: "#f9fde8",
    500: "#b7db3a",
    900: "#425408",
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/choice-items/?group_id=${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(response.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (groupId) fetchItems(); }, [groupId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/choice-items/`,
        { ...formData, group: groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ label: "", value: "", sort_order: 0 });
      setIsAdding(false);
      fetchItems();
    } catch (error) {
      alert("Error: Ensure the 'value' is unique for this group.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this value?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/choice-items/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
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
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Group Values</h4>
          <p className="text-xs text-slate-400 font-medium">Define labels and database keys for this group</p>
        </div>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ backgroundColor: brand[500], color: brand[900] }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-lg shadow-[#b7db3a]/20 transition-all hover:scale-105"
          >
            <FiPlus /> Add Value
          </button>
        )}
      </div>

      {/* Inline Create Form */}
      {isAdding && (
        <form 
          onSubmit={handleCreate} 
          style={{ backgroundColor: brand[25] }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-[1.5rem] border border-[#e4f0a3] animate-in slide-in-from-top-2 duration-200"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Display Label</label>
            <input 
              placeholder="e.g. Male" 
              className="w-full rounded-xl border-none bg-white p-3 text-sm focus:ring-2 focus:ring-[#b7db3a] outline-none"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">DB Key (Value)</label>
            <input 
              placeholder="e.g. male" 
              className="w-full rounded-xl border-none bg-white p-3 text-sm focus:ring-2 focus:ring-[#b7db3a] outline-none font-mono"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Sort Order</label>
            <input 
              type="number" 
              className="w-full rounded-xl border-none bg-white p-3 text-sm focus:ring-2 focus:ring-[#b7db3a] outline-none"
              value={formData.sort_order}
              onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex items-end gap-2">
            <button 
              type="submit" 
              style={{ backgroundColor: brand[500], color: brand[900] }}
              className="flex-1 h-11 rounded-xl flex items-center justify-center shadow-md"
            >
              <FiCheck size={20} />
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)} 
              className="flex-1 h-11 rounded-xl bg-white text-slate-400 flex items-center justify-center border border-gray-100"
            >
              <FiX size={20} />
            </button>
          </div>
        </form>
      )}

      {/* Modern Table Design */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-50">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Display Label</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Database Value</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Sort Order</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#f9fde8]/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FiList className="text-[#b7db3a]" />
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-400 bg-slate-50/50">{item.value}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-500">{item.sort_order}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-2 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && !isAdding && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <FiLayers size={40} className="text-gray-100 mb-3" />
            <p className="text-sm font-medium text-gray-400 italic">No values defined yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}