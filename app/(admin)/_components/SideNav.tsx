"use client";
import {
  AlertCircle,
  Building,
  History,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: User },
  { name: "Company", href: "/admin/company", icon: Building },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Notifications", href: "/admin/notifications", icon: AlertCircle },
  { name: "Messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Feedback", href: "/admin/feedback", icon: History },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function SideNav({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto mt-4">
      <ul className="space-y-2 px-4">
        {navLinks.map(({ name, href, icon: Icon }) => {
          const isActive =
            pathname.startsWith(href) &&
            !(href === "/admin" && pathname !== "/admin");

          return (
            <li key={name}>
              <Link
                href={href}
                className={`flex items-center p-2 rounded-md ${
                  isActive
                    ? "bg-color text-white"
                    : "text-gray-700 hover:bg-red-300 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} />
                  {isSidebarOpen && <p className="ml-2">{name}</p>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SideNav;
