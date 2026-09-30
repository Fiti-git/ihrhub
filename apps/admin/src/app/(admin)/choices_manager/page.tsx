import ComponentCard from "@/components/common/ChoicesMangerCoponentCard";
import PageBreadcrumb from "@/components/common/ChoicesManagerPageBreadCrumb";
import ChoiceGroupTable from "@/components/tables/ChoiceGroupTable"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IHRHUB CHOICES MANAGEMENT | Admin Dashboard",
  description: "Administrative interface to manage system choice groups.",
};

export default function ChoicesManagerPage() {
  return (
    <div className="space-y-6 p-6 bg-[#fafafa] min-h-screen">
      {/* 1. Header with navigation toggle */}
      <PageBreadcrumb pageTitle="Choice Group Manager" />

      <div className="max-w-6xl mx-auto">
        {/* 2. Main Choice Management Section */}
        <ComponentCard title="System Choice Groups">
          <div className="mt-2">
             <ChoiceGroupTable />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}