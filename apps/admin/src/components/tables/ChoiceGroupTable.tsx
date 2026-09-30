"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiPlus, FiSettings, FiChevronRight, FiTrash2, FiDatabase } from "react-icons/fi";

export default function ChoiceGroupTable() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const router = useRouter();

  // Brand Palette Mapping
  const brand = {
    bgLight: "#f9fde8",   // color-brand-25
    primary: "#b7db3a",   // color-brand-500
    darkText: "#425408",  // color-brand-900
    border: "#e4f0a3",    // color-brand-100
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/choice-groups/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching choice groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/choice-groups/`,
        { name: newGroupName, is_active: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGroupName("");
      setShowModal(false);
      fetchGroups();
    } catch (error) {
      alert("Failed to create group");
    }
  };

  const handleDeleteGroup = async (e, id, name) => {
    e.stopPropagation();
    if (!confirm(`Delete choice group "${name}"? This will remove all options inside it.`)) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/choice-groups/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroups();
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex h-60 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-[#b7db3a]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: brand.primary, color: brand.darkText }}
          className="flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black shadow-lg shadow-[#b7db3a]/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <FiPlus size={20} /> New Choice Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div 
            key={group.id} 
            onClick={() => router.push(`/choices_manager/${group.id}`)}
            className="group relative cursor-pointer overflow-hidden rounded-[0.5rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-[#b7db3a]/10 hover:-translate-y-1"
          >
            {/* Delete Button */}
            <button 
              onClick={(e) => handleDeleteGroup(e, group.id, group.name)}
              className="absolute top-6 right-6 p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <FiTrash2 size={18} />
            </button>

            {/* Icon Box */}
            <div 
              style={{ backgroundColor: brand.bgLight }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-[#b7db3a] mb-6 group-hover:bg-[#b7db3a] group-hover:text-white transition-all duration-300"
            >
              <FiDatabase size={28} />
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-1">{group.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic mb-6">{group.slug}</p>
            
            <div className="flex items-center justify-between border-t border-gray-50 pt-5">
              <span 
                style={{ color: brand.darkText, backgroundColor: brand.bgLight }}
                className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider"
              >
                {group.items_count || 0} Options
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-slate-400 group-hover:text-[#b7db3a] transition-colors">
                Manage <FiChevronRight />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FOR NEW GROUP */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-md rounded-[0.5rem] bg-white p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9fde8] text-[#b7db3a]">
               <FiSettings size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Create Choice Group</h2>
            <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">Groups help organize dropdown options like Genders, Job Types, or Locations across the system.</p>
            
            <form onSubmit={handleCreateGroup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Group Name</label>
                <input 
                  autoFocus
                  style={{ backgroundColor: "#fafafa" }}
                  className="w-full rounded-2xl px-6 py-4 outline-none ring-2 ring-transparent focus:ring-[#b7db3a] transition-all font-bold text-slate-700 placeholder:font-normal"
                  placeholder="e.g. Project Status"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ backgroundColor: brand.primary, color: brand.darkText }}
                  className="flex-[2] rounded-2xl py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-[#b7db3a]/20 transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {groups.length === 0 && !loading && (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-[0.5rem] border border-dashed border-gray-200">
          <FiDatabase size={48} className="text-gray-100 mb-4" />
          <p className="text-gray-400 font-medium">No choice groups found. Create your first one above.</p>
        </div>
      )}
    </div>
  );
}