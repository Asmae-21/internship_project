"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Eye, X, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Add this for backward compatibility
  email: string;
  phone: string;
  classes: string;
  subjects: string;
  role: string;
  photo: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    subject: true,
    class: false,
    contentCreated: true,
    sortBy: true,
  });
  
  const [filters, setFilters] = useState({
    status: {
      all: true,
      active: false,
      blocked: false,
    },
    subject: [] as string[],
    class: [] as string[],
    contentCreated: {
      all: true,
      hasContent: false,
      noContent: false,
    },
    sortBy: "titleAZ",
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/users');
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch users');
          } else {
            const errorText = await response.text();
            console.error('Server returned non-JSON response:', errorText);
            throw new Error('Server error: The server is not responding properly. Please check if the backend server is running.');
          }
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Helper function to get display name safely
  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
      return user.name;
    } else {
      return 'Unknown User';
    }
  };

  // Helper function to get initials safely
  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    } else if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      } else {
        return user.name.charAt(0);
      }
    } else {
      return 'U';
    }
  };

  // Get unique subjects and classes for filters
  const uniqueSubjects = Array.from(new Set(users.flatMap(user => 
    user.subjects ? user.subjects.split(',').map(s => s.trim()) : []
  )));
  
  const uniqueClasses = Array.from(new Set(users.flatMap(user => 
    user.classes ? user.classes.split(',').map(c => c.trim()) : []
  )));

  const filteredUsers = users.filter(user => {
    const displayName = getDisplayName(user).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    const matchesSearch = displayName.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.subjects && user.subjects.toLowerCase().includes(searchLower));
    
    // Status filter
    let matchesStatus = true;
    if (!filters.status.all) {
      if (filters.status.active && user.isActive) matchesStatus = true;
      else if (filters.status.blocked && !user.isActive) matchesStatus = true;
      else if (!filters.status.active && !filters.status.blocked) matchesStatus = false;
    }
    
    // Subject filter
    const matchesSubject = filters.subject.length === 0 || 
      (user.subjects && filters.subject.some(subject => 
        user.subjects!.toLowerCase().includes(subject.toLowerCase())
      ));
    
    // Class filter
    const matchesClass = filters.class.length === 0 || 
      (user.classes && filters.class.some(cls => 
        user.classes!.toLowerCase().includes(cls.toLowerCase())
      ));
    
    // Content created filter (simplified - you can enhance this based on your data)
    const matchesContent = filters.contentCreated.all || 
      (filters.contentCreated.hasContent && user.subjects) ||
      (filters.contentCreated.noContent && !user.subjects);
    
    return matchesSearch && matchesStatus && matchesSubject && matchesClass && matchesContent;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "titleAZ":
        return getDisplayName(a).localeCompare(getDisplayName(b));
      case "lastLogin":
        // You might need to add lastLogin field to your User interface
        return 0; // Placeholder
      case "content":
        return (b.subjects || '').localeCompare(a.subjects || '');
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete user');
        } else {
          const errorText = await response.text();
          console.error('Server returned non-JSON response:', errorText);
          throw new Error('Server error: The server is not responding properly. Please check if the backend server is running.');
        }
      }
      
      setUsers(users.filter(user => user._id !== userId));
      toast.error('User deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred while deleting the user');
      console.error('Error deleting user:', err);
    }
  };

  const handleFilterChange = (filterType: string, key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...(prev[filterType as keyof typeof prev] as Record<string, any>),
        [key]: value
      }
    }));
  };

  const handleArrayFilterChange = (filterType: string, item: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...(prev[filterType as keyof typeof prev] as string[]), item]
        : (prev[filterType as keyof typeof prev] as string[]).filter(i => i !== item)
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">ADMIN • USERS</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            Filters
          </Button>
          <Link href="/Admin/admin-users/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content with Filters and Table */}
      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-4 w-full lg:w-64 absolute lg:relative z-10 right-0 top-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => toggleSection('status')}
              >
                <span className="text-xs font-medium text-gray-900">Status</span>
                {expandedSections.status ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              {expandedSections.status && (
                <div className="space-y-1 pl-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={filters.status.all} 
                      onChange={e => handleFilterChange('status', 'all', e.target.checked)} 
                    />
                    All
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={filters.status.active} 
                      onChange={e => handleFilterChange('status', 'active', e.target.checked)} 
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={filters.status.blocked} 
                      onChange={e => handleFilterChange('status', 'blocked', e.target.checked)} 
                    />
                    Blocked
                  </label>
                </div>
              )}
            </div>

            {/* Subject Filter */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => toggleSection('subject')}
              >
                <span className="text-xs font-medium text-gray-900">Subject</span>
                {expandedSections.subject ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              {expandedSections.subject && (
                <div className="space-y-1 pl-2 max-h-32 overflow-y-auto">
                  {uniqueSubjects.slice(0, 3).map((subject, index) => (
                    <label key={index} className="flex items-center gap-2 text-xs">
                      <input 
                        type="checkbox" 
                        checked={filters.subject.includes(subject)} 
                        onChange={e => handleArrayFilterChange('subject', subject, e.target.checked)} 
                      />
                      {subject}
                    </label>
                  ))}
                  {uniqueSubjects.length > 3 && (
                    <button className="text-xs text-blue-600 hover:underline">+ View More</button>
                  )}
                </div>
              )}
            </div>

            {/* Class Filter */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => toggleSection('class')}
              >
                <span className="text-xs font-medium text-gray-900">Class</span>
                {expandedSections.class ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              {expandedSections.class && (
                <div className="space-y-1 pl-2 max-h-32 overflow-y-auto">
                  {uniqueClasses.map((cls, index) => (
                    <label key={index} className="flex items-center gap-2 text-xs">
                      <input 
                        type="checkbox" 
                        checked={filters.class.includes(cls)} 
                        onChange={e => handleArrayFilterChange('class', cls, e.target.checked)} 
                      />
                      {cls}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Content Created Filter */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => toggleSection('contentCreated')}
              >
                <span className="text-xs font-medium text-gray-900">Content Created</span>
                {expandedSections.contentCreated ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              {expandedSections.contentCreated && (
                <div className="space-y-1 pl-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={filters.contentCreated.all} 
                      onChange={e => handleFilterChange('contentCreated', 'all', e.target.checked)} 
                    />
                    All
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={filters.contentCreated.hasContent} 
                      onChange={e => handleFilterChange('contentCreated', 'hasContent', e.target.checked)} 
                    />
                    Has Content
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={filters.contentCreated.noContent} 
                      onChange={e => handleFilterChange('contentCreated', 'noContent', e.target.checked)} 
                    />
                    No Content
                  </label>
                </div>
              )}
            </div>

            {/* Sort By Filter */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => toggleSection('sortBy')}
              >
                <span className="text-xs font-medium text-gray-900">Sort By</span>
                {expandedSections.sortBy ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
              {expandedSections.sortBy && (
                <div className="space-y-1 pl-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="radio" 
                      name="sortBy" 
                      value="titleAZ" 
                      checked={filters.sortBy === "titleAZ"} 
                      onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} 
                    />
                    Title A-Z
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="radio" 
                      name="sortBy" 
                      value="lastLogin" 
                      checked={filters.sortBy === "lastLogin"} 
                      onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} 
                    />
                    Last Login
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="radio" 
                      name="sortBy" 
                      value="content" 
                      checked={filters.sortBy === "content"} 
                      onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} 
                    />
                    Content
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-10">Loading users...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subjects
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.photo ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={`http://localhost:4000${user.photo}`}
                                    alt={getDisplayName(user)}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                                    {getInitials(user)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getDisplayName(user)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">#{user._id.slice(-9)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {user.subjects ? user.subjects.split(',').slice(0, 2).map((subject, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {subject.trim()}
                                </span>
                              )) : <span className="text-sm text-gray-500">N/A</span>}
                              {user.subjects && user.subjects.split(',').length > 2 && (
                                <span className="text-xs text-gray-500">+{user.subjects.split(',').length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.classes || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">2 March 2021, 13:45 PM</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Link href={`/Admin/admin-users/${user._id}`}>
                                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/Admin/admin-users/edit?id=${user._id}`}>
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredUsers.length > usersPerPage && (
                <div className="flex justify-center items-center space-x-2 mt-4 p-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} from {filteredUsers.length} data
                  </span>
                  <button
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
