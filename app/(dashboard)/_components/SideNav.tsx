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
            <span className="flex items-center gap-2">
              <LayoutDashboard size={16} />
              <p className={`${isSidebarOpen ? "block" : "hidden"} ml-2 `}>
                Dashboard
              </p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/employees"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="flex items-center gap-2">
              <User size={16} />
              <p
                className={`${
                  isSidebarOpen ? "block" : "hidden"
                } ml-2 flex items-center gap-2`}
              >
                Employees
              </p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/reviews"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="flex items-center gap-2">
              <Star size={16} />
              <p
                className={`${
                  isSidebarOpen ? "block" : "hidden"
                } ml-2 flex items-center gap-2`}
              >
                Reviews
              </p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/feedback"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="flex items-center gap-2">
              <History size={16} />
              <p
                className={`${
                  isSidebarOpen ? "block" : "hidden"
                } ml-2 flex items-center gap-2`}
              >
                Feedback
              </p>
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/settings"
            className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <span className="flex items-center gap-2">
              <Settings size={16} />
              <p
                className={`${
                  isSidebarOpen ? "block" : "hidden"
                } ml-2 flex items-center gap-2`}
              >
                Settings
              </p>
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
