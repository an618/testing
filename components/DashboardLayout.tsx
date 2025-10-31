"use client";

import { ReactNode } from "react";
import { User } from "next-auth";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  title: string;
  user: User;
  // onLogout: () => void;
  children: ReactNode;
}

export function DashboardLayout({
  title,
  user,
  // onLogout,
  children,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F5F8FF]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
        user={user}
        // onLogout={onLogout}
      />
      <div
        className={`flex-1 transition-all duration-300 ml-0 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } pt-0`}
        style={{ minHeight: "100vh" }}
      >
        <DashboardHeader title={title} user={user} />
        <main className="w-full py-6 px-2 sm:px-4 lg:px-8">
          <div className="py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
