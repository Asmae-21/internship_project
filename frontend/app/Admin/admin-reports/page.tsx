"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Download, Medal, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import ContentChart from "../_Components/ContentChart";
import toast from "react-hot-toast";

interface ContentStats {
  contentThisPeriod: number;
  mostUsedContentType: string;
  mostUsedContentTypeCount: number;
  period: string;
}

interface TeacherStats {
  teachers: Array<{
    rank: number;
    name: string;
    email: string;
    activityCount: number;
    medal: string;
  }>;
  period: string;
}

interface ContentTypeStats {
  chartData: Array<{
    name: string;
    thisWeek: number;
    lastWeek: number;
  }>;
  period: string;
}

export default function AdminReportsPage() {
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null);
  const [contentTypeStats, setContentTypeStats] = useState<ContentTypeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  useEffect(() => {
    fetchAllStats();
  }, [selectedPeriod]);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      // Fetch content statistics
      const contentResponse = await fetch(`http://localhost:4000/api/reports/stats/content?period=${selectedPeriod}`);
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setContentStats(contentData);
      }

      // Fetch teacher statistics
      const teacherResponse = await fetch(`http://localhost:4000/api/reports/stats/teachers?period=${selectedPeriod}`);
      if (teacherResponse.ok) {
        const teacherData = await teacherResponse.json();
        setTeacherStats(teacherData);
      }

      // Fetch content type statistics
      const contentTypeResponse = await fetch(`http://localhost:4000/api/reports/stats/content-types?period=${selectedPeriod}`);
      if (contentTypeResponse.ok) {
        const contentTypeData = await contentTypeResponse.json();
        setContentTypeStats(contentTypeData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/reports/export/all');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'admin_data_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const chartData = contentTypeStats?.chartData || [];
  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Top Section - Left and Right Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Cards and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content This Week Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-1 h-8 bg-purple-600 rounded-full mr-3"></div>
                    <h3 className="text-gray-700 font-medium">
                      Content This Week
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : contentStats?.contentThisPeriod || 0}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 rounded-full p-1">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-500 text-sm">+5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Used Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-1 h-8 bg-purple-600 rounded-full mr-3"></div>
                    <div>
                      <h3 className="text-gray-700 font-medium">
                        Most Used Content
                      </h3>
                      <p className="text-gray-500 text-sm">Type this month</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : contentStats?.mostUsedContentType || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Created Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-700">
                Content Created
              </h3>
              <div className="flex items-center gap-2">
                <select 
                  className="text-sm text-gray-500 border border-gray-200 rounded px-2 py-1"
                  defaultValue="This Year"
                >
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            <div className="h-80">
              <ContentChart period={selectedPeriod} />
            </div>
          </div>
        </div>

        {/* Right Side - Export Button and Teacher List */}
        <div className="space-y-6">
          {/* Export Button */}
          <Button
            onClick={handleExportCSV}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export All Data (CSV)
          </Button>

          {/* Top 5 Most Active Teachers Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 pb-[178px] pt-6">
            <div className="flex flex-col items-center justify-between mb-4 space-y-1">
              <div className="big">
                <h3 className="text-lg font-bold text-gray-700">
                  Top 5 Most Active Teachers
                </h3>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span>This Month</span>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-500 py-4">Loading teachers...</div>
              ) : teacherStats?.teachers && teacherStats.teachers.length > 0 ? (
                teacherStats.teachers.map((teacher) => (
                  <div
                    key={teacher.email}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{teacher.medal}</span>
                      <span className="text-gray-700">{teacher.name}</span>
                    </div>
                    <span className="text-gray-500">{teacher.activityCount}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>No teacher activity data available</p>
                  <p className="text-sm mt-2">Teachers will appear here once they start creating content and performing actions in the system.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Content Type Usage Chart */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
        `,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-700">
            Content Type Usage
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
              <span className="text-xs text-gray-500">This Week 1.245</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-xs text-gray-500">Last Week 1.356</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            barSize={28}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 14,
                background: "#fff",
                border: "1px solid #eee",
                fontSize: 18,
                padding: "14px 18px",
                minWidth: 140,
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              height={36}
              formatter={(value) => {
                if (value === "thisWeek")
                  return (
                    <span style={{ color: "#8B5CF6", fontWeight: 600 }}>
                      This Week 1.245
                    </span>
                  );
                if (value === "lastWeek")
                  return (
                    <span style={{ color: "#C4B5FD", fontWeight: 600 }}>
                      Last Week 1.356
                    </span>
                  );
                return value;
              }}
            />
            <Bar
              dataKey="thisWeek"
              fill="#8B5CF6"
              radius={[6, 6, 0, 0]}
              animationDuration={900}
            >
              <LabelList
                dataKey="thisWeek"
                position="top"
                fill="#8B5CF6"
                fontSize={12}
                formatter={(v) => (v === 47 ? v : "")}
              />
            </Bar>
            <Bar
              dataKey="lastWeek"
              fill="#C4B5FD"
              radius={[6, 6, 0, 0]}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}