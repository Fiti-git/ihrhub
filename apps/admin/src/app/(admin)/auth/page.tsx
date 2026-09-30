import ComponentCard from "@/components/common/UserComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/UserTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "This is the user management page showing a list of all users with their details.",
  // other metadata
};

export default function BasicTables() {
  return (
    <div className="space-y-8">
      {/* Page Breadcrumb */}
      <PageBreadcrumb pageTitle="User Management" />

      {/* Main Content */}
      <div className="space-y-6">
        <ComponentCard title="Users List">
          {/* BasicTableOne will display the list of users */}
          <BasicTableOne />
          
        </ComponentCard>
        
      </div>
    </div>
  );
}
