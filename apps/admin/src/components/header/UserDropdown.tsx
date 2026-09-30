"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const router = useRouter();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // 🔹 Clear auth + show modal
  function forceLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");

    setIsOpen(false);
    setShowSessionExpired(true);
  }

  // 🔹 Manual logout
  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");

    router.push("/signin");
  }

  // 🔹 Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          forceLogout();
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/myapi/admin/me/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔴 Token expired / invalid
        if (res.status === 401 || res.status === 403) {
          forceLogout();
          return;
        }

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
  }, []);

  const fullName =
    user?.first_name || user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username || "User";

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        >
          <span className="block mr-1 font-medium text-theme-sm">
            {fullName}
          </span>

          <svg
            className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
        >
          <div>
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {fullName}
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              {user?.email || ""}
            </span>
          </div>

          {/* 🔹 Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 mt-4 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497V14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497V5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501H14.3507V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609H18.5007C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609V18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007Z"
              />
            </svg>
            Sign out
          </button>
        </Dropdown>
      </div>

      {/* 🔔 Session Expired Modal */}
      {showSessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Session Expired
            </h3>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your session has expired. Please sign in again to continue.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowSessionExpired(false);
                  router.push("/signin");
                }}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
