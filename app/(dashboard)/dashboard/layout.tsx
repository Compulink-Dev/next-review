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
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white shadow-md flex flex-col fixed inset-y-0 left-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Image src="/icons/logo.png" alt="Logo" width={40} height={40} />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <SideNav isSidebarOpen={isSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <Header />

        {/* Scrollable Main Section */}
        <main className="flex-1 overflow-y-auto p-6 mt-16">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
