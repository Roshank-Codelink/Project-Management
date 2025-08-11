"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Pencil, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateuserprofile, updateuserprofileT, updateEmployeeProfile } from "@/ultis/Projectfetching/project";

export interface UserProfileType {
  _id: string;
  Username: string;
  Email: string;
  Phone: number;
  ProfileImageUrl: string;
  Department: string;
  Role: string;
  EmployeeId: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [editField, setEditField] = useState<keyof UserProfileType | null>(null);
  const [formState, setFormState] = useState<Partial<UserProfileType>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser) return;

    const parsedUser: UserProfileType = JSON.parse(localUser);
    setUser(parsedUser);
    setFormState({
      Username: parsedUser.Username,
      Phone: parsedUser.Phone,
    });

    setImagePreview(
      parsedUser.ProfileImageUrl?.startsWith("http")
        ? parsedUser.ProfileImageUrl
        : `http://localhost:8080/User/${parsedUser.ProfileImageUrl.replace(/^\/+/, "")}`
    );
  }, []);

  const handleInputChange = (field: keyof UserProfileType, value: string | number): void => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setEditField(field);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Selected file:", file); // Debug log
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setEditField("ProfileImageUrl");
    }
  };

  const saveChanges = async (): Promise<void> => {
    if (!user?._id) {
      alert("User ID not found!");
      return;
    }

    try {
      const formData = new FormData();
      if (formState.Username !== undefined) formData.append("Username", String(formState.Username));
      if (formState.Phone !== undefined) formData.append("Phone", String(formState.Phone));

      // ✅ Important: Correct field name for multer
      if (selectedFile) {
        formData.append("ProfileImageUrl", selectedFile); // Must match multer field
      }

      let updatedUser: UserProfileType | null = null;

      // Role-based function selection
      if (user.Role === "TeamLeader") {
        // Use team leader specific function
        updatedUser = await updateuserprofileT(formData, user._id);
      } else if (user.Role === "Manager") {
        // Use manager specific function
        updatedUser = await updateuserprofile(formData, user._id);
      } else if (user.Role === "Employee") {
        // Use employee specific function - Fixed response handling
        const response = await updateEmployeeProfile(formData, user._id);
        console.log("Employee profile update response:", response);
        
        // Check if response is an error object
        if (response && response.message && response.message.includes("Error")) {
          throw new Error(response.message);
        }
        
        // If response has data, use it
        if (response && response.data) {
          updatedUser = response.data;
        } else if (response && response.message && response.message.includes("Successfully")) {
          // Success case - the response might contain the updated user data
          // or we need to fetch the updated user data
          console.log("Profile updated successfully:", response.message);
          // For now, we'll use the current user data since the update was successful
          updatedUser = {
            ...user,
            Username: formState.Username || user.Username,
            Phone: formState.Phone || user.Phone,
            ProfileImageUrl: selectedFile ? `http://localhost:8080/User/${selectedFile.name}` : user.ProfileImageUrl
          };
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        // For other roles, use the regular update function
        updatedUser = await updateuserprofile(formData, user._id);
      }
      
      if (updatedUser) {
        setUser(updatedUser);
        setFormState({
          Username: updatedUser.Username,
          Phone: updatedUser.Phone,
          ProfileImageUrl: updatedUser.ProfileImageUrl,
        });

        // ✅ Update image preview with new image URL
        if (updatedUser.ProfileImageUrl) {
          setImagePreview(
            updatedUser.ProfileImageUrl?.startsWith("http")
              ? updatedUser.ProfileImageUrl
              : `http://localhost:8080/User/${updatedUser.ProfileImageUrl.replace(/^\/+/, "")}`
          );
        }

        // ✅ Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditField(null);
        setSelectedFile(null);
        alert("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message || "Unknown error"}`);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen px-6 py-12 bg-gradient-to-tr from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header with profile image */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group w-[130px] h-[130px]">
            <label htmlFor="image-upload" className="cursor-pointer block w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="User Profile"
                  width={130}
                  height={130}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-blue-900">{user?.Username}</h1>
            <p className="text-sm text-gray-600">{user?.Email}</p>
            <p className="text-xs text-gray-500">Role: {user?.Role}</p>
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Username */}
          <div className="relative bg-white p-5 rounded-lg shadow-md border">
            <label className="text-sm font-semibold text-gray-700">Username</label>
            <Input
              type="text"
              value={formState.Username || ""}
              onChange={(e) => handleInputChange("Username", e.target.value)}
              className="mt-1"
            />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
              onClick={() => setEditField("Username")}
              type="button"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Phone */}
          <div className="relative bg-white p-5 rounded-lg shadow-md border">
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <Input
              type="number"
              value={formState.Phone || ""}
              onChange={(e) => handleInputChange("Phone", e.target.value)}
              className="mt-1"
            />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
              onClick={() => setEditField("Phone")}
              type="button"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Read-only fields */}
          <div className="bg-white p-5 rounded-lg shadow-md border">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <p className="mt-1 text-gray-800 text-sm">{user.Email}</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <p className="mt-1 text-gray-800 text-sm">{user.Role}</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border">
            <label className="text-sm font-semibold text-gray-700">Department</label>
            <p className="mt-1 text-gray-800 text-sm">{user.Department}</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border">
            <label className="text-sm font-semibold text-gray-700">Employee ID</label>
            <p className="mt-1 text-gray-800 text-sm">{user.EmployeeId}</p>
          </div>
        </div>

        {editField && (
          <div className="pt-6 text-center">
            <Button
              onClick={saveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
