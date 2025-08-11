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
    <div className="min-h-screen flex bg-[#F7F8FA]">
      {/* Sidebar à gauche */}
      <Sidebar />
      {/* Contenu principal */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-[margin-left] ease-in-out duration-300",
          isOpen ? "lg:ml-64" : "lg:ml-[72px]" // Largeur du sidebar ouverte/fermée
        )}
      >
        {/* Header en haut */}
        <Header />
        {/* Contenu dynamique */}
        <main className="flex-1 px-2 md:px-6 py-4 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
