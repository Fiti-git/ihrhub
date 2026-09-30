"use client";

import React, { useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
// Remove import of RecentOrders, or keep if you want both
// import RecentOrders from "@/components/ecommerce/RecentOrders";
import RecentActions from "@/components/ecommerce/RecentActions"; // New component for recent actions

export default function Ecommerce() {
  const [permissions, setPermissions] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [loadingActions, setLoadingActions] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Fetch Permissions
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/myapi/admin/me/permissions/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPermissions(data.permissions))
      .catch(console.error)
      .finally(() => setLoadingPermissions(false));

    // Fetch Recent Actions
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/myapi/admin/recent-actions/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecentActions(data))
      .catch(console.error)
      .finally(() => setLoadingActions(false));
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT: Permission Cards (3/5) */}
      <div className="col-span-12 lg:col-span-7">
        <EcommerceMetrics permissions={permissions} loading={loadingPermissions} />
      </div>

      {/* RIGHT: Recent Actions (2/5) */}
      <div className="col-span-12 lg:col-span-5">
        <RecentActions actions={recentActions} loading={loadingActions} />
      </div>
    </div>
  );
}
