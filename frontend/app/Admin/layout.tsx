"use client";

import { Sidebar } from "./_Components/sidebar";
import { Header } from "./_Components/header";
import { useSidebarState } from "@/hook/use-sidebar-state";
import { cn } from "@/lib/utils";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const { isOpen } = useSidebarState();

    return (
        <div className="min-h-screen flex bg-[#F7F8FA] overflow-auto">
            {/* Sidebar with same background */}
            <Sidebar />

            {/* Main content */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-[margin-left] ease-in-out duration-300",
                    isOpen ? "lg:ml-64" : "lg:ml-[72px]" // Sidebar width
                )}
            >
                {/* Header */}
                <Header />

                {/* Scrollable page content */}
                <main className="flex-1 px-2 md:px-6 py-4 md:py-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
