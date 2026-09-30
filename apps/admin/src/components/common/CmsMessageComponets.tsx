"use client";

import React from "react";
import { FiMessageSquare, FiInbox } from "react-icons/fi";

interface MessageComponentCardProps {
  title: string;
  children: React.ReactNode;
}

export default function MessageComponentCard({ title, children }: MessageComponentCardProps) {
  return (
    <div className="group overflow-hidden rounded-[1.0rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40">
      {/* Header Section */}
      <div className="relative border-b border-gray-50 px-8 py-8">
        {/* Decorative Background Icon */}
        <FiInbox className="absolute -bottom-2 -right-2 h-24 w-24 text-gray-50 opacity-50 transition-transform group-hover:scale-110 group-hover:rotate-12" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#f9fde8] text-[#b7db3a] shadow-inner">
            <FiMessageSquare size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-800">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b7db3a] animate-pulse"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Customer Inquiries & Feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white p-4">
        <div className="rounded-[1.5rem] border border-gray-50 bg-[#fafafa]/50 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50/50 px-8 py-3 text-right">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
          Syncing with Cloud Database...
        </p>
      </div>
    </div>
  );
}