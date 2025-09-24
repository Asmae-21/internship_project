"use client";
import React, { useState, useEffect } from "react";
import { getApiUrl, getAuthHeaders } from "@/lib/api-config";

interface StatsCardsProps {
  stats: {
    myContent: number;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const [contentCount, setContentCount] = useState(stats.myContent);

  useEffect(() => {
    const fetchContentCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await fetch(getApiUrl(`contents/teacher/${userId}/count`), {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setContentCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching content count:', error);
      }
    };

    fetchContentCount();
  }, []);

  return (
    <div className="flex gap-8 w-full justify-center">
      {/* My Content (Book with Checkmark Icon) */}
      <div className="flex items-center bg-white rounded-xl shadow-md px-6 py-4 min-w-[180px] max-w-[220px]">
        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-lg mr-4">
          {/* Book with Checkmark Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V2.5C4 1.11929 5.11929 0 6.5 0Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11L11 13L15 9" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <div className="flex-1 flex flex-col">
          <span className="text-sm font-semibold text-gray-700">My Content</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 ml-4">{contentCount}</span>
      </div>
    </div>
  );
};
