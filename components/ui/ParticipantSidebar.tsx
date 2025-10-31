"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ParticipantSidebar() {
  const pathname = usePathname();
  const [collapsed] = useState(false);

  const navItems = [
    {
      label: "Portfolio",
      icon: "heroicons:chart-pie",
      href: "/participant-dashboard",
      active: pathname === "/participant-dashboard",
    },
    {
      label: "Contribution",
      icon: "heroicons:currency-dollar",
      href: "/participant-dashboard/contribution",
      active: pathname === "/participant-dashboard/contribution",
    },
    {
      label: "Tasks & Activity",
      icon: "heroicons:clipboard-document-list",
      href: "/participant-dashboard/tasks",
      active: pathname === "/participant-dashboard/tasks",
    },
    {
      label: "Statements",
      icon: "heroicons:document-text",
      href: "/participant-dashboard/statements",
      active: pathname === "/participant-dashboard/statements",
    },
    {
      label: "Withdrawals",
      icon: "heroicons:arrow-trending-down",
      href: "/participant-dashboard/withdrawals",
      active: pathname === "/participant-dashboard/withdrawals",
    },
    {
      label: "Transfers",
      icon: "heroicons:arrow-right-left",
      href: "/participant-dashboard/transfers",
      active: pathname === "/participant-dashboard/transfers",
      hasSubmenu: true,
    },
    {
      label: "Resources",
      icon: "heroicons:book-open",
      href: "/participant-dashboard/resources",
      active: pathname === "/participant-dashboard/resources",
    },
  ];

  const secondaryItems = [
    { label: "Settings", icon: "heroicons:cog-6-tooth" },
    { label: "Support", icon: "heroicons:lifebuoy" },
  ];

  return (
    <aside
      className={`h-screen bg-white shadow-xl flex flex-col transition-all duration-300 border-r border-gray-100 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-6 py-6 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Image
          width={32}
          height={32}
          src="/logo.svg"
          alt="GlidingPath Logo"
          className="w-8 h-8"
        />
        {!collapsed && (
          <span className="text-xl font-bold text-gray-900">
            GP GlidingPath
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-6">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
              item.active
                ? "bg-purple-50 text-purple-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
            } ${collapsed ? "justify-center px-2" : ""}`}
          >
            <Icon icon={item.icon} className="w-5 h-5" />
            {!collapsed && (
              <span className="text-sm">
                {item.label}
                {item.hasSubmenu && (
                  <Icon
                    icon="heroicons:chevron-down"
                    className="w-4 h-4 ml-auto"
                  />
                )}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100" />

      {/* Secondary Items */}
      <div className="flex flex-col gap-1 px-6">
        {secondaryItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600 ${
              collapsed ? "justify-center px-2" : ""
            }`}
          >
            <Icon icon={item.icon} className="w-5 h-5" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </a>
        ))}
      </div>

      <div className="flex-1" />

      {/* User Info */}
      <div
        className={`flex items-center gap-3 py-6 px-6 border-t border-gray-100 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center">
          <span className="text-lg">👨‍💼</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Welcome back
            </span>
            <span className="text-xs text-gray-500">Alex Rivera</span>
          </div>
        )}
        {!collapsed && (
          <Icon
            icon="heroicons:chevron-right"
            className="w-4 h-4 ml-auto text-gray-400"
          />
        )}
      </div>
    </aside>
  );
}
