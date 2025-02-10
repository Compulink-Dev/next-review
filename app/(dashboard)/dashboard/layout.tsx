"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Header from "../_components/Header";
import SideNav from "../_components/SideNav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-48" : "w-20"
        } transition-all duration-300 bg-white shadow-md flex flex-col fixed inset-y-0 left-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen ? (
            <Image src="/icons/logo.png" alt="Logo" width={40} height={40} />
          ) : (
            ""
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? (
              <X size={20} className="text-slate-700" />
            ) : (
              <Menu className="ml-2 text-slate-700" size={20} />
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <SideNav isSidebarOpen={isSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-40" : "ml-12"} `}
      >
        {/* Header */}
        <Header isSidebarOpen={isSidebarOpen} />

        {/* Scrollable Main Section */}
        <main className="flex-1 overflow-y-auto p-12 mt-12">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
