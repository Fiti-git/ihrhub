"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { 
  ArrowLeft, User, FileText, Calendar, MapPin, Users, Building2, 
  X, Search, Globe, BadgeCheck, FileDown, History, ClipboardList, 
  GraduationCap, Briefcase, Mail, Phone, DollarSign, CheckCircle, 
  HelpCircle, ShieldCheck, Plane
} from "lucide-react";

export default function JobDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchJobDetails = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(`${baseUrl}/api/admin/jobs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobDetails(); }, [id]);

  const openAssignmentModal = async () => {
    setIsModalOpen(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get(`${baseUrl}/api/freelancers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingIds = data?.applicants?.map((a: any) => a.profile?.id) || [];
      setAllFreelancers(res.data.filter((f: any) => !existingIds.includes(f.id)));
    } catch (err) { console.error(err); }
  };

  const handleAddCandidate = async (freelancer: any) => {
    const token = localStorage.getItem("access_token");
    const adminName = localStorage.getItem("admin_name") || "Admin";
    try {
      await axios.post(`${baseUrl}/api/admin/jobs/${id}/assign-candidate/`, {
        freelancer_id: freelancer.user,
        reference_note: `Assigned by ${adminName} on ${new Date().toLocaleDateString()}`
      }, { headers: { Authorization: `Bearer ${token}` } });

      setIsModalOpen(false);
      setSelectedFreelancer(null);
      fetchJobDetails();
      alert("Candidate Assigned Successfully!");
    } catch (err: any) { alert(err.response?.data?.detail || "Error"); }
  };

  if (loading) return <div className="p-20 text-center font-black text-[#7da021] animate-pulse">LOADING...</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#fafafa]">
      
      {/* NAVIGATION */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black text-[#7da021] mb-4 uppercase">
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* TOP JOB HEADER */}
      <div className="bg-white p-10 rounded-[1.0rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
          <img src={`${baseUrl}${data.job_provider?.image}`} className="w-24 h-24 rounded-3xl object-cover border-4 border-gray-50 shadow-sm" alt="Logo" />
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-[#f1f8d0] text-[#7da021] rounded-full text-[10px] font-black uppercase tracking-widest">{data.job_type}</span>
               <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{data.job_provider?.company_name}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none mb-4">{data.job_title}</h1>
            <div className="flex flex-wrap gap-5 text-gray-500 font-bold text-xs">
              <span className="flex items-center gap-2"><MapPin size={16} className="text-[#b7db3a]"/> {data.work_location} ({data.work_mode})</span>
              <span className="flex items-center gap-2"><Building2 size={16} className="text-[#b7db3a]"/> {data.department}</span>
              <span className="flex items-center gap-2 text-[#7da021]"><ShieldCheck size={16}/> {data.job_status}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#263200] p-10 rounded-[1.0rem] text-white min-w-[300px] text-center shadow-xl">
            <p className="text-[10px] font-black text-[#b7db3a] uppercase tracking-widest mb-1">Budget Range</p>
            <div className="text-4xl font-black mb-3">{data.currency} {data.salary_from} - {data.salary_to}</div>
            <div className="text-[10px] font-black text-white/50 uppercase">Posted: {new Date(data.date_posted).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* APPLICANTS PIPELINE */}
          <section className="bg-white p-10 rounded-[1.0rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
                    <Users size={24} className="text-[#b7db3a]"/> Applicants ({data.applicants?.length || 0})
                </h3>
                <button onClick={openAssignmentModal} className="bg-[#b7db3a] text-[#263200] px-8 py-4 rounded-2xl text-xs font-black hover:scale-105 transition-all">
                    + ASSIGN FROM DB
                </button>
            </div>
            <div className="grid gap-4">
                {data.applicants?.map((app: any) => (
                    <div key={app.application_id} className="p-6 rounded-[2rem] bg-[#fafafa] flex justify-between items-center border border-gray-100">
                        <div className="flex items-center gap-4">
                            <img src={`${baseUrl}${app.profile?.profile_image}`} className="w-14 h-14 rounded-2xl object-cover" />
                            <div>
                                <h4 className="font-black text-gray-900">{app.profile?.full_name}</h4>
                                <p className="text-[10px] font-black text-[#7da021] uppercase">{app.profile?.professional_title}</p>
                                <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border mt-1 inline-block uppercase">{app.status}</span>
                            </div>
                        </div>
                        <Link href={`/profiles/freelancer/${app.profile?.id}`} className="px-6 py-4 bg-[#263200] text-white text-[10px] font-black rounded-xl uppercase">View Profile</Link>
                    </div>
                ))}
            </div>
          </section>

          {/* JOB DESCRIPTION DETAILS */}
          <section className="bg-white p-10 rounded-[1.0rem] border border-gray-100 shadow-sm space-y-10">
              <div>
                <h4 className="text-[11px] font-black text-[#7da021] uppercase tracking-[0.2em] mb-4">Role Overview</h4>
                <p className="text-gray-600 leading-relaxed text-sm font-medium">{data.role_overview}</p>
              </div>

              <div>
                <h4 className="text-[11px] font-black text-[#7da021] uppercase tracking-[0.2em] mb-4">Key Responsibilities</h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-8 rounded-[2rem] whitespace-pre-line leading-relaxed">
                    {data.key_responsibilities}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-[11px] font-black text-[#7da021] uppercase tracking-[0.2em] mb-4">Required Qualifications</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{data.required_qualifications}</p>
                </div>
                <div>
                    <h4 className="text-[11px] font-black text-[#7da021] uppercase tracking-[0.2em] mb-4">Preferred Qualifications</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{data.preferred_qualifications}</p>
                </div>
              </div>
          </section>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-8">
            {/* SCREENING QUESTIONS */}
            <section className="bg-white p-10 rounded-[1.0rem] border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                    <HelpCircle size={18} className="text-[#b7db3a]"/> Screening Questions
                </h3>
                <div className="space-y-4">
                    {data.screening_questions?.split('\n\n').map((q: string, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-2xl text-[11px] font-bold text-gray-500 border border-gray-100">
                            {q}
                        </div>
                    ))}
                </div>
            </section>

            {/* PERKS & DETAILS */}
            <section className="bg-[#263200] p-10 rounded-[1.0rem] text-white">
                <h3 className="text-sm font-black text-[#b7db3a] uppercase mb-8">Benefits & Details</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-[10px] font-black uppercase text-white/40">Health Insurance</span>
                        {data.health_insurance ? <CheckCircle size={18} className="text-[#b7db3a]"/> : <X size={18} className="text-red-500"/>}
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-[10px] font-black uppercase text-white/40">Paid Leave</span>
                        {data.paid_leave ? <CheckCircle size={18} className="text-[#b7db3a]"/> : <X size={18} className="text-red-500"/>}
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-[10px] font-black uppercase text-white/40">Remote Friendly</span>
                        {data.remote_work ? <CheckCircle size={18} className="text-[#b7db3a]"/> : <X size={18} className="text-red-500"/>}
                    </div>
                    <div className="pt-4">
                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">Hiring Manager</p>
                        <p className="text-lg font-bold">{data.hiring_manager}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">Deadline</p>
                        <p className="text-lg font-bold text-[#b7db3a]">{new Date(data.application_deadline).toLocaleDateString()}</p>
                    </div>
                </div>
            </section>
        </div>
      </div>

      {/* --- ASSIGNMENT MODAL (Full Freelancer Details) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#263200]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[98vw] rounded-[3.5rem] flex h-[94vh] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-10 p-4 hover:bg-gray-100 rounded-full text-gray-400 z-[110] transition-all"><X size={24}/></button>

                {/* DB SIDEBAR */}
                <div className="w-1/4 border-r border-gray-100 p-10 flex flex-col bg-white">
                    <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Candidate Pool</h3>
                    <div className="relative mb-8">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="text" placeholder="Filter by name..." className="w-full pl-14 pr-5 py-5 bg-gray-50 border-none rounded-[1.5rem] text-xs font-bold focus:ring-2 focus:ring-[#b7db3a]" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {allFreelancers.filter((f: any) => f.full_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((f: any) => (
                            <button key={f.id} onClick={() => setSelectedFreelancer(f)} className={`w-full p-5 rounded-[1.5rem] flex items-center gap-4 transition-all ${selectedFreelancer?.id === f.id ? 'bg-[#f1f8d0] border border-[#b7db3a] shadow-lg' : 'hover:bg-gray-50'}`}>
                                <img src={f.profile_image} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                                <div className="text-left min-w-0">
                                    <p className="text-[11px] font-black text-gray-900 truncate uppercase">{f.full_name}</p>
                                    <p className="text-[9px] text-[#7da021] font-bold truncate uppercase">{f.professional_title}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* PREVIEW CONTENT */}
                <div className="flex-1 bg-gray-50/50 overflow-y-auto p-16">
                    {selectedFreelancer ? (
                        <div className="max-w-4xl mx-auto space-y-12">
                            
                            {/* PREVIEW HEADER */}
                            <div className="bg-white p-10 rounded-[1.0rem] shadow-sm border border-gray-100 flex items-center gap-10">
                                <img src={selectedFreelancer.profile_image} className="w-44 h-44 rounded-[1.0rem] object-cover border-8 border-[#f1f8d0] shadow-2xl" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{selectedFreelancer.full_name}</h2>
                                        {selectedFreelancer.is_verified && <BadgeCheck className="text-blue-500" size={32} />}
                                    </div>
                                    <p className="text-xl font-black text-[#7da021] mb-6">{selectedFreelancer.professional_title}</p>
                                    
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                                        <span className="flex items-center gap-2"><Mail size={16} className="text-[#b7db3a]"/> {selectedFreelancer.email}</span>
                                        <span className="flex items-center gap-2"><Phone size={16} className="text-[#b7db3a]"/> {selectedFreelancer.phone_number}</span>
                                        <span className="flex items-center gap-2"><Globe size={16} className="text-[#b7db3a]"/> {selectedFreelancer.city}, {selectedFreelancer.country}</span>
                                        <span className="flex items-center gap-2 text-[#7da021]"><DollarSign size={16}/> ${selectedFreelancer.hourly_rate}/hr</span>
                                    </div>

                                    <div className="flex gap-4">
                                        {selectedFreelancer.resume && (
                                            <a href={selectedFreelancer.resume} target="_blank" className="bg-[#263200] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-black transition-all">
                                                <FileDown size={18}/> View Resume
                                            </a>
                                        )}
                                        <button onClick={() => handleAddCandidate(selectedFreelancer)} className="bg-[#b7db3a] text-[#263200] px-10 py-4 rounded-2xl text-[10px] font-black uppercase hover:scale-105 transition-all shadow-xl shadow-[#b7db3a]/20">
                                            Confirm Assignment
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* BIO & SKILLS */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-10 rounded-[1.0rem] shadow-sm">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Profile Bio</h4>
                                    <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line text-sm">{selectedFreelancer.bio}</p>
                                </div>
                                <div className="bg-white p-10 rounded-[1.0rem] shadow-sm space-y-8">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Core Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFreelancer.skills?.split(',').map((s: string) => (
                                                <span key={s} className="px-3 py-1.5 bg-[#f1f8d0] text-[#7da021] text-[9px] font-black rounded-lg uppercase">{s.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">Exp Level</h4>
                                        <p className="text-sm font-black text-gray-800 uppercase">{selectedFreelancer.experience_level}</p>
                                    </div>
                                </div>
                            </div>

                            {/* EXPERIENCE & EDUCATION */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-black text-gray-900 uppercase flex items-center gap-2"><Briefcase size={20} className="text-[#b7db3a]"/> Work Experience</h3>
                                    {selectedFreelancer.work_experience?.map((w: any, i: number) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-black text-gray-800 text-sm">{w.job_title}</h5>
                                                <span className="text-[9px] font-black text-gray-300">{w.start_year}-{w.end_year}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-[#7da021] uppercase mb-2">{w.company}</p>
                                            <p className="text-xs text-gray-400 italic leading-snug">{w.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-black text-gray-900 uppercase flex items-center gap-2"><GraduationCap size={20} className="text-[#b7db3a]"/> Education</h3>
                                    {selectedFreelancer.education?.map((e: any, i: number) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <h5 className="font-black text-gray-800 text-sm">{e.degree}</h5>
                                                <span className="text-[9px] font-black text-gray-300">{e.start_year}-{e.end_year}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase">{e.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-200 opacity-50">
                            <User size={140} strokeWidth={0.5} />
                            <p className="text-sm font-black uppercase tracking-widest mt-8">Pick a candidate to see all data</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}