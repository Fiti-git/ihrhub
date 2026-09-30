"use client";

import React, { useEffect, useState } from "react";
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

// 1. Refined TypeScript interfaces based on your API response

interface SimpleUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ReferenceObject {
  id: number;
  job_title: string;
  department: string;
  job_status: string;
}

interface ChatMessage {
  sender: string;
  message: string;
  sender_id: number;
  timestamp: string;
}

interface SupportTicket {
  id: number;
  user: SimpleUser;
  ticket_type: string;
  reference_id: number;
  reference_title: string;
  reference_object: ReferenceObject | null;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: ChatMessage[];
  assigned_to_details: SimpleUser | null;
  created_at: string;
  updated_at: string;
}

export default function SupportTicketsTable() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // 2. Fetch data from the API

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        
        setTickets(response.data); // Set the fetched tickets data

      } catch (error) {
        console.error("Error fetching support tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions for badge colors
  const getStatusBadgeColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'info';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'secondary';
    }
  };

  const handleViewClick = (id: number) => {
  // Make sure the id is passed correctly
  console.log("Navigating to ticket ID:", id);  // Check if the id is logged correctly
  router.push(`/support/${id}`); // Navigate to the ticket details page
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Subject
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Submitted By
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Priority
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Assigned To
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      #{ticket.id} - {ticket.subject}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {ticket.user.username}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <Badge size="sm" color={getStatusBadgeColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <Badge size="sm" color={getPriorityBadgeColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {ticket.assigned_to_details?.username || "Unassigned"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <button
                      onClick={() => handleViewClick(ticket.id)}
                      className="text-white bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-600)] hover:from-[var(--color-brand-600)] hover:to-[var(--color-brand-700)] rounded-md px-3 py-1 text-theme-sm font-medium transition-all duration-300 shadow-sm hover:scale-105"
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
