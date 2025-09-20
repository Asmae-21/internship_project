"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import Link from "next/link";

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classes: "",
    subjects: "",
    password: "",
    confirmPassword: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear password error when user starts typing
    if (name === 'password') {
      setPasswordError("");
    }
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[\W_]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&* etc.)";
    }
    return "";
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Validate password strength
      const passwordValidationError = validatePassword(formData.password);
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        alert(`Password Requirements:\n\n• At least 8 characters\n• At least one uppercase letter (A-Z)\n• At least one lowercase letter (a-z)\n• At least one number (0-9)\n• At least one special character (!@#$%^&* etc.)\n\nCurrent error: ${passwordValidationError}`);
        return;
      }
      
      // Create form data for multipart/form-data (for file upload)
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') { // Don't send confirmPassword to API
          submitData.append(key, value);
        }
      });
      
      // Add photo if exists
      if (photoFile) {
        submitData.append('photo', photoFile);
      }
      
      console.log('Sending request to create user...');
      
      // Send data to API
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        body: submitData,
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.log('Response not ok, status:', response.status);
        
        const contentType = response.headers.get('content-type');
        console.log('Content type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            console.log('Error data:', errorData);
            
            // Check if it's a password validation error from server
            if (errorData.details && errorData.details.includes('password')) {
              alert(`Password Requirements:\n\n• At least 8 characters\n• At least one uppercase letter (A-Z)\n• At least one lowercase letter (a-z)\n• At least one number (0-9)\n• At least one special character (!@#$%^&* etc.)\n\nServer error: ${errorData.details}`);
              return;
            }
            
            throw new Error(errorData.error || errorData.message || 'Failed to create user');
          } catch (jsonError) {
            console.error('Failed to parse JSON error response:', jsonError);
            throw new Error('Server returned invalid JSON response');
          }
        } else {
          const errorText = await response.text();
          console.error('Server returned non-JSON response:', errorText);
          
          let errorMessage = 'Server error: The server is not responding properly.';
          
          if (errorText.includes('Only image files are allowed')) {
            errorMessage = 'Only image files (jpeg, jpg, png, gif) are allowed!';
          } else if (errorText.includes('Error:')) {
            const errorMatch = errorText.match(/Error:([^<]+)/);
            if (errorMatch && errorMatch[1]) {
              errorMessage = errorMatch[1].trim();
            }
          }
          
          throw new Error(errorMessage);
        }
      }
      
      // Success - parse the response
      const responseData = await response.json();
      console.log('Success! Created user:', responseData);
      
      // Success - redirect to users list
      alert('User created successfully!');
      window.location.href = '/Admin/admin-users';
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while creating the user');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* User Details Header */}
        <div className="bg-purple-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold">User Details</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* First Row - First Name & Last Name */}
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
                className="w-full"
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
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Second Row - Email & Phone */}
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
                className="w-full"
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
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Third Row - Classes & Photo */}
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
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                required
              />
              <div className="text-xs text-gray-500 mt-1">0/2000</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="User photo preview"
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Drag and drop or<br />
                      click here to select file
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

          {/* Fourth Row - Subjects */}
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
              className="w-full"
              required
            />
          </div>

          {/* Fifth Row - Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••••••••••••"
                className={`w-full ${passwordError ? 'border-red-500' : ''}`}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                <strong>Password Requirements:</strong><br />
                • At least 8 characters<br />
                • At least one uppercase letter (A-Z)<br />
                • At least one lowercase letter (a-z)<br />
                • At least one number (0-9)<br />
                • At least one special character (!@#$%^&* etc.)
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="•••••••••••••••••••••••"
                className="w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link href="/Admin/admin-users">
            <Button type="button" variant="outline" className="px-8">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="px-8 bg-purple-600 hover:bg-purple-700">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
