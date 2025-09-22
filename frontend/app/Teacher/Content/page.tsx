"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search, Eye, ChevronDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeacherContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    owner: false,
    date: true,
    sortBy: true,
  });

  const [filters, setFilters] = useState({
    type: [] as string[],
    owner: [] as string[],
    date: {
      all: true,
      today: false,
      week: false,
      month: false,
    },
    sortBy: "titleAZ",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const contentsPerPage = 5;

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/contents');
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch contents');
          } else {
            const errorText = await response.text();
            console.error('Server returned non-JSON response:', errorText);
            throw new Error('Server error: The server is not responding properly. Please check if the backend server is running.');
          }
        }
        const data = await response.json();
        setContents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching contents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/contents/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      setContents(contents.filter(content => content._id !== contentId));
      toast.success('Content deleted successfully');
    } catch (err) {
      toast.error('Failed to delete content');
      console.error('Error deleting content:', err);
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.createdBy.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.createdBy.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filters.type.length === 0 || filters.type.includes(content.type);

    return matchesSearch && matchesType;
  });

  const sortedContents = [...filteredContents].sort((a, b) => {
    switch (filters.sortBy) {
      case 'titleAZ':
        return a.title.localeCompare(b.title);
      case 'titleZA':
        return b.title.localeCompare(a.title);
      case 'dateNewest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dateOldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastContent = currentPage * contentsPerPage;
  const indexOfFirstContent = indexOfLastContent - contentsPerPage;
  const currentContents = sortedContents.slice(indexOfFirstContent, indexOfLastContent);

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
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
        <Link href="/Teacher/Content/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Search and Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <h4 className="font-medium mb-2">Content Type</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[
                      'Lesson',
                      'Quiz',
                      'Assignment',
                      'Project',
                      'Worksheet',
                      'Summary',
                      'Schema',
                      'Course Outline',
                    ].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => {
                            setFilters((prev) => {
                              const newTypes = prev.type.includes(type)
                                ? prev.type.filter((t) => t !== type)
                                : [...prev.type, type];
                              return { ...prev, type: newTypes };
                            });
                          }}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="font-medium mb-2">Sort By</h4>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="titleAZ">Title A-Z</option>
                    <option value="titleZA">Title Z-A</option>
                    <option value="dateNewest">Date Newest</option>
                    <option value="dateOldest">Date Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contents Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Content Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentContents.map((content) => (
                <tr key={content._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{content.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {content.description}
                      </div>
                      {content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {content.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                          {content.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{content.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {content.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/Teacher/Content/${content._id}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/Teacher/Content/edit?id=${content._id}`}>
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteContent(content._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedContents.length > contentsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-4 p-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstContent + 1}-{Math.min(indexOfLastContent, sortedContents.length)} from {sortedContents.length} contents
            </span>
            <button
              disabled={currentPage === Math.ceil(sortedContents.length / contentsPerPage)}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
