import React from "react";
import {
  Briefcase,
  Users,
  CheckCircle,
  DollarSign,
} from "lucide-react";

const iconMap = {
  Briefcase: Briefcase,
  Users: Users,
  CheckCircle: CheckCircle,
  DollarSign: DollarSign,
};

export default function StatCard({ title, value, icon, color }) {
  const Icon = iconMap[icon];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-body dark:text-bodydark">
            {title}
          </span>
          <h4 className="mt-1 text-title-md font-semibold text-black dark:text-white">
            {value}
          </h4>
        </div>

        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              colorClasses[color] || colorClasses.blue
            }`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
