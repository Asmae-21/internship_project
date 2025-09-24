"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, getAuthHeaders } from "@/lib/api-config";

interface Lesson {
  title: string;
  type: string;
  createdAt: string;
}

interface RecentLessonsProps {
  lessons: Lesson[];
}

export const RecentLessons: React.FC<RecentLessonsProps> = ({ lessons }) => {
  const [recentLessons, setRecentLessons] = useState<Lesson[]>(lessons);
  const router = useRouter();

  useEffect(() => {
    const fetchRecentLessons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await fetch(getApiUrl(`contents/teacher/${userId}/recent`), {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          const formattedLessons = data.map((lesson: any) => ({
            title: lesson.title,
            type: lesson.type,
            createdAt: new Date(lesson.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }));
          setRecentLessons(formattedLessons);
        }
      } catch (error) {
        console.error('Error fetching recent lessons:', error);
      }
    };

    fetchRecentLessons();
  }, []);

  const handleSeeAll = () => {
    router.push('/Teacher/Content');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-800">Recent Lessons</span>
        <button
          onClick={handleSeeAll}
          className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
        >
          See All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b">
              <th className="py-2 pr-6">Title</th>
              <th className="py-2 pr-6">Type</th>
              <th className="py-2 pr-6">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentLessons.map((lesson, idx) => (
              <tr key={lesson.title + idx} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 pr-6 font-semibold text-gray-900 whitespace-nowrap">{lesson.title}</td>
                <td className="py-3 pr-6 text-gray-700 whitespace-nowrap">{lesson.type}</td>
                <td className="py-3 pr-6 text-gray-700 whitespace-nowrap">{lesson.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
