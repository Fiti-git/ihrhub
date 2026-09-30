"use client";

import React from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/ChoicesManagerPageBreadCrumb";
import ChoiceItemTable from "@/components/tables/ChoiceItemTable";
import ComponentCard from "@/components/common/ChoicesMangerCoponentCard";

export default function ChoiceItemsPage() {
  const params = useParams();
  const groupId = params.id;

  return (
    <div className="space-y-6 p-6 bg-[#fafafa] min-h-screen">
      <PageBreadcrumb pageTitle="Manage Choice Values" />

      <div className="max-w-6xl mx-auto">
        <ComponentCard title={`Items for Group ID: #${groupId}`}>
          <ChoiceItemTable groupId={groupId} />
        </ComponentCard>
      </div>
    </div>
  );
}