"use client";
import { Bell, UserPlus, Star, FileText } from "lucide-react";

const notificationsToday = [
  {
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    title: "New Content Created",
    description: `Salma Bennani just created a new content: "Drag & Drop – Animal Habitats".`,
    time: "5m ago",
  },
  {
    icon: <UserPlus className="w-5 h-5 text-green-500" />,
    title: "New Teacher Account",
    description: "A new teacher account has been added: Hajar Boukhriss.",
    time: "21m ago",
  },
  {
    icon: <Bell className="w-5 h-5 text-gray-400" />,
    title: "No Recent Activity",
    description: "No new content has been created in the last 7 days. Consider checking in with your teaching team.",
    time: "8h ago",
  },
  {
    icon: <Star className="w-5 h-5 text-yellow-500" />,
    title: "New Entry in Top 5 Active Teachers",
    description: "Khadija Berrada is now among the top 5 most active teachers this month.",
    time: "1h ago",
  },
];

const notificationsPast = [
  {
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    title: "New Content Created",
    description: `Youssef Barhouah just created a new content: "Interactive Video – Human Body Systems."`,
    time: "1d ago",
  },
  {
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    title: "New Content Created",
    description: `Ahmad Boulahcen just created a new content: "Multiple Choice – French Grammar."`,
    time: "23w ago",
  },
];

export default function AdminNotificationsPage() {
  return (
    <div className="px-8 py-3">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div className="bg-white rounded-xl shadow p-6">
        {/* Today */}
        <div>
          <div className="text-lg font-semibold text-gray-700 mb-4">Today <span className="text-gray-400 font-normal">({notificationsToday.length})</span></div>
          <div className="flex flex-col gap-4">
            {notificationsToday.map((n, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-md px-4 py-3">
                <div className="flex-shrink-0">{n.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{n.title}</div>
                  <div className="text-gray-600 text-sm">{n.description}</div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Past */}
        <div className="mt-8">
          <div className="text-lg font-semibold text-gray-700 mb-4">Past <span className="text-gray-400 font-normal">({notificationsPast.length})</span></div>
          <div className="flex flex-col gap-4">
            {notificationsPast.map((n, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-md px-4 py-3">
                <div className="flex-shrink-0">{n.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{n.title}</div>
                  <div className="text-gray-600 text-sm">{n.description}</div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
