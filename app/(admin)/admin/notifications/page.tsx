"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "@/components/Title";
import Loading from "@/components/Loading";

type Notification = {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <Loading />;
  if (!notifications.length) return <p>No notifications found.</p>;

  return (
    <div>
      <Title title="Notifications" subtitle="View all notifications" />
      <ul className="mt-4 space-y-4">
        {notifications.map((notif) => (
          <li key={notif._id} className="p-4 border rounded-lg bg-gray-50">
            <p>
              <strong className="text-color">
                {notif.type.toUpperCase()}:
              </strong>{" "}
              {notif.message}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;
