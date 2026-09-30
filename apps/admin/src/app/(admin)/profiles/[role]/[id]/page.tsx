"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ComponentCard from "@/components/common/ProfileSingleComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";

export default function SingleProfileView() {
  const { role, id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_BASE}/api/admin/profile/${role}/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, role, API_BASE]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleNestedChange = (index: number, field: string, value: string, type: 'education' | 'work_experience') => {
    const updatedList = [...formData[type]];
    updatedList[index][field] = value;
    setFormData({ ...formData, [type]: updatedList });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const data = new FormData();
      const skipFields = ["profile_image", "resume", "display_name", "email", "role", "created_at", "updated_at", "user"];
      
      Object.keys(formData).forEach((key) => {
        if (skipFields.includes(key)) return;
        if (Array.isArray(formData[key])) {
            data.append(key, JSON.stringify(formData[key]));
        } else {
            data.append(key, formData[key] === null ? "" : formData[key]);
        }
      });

      if (selectedImage) data.append("profile_image", selectedImage);

      const response = await axios.patch(`${API_BASE}/api/admin/profile/${role}/${id}/`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setProfile(response.data);
      setIsEditing(false);
      setSelectedImage(null);
      alert("Updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Profile Data...</div>;

  const isFreelancer = role === "freelancer";

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <PageBreadcrumb pageTitle={`${profile.display_name} Details`} />
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-brand-600 transition">Save All Changes</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium shadow-md">Edit Profile</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- LEFT SIDEBAR --- */}
        <div className="space-y-6">
          <ComponentCard title="Identity">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="relative group mb-4">
                <img
                  src={previewUrl || (profile.profile_image ? `${API_BASE}${profile.profile_image}` : "/images/user/user-01.jpg")}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-lg"
                  alt="Profile"
                />
                {isEditing && (
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-brand-500 text-white rounded-full border-2 border-white shadow-md hover:scale-110 transition">📷</button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
              
              {isEditing ? (
                <input 
                  name={isFreelancer ? "full_name" : "company_name"} 
                  value={isFreelancer ? formData.full_name : formData.company_name} 
                  onChange={handleInputChange} 
                  className="text-center font-bold text-lg border-b border-brand-500 focus:outline-none w-full bg-transparent"
                />
              ) : (
                <h3 className="text-xl font-bold">{isFreelancer ? profile.full_name : profile.company_name}</h3>
              )}
              <p className="text-sm text-gray-400 mb-4">{profile.email}</p>
              
              <div className="w-full space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                        <span className="text-xs">{formData.is_active ? "Active" : "Disabled"}</span>
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-4 h-4 accent-brand-500" />
                    </div>
                  ) : (
                    <Badge color={profile.is_active ? "success" : "warning"}>{profile.is_active ? "Active" : "Inactive"}</Badge>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Verification</span>
                  {isEditing ? (
                    <input type="checkbox" name="is_verified" checked={formData.is_verified} onChange={handleInputChange} className="w-4 h-4 accent-brand-500" />
                  ) : (
                    <Badge color={profile.is_verified ? "success" : "error"}>{profile.is_verified ? "Verified" : "Unverified"}</Badge>
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Location & Contact">
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                    <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Phone</label>
                    {isEditing ? <input name="phone_number" value={formData.phone_number || ""} onChange={handleInputChange} className="w-full border p-2 rounded" /> : <p className="font-medium">{profile.phone_number}</p>}
                </div>
                <div>
                  <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">City</label>
                  {isEditing ? <input name="city" value={formData.city || ""} onChange={handleInputChange} className="w-full border p-2 rounded" /> : <p className="font-medium">{profile.city || "N/A"}</p>}
                </div>
                <div>
                  <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Country</label>
                  {isEditing ? <input name="country" value={formData.country || ""} onChange={handleInputChange} className="w-full border p-2 rounded" /> : <p className="font-medium">{profile.country}</p>}
                </div>
              </div>
              {isFreelancer && (
                <>
                    <div>
                    <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Language ({profile.language_proficiency})</label>
                    {isEditing ? <input name="language" value={formData.language || ""} onChange={handleInputChange} className="w-full border p-2 rounded" /> : <p className="font-medium capitalize">{profile.language}</p>}
                    </div>
                    <div>
                    <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Social/Portfolio Link</label>
                    {isEditing ? <input name="linkedin_or_github" value={formData.linkedin_or_github || ""} onChange={handleInputChange} className="w-full border p-2 rounded" /> : <a href={profile.linkedin_or_github} target="_blank" className="text-blue-500 underline truncate block">{profile.linkedin_or_github}</a>}
                    </div>
                </>
              )}
            </div>
          </ComponentCard>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard title={isFreelancer ? "Professional Bio" : "Company Overview"}>
            {isEditing ? (
              <textarea name={isFreelancer ? "bio" : "company_overview"} value={isFreelancer ? formData.bio : formData.company_overview} onChange={handleInputChange} className="w-full border p-3 rounded-lg text-sm bg-gray-50 focus:bg-white transition" rows={6} />
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{isFreelancer ? profile.bio : profile.company_overview}</p>
            )}
          </ComponentCard>

          {isFreelancer && (
            <>
              <ComponentCard title="Work Experience">
                <div className="space-y-6">
                  {(isEditing ? formData.work_experience : profile.work_experience)?.map((work: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-blue-100 space-y-2 pb-4">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 shadow-sm"></div>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input value={work.job_title} onChange={(e) => handleNestedChange(idx, 'job_title', e.target.value, 'work_experience')} className="font-bold border-b w-full outline-none p-1" placeholder="Job Title" />
                          <input value={work.company} onChange={(e) => handleNestedChange(idx, 'company', e.target.value, 'work_experience')} className="text-brand-500 border-b w-full outline-none p-1" placeholder="Company" />
                          <textarea value={work.description} onChange={(e) => handleNestedChange(idx, 'description', e.target.value, 'work_experience')} className="text-gray-500 text-xs w-full border rounded p-2 col-span-2" rows={2} placeholder="Description" />
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                             <h4 className="font-bold text-gray-800">{work.job_title}</h4>
                             <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase">{work.start_year} - {work.end_year}</span>
                          </div>
                          <p className="text-brand-500 text-sm font-medium">{work.company}</p>
                          <p className="text-gray-500 text-xs leading-relaxed">{work.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ComponentCard>

              <ComponentCard title="Education History">
                <div className="space-y-6">
                  {(isEditing ? formData.education : profile.education)?.map((edu: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-brand-100 space-y-2 pb-4">
                      <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[7px] top-1 shadow-sm"></div>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input value={edu.degree} onChange={(e) => handleNestedChange(idx, 'degree', e.target.value, 'education')} className="font-bold border-b w-full outline-none p-1" placeholder="Degree" />
                          <input value={edu.school} onChange={(e) => handleNestedChange(idx, 'school', e.target.value, 'education')} className="text-brand-500 border-b w-full outline-none p-1" placeholder="School" />
                          <textarea value={edu.description} onChange={(e) => handleNestedChange(idx, 'description', e.target.value, 'education')} className="text-gray-500 text-xs w-full border rounded p-2 col-span-2" rows={2} />
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                             <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                             <span className="text-[10px] bg-brand-50 text-brand-600 px-2 py-1 rounded font-bold uppercase">{edu.start_year} - {edu.end_year}</span>
                          </div>
                          <p className="text-brand-500 text-sm font-medium">{edu.school}</p>
                          <p className="text-gray-500 text-xs italic leading-relaxed">{edu.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ComponentCard>

              <ComponentCard title="Professional Stats & Skills">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Hourly Rate</span>
                    {isEditing ? <input name="hourly_rate" type="number" value={formData.hourly_rate} onChange={handleInputChange} className="w-full border p-2 rounded font-bold text-green-600" /> : <p className="text-lg font-bold text-green-600">${profile.hourly_rate}/hr</p>}
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Exp. Level</span>
                    {isEditing ? (
                        <select name="experience_level" value={formData.experience_level} onChange={handleInputChange} className="w-full border p-2 rounded text-sm bg-white">
                            <option value="entry">Entry</option>
                            <option value="mid">Mid</option>
                            <option value="senior">Senior</option>
                        </select>
                    ) : <p className="text-lg font-bold capitalize">{profile.experience_level}</p>}
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Specialization</span>
                    {isEditing ? <input name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" /> : <p className="text-lg font-bold capitalize">{profile.specialization}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px] font-bold uppercase">Skills</label>
                  {isEditing ? (
                    <textarea name="skills" value={formData.skills} onChange={handleInputChange} className="w-full border p-3 text-xs rounded-lg" rows={3} placeholder="React, Node.js..." />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.split(',').map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white text-gray-700 rounded-full text-[11px] font-bold border border-gray-200 shadow-sm">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ComponentCard>
            </>
          )}
          {/* --- RESUME SECTION --- */}
<ComponentCard title="Documents & Attachments">
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-red-50 text-red-600 rounded-lg">
        {/* PDF Icon Placeholder */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">Curriculum Vitae (CV)</h4>
        <p className="text-xs text-gray-500">
          {profile.resume ? "PDF Document Attached" : "No resume uploaded"}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {profile.resume && (
        <a 
          href={`${API_BASE}${profile.resume}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-black transition flex items-center gap-2"
        >
          <span>Download / View CV</span>
        </a>
      )}

      {isEditing && (
        <div className="relative">
          <input 
            type="file" 
            name="resume" 
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFormData({ ...formData, new_resume: e.target.files[0] });
              }
            }}
            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
        </div>
      )}
    </div>
  </div>
</ComponentCard>

          {!isFreelancer && (
            <ComponentCard title="Company & Industry Details">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Primary Industry</label>
                  {isEditing ? <input name="industry" value={formData.industry || ""} onChange={handleInputChange} className="w-full border p-2 rounded bg-gray-50" /> : <p className="text-lg font-bold capitalize text-brand-600">{profile.industry}</p>}
                </div>
                <div>
                  <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Standard Job Type</label>
                  {isEditing ? <input name="job_type" value={formData.job_type || ""} onChange={handleInputChange} className="w-full border p-2 rounded bg-gray-50" /> : <p className="text-lg font-bold capitalize text-gray-800">{profile.job_type}</p>}
                </div>
                <div className="col-span-2">
                   <label className="text-gray-400 block text-[10px] font-bold uppercase mb-1">Company Contact Email</label>
                   {isEditing ? <input name="email_address" value={formData.email_address || ""} onChange={handleInputChange} className="w-full border p-2 rounded bg-gray-50" /> : <p className="font-medium">{profile.email_address}</p>}
                </div>
              </div>
            </ComponentCard>
          )}
        </div>
      </div>
    </div>
  );
}