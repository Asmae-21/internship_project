"use client";
import { useState } from "react";
import { Check, Edit2 } from "lucide-react";
import { useTheme } from "@/context/theme-context";

const LANGUAGES = ["English (Default)", "French", "Arabic"];
const TIMEZONES = ["UTC+01:00 Morocco", "UTC+00:00 GMT", "UTC+02:00 Egypt"];

export default function AdminSettingsPage() {
    const [tab, setTab] = useState<"general" | "account">("general");
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState("admin@gmail.com");
    const [editingEmail, setEditingEmail] = useState(false);

    return (
        <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#0f172a] pl-4 pr-8 py-1">
            <div className="max-w-xl w-full">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            tab === "general"
                                ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                        onClick={() => setTab("general")}
                    >
                        General
                    </button>
                    <button
                        className={`ml-4 px-4 py-2 text-sm font-medium ${
                            tab === "account"
                                ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400"
                                : "text-gray-500 dark:text-gray-400"
                        }`}
                        onClick={() => setTab("account")}
                    >
                        Account
                    </button>
                </div>

                {/* General Tab */}
                {tab === "general" && (
                    <form className="space-y-6">
                        {/* Language */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Language
                            </label>
                            <select className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600">
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
                            <select className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600">
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
                                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    }`}
                                    onClick={() => theme === 'light' && toggleTheme()}
                                >
                                    <span className="mr-2">Dark</span>
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 ${
                                            theme === "dark"
                                                ? "border-blue-600 bg-blue-600"
                                                : "border-gray-300"
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
                )}

                {/* Account Tab */}
                {tab === "account" && (
                    <form className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 pr-10"
                                    value={email}
                                    disabled={!editingEmail}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
                                    onClick={() => setEditingEmail((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {editingEmail ? <Check size={18} /> : <Edit2 size={18} />}
                                </button>
                            </div>
                        </div>
                        {/* Change Password */}
                        <div>
                            <label className="block text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Change password
                            </label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Old Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Placeholder"
                                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Input your new password"
                                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Retype New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Input again your new password"
                                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}