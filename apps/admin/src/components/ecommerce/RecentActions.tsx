"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

/* ---------------- Types ---------------- */

interface RecentAction {
  id: number;
  time_ago: string;
  object: string;
  description: string;
  user: string;
}

interface RecentActionsProps {
  actions: RecentAction[];
  loading: boolean;
}

/* ---------------- Helpers ---------------- */

// Convert audit JSON text into readable text
const formatDescription = (description: string) => {
  try {
    const jsonMatch = description.match(/\[(.*)\]/);
    if (!jsonMatch) return description;

    const parsed = JSON.parse(`[${jsonMatch[1]}]`);
    const fields = parsed[0]?.changed?.fields;

    if (!fields || fields.length === 0) {
      return "Updated details";
    }

    return `Updated ${fields.join(", ")}`;
  } catch {
    return description;
  }
};

// Optional: shorten time text
const formatTime = (time: string) => {
  return time.replace("minutes", "min").replace("hours", "hr");
};

/* ---------------- Component ---------------- */

export default function RecentActions({
  actions,
  loading,
}: RecentActionsProps) {
  if (loading) return <p>Loading recent actions...</p>;
  if (!actions.length) return <p>No recent actions found.</p>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Recent Actions
      </h3>

      {/* Scrollable Table Wrapper (Invisible Scrollbar) */}
      <div className="max-h-[320px] overflow-y-auto scrollbar-hide">
        <Table className="table-fixed w-full">
          {/* Sticky Header */}
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-[#0f0f0f] border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="w-24 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Time
              </TableCell>

              <TableCell
                isHeader
                className="w-40 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Object
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {actions.map((action) => (
              <TableRow key={action.id}>
                {/* Time */}
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(action.time_ago)}
                </TableCell>

                {/* Object (fixed width + truncate) */}
                <TableCell className="py-3 font-medium text-gray-800 dark:text-white truncate">
                  {action.object}
                </TableCell>

                {/* Action (max 2 lines) */}
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {formatDescription(action.description)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
