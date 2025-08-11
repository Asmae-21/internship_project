"use client" // This component needs client-side interactivity for dropdowns and sheets.

import Link from "next/link" // Next.js Link component.
import { MenuIcon, PanelsTopLeft, LogOut, User, Bell } from "lucide-react" // Icons for menu, brand, and user dropdown.
import { usePathname } from "next/navigation" // Hook to get the current URL path (for mobile menu active state).
import { Button } from "@/components/ui/button" // shadcn/ui Button component.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // shadcn/ui Avatar components.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // shadcn/ui DropdownMenu components.
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet" // shadcn/ui Sheet components.
import { ScrollArea } from "@/components/ui/scroll-area" // shadcn/ui ScrollArea for mobile menu.
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // shadcn/ui Tooltip components.
import { getMenuList } from "@/lib/admin-menu-item" // Our menu data (for mobile menu).

export function Header() {
  const pathname = usePathname(); // Get current path
  const menuItems = getMenuList(); // Get menu items

  // Find the menu item that matches the current path
  let title = "Dashboard";
  if (pathname === "/settings") title = "Settings";
  else if (pathname === "/logout") title = "Logout";
  else {
    const currentMenu = menuItems.find((item) => item.href === pathname);
    if (currentMenu) title = currentMenu.label;
  }

  // User name (replace with real user data if available)
  const userName = "Ahmed";
  // SSR-safe date string
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase();

  return (
    <header className="w-full">
      {/* Minimal Top Bar */}
      <div className="flex h-16 items-center px-8 justify-between bg-white border-b border-gray-100">
        {/* Left: Title */}
        <div className="flex items-center">
          <span className="uppercase tracking-widest font-bold text-gray-700 text-base">
            {(() => {
              if (pathname === "/Admin/admin-dashboard") return "admin • dashboard";
              if (pathname === "/Admin/admin-users") return "admin • users";
              if (pathname === "/Admin/admin-content-audit") return "admin • content audit";
              if (pathname === "/Admin/admin-activity-types") return "admin • activity types";
              if (pathname === "/Admin/admin-logs") return "admin • logs";
              if (pathname === "/Admin/admin-reports") return "admin • reports";
              return "admin";
            })()}
          </span>
        </div>
        {/* Right: Language, Notification, Avatar */}
        <div className="flex items-center space-x-6">
          {/* Language Selector */}
           <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100">
                        <span className="text-sm font-medium">Eng (US)</span>
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Eng (US)</DropdownMenuItem>
                      <DropdownMenuItem>Fr (FR)</DropdownMenuItem>
                      <DropdownMenuItem>Ar (AR)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            {/* Red dot for unread notification */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
          </div>
          {/* User Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
    </header>
  )
}
