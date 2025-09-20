"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

export default function EditTeacherPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classes: "",
    subjects: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and initialize form with existing data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        
        if (!userId) {
          throw new Error('User ID not found in URL');
        }
        
        // Fetch user data from API
        const response = await fetch(`http://localhost:4000/api/users/${userId}`);
        
        if (!response.ok) {
          // Check content type before trying to parse as JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user data');
          } else {
            // Handle non-JSON responses (like HTML error pages)
            const errorText = await response.text();
            console.error('Server returned non-JSON response:', errorText);
            
            // Try to extract error message from HTML response
            let errorMessage = 'Server error: The server is not responding properly.';
            
            // Check for error message in HTML
            if (errorText.includes('Error:')) {
              // Try to extract any error message
              const errorMatch = errorText.match(/Error:([^<]+)/);
              if (errorMatch && errorMatch[1]) {
                errorMessage = errorMatch[1].trim();
              }
            }
            
            throw new Error(errorMessage);
          }
        }
        
        const userData = await response.json();
        
        // Set form data with fetched user data
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          classes: userData.classes || "",
          subjects: userData.subjects || "",
          newPassword: "",
          confirmNewPassword: "",
        });
        
        // Set photo preview if user has a photo
        if (userData.photo) {
          setPhotoPreview(`http://localhost:4000${userData.photo}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    // Reset to empty string since we're no longer using mock data
    setPhotoPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Create form data for multipart/form-data (for file upload)
      const submitData = new FormData();
      
      // Add all form fields except confirmNewPassword
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmNewPassword') {
          submitData.append(key, value);
        }
      });
      
      // Add photo if exists
      if (photoFile) {
        submitData.append('photo', photoFile);
      }
      
      // Get user ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('id');
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Send data to API
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'PUT',
        body: submitData,
        // Don't set Content-Type header, it will be set automatically with boundary for multipart/form-data
      });
      
      if (!response.ok) {
        // Check content type before trying to parse as JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update user');
        } else {
          // Handle non-JSON responses (like HTML error pages)
          const errorText = await response.text();
          console.error('Server returned non-JSON response:', errorText);
          
          // Try to extract error message from HTML response
          let errorMessage = 'Server error: The server is not responding properly.';
          
          // Check for multer file validation error
          if (errorText.includes('Only image files are allowed')) {
            errorMessage = 'Only image files (jpeg, jpg, png, gif) are allowed!';
          } else if (errorText.includes('Error:')) {
            // Try to extract any error message
            const errorMatch = errorText.match(/Error:([^<]+)/);
            if (errorMatch && errorMatch[1]) {
              errorMessage = errorMatch[1].trim();
            }
          }
          
          throw new Error(errorMessage);
        }
      }
      
      // Success - redirect to users list
      alert('User updated successfully!');
      window.location.href = '/Admin/admin-users';
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while updating the user');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Teacher</h1>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-pulse text-lg text-gray-600">Loading user data...</div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-red-500 text-center mb-4">{error}</div>
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.href = '/Admin/admin-users'}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Return to Users List
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Personal Details */}
          <div className="bg-purple-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Personal Details</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Maria"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Historia"
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Historia@gmail.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            {/* Classes & Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classes <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="classes"
                  value={formData.classes}
                  onChange={handleInputChange}
                  placeholder="2Bac SM-A, 2Bac SM-B, Tronc Commun"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  maxLength={2000}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.classes.length}/2000
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Teacher preview"
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                      {photoFile && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Drag & drop or click to upload
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="subjects"
                value={formData.subjects}
                onChange={handleInputChange}
                placeholder="Arabic, Islamic Education"
                required
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave blank to keep current password
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <Button
              type="button"
              variant="outline"
              className="px-8"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 bg-purple-600 hover:bg-purple-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
