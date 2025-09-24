"use client";
import React, { useState, useEffect } from "react";
import { WelcomeBanner } from "../_Components/dashboard/WelcomeBanner";
import { StatsCards } from "../_Components/dashboard/StatsCards";
import { ContentShortcuts } from "../_Components/dashboard/ContentShortcuts";
import { RecentLessons } from "../_Components/dashboard/RecentLessons";
import { getApiUrl, getAuthHeaders } from "@/lib/api-config";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    myContent: 0,
  });

  const [lessons, setLessons] = useState([
    {
      title: "Loading...",
      type: "Loading...",
      createdAt: "Loading...",
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        // Fetch content count
        const countResponse = await fetch(getApiUrl(`contents/teacher/${userId}/count`), {
          headers: getAuthHeaders(),
        });
        if (countResponse.ok) {
          const countData = await countResponse.json();
          setStats({ myContent: countData.count });
        }

        // Fetch recent lessons
        const lessonsResponse = await fetch(getApiUrl(`contents/teacher/${userId}/recent`), {
          headers: getAuthHeaders(),
        });
        if (lessonsResponse.ok) {
          const lessonsData = await lessonsResponse.json();
          const formattedLessons = lessonsData.map((lesson: any) => ({
            title: lesson.title,
            type: lesson.type,
            createdAt: new Date(lesson.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }));
          setLessons(formattedLessons);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <WelcomeBanner />
        <StatsCards stats={stats} />
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full">
            <RecentLessons lessons={lessons} />
          </div>
        </div>
      </div>
    </div>
  );
}
