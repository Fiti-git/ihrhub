"use client";  // This marks the component as a Client Component

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { useRouter } from "next/navigation";  // For navigation to user detail page

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  is_active: boolean;
  is_staff: boolean;
  groups: string[];
  permissions: {
    id: number;
    codename: string;
    name: string;
    app: string;
  }[];
}

export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();  // Router for navigation

  // Fetch user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Using the token from localStorage
          },
        });
        setUsers(response.data); // Set the fetched users to the state
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is fetching
  }

  // Navigate to a user's detail page
  const handleViewClick = (id: number) => {
    router.push(`/auth/${id}`);  // Replace with your actual user detail page route
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
      isHeader
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
    >
      Role
    </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >

                  First Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
        <span 
          className={`font-medium ${
            user.is_staff 
              ? "text-brand-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {user.is_staff ? "Admin Staff" : "Platform User"}
        </span>
      </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.first_name || "N/A"} {/* Display first name, fallback to "N/A" */}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={user.is_active ? "success" : "error"}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button
                      onClick={() => handleViewClick(user.id)}
                      className="
                        text-white 
                        bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-600)] 
                        hover:from-[var(--color-brand-600)] hover:to-[var(--color-brand-700)]
                        rounded-md px-3 py-1 text-theme-sm font-medium 
                        transition-all duration-300
                        shadow-sm hover:scale-105
                        dark:bg-gradient-to-r dark:from-[var(--color-brand-600)] dark:to-[var(--color-brand-700)]
                        dark:hover:from-[var(--color-brand-700)] dark:hover:to-[var(--color-brand-800)]
                      "
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
        </div>
      </div>
    </div>
  );
}
