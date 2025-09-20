"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Clock, MoreHorizontal, UserX, Key, Trash2 } from "lucide-react";
import { users } from "../../../../lib/user-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 
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

  // Find the user data based on the ID
  const userData = users.find((user: any) => user.id.toString() === userId) || users[0];

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
            {userData.avatar}
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <Mail className="w-4 h-4" />
              <span>{userData.email}</span>
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
                Suspend
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
          <div className="text-2xl font-bold text-gray-900">{userData.content}</div>
          <div className="text-sm text-gray-500">Content</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-900">{userData.subjects.join(" / ")}</div>
          <div className="text-sm text-gray-500">Subjects</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm font-medium text-gray-900">{userData.classes.join(", ")}</div>
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
                    <span className="font-medium">{userData.name}</span> {activity.action}
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
