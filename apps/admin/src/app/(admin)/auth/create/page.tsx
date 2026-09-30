import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InputStates from "@/components/form/form-elements/CreateInputStates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Creation | Admin Dashboard",
  description: "This is the user creation page for adding new users.",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create User" />
      {/* Removed 'xl:grid-cols-2' to allow full width. 
          The 'max-w' class is optional but recommended for readability on very large screens.
      */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <InputStates />
        </div>
      </div>
    </div>
  );
}