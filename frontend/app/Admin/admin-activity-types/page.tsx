"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ContentType {
  id: string;
  name: string;
  description: string;
  usedIn: number;
  isEnabled: boolean;
}

const contentTypeDescriptions: Record<string, string> = {
  'Lesson': 'Educational content designed to teach specific topics or skills.',
  'Quiz': 'Interactive assessments to test knowledge and understanding.',
  'Assignment': 'Tasks assigned to learners for completion and submission.',
  'Project': 'Comprehensive work requiring planning, execution, and presentation.',
  'Worksheet': 'Practice exercises and activities for skill development.',
  'Summary': 'Condensed overviews of key information and concepts.',
  'Schema': 'Structured frameworks or outlines for organizing information.',
  'Course Outline': 'High-level overview of course structure and objectives.'
};

export default function ActivityTypesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypesList, setContentTypesList] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content type statistics from backend
  useEffect(() => {
    async function fetchContentTypeStats() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/contents/stats/types", {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch content type statistics");
        }

        const data = await response.json();

        // Transform the data to match our interface
        const contentTypes: ContentType[] = data.map((item: any, index: number) => ({
          id: index.toString(),
          name: item._id,
          description: contentTypeDescriptions[item._id] || `Content of type ${item._id}`,
          usedIn: item.count,
          isEnabled: true // Default to enabled, you can modify this logic based on your needs
        }));

        setContentTypesList(contentTypes);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchContentTypeStats();
  }, []);

  const filteredContentTypes = contentTypesList.filter(contentType =>
    (contentType.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (contentType.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const toggleContentType = (id: string) => {
    setContentTypesList(prev =>
      prev.map(contentType =>
        contentType.id === id
          ? { ...contentType, isEnabled: !contentType.isEnabled }
          : contentType
      )
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading content types...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search content types"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content Types Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Content Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Used in
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Toggle
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContentTypes.map((contentType) => (
                <tr key={contentType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{contentType.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-extralight text-gray-400 max-w-md">{contentType.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {contentType.usedIn} Content
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleContentType(contentType.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        contentType.isEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          contentType.isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredContentTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 font-light">No content types found matching your search.</p>
        </div>
      )}
    </div>
  );
} 