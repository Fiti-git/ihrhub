import Link from "next/link";
import React from "react";
import { FiMail } from "react-icons/fi";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>
      
      <nav className="flex items-center gap-3">
        {/* New Navigation Button for Messages */}
        <Link
          href="/cms/messages" 
          className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-[#f9fde8] hover:border-[#b7db3a] hover:text-[#425408]"
        >
          <FiMail size={18} className="text-[#b7db3a]" />
          View Inbound Messages
        </Link>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;