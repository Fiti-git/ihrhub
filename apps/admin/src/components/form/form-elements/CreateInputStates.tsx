"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";

export default function CreateUserForm() {
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString();

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    email: "", 
    password: "",
    is_active: true,
    is_staff: false,
  });

  const [emailError, setEmailError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(!isValid);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || !formData.email) return;

    // Mapping email to username for the Django payload
    const payload = {
      ...formData,
      username: formData.email, 
    };

    try {
      // Retrieve the access token using your specific key
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Critical for IsAuthenticated check
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/auth");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Authentication or Validation failed"}`);
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <ComponentCard
      title="Create User Profile"
      desc="The email address provided will serve as the account username."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Info Row: Date Joined */}
        <div className="flex justify-between items-center bg-[var(--color-brand-25)] dark:bg-white/[0.03] p-4 rounded-lg border border-[var(--color-brand-100)] dark:border-gray-800">
          <span className="text-sm font-medium text-gray-500">Date Joining</span>
          <span className="text-sm font-bold text-[var(--color-brand-800)] dark:text-[var(--color-brand-300)]">
            {currentDate}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <Label>First Name</Label>
            <Input
              name="first_name"
              type="text"
              placeholder="Enter first name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email / Username */}
          <div>
            <Label>Email (Username)</Label>
            <Input
              name="email"
              type="email"
              placeholder="user@company.com"
              error={emailError}
              onChange={handleChange}
              hint={emailError ? "Invalid email format" : ""}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <Label>Account Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
            onChange={handleChange}
            required
          />
        </div>

        {/* Status Switches */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10 border-t border-gray-100 pt-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-brand-500)] focus:ring-[var(--color-brand-400)]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Is Active
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_staff"
              id="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-brand-500)] focus:ring-[var(--color-brand-400)]"
            />
            <label htmlFor="is_staff" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Is Staff (Admin Access)
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="
              rounded-md px-6 py-2 text-sm font-medium text-white shadow-md transition-all
              bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-600)]
              hover:from-[var(--color-brand-600)] hover:to-[var(--color-brand-700)]
              hover:scale-[1.02] active:scale-95
            "
          >
            Create User
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}