"use client"; // This marks the component as a client component

import React from "react";
import { useRouter } from "next/navigation"; // 1. Import the router hook

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  const router = useRouter(); // 2. Initialize the router

  const handleNavigation = () => {
    // 3. Navigate to the desired path
    router.push("/profiles/create");
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {/* Add User Button */}
        <button
          className="
            flex items-center gap-2 text-sm font-medium text-white
            bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-600)]
            hover:from-[var(--color-brand-600)] hover:to-[var(--color-brand-700)]
            rounded-md py-2 px-6 transition-all duration-300 shadow-md
            hover:scale-105 dark:shadow-lg
            dark:bg-gradient-to-r dark:from-[var(--color-brand-600)] dark:to-[var(--color-brand-700)]
            dark:hover:from-[var(--color-brand-700)] dark:hover:to-[var(--color-brand-800)]
          "
          onClick={handleNavigation} // 4. Link the button to navigation
        >
          + Add Profile
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;