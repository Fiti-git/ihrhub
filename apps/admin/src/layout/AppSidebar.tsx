"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { GridIcon } from "../icons/index";

/* ================= TYPES ================= */

type NavItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string; // Direct path, no subitems
};

/* ================= STATIC NAV ================= */

const staticNavItems: NavItem[] = [
  {
    id: "dashboard-static",
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/",
  },
];

/* ================= FETCH PERMISSIONS ================= */

function permissionToPath(codename: string, app: string) {
  switch (codename) {
    case "add_logentry":
    case "change_logentry":
    case "delete_logentry":
    case "view_logentry":
      return "/admin/logs";
    case "add_permission":
    case "change_permission":
    case "delete_permission":
    case "view_permission":
      return "/admin/permissions";
    default:
      return `/${app}`;
  }
}

/* ================= COMPONENT ================= */

const AppSidebar: React.FC = () => {
  const { isExpanded, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isActive = (path: string) => path === pathname;

  /* ================= FETCH PERMISSIONS ================= */

  useEffect(() => {
    async function fetchPermissions() {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/myapi/admin/me/permissions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        const appsMap: Record<string, NavItem> = {};

        (data.permissions || []).forEach(
          (perm: { codename: string; name: string; app: string }) => {
            if (!appsMap[perm.app]) {
              appsMap[perm.app] = {
                id: `app-${perm.app}`,
                name: perm.app.charAt(0).toUpperCase() + perm.app.slice(1),
                icon: <GridIcon />,
                path: `/${perm.app}`, // Set main path for each app
              };
            }
          }
        );

        const filteredApps = Object.values(appsMap).filter(
          (item) => item.name !== "Dashboard"
        );

        setNavItems([...staticNavItems, ...filteredApps]);
      } catch (err) {
        console.error("Failed to fetch permissions", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  /* ================= RENDER MENU ================= */

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.id}>
          <Link
            href={nav.path}
            className={`menu-item group cursor-pointer ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            } ${
              !isExpanded && !isHovered
                ? "lg:justify-center"
                : "lg:justify-start"
            }`}
          >
            <span
              className={
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }
            >
              {nav.icon}
            </span>

            {(isExpanded || isHovered) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  /* ================= JSX ================= */

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen flex flex-col px-5 mt-16 lg:mt-0
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transition-all duration-300
        ${isExpanded || isHovered ? "w-[290px]" : "w-[90px]"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* ✅ SCROLL CONTAINER */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase text-gray-400 flex ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered ? "Menu" : "…"}
          </h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading menu...</div>
          ) : (
            renderMenuItems(navItems)
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
