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
  content?: string;
  type?: string;
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={log._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                  {log.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {log.content ? `"${log.content}"` : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {log.type || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                  {new Date(log.timestamp).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
