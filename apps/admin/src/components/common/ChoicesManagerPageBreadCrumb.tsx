import Link from "next/link";
import { FiArrowLeft, FiDatabase } from "react-icons/fi";

export default function PageBreadcrumb({ pageTitle }: { pageTitle: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-4">
      
        <h2 className="text-xl font-bold text-gray-800">{pageTitle}</h2>
      </div>
    </div>
  );
}