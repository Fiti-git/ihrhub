"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiPlus, FiLayers, FiChevronRight, FiGrid, FiTrash2, FiAlertCircle } from "react-icons/fi";

export default function ServiceCategoryTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const router = useRouter();

  const brand = {
    25: "#f9fde8",
    500: "#b7db3a",
    900: "#425408",
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/`,
        { name: newCategoryName, is_active: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategoryName("");
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      alert("Failed to create category");
    }
  };

  const handleDeleteCategory = async (e, id, name) => {
    e.stopPropagation(); // Prevent navigating to the detail page
    if (!confirm(`Are you sure you want to delete the category "${name}"? This will remove all associated services.`)) return;
    
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCategories();
    } catch (error) {
      alert("Failed to delete category. Check if you have permission.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#b7db3a]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 font-sans text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b7db3a] text-[#425408] shadow-sm">
              <FiGrid size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Service CMS</h1>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Category Overview</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: brand[500], color: brand[900] }}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg shadow-[#b7db3a]/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <FiPlus /> Create Category
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Your Categories</h2>
            <p className="text-sm font-medium text-slate-400">Manage groups and drill down into specific services</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => router.push(`/cms/${cat.id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-[1.0rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
            >
              {/* Delete Button - Top Right */}
              <button 
                onClick={(e) => handleDeleteCategory(e, cat.id, cat.name)}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100"
                title="Delete Category"
              >
                <FiTrash2 size={16} />
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#f9fde8] group-hover:text-[#b7db3a]">
                  <FiLayers size={24} />
                </div>
                <div className={`mr-10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cat.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-800 mb-1 group-hover:text-[#425408]">{cat.name}</h3>
              <p className="text-sm font-medium text-slate-400 mb-6">
                {cat.services?.length || 0} Professional Services
              </p>

              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID: #{cat.id}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#b7db3a] uppercase">
                  Manage <FiChevronRight />
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[1.0rem] border-2 border-dashed border-gray-100">
              <FiLayers size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">No categories created yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* CREATE CATEGORY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="relative w-full max-w-md overflow-hidden rounded-[1.0rem] bg-white shadow-2xl">
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-2xl font-black text-slate-800">New Category</h2>
              <p className="text-sm font-medium text-slate-400">Enter a name to group your services</p>
            </div>

            <form onSubmit={handleCreateCategory} className="px-8 pb-8 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                  <input 
                    type="text" 
                    autoFocus
                    className="w-full rounded-2xl bg-gray-50 px-4 py-4 outline-none ring-2 ring-transparent focus:ring-[#b7db3a] transition-all"
                    placeholder="e.g. Talent Acquisition"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] rounded-2xl bg-[#b7db3a] py-4 text-sm font-black text-[#425408] shadow-xl shadow-[#b7db3a]/30 transition-all hover:translate-y-[-2px] active:scale-[0.98]"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}