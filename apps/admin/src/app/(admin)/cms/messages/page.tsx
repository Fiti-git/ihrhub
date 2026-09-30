import MessageComponentCard from "@/components/common/CmsMessageComponets";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContactMessageTable from "@/components/tables/ContactMessageTable";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function MessageInboxPage() {
  return (
    <div className="space-y-6 p-6 bg-[#fafafa] min-h-screen">
      <div className="flex items-center gap-4 mb-2">
         <Link href="/cms" className="p-2 bg-white rounded-full shadow-sm hover:text-[#b7db3a] transition-colors">
            <FiArrowLeft size={20} />
         </Link>
         <h1 className="text-xl font-black text-slate-800">Back to Service Management</h1>
      </div>

      <MessageComponentCard title="Customer Inbound Messages">
        <ContactMessageTable />
      </MessageComponentCard>
    </div>
  );
}