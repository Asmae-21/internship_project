"use client";
import { Sidebar } from "./_Components/sidebar";
import { Header } from "./_Components/header";
import { useSidebarState } from "@/hook/use-sidebar-state";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen } = useSidebarState();               
  return (
    <div>
      <Sidebar />
      <div
        className={cn(
          "min-h-screen transition-[margin-left] ease-in-out duration-300",
          isOpen ? "lg:ml-64" : "lg:ml-[80px]" // Match sidebar widths.
        )}
      >
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
