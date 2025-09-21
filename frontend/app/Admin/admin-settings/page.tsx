"use client";
import { useState } from "react";
import { Check, Edit2 } from "lucide-react";

const LANGUAGES = ["English (Default)", "French", "Arabic"];
const TIMEZONES = ["UTC+01:00 Morocco", "UTC+00:00 GMT", "UTC+02:00 Egypt"];

export default function AdminSettingsPage() {
    const [tab, setTab] = useState<"general" | "account">("general");
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [email, setEmail] = useState("admin@gmail.com");
    const [editingEmail, setEditingEmail] = useState(false);

    return (
        <div className="min-h-screen bg-[#f7f7f7] pl-4 pr-8 py-1">
            <div className="max-w-xl">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            tab === "general"
                                ? "text-blue-700 border-b-2 border-blue-700"
                                : "text-gray-500"
                        }`}
                        onClick={() => setTab("general")}
                    >
                        General
                    </button>
                    <button
                        className={`ml-4 px-4 py-2 text-sm font-medium ${
                            tab === "account"
                                ? "text-blue-700 border-b-2 border-blue-700"
                                : "text-gray-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Language
                            </label>
                            <select className="w-full rounded-md border border-gray-200 py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                {LANGUAGES.map((lang) => (
                                    <option key={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        {/* Timezone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timezone
                            </label>
                            <select className="w-full rounded-md border border-gray-200 py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                {TIMEZONES.map((tz) => (
                                    <option key={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>
                        {/* Theme */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Theme
                            </label>
                            <div className="flex gap-4 mt-2">
                                <button
                                    type="button"
                                    className={`flex items-center px-6 py-2 rounded-md border ${
                                        theme === "light"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-200 bg-white text-gray-700"
                                    }`}
                                    onClick={() => setTheme("light")}
                                >
                                    <span className="mr-2">Light</span>
                                    <span
                                        className={`w-4 h-4 rounded-full border-2 ${
                                            theme === "light"
                                                ? "border-blue-600 bg-blue-600"
                                                : "border-gray-300"
                                        } inline-block`}
                                    ></span>
                                </button>
                                <button
                                    type="button"
                                    className={`flex items-center px-6 py-2 rounded-md border ${
                                        theme === "dark"
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-200 bg-white text-gray-700"
                                    }`}
                                    onClick={() => setTheme("dark")}
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
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full rounded-md border border-gray-200 py-2 px-3 bg-white text-gray-700 pr-10"
                                    value={email}
                                    disabled={!editingEmail}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600"
                                    onClick={() => setEditingEmail((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {editingEmail ? <Check size={18} /> : <Edit2 size={18} />}
                                </button>
                            </div>
                        </div>
                        {/* Change Password */}
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">
                                Change password
                            </label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Old Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Placeholder"
                                        className="w-full rounded-md border border-gray-200 py-2 px-3 bg-white text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Input your new password"
                                        className="w-full rounded-md border border-gray-200 py-2 px-3 bg-white text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Retype New Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Input again your new password"
                                        className="w-full rounded-md border border-gray-200 py-2 px-3 bg-white text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}