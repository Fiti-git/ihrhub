import UserInfoCard from "@/components/user-profile/StaffUserInfo";
import PermissionInfoCard from "@/components/user-profile/StaffPermisionInfo";
import { Metadata } from "next";
import React from "react";

// Metadata works here because this is a Server Component (no "use client")
export const metadata: Metadata = {
  title: "User Profile | Admin Dashboard",
  description: "View and edit user details",
};

// Next.js automatically passes 'params' to the page
export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          User Profile
        </h3>
        <div className="space-y-6">
          {/* Pass the ID directly to your Client Component */}
          <UserInfoCard userId={id} />
          <PermissionInfoCard userId={id} />
        </div>
      </div>
    </div>
  );
}