"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, Mail } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Header = ({ isSidebarOpen }: { isSidebarOpen: any }) => {
  const { data: session } = useSession();

  // Generate user initials from the session
  const getUserInitials = () => {
    if (session?.user?.name) {
      const nameParts = session.user.name.split(" ");
      const initials = nameParts
        .map((part: string) => part[0].toUpperCase()) // Explicitly typing `part` as string
        .join("");
      return initials;
    }
    return "??";
  };

  return (
    <header
      className={`bg-white shadow-md px-6 py-4 flex items-center justify-between fixed top-0 right-0 ${
        isSidebarOpen ? "left-48" : "left-20"
      } z-50`}
    >
      {/* Search Bar */}
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full max-w-sm border rounded-md px-4 py-2"
        />
      </div>

      {/* Icons and User Profile */}
      <div className="flex items-center space-x-2">
        {/* Mail Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Mail className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>You have 3 new messages</DropdownMenuItem>
              <DropdownMenuItem>View all</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                5
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>New comment on your post</DropdownMenuItem>
              <DropdownMenuItem>System update available</DropdownMenuItem>
              <DropdownMenuItem>View all</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">
                <p className="p-2 text-xs">{getUserInitials()}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
