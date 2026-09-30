"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import StatCard from "@/components/common/StatCard";
import ProjectTable from "@/components/tables/ProjectTable";

export default function ProjectDashboard() {
  const [stats, setStats] = useState({
    total_projects: 0,
    pending_bids: 0,
    completed_projects: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await axios.get(
          `${baseUrl}/api/admin/dashboard-stats/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Project Dashboard</h2>
      {/* Add Project Button */}
      <div className="flex justify-end">
        
        <Link
          href="/project/create"
          className="inline-flex items-center rounded-xl bg-[#7da021] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6a8f1c] transition-all"
        >
          + Add Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard 
          title="Total Projects" 
          value={stats.total_projects} 
          icon="Briefcase" 
          color="blue" 
        />
        <StatCard 
          title="Pending Bids" 
          value={stats.pending_bids} 
          icon="Users" 
          color="orange" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed_projects} 
          icon="CheckCircle" 
          color="purple" 
        />
      </div>

      <div className="mt-8">
        <ProjectTable />
      </div>
    </div>
  );
}
