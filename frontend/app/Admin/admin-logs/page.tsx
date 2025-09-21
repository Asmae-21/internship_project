"use client";

const logs = [
  {
    teacher: "Salma Benali",
    activity: "Logged in",
    content: "—",
    type: "—",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Rania Chacul",
    activity: "Created content",
    content: "Grade 5 Quiz – Geography",
    type: "Multiple Choice",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Mehdi El Bahi",
    activity: "Edited content",
    content: "Ecosystems",
    type: "Interactive Video",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Salma Benali",
    activity: "Shared content",
    content: "Animal Sorting Activity",
    type: "Drag and Drop",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Ilham Bahi",
    activity: "Created content",
    content: "Introduction to History ",
    type: "Course Presentation",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Akram Deraoui",
    activity: "Logged in",
    content: "—",
    type: "—",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Salma Benali",
    activity: "Logged in",
    content: "—",
    type: "—",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Rania Chacul",
    activity: "Created content",
    content: "Grade 5 Quiz – Geography",
    type: "Multiple Choice",
    timestamp: "2025-07-28 09:45",
  },
  {
    teacher: "Mehdi El Bahi",
    activity: "Edited content",
    content: "Ecosystems",
    type: "Interactive Video",
    timestamp: "2025-07-28 09:45",
  },
];

export default function AdminLogsPage() {
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
      <tr key={index} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "border-l-4 border-blue-500" : ""}`}>
        <td className="px-6 py-5 whitespace-nowrap text-center text-gray-900 font-medium">{log.teacher}</td>
        <td className="px-6 py-5 whitespace-nowrap text-center text-blue-600 font-medium">{log.activity}</td>
        <td className="px-6 py-5 whitespace-nowrap text-center text-gray-700 opacity-80">{log.content}</td>
        <td className="px-6 py-5 whitespace-nowrap text-center text-gray-600">{log.type}</td>
        <td className="px-6 py-5 whitespace-nowrap text-center text-blue-600 font-medium">{log.timestamp}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
}