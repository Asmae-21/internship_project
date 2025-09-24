"use client";

import Link from "next/link";
import { MenuIcon, PanelsTopLeft, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMenuList } from "@/lib/menu-item";
import { useSidebarState } from "@/hook/use-sidebar-state";

export function Header() {
  const pathname = usePathname();
  const menuItems = getMenuList();
  const { toggle } = useSidebarState();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Find the menu item that matches the current path
  let title = "DASHBOARD";
  if (pathname === "/settings") title = "SETTINGS";
  else if (pathname === "/logout") title = "LOGOUT";
  else if (pathname.startsWith("/Teacher/Content")) title = "";
  else {
    const currentMenu = menuItems.find((item) => item.href === pathname);
    if (currentMenu) title = currentMenu.label.toUpperCase();
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm border-b">
      <div className="flex h-16 items-center px-8 gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggle}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        {/* Title */}
        <div className="flex-1 flex items-center">
          <h1 className="font-extrabold text-xl tracking-widest text-gray-800 uppercase">{title}</h1>
        </div>
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

        {/* User Dropdown */}
        <DropdownMenu>
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" asChild>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={currentUser?.photo ? `http://localhost:4000${currentUser.photo}` : "/placeholder.svg?height=40&width=40"}
                        alt={`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "User Avatar"}
                      />
                      <AvatarFallback>{currentUser ? `${currentUser.firstName?.charAt(0) || ""}${currentUser.lastName?.charAt(0) || ""}`.toUpperCase() || "U" : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom"><span>Profile</span></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "John Doe"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email || "john.doe@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('currentUser');
              window.location.href = '/Login';
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
