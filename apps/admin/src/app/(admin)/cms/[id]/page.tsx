"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FiEdit3, FiPlus, FiTrash2, FiLayers, FiCheckCircle, FiXCircle, FiArrowLeft } from "react-icons/fi";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const brand = { 
    primary: "#b7db3a", 
    dark: "#425408",
    light: "#f7fee7",
    gray: "#64748b",
    900: "#425408" // Added for your specific style snippet
  };

  const [formData, setFormData] = useState({
    name: "",
    header_text: "",
    is_active: true,
    image: null,
    sub_headings: [],
  });

  const fetchCategoryDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategory(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategoryDetails(); }, [id]);

  const handleDelete = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${serviceId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategoryDetails();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      header_text: service.header_text || "",
      is_active: service.is_active,
      image: null,
      sub_headings: service.sub_headings || [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const apiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services`;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("header_text", formData.header_text || "");
    data.append("category", id); 
    data.append("is_active", String(formData.is_active));
    data.append("sub_headings", JSON.stringify(formData.sub_headings));

    if (formData.image instanceof File) data.append("image", formData.image);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingService) {
        await axios.patch(`${apiBase}/${editingService.id}/manual/`, data, config);
      } else {
        await axios.post(`${apiBase}/create-manual/`, data, config);
      }
      setShowModal(false);
      fetchCategoryDetails();
    } catch (error) {
      alert("Error saving data");
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
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-slate-400 hover:bg-gray-100 transition-all">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{category?.name}</h1>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Service Management</p>
            </div>
          </div>
          <button
            onClick={() => { 
              setEditingService(null); 
              setFormData({name:"", header_text:"", is_active:true, image:null, sub_headings:[]}); 
              setShowModal(true); 
            }}
            className="flex items-center gap-2 rounded-xl bg-[#b7db3a] px-5 py-2.5 text-sm font-bold text-[#425408] shadow-lg shadow-[#b7db3a]/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <FiPlus /> Add Service
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-8">
          {category?.services?.map((service) => (
            <div key={service.id} className="group relative overflow-hidden rounded-[1.0rem] bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:shadow-gray-200/50">
              <div className="flex flex-col gap-6 md:flex-row items-start">
                {/* Image Section */}
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[2rem] shadow-inner bg-gray-50">
                  <img src={service.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-black text-slate-800">{service.name}</h2>
                      <p className="text-sm font-medium text-slate-400">{service.header_text || "No description provided."}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(service)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#b7db3a] hover:text-[#425408] transition-all"><FiEdit3 size={16} /></button>
                      <button onClick={() => handleDelete(service.id)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-red-300 hover:bg-red-50 hover:text-red-600 transition-all"><FiTrash2 size={16} /></button>
                    </div>
                  </div>

                  {/* YOUR CUSTOM DESIGNED CONTENT SECTIONS AREA */}
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3">Content Sections (Subheadings)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.sub_headings?.map((sub, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-sm font-bold text-gray-700">{sub.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{sub.content}</p>
                        </div>
                      ))}
                      <button 
                         onClick={() => openEditModal(service)}
                         style={{ color: brand[900] }}
                         className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-3 text-xs font-bold hover:bg-[#f9fde8] transition-colors"
                      >
                        + Add Section
                      </button>
                    </div>
                  </div>
                  {/* END CUSTOM AREA */}

                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal logic remains for editing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-gray-50 px-10 py-6">
              <h2 className="text-2xl font-black text-slate-800">{editingService ? "Update Service" : "Add Service"}</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full bg-gray-50 p-2 text-gray-400 hover:text-black focus:outline-none"><FiXCircle size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-10 py-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Title</label>
                    <input type="text" className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 outline-none ring-2 ring-transparent focus:ring-[#b7db3a]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagline</label>
                    <input type="text" className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 outline-none ring-2 ring-transparent focus:ring-[#b7db3a]" value={formData.header_text} onChange={e => setFormData({...formData, header_text: e.target.value})} />
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border-2 border-dashed border-slate-200">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                    <input type="file" className="mt-1 w-full text-xs text-slate-500" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                  </div>
                </div>

                {/* Sub-headings Editor in Modal */}
                <div className="rounded-[2rem] bg-gray-50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Section Editor</h3>
                    <button type="button" onClick={() => setFormData(p => ({...p, sub_headings: [...p.sub_headings, {title:"", content:"", order:p.sub_headings.length}]}))} 
                    className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase hover:bg-blue-100 transition-all">
                      + Add New
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.sub_headings.map((sh, idx) => (
                      <div key={idx} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <input placeholder="Section Title" className="w-full text-sm font-bold outline-none" value={sh.title} onChange={e => {
                                const newSh = [...formData.sub_headings];
                                newSh[idx].title = e.target.value;
                                setFormData({...formData, sub_headings: newSh});
                            }} />
                            <button type="button" onClick={() => setFormData(p => ({...p, sub_headings: p.sub_headings.filter((_, i) => i !== idx)}))} className="text-red-300 hover:text-red-500"><FiTrash2 size={14}/></button>
                        </div>
                        <textarea placeholder="Section Content..." className="w-full text-xs text-slate-500 outline-none resize-none" rows={2} value={sh.content} onChange={e => {
                            const newSh = [...formData.sub_headings];
                            newSh[idx].content = e.target.value;
                            setFormData({...formData, sub_headings: newSh});
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 py-2">
                    <input type="checkbox" className="h-5 w-5 accent-[#b7db3a]" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                    <label className="text-sm font-bold text-slate-600">Visible on Website</label>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] rounded-[1.5rem] bg-[#b7db3a] py-4 text-sm font-black text-[#425408] shadow-xl shadow-[#b7db3a]/30 transition-all hover:translate-y-[-2px] active:scale-[0.98]">
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}