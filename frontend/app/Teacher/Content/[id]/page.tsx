"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Download, Eye } from "lucide-react";
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

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/contents/${contentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const handleDeleteContent = async () => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/contents/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      toast.success('Content deleted successfully');
      router.push('/Teacher/Content');
    } catch (err) {
      toast.error('Failed to delete content');
      console.error('Error deleting content:', err);
    }
  };

  const handleDownloadFile = (fileName: string) => {
    // Create a link to download the file
    const link = document.createElement('a');
    // Check if fileName already contains the full path
    const fileUrl = fileName.startsWith('/uploads/content/')
      ? `http://localhost:4000${fileName}`
      : `http://localhost:4000/uploads/content/${fileName}`;
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (fileName: string) => {
    // Open file in new tab for viewing
    const fileUrl = fileName.startsWith('/uploads/content/')
      ? `http://localhost:4000${fileName}`
      : `http://localhost:4000/uploads/content/${fileName}`;
    window.open(fileUrl, '_blank');
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Link href="/Teacher/Content">
          <Button>Back to Content</Button>
        </Link>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-600 mb-4">Content not found</div>
        <Link href="/Teacher/Content">
          <Button>Back to Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/Teacher/Content">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Content Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/Teacher/Content/edit?id=${content._id}`}>
            <Button variant="outline" className="text-blue-600 hover:text-blue-800">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-800"
            onClick={handleDeleteContent}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h2>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                content.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {content.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Content Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">
                {content.description || 'No description provided'}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
              {content.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tags assigned</p>
              )}
            </div>

            {/* Owner Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Owner Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">
                  {content.createdBy.firstName} {content.createdBy.lastName}
                </p>
                <p className="text-gray-600">{content.createdBy.email}</p>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Created:</span>
                  <p className="text-gray-900">
                    {new Date(content.createdAt).toLocaleDateString()} at{' '}
                    {new Date(content.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                  <p className="text-gray-900">
                    {new Date(content.updatedAt).toLocaleDateString()} at{' '}
                    {new Date(content.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          {content && content.files && content.files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attached Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.files.map((file, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getFileIcon(file)}</span>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {file}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFile(file)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <Link href={`/Teacher/Content/edit?id=${content._id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
