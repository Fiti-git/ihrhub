"use client";

import React from "react";
import Link from "next/link";
// Assuming you are renaming your table component to match the "Job" context
import JobPostingTable from "@/components/tables/JobTable"; 

export default function JobDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Job Postings</h2>
          <p className="text-sm text-gray-500">Manage and monitor all active job listings</p>
        </div>
        
        <Link
          href="/jobs/create" 
          className="inline-flex items-center rounded-xl bg-[#7da021] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6a8f1c] transition-all shadow-sm"
        >
          + Post New Job
        </Link>
      </div>

      {/* Main Table Section */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Admin Job List</h3>
        </div>
        
        <div className="p-0">
          <JobPostingTable />
        </div>
      </div>
    </div>
  );
}