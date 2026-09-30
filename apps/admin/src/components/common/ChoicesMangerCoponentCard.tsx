import { FiDatabase } from "react-icons/fi";

export default function ComponentCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.0rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4 border-b border-gray-50 px-8 py-6">
        {/* Changed bg to brand-500 (#b7db3a), text to brand-900 (#425408), and shadow to match */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b7db3a] text-[#425408] shadow-lg shadow-[#b7db3a]/20">
          <FiDatabase size={20} />
        </div>
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}