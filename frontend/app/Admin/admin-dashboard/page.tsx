"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, FileText, LogIn, Plus, EyeOff, BarChart2, Download } from "lucide-react";
import DashboardChartWrapper from "../../Admin/_Components/DashboardChartWrapper";
import { ContentTypeUsageChart } from "../../Admin/_Components/ContentTypeUsageChart";
import { DashboardBanner } from "../../Admin/_Components/DashboardBanner";
import Link from "next/link";

interface UserData {
  _id: string;
  firstName?: string;  // Make optional
  lastName?: string;   // Make optional
  email: string;
  role: string;
  isActive: boolean;
  subjects: string;
  createdAt: string;
}

interface DashboardStats {
  totalTeachers: number;
  totalContent: number;
  recentLogins: number;
  activeUsers: number;
}

const actions = [
  {
    icon: <Plus className="size-5" />, 
    text: "Add New User",
    href: "/Admin/admin-users/create"
  },
  {
    icon: <EyeOff className="w-5 h-5" />, 
    text: "Enable/Disable Activity Types",
    href: "/Admin/admin-activity-types"
  },
  {
    icon: <BarChart2 className="w-5 h-5" />, 
    text: "Content Audit",
    href: "/Admin/admin-content-audit"
  },
  {
    icon: <Download className="w-5 h-5" />, 
    text: "Download Content Report",
    href: "/Admin/admin-reports"
  },
];

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalContent: 0,
    recentLogins: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users data
        const response = await fetch('http://localhost:4000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users: UserData[] = await response.json();
        
        // Calculate stats
        const totalTeachers = users.filter(user => user.role === 'teacher').length;
        const activeUsers = users.filter(user => user.isActive).length;
        const totalContent = users.filter(user => user.subjects && user.subjects.trim() !== '').length;
        
        // Get recent activity (last 4 users created)
        const recentUsers = users
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);

        setStats({
          totalTeachers,
          totalContent,
          recentLogins: activeUsers,
          activeUsers
        });
        
        setRecentActivity(recentUsers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: <User className="w-6 h-6 text-blue-500" />,
      title: "Total Teachers",
      value: stats.totalTeachers,
      link: "View Users",
      href: "/Admin/admin-users",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: "Total Content",
      value: stats.totalContent,
      link: "View Content",
      href: "/Admin/admin-content-audit",
    },
    {
      icon: <LogIn className="w-6 h-6 text-blue-500" />,
      title: "Active Users",
      value: stats.activeUsers,
      link: "View Logs",
      href: "/Admin/admin-logs",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <DashboardBanner />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md flex items-center px-6 py-4 gap-4 min-w-[200px] animate-pulse">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardBanner />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md flex items-center px-6 py-4 gap-4 min-w-[200px]">
            <div>{stat.icon}</div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-700 mb-1">{stat.title}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <Link href={stat.href} className="text-xs text-blue-500 hover:underline font-medium">{stat.link} &rarr;</Link>
            </div>
          </div>
        ))}
      </div>
      {/* Main Content Row */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[340px] items-stretch">
        {/* Chart Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-8 min-w-0 flex flex-col justify-center h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-gray-800">Content Created</div>
            <select className="bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-600 outline-none border-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <DashboardChartWrapper />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full lg:w-72">
          {actions.map((action, i) => {
            // Create a wrapper component based on the action
            const ButtonWrapper = ({ children }: { children: React.ReactNode }) => {
              if (action.href) {
                return <Link href={action.href}>{children}</Link>;
              }
              return <>{children}</>;
            };
            
            return (
              <ButtonWrapper key={i}>
                <Button className="w-full h-14 text-base font-semibold flex items-center justify-start gap-3 bg-gradient-to-r from-blue-600 to-purple-400 text-white rounded-xl shadow-none hover:from-blue-700 hover:to-purple-500">
                  {action.icon} {action.text} <span className="ml-auto">&raquo;</span>
                </Button>
              </ButtonWrapper>
            );
          })}
        </div>
      </div>
      {/* Bottom Section: Latest Activity & Content Type Usage */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Latest Activity */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-8 min-w-0 mb-4 lg:mb-0">
          <div className="text-xl font-bold text-gray-800 mb-6">Latest Activity</div>
          <div className="flex flex-col gap-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((user, index) => {
                // Safe initials generation
                const initials = user.firstName && user.lastName 
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : user.firstName 
                    ? user.firstName.charAt(0)
                    : user.lastName 
                      ? user.lastName.charAt(0)
                      : 'U';

                // Safe full name generation
                const fullName = user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || user.lastName || 'Unknown User';

                const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                return (
                  <div key={user._id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-blue-500">
                      {initials}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">{fullName}</span> joined the platform
                      <div className="text-xs text-gray-400 mt-1">{createdDate}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent activity
              </div>
            )}
          </div>
        </div>
        {/* Content Type Usage */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-8 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold text-gray-800">Content Type Usage</div>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-blue-600"></span> This Week <span className="font-bold ml-1">1,245</span></span>
              <span className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-indigo-200"></span> Last Week <span className="font-bold ml-1">1,356</span></span>
            </div>
          </div>
          {/* Chart */}
          <div className="h-[300px]">
            <ContentTypeUsageChart />
          </div>
        </div>
      </div>
    </div>
  );
}