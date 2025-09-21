"use client";

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

const chartData = [
  { name: "Interactive Video", thisWeek: 74, lastWeek: 97 },
  { name: "Quiz", thisWeek: 56, lastWeek: 43 },
  { name: "Course Presentation", thisWeek: 30, lastWeek: 36 },
  { name: "Interactive Book", thisWeek: 39, lastWeek: 47 },
  { name: "Multiple Choice", thisWeek: 20, lastWeek: 29 },
  { name: "Drag & Drop", thisWeek: 81, lastWeek: 66 },
  { name: "Fill in the Blanks", thisWeek: 54, lastWeek: 74 },
  { name: "Single Choice", thisWeek: 54, lastWeek: 74 },
  { name: "Image Hotspot", thisWeek: 39, lastWeek: 48 },
  { name: "True / False", thisWeek: 74, lastWeek: 97 },
];

export default function AdminReportsPage() {
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
                    <span className="text-3xl font-bold text-gray-900">32</span>
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
                      Quiz
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
              <ContentChart />
            </div>
          </div>
        </div>

        {/* Right Side - Export Button and Teacher List */}
        <div className="space-y-6">
          {/* Export Button */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer">
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
              {[
                { name: "Amina Bensalah", count: "12", medal: "🥇" },
                { name: "Yassine Bouzid", count: "9", medal: "🥈" },
                { name: "Fatima Belkacem", count: "7", medal: "🥉" },
                { name: "Soufiane Bakkali", count: "6", rank: "4" },
                { name: "Laila Benchekroun", count: "4", rank: "5" },
              ].map((teacher, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {teacher.medal || teacher.rank}
                    </span>
                    <span className="text-gray-700">{teacher.name}</span>
                  </div>
                  <span className="text-gray-500">{teacher.count}</span>
                </div>
              ))}
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