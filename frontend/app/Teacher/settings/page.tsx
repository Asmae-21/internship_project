"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import toast from "react-hot-toast";

const LANGUAGES = ["English (Default)", "French", "Arabic"];
const TIMEZONES = ["UTC+01:00 Morocco", "UTC+00:00 GMT", "UTC+02:00 Egypt"];

export default function TeacherSettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState("English (Default)");
    const [selectedTimezone, setSelectedTimezone] = useState("UTC+01:00 Morocco");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Here you would typically save to backend
            toast.success("Settings saved successfully!");
        } catch (error) {
            toast.error("Failed to save settings");
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0f172a] pl-4 pr-8 py-1">
            <div className="max-w-xl w-full">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">General Settings</h1>

                {/* Settings Form */}
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Language */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Language
                        </label>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang} className="dark:bg-gray-800">{lang}</option>
                            ))}
                        </select>
                    </div>
                    {/* Timezone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Timezone
                        </label>
                        <select
                            value={selectedTimezone}
                            onChange={(e) => setSelectedTimezone(e.target.value)}
                            className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600"
                        >
                            {TIMEZONES.map((tz) => (
                                <option key={tz} className="dark:bg-gray-800">{tz}</option>
                            ))}
                        </select>
                    </div>
                    {/* Theme */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Theme
                        </label>
                        <div className="flex gap-4 mt-2">
                            <button
                                type="button"
                                className={`flex items-center px-6 py-2 rounded-md border ${
                                    theme === "light"
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-300"
                                }`}
                                onClick={() => theme === 'dark' && toggleTheme()}
                            >
                                <span className="mr-2">Light</span>
                                <span
                                    className={`w-4 h-4 rounded-full border-2 ${
                                        theme === "light"
                                            ? "border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400"
                                            : "border-gray-300 dark:border-gray-600"
                                    } inline-block`}
                                ></span>
                            </button>
                            <button
                                type="button"
                                className={`flex items-center px-6 py-2 rounded-md border ${
                                    theme === "dark"
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-300"
                                }`}
                                onClick={() => theme === 'light' && toggleTheme()}
                            >
                                <span className="mr-2">Dark</span>
                                <span
                                    className={`w-4 h-4 rounded-full border-2 ${
                                        theme === "dark"
                                            ? "border-blue-600 bg-blue-600"
                                            : "border-gray-300 dark:border-gray-600"
                                        } inline-block`}
                                ></span>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
