"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Clock, MoreHorizontal, UserX, Key, Trash2, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 
// Define the User interface to match the API structure
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone: string;
  classes: string;
  subjects: string;
  role: string;
  photo: string;
  isActive: boolean;
}

// Mock activity data
const activities = [
  {
    id: 1,
    action: "created new content: 'Water Cycle'",
    date: "2 March 2021, 13:45 PM",
  },
  {
    id: 2,
    action: "shared 'Science Lab Safety' with Mr. Khalid",
    date: "2 March 2021, 13:45 PM",
  },
  {
    id: 3,
    action: "edited the lesson 'Algebra Basics: Part 1'",
    date: "2 March 2021, 13:45 PM",
  },
  {
    id: 4,
    action: "created new content 'Functions'",
    date: "2 March 2021, 13:45 PM",
  },
];

// Mock content data
const contentItems = [
  {
    id: 1,
    title: "Photosynthesis Quiz",
    lastUpdated: "2 Days Ago",
    type: "Quiz",
    access: "Private",
    accessColor: "bg-purple-100 text-purple-800",
  },
  {
    id: 2,
    title: "Intro To Fractions",
    lastUpdated: "June 25, 2025",
    type: "Course Presentation",
    access: "Shared",
    accessColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    title: "French Vocabulary Cards",
    lastUpdated: "June 18, 2025",
    type: "Dialog Cards",
    access: "Shared",
    accessColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    title: "Fractions",
    lastUpdated: "May 27, 2025",
    type: "Interactive Book",
    access: "Private",
    accessColor: "bg-purple-100 text-purple-800",
  },
];

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/${userId}`);
        
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user');
          } else {
            const errorText = await response.text();
            console.error('Server returned non-JSON response:', errorText);
            throw new Error('Server error: The server is not responding properly.');
          }
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  }

  if (!user) {
    return <div className="text-red-500 p-4 bg-red-50 rounded-lg">User not found</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* User Profile Banner */}
      <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-orange-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-4 right-8 w-16 h-16 bg-yellow-400 rounded-full opacity-20"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center text-2xl font-bold text-purple-700">
            {user.photo ? (
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={`http://localhost:4000${user.photo}`}
                alt={getDisplayName(user)}
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-700">
                {getInitials(user)}
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{getDisplayName(user)}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-white/90">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 sm:ml-4">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-yellow-600">
                <UserX className="w-4 h-4" />
                {user.isActive ? "Suspend" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-blue-600">
                <Key className="w-4 h-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {contentItems.length} {/* Using mock content count for now */}
          </div>
          <div className="text-sm text-gray-500">Content</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-900">
            {user.subjects ? user.subjects : "No subjects"}
          </div>
          <div className="text-sm text-gray-500">Subjects</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-900">
            {user.classes ? user.classes : "No classes"}
          </div>
          <div className="text-sm text-gray-500">Classes</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                  {index < activities.length - 1 && (
                    <div className="absolute top-3 left-1.5 w-px h-8 bg-gray-200"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{getDisplayName(user)}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Content</h2>
          <div className="space-y-4">
            {contentItems.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.accessColor}`}>
                    {item.access}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>{item.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
