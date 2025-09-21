"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Content {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  files: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    isActive: true,
  });
  const [files, setFiles] = useState<File[]>([]);

  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) {
        router.push('/Teacher/Content');
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/contents/${contentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);

        // Populate form data
        setFormData({
          title: data.title,
          description: data.description,
          tags: data.tags.join(', '),
          isActive: data.isActive,
        });
      } catch (err) {
        toast.error('Failed to fetch content');
        console.error('Error fetching content:', err);
        router.push('/Teacher/Content');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchContent();
  }, [contentId, router]);

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
    if (!contentId) return;

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

      const response = await fetch(`http://localhost:4000/api/contents/${contentId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update content');
      }

      toast.success('Content updated successfully');
      router.push('/Teacher/Content');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update content');
      console.error('Error updating content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 mb-4">Content not found</div>
        <Link href="/Teacher/Content">
          <Button>Back to Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/Teacher/Content">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
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

            {/* Status */}
            <div>
              <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive.toString()}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.value === 'true'
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                Files (Optional - leave empty to keep existing files)
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
                Select new files to replace existing ones, or leave empty to keep current files
              </p>
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">New files to upload:</p>
                  <ul className="text-sm text-gray-600">
                    {files.map((file, index) => (
                      <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Current files:</p>
                  <ul className="text-sm text-gray-600">
                    {content.files.map((file, index) => (
                      <li key={index}>• {file}</li>
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
              {loading ? 'Updating...' : 'Update Content'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
