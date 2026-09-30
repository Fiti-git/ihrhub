"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  budget: string;
  status: string;
  project_type: string;
}

const ProjectTable = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const response = await axios.get(`${baseUrl}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Logic: Filter projects based on Search and Status
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Logic: Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "bg-[#f1f8d0] text-[#7da021]"; // Brand 50 & 700
      case "completed": return "bg-gray-100 text-gray-700";
      case "in_progress": return "bg-blue-50 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleViewDetail = (id: number) => {
    router.push(`/project/${id}`);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-[#7da021] font-medium">Loading Marketplace Data...</div>;

  return (
    <div className="space-y-4">
      {/* --- FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search project titles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b7db3a] transition-all"
            onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>
        <select 
          className="w-full md:w-48 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b7db3a] cursor-pointer"
          onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to page 1 on filter
          }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-[#f9fde8]">
            <tr className="text-left text-xs font-bold text-[#5f7a14] uppercase tracking-wider">
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentItems.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-[#f9fde8]/50 transition-colors cursor-pointer group"
                onClick={() => handleViewDetail(project.id)}
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800 group-hover:text-[#425408]">{project.title}</div>
                  <div className="text-xs text-gray-500">{project.category}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  ${parseFloat(project.budget).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-brand-100 text-brand-900 ${getStatusStyle(project.status)}`}
                    >
                    {project.status.replace('_', ' ')}
                    </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleViewDetail(project.id)}
                      className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-[#9ac62f] shadow-sm border border-transparent hover:border-gray-100 transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-transparent hover:border-gray-100 transition-all"
                      title="Delete Project"
                      onClick={() => {
                          if(confirm("Are you sure you want to delete this project?")) {
                              // Add delete logic here
                          }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- NO DATA STATE --- */}
        {currentItems.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic bg-white">
            No projects matching your criteria were found.
          </div>
        )}

        {/* --- PAGINATION FOOTER --- */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-800">{indexOfFirstItem + 1}</span> to <span className="text-gray-800">{Math.min(indexOfLastItem, filteredProjects.length)}</span> of <span className="text-gray-800">{filteredProjects.length}</span>
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-[#f1f8d0] hover:text-[#7da021] transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:bg-[#f1f8d0] hover:text-[#7da021] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;