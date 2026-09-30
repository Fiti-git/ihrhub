"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import { GroupIcon } from "@/icons";

export const EcommerceMetrics = ({ permissions = [], loading }) => {
  if (loading) {
    return <div>Loading permissions...</div>;
  }

  const grouped = permissions.reduce((acc, p) => {
    acc[p.app] = acc[p.app] || [];
    acc[p.app].push(p);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(grouped).map(([app, perms]) => (
        <div
          key={app}
          className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]
                     w-full h-[260px] p-5 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-5 dark:text-white/90" />
            </div>

            <h4 className="font-bold uppercase text-gray-800 dark:text-white/90">
              {app}
            </h4>
          </div>

          {/* Scrollable Permission List (Invisible Scrollbar) */}
          <div className="mt-4 flex-1 overflow-y-auto scrollbar-hide">
            <ul className="space-y-2">
              {perms.map((perm) => (
                <li
                  key={perm.id}
                  className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="truncate">
                    {perm.name.replace("Can ", "")}
                  </span>

                  <Badge color="success">Allowed</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
