"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

interface ContentTimelineStats {
  chartData: Array<{
    name: string;
    value: number;
  }>;
  period: string;
}

interface ContentChartProps {
  period?: string;
}

function ContentChart({ period = "year" }: ContentChartProps) {
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentTimeline();
  }, [period]);

  const fetchContentTimeline = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/reports/stats/content-timeline?period=${period}`);
      if (response.ok) {
        const data: ContentTimelineStats = await response.json();
        setChartData(data.chartData);
      } else {
        console.error('Failed to fetch content timeline data');
        toast.error('Failed to load content timeline data');
      }
    } catch (error) {
      console.error('Error fetching content timeline:', error);
      toast.error('Failed to load content timeline data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#8884d8', fontSize: 14 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8884d8', fontSize: 14 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            background: '#fff',
            border: '1px solid #eee'
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3B5CFF"
          strokeWidth={4}
          dot={{ r: 6, fill: '#fff', stroke: '#3B5CFF', strokeWidth: 3 }}
          activeDot={{ r: 10, fill: '#fff', stroke: '#3B5CFF', strokeWidth: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ContentChart;
