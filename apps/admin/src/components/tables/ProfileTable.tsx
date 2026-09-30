"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export default function BasicTableOne() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State for Pagination and Filtering
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(""); // "" (All), "freelancer", or "employer"
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/all-profiles/`,
        {
          params: {
            search: search,
            role: role,
            page: page,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Django paginated response: { count, next, previous, results }
      setProfiles(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching admin profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [search, role, page]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const totalPages = Math.ceil(totalCount / 10);

  // Navigate to single profile view
  const handleViewClick = (role: string, id: number) => {
    router.push(`/profiles/${role}/${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-1 gap-4 min-w-[300px]">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => {setSearch(e.target.value); setPage(1);}}
            className="w-full max-w-sm px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-white/[0.1]"
          />
          <select
            value={role}
            onChange={(e) => {setRole(e.target.value); setPage(1);}}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-white/[0.1]"
          >
            <option value="">All Roles</option>
            <option value="freelancer">Freelancer</option>
            <option value="employer">Employer</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start">User / Company</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">Title / Industry</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">Location</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    <div className="flex justify-center items-center gap-2">
                       <span className="text-sm text-gray-500">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                  <TableRow key={`${profile.role}-${profile.id}`}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {profile.display_name || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500">{profile.email}</span>
                    </TableCell>
                    
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                      {profile.professional_title || profile.industry || "N/A"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                       <Badge size="sm" color={profile.role === "freelancer" ? "primary" : "info"}>
                        {profile.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm">
                      {profile.city ? `${profile.city}, ` : ""}{profile.country || "N/A"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-start">
                      <button 
                        onClick={() => handleViewClick(profile.role, profile.id)}
                        className="text-brand-500 hover:text-brand-600 font-medium text-theme-sm transition-colors"
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-gray-500">
                    No matching profiles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{profiles.length}</span> of <span className="font-medium">{totalCount}</span> results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium bg-gray-50 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-white/[0.05] transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 text-sm font-medium bg-gray-50 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-white/[0.05] transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}