"use client";

import React, { useEffect, useState } from "react";

interface Log {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("http://localhost:4000/api/logs", { credentials: 'include' });
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data: Log[] = await response.json();
        setLogs(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading logs...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans w-full px-4 py-0">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full h-full">
        <table className="min-w-full w-full table-fixed">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-5 text-sm font-medium text-gray-700 tracking-wide text-center">
                Teacher
              </th>
              <th className="px-6 py-5 text-sm font-medium text-gray-700 tracking-wide text-center">
                Activity
              </th>
              <th className="px-6 py-5 text-sm font-medium text-gray-700 tracking-wide text-center">
                Content
              </th>
              <th className="px-6 py-5 text-sm font-medium text-gray-700 tracking-wide text-center">
                Type
              </th>
              <th className="px-6 py-5 text-sm font-medium text-gray-700 tracking-wide text-center">
                Timestamp
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {logs.map((log, index) => (
              <tr
                key={log._id || index}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <td className="px-6 py-5 whitespace-nowrap text-center text-gray-900 font-medium">
                  {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-blue-600 font-medium">
                  {log.action}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-gray-700 opacity-80">
                  {log.ipAddress || 'N/A'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-gray-600">
                  {log.userAgent || 'N/A'}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center text-blue-600 font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
