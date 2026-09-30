import ComponentCard from "@/components/common/ChatComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/ChatRoomTable";
import { Metadata } from "next";
import React from "react";



export const metadata: Metadata = {
  title: "Chatroom Management | Admin Dashboard",
  description: "This page shows a list of all chatrooms with their details.",
};

export default function BasicTables() {
  return (
    <div className="space-y-8">
      {/* Page Breadcrumb */}
      <PageBreadcrumb pageTitle="Chatroom Management" />

      {/* Main Content */}
      <div className="space-y-6">
        <ComponentCard title="Chatrooms List">
          {/* BasicTableOne will display the list of users */}
          <BasicTableOne />
          
        </ComponentCard>
        
      </div>
    </div>
  );
}
