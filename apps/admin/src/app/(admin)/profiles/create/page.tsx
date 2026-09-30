"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ComponentCard from "@/components/common/ProfileSingleComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  // 1. Initial State for all model fields
  const [formData, setFormData] = useState<any>({
    // User Model
    username: "",
    email: "",
    password: "",
    first_name: "",
    is_active: true,
    group: "",

    // Shared Profile Fields
    phone_number: "",
    country: "",
    city: "",

    // Freelancer Specific
    full_name: "",
    professional_title: "",
    hourly_rate: "",
    gender: "",
    experience_level: "entry",
    specialization: "",
    skills: "",
    language: "",
    language_proficiency: "",
    linkedin_or_github: "",
    bio: "",

    // Employer Specific
    company_name: "",
    company_overview: "",
    job_type: "full-time",
    industry: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    profile_image: null,
    resume: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 2. Load Groups for selection
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${API_BASE}/api/admin/create-user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(res.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [API_BASE]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const data = new FormData();

      // Append all text/boolean data
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append files
      if (files.profile_image) data.append("profile_image", files.profile_image);
      if (files.resume) data.append("resume", files.resume);

      const response = await axios.post(`${API_BASE}/api/admin/create-user/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("User and Profile created successfully!");
      router.push(`/profile/${response.data.role}/${response.data.user_id}`);
    } catch (error: any) {
      alert(error.response?.data?.error || "An error occurred during creation.");
    } finally {
      setLoading(false);
    }
  };

  const isFreelancer = formData.group.toLowerCase() === "freelancer" || formData.group.toLowerCase() === "candidate";
  const isEmployer = formData.group.toLowerCase() === "employer";

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6">
      <PageBreadcrumb pageTitle="Add New User & Profile" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- SECTION 1: AUTH & CORE USER --- */}
        <ComponentCard title="Account Authentication">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Account Type (Group)</label>
              <select name="group" required value={formData.group} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                <option value="">Select Role</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Username</label>
              <input name="username" required value={formData.username} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="john_doe" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">First Name</label>
              <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="John" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Email Address</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="john@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Password</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 accent-brand-500" />
              <label className="text-sm font-bold text-gray-700">Account is Active</label>
            </div>
          </div>
        </ComponentCard>

        {/* --- SECTION 2: CONTACT & LOCATION (SHARED) --- */}
        <ComponentCard title="Contact & Geography">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Phone Number</label>
              <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="+1..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">City</label>
              <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Country</label>
              <input name="country" value={formData.country} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
            </div>
          </div>
        </ComponentCard>

        {/* --- SECTION 3: FREELANCER SPECIFIC --- */}
        {isFreelancer && (
          <ComponentCard title="Freelancer Professional Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Professional Title</label>
                <input name="professional_title" value={formData.professional_title} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="React Developer" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Hourly Rate ($)</label>
                <input name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="45" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Experience Level</label>
                <select name="experience_level" value={formData.experience_level} onChange={handleChange} className="w-full border p-2.5 rounded-lg">
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Specialization</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2.5 rounded-lg">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Skills (Comma Separated)</label>
                <textarea name="skills" value={formData.skills} onChange={handleChange} className="w-full border p-2.5 rounded-lg" rows={2} placeholder="JavaScript, Python, Figma..."></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Language</label>
                <input name="language" value={formData.language} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Portfolio/Social URL</label>
                <input name="linkedin_or_github" value={formData.linkedin_or_github} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="https://..." />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Bio / Professional Summary</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full border p-2.5 rounded-lg" rows={4}></textarea>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* --- SECTION 4: EMPLOYER SPECIFIC --- */}
        {isEmployer && (
          <ComponentCard title="Employer / Company Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Company Name</label>
                <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full border p-2.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Industry</label>
                <input name="industry" value={formData.industry} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="FinTech" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Job Type Preference</label>
                <input name="job_type" value={formData.job_type} onChange={handleChange} className="w-full border p-2.5 rounded-lg" placeholder="Full-time" />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Company Overview</label>
                <textarea name="company_overview" value={formData.company_overview} onChange={handleChange} className="w-full border p-2.5 rounded-lg" rows={4}></textarea>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* --- SECTION 5: MEDIA UPLOADS --- */}
        {formData.group && (
          <ComponentCard title="Upload Documents & Media">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Profile Image</label>
                <input name="profile_image" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm border p-2 rounded-lg" />
              </div>
              {isFreelancer && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Resume / CV (PDF)</label>
                  <input name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full text-sm border p-2 rounded-lg" />
                </div>
              )}
            </div>
          </ComponentCard>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className={`px-12 py-3 rounded-xl font-bold text-white shadow-lg transition ${loading ? "bg-gray-400" : "bg-brand-500 hover:bg-brand-600 active:scale-95"}`}>
            {loading ? "Processing..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}