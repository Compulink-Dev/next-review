"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

function SettingsTop() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [stats, setStats] = useState({ reviews: 0, reads: 0, useful: 0 });

  console.log(notificationCount);

  console.log(notifications);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);
        setNotificationCount(data.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch user stats (reviews, reads, useful)
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/user-stats"); // Adjust this endpoint
        const data = await response.json();
        setStats({
          reviews: data.reviews || 0,
          reads: data.reads || 0,
          useful: data.useful || 0,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchNotifications();
    fetchUserStats();
  }, []);

  // Generate user initials from session
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((part) => part[0].toUpperCase())
        .join("");
    }
    return "??";
  };

  return (
    <div className="p-6 flex justify-between items-center">
      {/* User Info */}
      <div className="flex gap-2 items-center">
        <div className="w-24 h-24 bg-red-100 border border-color rounded-full flex items-center justify-center text-lg font-bold">
          <p className="p-2 text-4xl text-color">{getUserInitials()}</p>
        </div>
        <p className="text-lg font-medium">{session?.user?.name}</p>
      </div>

      {/* Stats Section */}
      <div className="flex gap-6">
        {/* Reviews */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 border border-color rounded-full flex items-center justify-center text-lg font-bold">
            <p className="p-2 text-4xl text-blue-600">{stats.reviews}</p>
          </div>
          <p className="text-sm font-medium">Reviews</p>
        </div>

        {/* Reads */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 border border-color rounded-full flex items-center justify-center text-lg font-bold">
            <p className="p-2 text-4xl text-green-600">{stats.reads}</p>
          </div>
          <p className="text-sm font-medium">Reads</p>
        </div>

        {/* Useful */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-yellow-100 border border-color rounded-full flex items-center justify-center text-lg font-bold">
            <p className="p-2 text-4xl text-yellow-600">{stats.useful}</p>
          </div>
          <p className="text-sm font-medium">Useful</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsTop;
