"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, User } from "lucide-react";

interface JobProvider {
  id: number;
  company_name: string;
  profile_image: string | null;
}

interface JobPosting {
  id: number;
  job_title: string;
  department: string;
  job_type: string;
  job_status: string;
  assigned_to_name: string | null;
  job_provider: JobProvider;
  number_of_openings: number;
  date_posted: string;
  application_deadline: string;
}

const JobPostingTable = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        // Updated to your new Admin Job Listing endpoint
        const response = await axios.get(`${baseUrl}/api/admin/jobs/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.job_title.toLowerCase().includes(search.toLowerCase()) || 
                          j.job_provider.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.job_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentItems = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "bg-green-100 text-green-700 border border-green-200";
      case "closed": return "bg-red-50 text-red-600 border border-red-100";
      case "filled": return "bg-blue-50 text-blue-600 border border-blue-100";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-[#7da021] font-medium">Loading Job Listings...</div>;

  return (
    <div className="space-y-4">
      {/* --- FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search job title or company..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b7db3a]"
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select 
          className="w-full md:w-48 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b7db3a]"
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="filled">Filled</option>
        </select>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
        <table className="min-w-full">
          <thead className="bg-[#f9fde8]">
            <tr className="text-left text-xs font-bold text-[#5f7a14] uppercase tracking-wider">
              <th className="px-4 py-4">ID</th>
              <th className="px-4 py-4">Job Title</th>
              <th className="px-4 py-4">Dept.</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Assigned To</th>
              <th className="px-4 py-4">Provider</th>
              <th className="px-4 py-4">Openings</th>
              <th className="px-4 py-4">Posted</th>
              <th className="px-4 py-4">Deadline</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentItems.map((job) => (
              <tr key={job.id} className="hover:bg-[#f9fde8]/30 transition-colors text-sm">
                <td className="px-4 py-4 text-gray-500 font-mono">#{job.id}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">{job.job_title}</td>
                <td className="px-4 py-4 text-gray-600">{job.department}</td>
                <td className="px-4 py-4 text-gray-600 capitalize">{job.job_type}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(job.job_status)}`}>
                    {job.job_status}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <User size={14} className="text-gray-400" />
                    {job.assigned_to_name || "Unassigned"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{job.job_provider.company_name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-medium">{job.number_of_openings}</td>
                <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                  {new Date(job.date_posted).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                  {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-[#9ac62f] border border-transparent hover:border-gray-200"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-red-500 border border-transparent hover:border-gray-200"
                      title="Delete"
                      onClick={() => { if(confirm("Delete this posting?")) { /* Add delete logic */ } }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- PAGINATION FOOTER --- */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Page <span className="font-bold text-gray-800">{currentPage}</span> of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-[#f1f8d0]"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-[#f1f8d0]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingTable;