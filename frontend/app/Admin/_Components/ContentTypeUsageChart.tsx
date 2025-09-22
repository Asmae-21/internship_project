"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface ContentTypeData {
  name: string;
  thisWeek: number;
  lastWeek: number;
}

export function ContentTypeUsageChart() {
  const [data, setData] = useState<ContentTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContentTypeStats() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/contents/stats/types", {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch content type statistics");
        }

        const rawData = await response.json();

        // Transform the data to match our chart format
        const chartData: ContentTypeData[] = rawData
          .sort((a: any, b: any) => b.count - a.count) // Sort by usage count
          .slice(0, 7) // Take top 7 most used types
          .map((item: any) => ({
            name: item._id,
            thisWeek: item.count,
            // For lastWeek, we'll use a random percentage of this week's count
            // In a real app, you'd get this from historical data
            lastWeek: Math.floor(item.count * (0.7 + Math.random() * 0.6))
          }));

        setData(chartData);
      } catch (err) {
        console.error('Error fetching content type stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchContentTypeStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} barSize={28} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6B7280', fontSize: 13 }} 
          axisLine={false} 
          tickLine={false}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fill: '#6B7280', fontSize: 13 }} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: 14, 
            background: '#fff', 
            border: '1px solid #eee', 
            fontSize: 18, 
            padding: '14px 18px', 
            minWidth: 140 
          }} 
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle" 
          height={36} 
          formatter={(value) => {
            if (value === 'thisWeek') return <span style={{ color: '#6366F1', fontWeight: 600 }}>This Week</span>;
            if (value === 'lastWeek') return <span style={{ color: '#A5B4FC', fontWeight: 600 }}>Last Week</span>;
            return value;
          }} 
        />
        <Bar 
          dataKey="thisWeek" 
          fill="#6366F1" 
          radius={[6, 6, 0, 0]} 
          animationDuration={900}
        >
          <LabelList 
            dataKey="thisWeek" 
            position="top" 
            fill="#6366F1" 
            fontSize={12} 
            formatter={(v: number) => v} 
          />
        </Bar>
        <Bar 
          dataKey="lastWeek" 
          fill="#A5B4FC" 
          radius={[6, 6, 0, 0]} 
          animationDuration={900} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}