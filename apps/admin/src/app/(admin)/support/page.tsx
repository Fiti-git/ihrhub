import ComponentCard from "@/components/common/SupportComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/SupportTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Management | Admin Dashboard",
  description: "This is the ticket management page showing a list of all tickets.",
};

export default function BasicTables() {
  return (
    <div className="space-y-8">
      {/* Page Breadcrumb */}
      <PageBreadcrumb pageTitle="Ticket Management" />

      {/* Main Content */}
      <div className="space-y-6">
        <ComponentCard title="Support Tickets List">
          {/* BasicTableOne will display the list of users */}
          <BasicTableOne />
          
        </ComponentCard>
        
      </div>
    </div>
  );
}
