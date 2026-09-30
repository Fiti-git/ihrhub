"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { 
  ArrowLeft, 
  CheckCircle2, 
  CircleDollarSign, 
  User, 
  FileText,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Plus,
  X,
  Search,
  Briefcase,
  MapPin,
  GraduationCap
} from "lucide-react";

export default function ProjectDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- States for Assignment Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewFreelancer, setPreviewFreelancer] = useState<any>(null);
  const [newProposal, setNewProposal] = useState({ 
    freelancer: "", 
    budget: "", 
    cover_letter: "Admin manually assigned this freelancer to the project." 
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(`${baseUrl}/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(Array.isArray(res.data) ? res.data[0] : res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(`${baseUrl}/api/freelancers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFreelancers(res.data);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
    }
  };

  const handleManualSubmit = async () => {
    if (!newProposal.freelancer || !newProposal.budget) {
      alert("Please select a freelancer and set a budget.");
      return;
    }

    const token = localStorage.getItem("access_token");
    try {
      await axios.post(`${baseUrl}/api/proposals/`, {
        project: id,
        freelancer: newProposal.freelancer,
        budget: newProposal.budget,
        cover_letter: newProposal.cover_letter,
        status: "submitted" 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsModalOpen(false);
      fetchProjectDetails();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Action failed. Check API permissions.");
    }
  };

  const filteredFreelancers = freelancers.filter((f: any) => 
    f.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.professional_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center animate-pulse text-[#7da021] font-bold">Loading Workspace...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Project Not Found</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#fafafa]">
      
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-[#7da021] hover:underline">
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* PROJECT HEADER */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-[#f1f8d0] text-[#7da021] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#d6e776]">
                {data.category}
             </span>
             <span className="text-gray-400 text-xs flex items-center gap-1">
                <Calendar size={12}/> {new Date(data.created_at).toLocaleDateString()}
             </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">{data.title}</h1>
          <div className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-2xl border border-gray-100 w-fit">
              <img src={data.employer_profile?.profile_image} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
              <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Employer</p>
                  <p className="text-sm font-bold text-gray-800">{data.employer_profile?.company_name}</p>
              </div>
          </div>
        </div>
        <div className="bg-[#263200] p-6 rounded-[1.5rem] text-white min-w-[220px] text-center shadow-xl shadow-[#263200]/10">
            <p className="text-[10px] font-bold text-[#b7db3a] uppercase tracking-widest mb-1">Total Budget</p>
            <div className="text-4xl font-black mb-2">${parseFloat(data.budget).toLocaleString()}</div>
            <div className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-tighter">{data.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#b7db3a]" /> Project Description
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{data.description}</p>
          </section>

          {/* BIDS SECTION */}
          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900">Assigned Freelancers & Bids</h3>
                <button 
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 bg-[#b7db3a] text-[#263200] px-5 py-2.5 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md"
                >
                    <Plus size={14} /> Assign Freelancer
                </button>
            </div>
            
            <div className="space-y-4">
              {data.proposals?.length > 0 ? data.proposals.map((proposal: any) => (
                <div key={proposal.id} className="p-6 rounded-3xl border border-gray-100 bg-[#fafafa]/50 hover:bg-white hover:shadow-xl transition-all border-l-8 border-l-[#b7db3a]">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                        <img src={proposal.freelancer_details?.profile_image} className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-4 ring-white" />
                        <div>
                            <h4 className="font-bold text-gray-900">{proposal.freelancer_details?.full_name}</h4>
                            <p className="text-xs text-[#7da021] font-bold">{proposal.freelancer_details?.professional_title}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] bg-gray-200/50 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-tighter">{proposal.status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end justify-center">
                        <div className="text-xl font-black text-gray-900">${proposal.budget}</div>
                        <Link 
                          href={`/profiles/freelancer/${proposal.freelancer_details.id}`}
                          className="mt-2 text-[10px] font-bold text-[#7da021] flex items-center gap-1 bg-[#f1f8d0] px-4 py-2 rounded-xl hover:bg-[#b7db3a] hover:text-[#263200] transition-all"
                        >
                            View Profile <User size={12} />
                        </Link>
                    </div>
                  </div>
                </div>
              )) : <div className="text-center py-10 text-gray-400 text-sm italic">No proposals yet.</div>}
            </div>
          </section>
        </div>

        {/* SIDEBAR: MILESTONES */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <CircleDollarSign size={20} className="text-[#b7db3a]" /> Payment Milestones
            </h3>
            <div className="space-y-4">
              {data.milestones?.map((m: any, idx: number) => (
                <div key={m.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-gray-300 uppercase">Phase 0{idx + 1}</span>
                    <span className="font-bold text-[#7da021] text-sm">${m.budget}</span>
                  </div>
                  <h5 className="font-bold text-gray-800 text-sm">{m.name}</h5>
                  <div className="flex items-center gap-2 mt-3">
                     <div className={`w-2 h-2 rounded-full ${m.status === 'completed' ? 'bg-[#7da021]' : 'bg-orange-400'}`}></div>
                     <span className="text-[10px] font-black uppercase text-gray-400">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- DUAL-PANE ASSIGNMENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#263200]/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-[3rem] flex h-[85vh] shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden border border-white/20">
                
                {/* LEFT: SEARCH & LIST (40%) */}
                <div className="w-full md:w-[35%] border-r border-gray-100 p-8 flex flex-col bg-white">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                    
                    <h3 className="text-2xl font-black text-gray-900 mb-2 mt-6 tracking-tight">Assign Expert</h3>
                    <p className="text-xs text-gray-400 mb-6">Select a freelancer to view full resume.</p>
                    
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by name or title..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#b7db3a]"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredFreelancers.map((f: any) => (
                            <button
                                key={f.id}
                                onClick={() => {
                                    setNewProposal({...newProposal, freelancer: f.user});
                                    setPreviewFreelancer(f);
                                }}
                                className={`w-full text-left p-4 rounded-[1.5rem] flex items-center gap-4 transition-all border-2 ${
                                    newProposal.freelancer === f.user ? 'bg-[#f1f8d0] border-[#b7db3a]' : 'bg-white border-transparent hover:bg-gray-50'
                                }`}
                            >
                                <img src={f.profile_image} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate">{f.full_name}</p>
                                    <p className="text-[10px] text-[#7da021] font-bold truncate uppercase tracking-tight">{f.professional_title}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proposed Budget ($)</label>
                            <input 
                                type="number" 
                                className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold"
                                placeholder="0.00"
                                onChange={(e) => setNewProposal({...newProposal, budget: e.target.value})}
                            />
                        </div>
                        <button 
                            onClick={handleManualSubmit}
                            className="w-full py-5 bg-[#b7db3a] text-[#263200] font-black rounded-2xl shadow-xl shadow-[#b7db3a]/20 hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </div>

                {/* RIGHT: PREVIEW PANEL (65%) */}
                <div className="hidden md:flex flex-1 bg-gray-50/50 p-12 overflow-y-auto">
                    {previewFreelancer ? (
                        <div className="w-full max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-500">
                            {/* PREVIEW HEADER */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <img src={previewFreelancer.profile_image} className="w-24 h-24 rounded-[2rem] object-cover shadow-2xl border-4 border-white" />
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900">{previewFreelancer.full_name}</h2>
                                        <p className="text-[#7da021] font-bold flex items-center gap-2 text-lg">
                                            <Briefcase size={18} /> {previewFreelancer.professional_title}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm font-medium">
                                            <span className="flex items-center gap-1 capitalize"><MapPin size={14}/> {previewFreelancer.city}, {previewFreelancer.country}</span>
                                            <span className="bg-[#b7db3a]/20 text-[#263200] px-3 py-0.5 rounded-full text-xs font-black">${previewFreelancer.hourly_rate}/hr</span>
                                        </div>
                                    </div>
                                </div>
                                {previewFreelancer.is_verified && <ShieldCheck size={40} className="text-[#7da021]" fill="#f1f8d0" />}
                            </div>

                            {/* BIO */}
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-[#b7db3a]" /> Professional Bio
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{previewFreelancer.bio}</p>
                            </div>

                            {/* SKILLS & EDUCATION */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Core Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {previewFreelancer.skills?.split(',').map((s: string) => (
                                            <span key={s} className="px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 shadow-sm">
                                                {s.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Academic Background</h4>
                                    {previewFreelancer.education?.map((edu: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-xs font-black text-gray-800">{edu.degree}</p>
                                            <p className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-1">
                                               <GraduationCap size={12}/> {edu.school} • {edu.end_year}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* WORK EXPERIENCE */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Work History</h4>
                                <div className="space-y-3">
                                    {previewFreelancer.work_experience?.map((work: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="bg-[#f1f8d0] p-3 rounded-xl h-fit text-[#7da021]"><Briefcase size={20}/></div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{work.job_title}</p>
                                                <p className="text-xs text-gray-500 font-bold">{work.company} • {work.start_year} - {work.end_year}</p>
                                                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{work.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full text-gray-200">
                            <User size={120} strokeWidth={0.5} />
                            <p className="mt-6 text-xl font-black text-gray-300">Select a freelancer to preview profile</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}