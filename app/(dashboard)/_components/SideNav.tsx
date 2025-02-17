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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: User,
    roles: ["companyAdmin"],
  },
  {
    name: "Company",
    href: "/dashboard/company",
    icon: Building,
    roles: ["employee", "companyAdmin", "client"],
  },
  { name: "Reviews", href: "/dashboard/reviews", icon: Star },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: AlertCircle,
    roles: ["employee", "companyAdmin", "client"],
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
    roles: ["employee", "companyAdmin"],
  },
  {
    name: "Feedback",
    href: "/dashboard/feedback",
    icon: History,
    roles: ["companyAdmin"],
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: ["employee", "companyAdmin", "client"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["employee", "companyAdmin", "client"],
  },
];

type Props = {
  isSidebarOpen: boolean;
  userRole: any;
};

function SideNav({ isSidebarOpen, userRole }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto mt-4">
      <ul className="space-y-2 px-4">
        {navLinks
          .filter((link) => !link.roles || link.roles.includes(userRole))
          .map(({ name, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <li key={name}>
                <Link
                  href={href}
                  className={`flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-color text-white"
                      : "text-color hover:bg-red-400 hover:text-white"
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
