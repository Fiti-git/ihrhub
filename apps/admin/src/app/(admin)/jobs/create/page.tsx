"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, Building2, Search, Check, Send, LayoutGrid, 
  Calendar, DollarSign, Briefcase, MapPin, Globe, 
  HelpCircle, UserCheck, FileText, Info, Languages, AlertCircle
} from "lucide-react";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null);

  const [formData, setFormData] = useState({
    job_title: "",
    department: "",
    job_type: "full-time",
    work_location: "", // Ensuring this is initialized
    work_mode: "on-site",
    role_overview: "",
    key_responsibilities: "",
    required_qualifications: "",
    preferred_qualifications: "",
    languages_required: "",
    job_category: "engineering",
    salary_from: "",
    salary_to: "",
    currency: "USD",
    application_deadline: "",
    application_method: "portal",
    interview_mode: "in-person",
    hiring_manager: "",
    number_of_openings: 1,
    expected_start_date: "",
    screening_questions: "",
    health_insurance: false,
    remote_work: false,
    paid_leave: false,
    bonus: false,
    job_status: "open",
    // Hardcoded internal note
    reference_added_by_admin: "THIS JOB WAS POSTED BY ADMIN"
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
      } catch (err) { console.error(err); }
    };
    fetchEmployers();
  }, [baseUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployer) return alert("Please select an employer first.");
    if (!formData.work_location) return alert("Work location is required.");

    setLoading(true);
    const token = localStorage.getItem("access_token");
    
    const payload = { 
      ...formData, 
      job_provider: selectedEmployer.id,
      salary_from: formData.salary_from ? parseFloat(formData.salary_from) : null,
      salary_to: formData.salary_to ? parseFloat(formData.salary_to) : null,
      number_of_openings: parseInt(formData.number_of_openings.toString()),
      expected_start_date: formData.expected_start_date || null,
      application_deadline: formData.application_deadline || null,
    };

    try {
      await axios.post(`${baseUrl}/api/admin/jobs/create/`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      router.push("/jobs"); // Redirect to projects/jobs dashboard
    } catch (err: any) {
      console.error(err.response?.data);
      alert("Error: " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployers = employers.filter((emp: any) =>
    emp.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-[#F8F9FA]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 font-black text-[#7da021] text-xs uppercase transition-all">
          <ArrowLeft size={16}/> Back
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 leading-none">POST JOB AS ADMIN</h1>
          <p className="text-[10px] font-black text-[#7da021] uppercase tracking-[0.3em] mt-2">Internal Management Portal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: EMPLOYER SEARCH */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-[1rem] border border-gray-100 shadow-sm sticky top-6">
            <h3 className="font-black mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest text-gray-400">
              <Building2 size={16} className="text-[#b7db3a]"/> Assign Employer
            </h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="text" placeholder="Filter companies..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#b7db3a]" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredEmployers.map((emp: any) => (
                <button key={emp.id} type="button" onClick={() => setSelectedEmployer(emp)} className={`w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all border-2 ${selectedEmployer?.id === emp.id ? 'bg-[#f1f8d0] border-[#b7db3a]' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                  <img src={emp.profile_image || "/api/placeholder/40/40"} className="w-10 h-10 rounded-xl object-cover" />
                  <span className="text-xs font-black truncate text-gray-900 uppercase">{emp.company_name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: MAIN FORM */}
        <div className="lg:col-span-9">
          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            
            <div className="bg-white p-10 rounded-[1rem] shadow-sm border border-gray-100">
              <h4 className="text-[10px] font-black text-[#7da021] uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
                <Info size={14}/> Job Classification & Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Job Title</label>
                  <input required name="job_title" className="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#b7db3a]" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Work Location (Required)</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required name="work_location" placeholder="e.g. Dubai, UAE" className="w-full pl-14 p-5 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#b7db3a]" onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Department</label>
                  <input required name="department" className="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#b7db3a]" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Job Type</label>
                  <select name="job_type" className="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold border-none" onChange={handleInputChange}>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Work Mode</label>
                  <select name="work_mode" className="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold border-none" onChange={handleInputChange}>
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[1rem] shadow-sm border border-gray-100">
              <h4 className="text-[10px] font-black text-[#7da021] uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
                <FileText size={14}/> Role Content
              </h4>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Role Overview</label>
                  <textarea required name="role_overview" rows={3} className="w-full p-5 bg-gray-50 rounded-3xl text-sm border-none" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Key Responsibilities</label>
                  <textarea required name="key_responsibilities" rows={4} className="w-full p-5 bg-gray-50 rounded-3xl text-sm border-none" onChange={handleInputChange} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block">Required Qualifications</label>
                  <textarea required name="required_qualifications" rows={3} className="w-full p-5 bg-gray-50 rounded-3xl text-sm border-none" onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#263200] p-10 rounded-[1rem] text-white space-y-8">
                <h4 className="text-[10px] font-black text-[#b7db3a] uppercase mb-4 flex items-center gap-2"><DollarSign size={14}/> Budget</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input name="salary_from" type="number" placeholder="From" className="w-full p-4 bg-white/5 border-white/10 rounded-xl text-sm text-white outline-none" onChange={handleInputChange} />
                  <input name="salary_to" type="number" placeholder="To" className="w-full p-4 bg-white/5 border-white/10 rounded-xl text-sm text-white outline-none" onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="currency" defaultValue="USD" className="w-full p-4 bg-white/5 border-white/10 rounded-xl text-sm text-white" onChange={handleInputChange} />
                  <input name="number_of_openings" type="number" defaultValue={1} className="w-full p-4 bg-white/5 border-white/10 rounded-xl text-sm text-white" onChange={handleInputChange} />
                </div>
              </div>

              <div className="bg-white p-10 rounded-[1rem] border border-gray-100 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black text-[#7da021] uppercase mb-4 flex items-center gap-2"><UserCheck size={14}/> Hiring Details</h4>
                <input required name="hiring_manager" placeholder="Hiring Manager Name" className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold border-none" onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4">
                  <select name="interview_mode" className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold border-none" onChange={handleInputChange}>
                    <option value="in-person">In-Person</option>
                    <option value="zoom">Zoom</option>
                    <option value="phone">Phone</option>
                  </select>
                  <input type="datetime-local" name="application_deadline" className="w-full p-4 bg-gray-50 rounded-2xl text-[10px] font-bold border-none" onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[1rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block">Screening Questions (Optional)</label>
                <textarea name="screening_questions" rows={3} className="w-full p-5 bg-gray-50 rounded-3xl text-sm border-none" onChange={handleInputChange} />
              </div>
              <div className="bg-[#f1f8d0] p-6 rounded-3xl border border-[#b7db3a]/30">
                <p className="text-[10px] font-black text-[#7da021] uppercase mb-2 flex items-center gap-2"><AlertCircle size={14}/> Admin Status</p>
                <p className="text-sm font-black text-[#263200]">THIS JOB WAS POSTED BY ADMIN</p>
              </div>
            </div>

            <div className="flex justify-end pt-10">
              <button 
                disabled={loading || !selectedEmployer} 
                type="submit" 
                className="bg-[#263200] text-[#b7db3a] px-20 py-6 rounded-3xl font-black text-sm uppercase flex items-center gap-4 hover:scale-105 transition-all shadow-xl disabled:opacity-20"
              >
                {loading ? "SAVING..." : "PUBLISH NOW"} <Send size={20}/>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}