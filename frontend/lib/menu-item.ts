import {
  Home,
  Settings,
  Users,
  Package,
  BarChart,
  type LucideIcon,
  LayoutDashboard,
  Library,
  LogOut,
  FileText,
} from "lucide-react";

// Define the type for a single menu item.
type MenuItem = {
  href: string; // The URL path for the navigation link.
  label: string; // The display text for the menu item.
  icon: LucideIcon; // The Lucide React icon component for the menu item.
};

// Function to get the list of menu items.
export function getMenuList(): MenuItem[] {
  return [
    {
      href: "/Teacher/Dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/Teacher/Content",
      label: "My Content",
      icon: FileText,
    },

    {
      href: "/Teacher/Library",
      label: "My Library",
      icon: Library,
    },
  ];
}
