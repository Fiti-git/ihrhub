"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react"; // Fallback icon

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // Keep as string for flexibility
  color: "blue" | "green" | "orange" | "purple" | "red";
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  // 1. Convert string to PascalCase (e.g., "briefcase" -> "Briefcase")
  const pascalIconName = icon.charAt(0).toUpperCase() + icon.slice(1);
  
  // 2. Safely access the icon or use a fallback
  // @ts-ignore - dynamic access can trigger TS warnings
  const IconComponent = LucideIcons[pascalIconName] || HelpCircle;

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
          {/* Now IconComponent is guaranteed to be a valid function/component */}
          <IconComponent size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;