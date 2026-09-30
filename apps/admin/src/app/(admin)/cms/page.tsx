import ComponentCard from "@/components/common/CmdCoponentCard";
import PageBreadcrumb from "@/components/common/CmsPageBreadCrumb";
import BasicTableOne from "@/components/tables/CmsTable"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IHRHUB SERVICE MANAGEMENT | Admin Dashboard",
  description: "Manage service categories effectively.",
};

export default function BasicTables() {
  return (
    <div className="space-y-6 p-6 bg-[#fafafa] min-h-screen">
      {/* Page Breadcrumb with the new Message Button */}
      <PageBreadcrumb pageTitle="Service Management" />

      <div className="max-w-6xl mx-auto">
        {/* Main Focus: Service Categories */}
        <ComponentCard title="Service Categories List">
          <BasicTableOne />
        </ComponentCard>
        
        <p className="mt-4 text-center text-xs text-gray-400 font-medium italic">
          Tip: Use the "View Inbound Messages" button above to check customer inquiries.
        </p>
      </div>
    </div>
  );
}