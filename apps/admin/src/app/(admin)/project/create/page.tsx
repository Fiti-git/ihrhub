"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, 
  Building2, 
  Search, 
  Check, 
  Send, 
  LayoutGrid, 
  Calendar, 
  DollarSign,
  Briefcase,
  Clock,
  AlertCircle
} from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    budget: "",
    project_type: "fixed_price",
    deadline: "",
    visibility: "public",
    status: "open",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchEmployers = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await axios.get(`${baseUrl}/api/employers/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployers(res.data);
      } catch (err) {
        console.error("Error fetching employers", err);
      }
    };
    fetchEmployers();
  }, [baseUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployer) return;

    setLoading(true);
    const token = localStorage.getItem("access_token");
    const payload = { ...formData, user: selectedEmployer.user };

    try {
      await axios.post(`${baseUrl}/api/projects/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push("/project");
    } catch (err: any) {
      console.error(err.response?.data);
      alert("Error creating project. Check if all fields are valid.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployers = employers.filter((emp: any) =>
    emp.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen bg-[#F8F9FA] text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#7da021] transition-colors"
        >
          <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-[#b7db3a]">
            <ArrowLeft size={18} />
          </div>
          Back to Dashboard
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-black tracking-tight">Post a New Project</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Client Portal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* STEP 1: SELECT EMPLOYER */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[1.0rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-[#f1f8d0] rounded-xl">
                  <Building2 size={20} className="text-[#7da021]" />
                </div>
                1. Client
              </h3>
              {selectedEmployer && (
                <span className="text-[10px] bg-[#7da021] text-white px-2 py-1 rounded-full font-bold animate-pulse">
                  SELECTED
                </span>
              )}
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredEmployers.length > 0 ? (
                filteredEmployers.map((emp: any) => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployer(emp)}
                    className={`w-full text-left p-4 rounded-3xl flex items-center gap-4 transition-all border-2 ${
                      selectedEmployer?.id === emp.id 
                        ? 'bg-[#f1f8d0]/50 border-[#b7db3a] shadow-inner' 
                        : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative">
                      <img src={emp.profile_image || "/api/placeholder/40/40"} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="profile" />
                      {selectedEmployer?.id === emp.id && (
                        <div className="absolute -top-1 -right-1 bg-[#7da021] text-white rounded-full p-0.5 border-2 border-white">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{emp.company_name}</p>
                      <p className="text-xs text-slate-400 truncate">{emp.email_address}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-sm text-slate-400 font-medium">No employers found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 2: PROJECT FORM */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[1.0rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="p-3 bg-slate-900 rounded-2xl text-[#b7db3a]">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">2. Project Specification</h3>
                <p className="text-sm text-slate-400">Define the scope and requirements</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 group-focus-within:text-[#7da021] transition-colors">
                  Project Title
                </label>
                <input 
                  required
                  name="title"
                  type="text" 
                  placeholder="e.g. Build a Modern E-commerce Platform"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all shadow-sm"
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                  <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      name="category"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none appearance-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all cursor-pointer shadow-sm"
                      onChange={handleInputChange}
                    >
                      <option>Web Development</option>
                      <option>Mobile Apps</option>
                      <option>Design</option>
                      <option>Marketing & SEO</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7da021]" size={18} />
                    <input 
                      required
                      name="budget"
                      type="number" 
                      placeholder="1000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all shadow-sm"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Detailed Description</label>
                <textarea 
                  required
                  name="description"
                  rows={5}
                  placeholder="What needs to be done? Include specific technologies, goals, and deliverables..."
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all shadow-sm"
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Project Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      name="deadline"
                      type="datetime-local" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all shadow-sm"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Payment Model</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      name="project_type"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none appearance-none focus:ring-2 focus:ring-[#b7db3a] focus:bg-white transition-all cursor-pointer shadow-sm"
                      onChange={handleInputChange}
                    >
                      <option value="fixed_price">Fixed Price Project</option>
                      <option value="hourly">Hourly Contract</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={loading || !selectedEmployer}
                type="submit"
                className="group w-full py-5 bg-[#263200] text-[#b7db3a] font-black rounded-3xl flex items-center justify-center gap-3 hover:bg-[#1a2200] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-lime-900/10 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#b7db3a] border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </div>
                ) : (
                  <>
                    <span>Publish Project</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
              {!selectedEmployer && (
                <p className="text-center text-[10px] text-red-400 font-bold uppercase mt-3 tracking-widest">
                  * Select an employer to enable publishing
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}