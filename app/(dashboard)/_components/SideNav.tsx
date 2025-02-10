import { History, LayoutDashboard, Settings, Star, User } from "lucide-react";
import Link from "next/link";
import React from "react";

function SideNav({ isSidebarOpen }: { isSidebarOpen: any }) {
  return (
    <nav className="flex-1 overflow-y-auto mt-4">
      <ul className="space-y-2 px-4">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } ml-2 flex items-center gap-2`}
            >
              <LayoutDashboard size={16} />
              <p className="">Dashboard</p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } ml-2 flex items-center gap-2`}
            >
              <User size={16} />
              <p className="">Employees</p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } ml-2 flex items-center gap-2`}
            >
              <Star size={16} />
              <p className="">Review</p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } ml-2 flex items-center gap-2`}
            >
              <History size={16} />
              <p className="">Feedback</p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } ml-2 flex items-center gap-2`}
            >
              <Settings size={16} />
              <p className="">Settings</p>
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
