import ComponentCard from "@/components/common/ProfileCreateComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProfileDetails from "@/components/tables/ProfileTable"; // Updated component import
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | Admin Dashboard",
  description: "This is the profile page showing user details.",
  // other metadata
};

export default function Profile() {
  return (
    <div className="space-y-8">
      {/* Page Breadcrumb */}
      <PageBreadcrumb pageTitle="Profile" />

      {/* Main Content */}
      <div className="space-y-6">
        <ComponentCard title="Profile Details">
          {/* ProfileDetails will display the details of the user */}
          <ProfileDetails />
          
        </ComponentCard>
        
      </div>
    </div>
  );
}