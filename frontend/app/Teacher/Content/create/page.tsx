"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreateContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    type: 'Lesson',
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user from localStorage or session
      const currentUser = localStorage.getItem('currentUser');
      const user = currentUser ? JSON.parse(currentUser) : null;

      if (!user || !user.id) {
        toast.error('User not authenticated. Please log in again.');
        router.push('/');
        return;
      }

      const submitData = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags' && typeof value === 'string') {
          submitData.append(key, JSON.stringify(value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)));
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Add createdBy field
      submitData.append('createdBy', user.id);

      // Add files
      files.forEach((file, index) => {
        submitData.append('files', file);
      });

      const response = await fetch('http://localhost:4000/api/contents', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create content');
      }

      toast.success('Content created successfully');
      router.push('/Teacher/Content');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create content');
      console.error('Error creating content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/Teacher/Content">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Content</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter content title"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter content description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas (e.g., math, quiz, interactive)"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Content Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Lesson">Lesson</option>
                <option value="Quiz">Quiz</option>
                <option value="Assignment">Assignment</option>
                <option value="Project">Project</option>
                <option value="Worksheet">Worksheet</option>
                <option value="Summary">Summary</option>
                <option value="Schema">Schema</option>
                <option value="Course Outline">Course Outline</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                Files
              </label>
              <Input
                id="files"
                name="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select multiple files to upload with this content
              </p>
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  <ul className="text-sm text-gray-600">
                    {files.map((file, index) => (
                      <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <Link href="/Teacher/Content">
              <Button type="button" variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Content'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
