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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bell, Mail } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Header = ({ isSidebarOpen }: { isSidebarOpen: any }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // Store notifications
  const [notificationCount, setNotificationCount] = useState(0); // Store the count of notifications

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications"); // Adjust the API path if needed
        const data = await response.json();
        setNotifications(data);
        setNotificationCount(data.length); // Update the notification count
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Generate user initials from the session
  const getUserInitials = () => {
    if (session?.user?.name) {
      const nameParts = session.user.name.split(" ");
      const initials = nameParts
        .map((part: string) => part[0].toUpperCase())
        .join("");
      return initials;
    }
    return "??";
  };

  const signoutHandler = () => {
    signOut({ callbackUrl: "/signin" });
    setShowDialog(false);
  };

  return (
    <header
      className={`bg-white border-b border-l px-6 py-4 flex items-center justify-between fixed top-0 right-0 ${
        isSidebarOpen ? "left-48" : "left-20"
      } z-50`}
    >
      {/* Search Bar */}
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full max-w-sm border border-color placeholder:text-color rounded-md px-4 py-2"
        />
      </div>

      {/* Icons and User Profile */}
      <div className="flex items-center space-x-2">
        {/* Mail Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Mail className="h-6 w-6 text-color" />
              <span className="absolute -top-1 -right-1 bg-color text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>You have 3 new messages</DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/admin/messages")}
              >
                View all
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Bell className="h-6 w-6 text-color" />
              <span className="absolute -top-1 -right-1 bg-color text-white text-xs px-1.5 py-0.5 rounded-full">
                {notificationCount} {/* Display notification count */}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.length > 0 ? (
                notifications.map((notification: any, index: number) => (
                  <DropdownMenuItem key={index}>
                    {notification.message}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/admin/notifications")}
              >
                View all
              </DropdownMenuItem>
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
              <div className="w-8 h-8 bg-red-100 border border-color rounded-full flex items-center justify-center text-lg font-bold">
                <p className="p-2 text-xs text-color">{getUserInitials()}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/admin/profile")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/admin/settings")}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDialog(true)}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sign Out Confirmation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-white">
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="outline"
                className="text-color border-color"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="border-black"
                onClick={signoutHandler}
              >
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
