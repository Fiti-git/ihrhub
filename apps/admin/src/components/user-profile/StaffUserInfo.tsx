"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface UserInfoCardProps {
  userId: string;
}

export default function UserInfoCard({ userId }: UserInfoCardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<any>(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ======================
     FETCH USER
  ====================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  /* ======================
     EDIT MODE
  ====================== */
  const handleEdit = () => {
    setFormData({
      first_name: user?.first_name ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
      password: "",
    });
    setConfirmPassword("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
    setConfirmPassword("");
  };

  /* ======================
     INPUT HANDLERS
  ====================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ======================
     SAVE
  ====================== */
  const handleSave = async () => {
    // 🔐 Password confirmation
    if (formData.password) {
      if (formData.password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    try {
      const token = localStorage.getItem("access_token");

      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (e) {
      console.error(e);
      alert("Update failed");
    }
  };

  /* ======================
     UI STATES
  ====================== */
  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <div className="p-10 text-red-500">User not found</div>;

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="p-5 border rounded-2xl bg-white dark:bg-white/[0.03]">
      <div className="flex justify-between gap-6">
        <div className="w-full">
          <h4 className="text-lg font-semibold mb-6">Personal Information</h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* First Name */}
            <div>
              <Label>First Name</Label>
              {isEditing ? (
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.first_name || "N/A"}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <Label>Username</Label>
              {isEditing ? (
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.username || "N/A"}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>New Password</Label>
              {isEditing ? (
                <Input
                  name="password"
                  type="password"
                  placeholder="Leave empty to keep password"
                  value={formData.password}
                  onChange={handleChange}
                />
              ) : (
                <p className="italic text-gray-400">********</p>
              )}
            </div>

            {/* Confirm Password */}
            {isEditing && (
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
