"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaBars } from "react-icons/fa";
import {
  HiOutlineCalendar,
  HiOutlinePresentationChartBar,
} from "react-icons/hi";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";
import {
  TbDeviceGamepad3,
  TbInbox,
  TbInfoCircle,
  TbLayoutGridAdd,
  TbSettings,
  TbLogout,
} from "react-icons/tb";
import { FiCreditCard } from "react-icons/fi";
import { LogoutButton } from "./LogoutButton";

interface SidebarProps {
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  user: User;
}

export function Sidebar({
  collapsed: collapsedProp = false,
  onCollapseChange,
  user,
}: SidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(collapsedProp);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(!collapsedProp);
  const [reallyHidden, setReallyHidden] = useState(collapsedProp);

  const navItems = [
    {
      label: t("Sidebar.navigation.dashboard"),
      icon: <TbLayoutGridAdd />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: t("Sidebar.navigation.tasks"),
      icon: <TbInbox />,
      href: "/tasks",
      active: pathname === "/tasks",
    },
    {
      label: t("Sidebar.navigation.participants"),
      icon: <HiOutlineCalendar />,
      href: "/participants",
      active: pathname === "/participants",
    },
    {
      label: t("Sidebar.navigation.contributions"),
      icon: <FiCreditCard />,
      href: "/contributions",
      active: pathname === "/contributions",
    },
    {
      label: t("Sidebar.navigation.reports"),
      icon: <HiOutlinePresentationChartBar />,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: t("Sidebar.navigation.resources"),
      icon: <TbDeviceGamepad3 />,
      href: "/resources",
      active: pathname === "/resources",
    },
  ];

  const secondaryItems = [
    { label: t("Sidebar.secondary.settings"), icon: <TbSettings /> },
    { label: t("Sidebar.secondary.support"), icon: <TbInfoCircle /> },
  ];

  useEffect(() => {
    setCollapsed(collapsedProp);
  }, [collapsedProp]);

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!collapsed) {
      setReallyHidden(false);
      timeout = setTimeout(() => setShowLabels(true), 10);
    } else {
      setShowLabels(false);
      setReallyHidden(true);
    }
    return () => clearTimeout(timeout);
  }, [collapsed]);

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const Hamburger = (
    <button
      className={`md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow border border-gray-200 ${
        mobileOpen ? "hidden" : ""
      }`}
      aria-label={t("Sidebar.accessibility.openSidebar")}
      onClick={() => setMobileOpen(true)}
    >
      <FaBars size={20} color="#374151" />
    </button>
  );

  // Sidebar content
  const SidebarContent = (
    <aside
      className={`h-[calc(100vh-2rem)] bg-white shadow-xl rounded-2xl m-4 flex flex-col transition-all duration-300 border border-gray-100 fixed top-0 left-0 z-40 ${
        collapsed ? "w-20" : "w-[240px]"
      } md:z-40 md:block ${mobileOpen ? "block" : "hidden"} md:flex`}
      aria-label="Sidebar"
      style={{ minWidth: collapsed ? 80 : 240 }}
    >
      {/* Collapse/Expand Arrow (desktop only) */}
      <div className="hidden md:block">
        <button
          className={`cursor-pointer absolute top-7 -right-3 w-7 h-7 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center transition-transform duration-300 z-50`}
          aria-label={
            collapsed
              ? t("Sidebar.accessibility.expandSidebar")
              : t("Sidebar.accessibility.collapseSidebar")
          }
          onClick={handleCollapse}
          tabIndex={0}
          style={{ boxShadow: "0 2px 8px 0 rgba(16,30,54,0.08)" }}
        >
          {collapsed ? (
            <FaChevronRight size={12} color="#081021" />
          ) : (
            <FaChevronLeft size={12} color="#081021" />
          )}
        </button>
      </div>

      {/* Close button for mobile */}
      <button
        className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow z-50"
        aria-label={t("Sidebar.accessibility.closeSidebar")}
        onClick={() => setMobileOpen(false)}
      >
        <FaChevronLeft size={20} color="#081021" />
      </button>

      {/* Logo */}
      <div
        className={`flex items-center gap-2 px-6 pt-7 pb-6 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Image
          width={36}
          height={36}
          src="/dash_logo.svg"
          alt="Glidingpath Logo"
          className="w-10 h-10"
        />
        {!collapsed && (
          <span
            className="text-[20px] font-semibold text-gray-700 leading-none"
            style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
          >
            {t("Sidebar.logo")}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={`flex flex-col gap-1 mt-6 ${collapsed ? "px-2" : "px-6"}`}
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center gap-3 px-6 py-2.5 rounded-full transition-colors duration-200 text-[#64748B] hover:bg-indigo-50 hover:text-indigo-600 ${
              item.active ? "bg-indigo-50 text-indigo-600 font-semibold" : ""
            } ${collapsed ? "justify-center px-2" : ""}`}
            aria-current={item.active ? "page" : undefined}
            style={{ fontSize: 16, height: 44 }}
            onClick={() => setMobileOpen(false)}
          >
            <span
              className={`text-xl ${
                item.active ? "text-indigo-600" : "text-[#64748B]"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[15px] transition-all duration-300 whitespace-nowrap ease-in-out
                ${
                  showLabels && !collapsed
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }
                whitespace-nowrap${reallyHidden ? " hidden" : ""}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-3 border-t border-gray-100" />

      {/* Secondary Items */}
      <div className={`flex flex-col gap-1 ${collapsed ? "px-2" : "px-6"}`}>
        {secondaryItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl transition-colors duration-200 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 ${
              collapsed ? "justify-center px-2" : ""
            }`}
            style={{ fontSize: 15, height: 40 }}
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={`text-[15px] transition-all duration-300 ease-in-out
                ${
                  showLabels && !collapsed
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }
                whitespace-nowrap${reallyHidden ? " hidden" : ""}`}
            >
              {item.label}
            </span>
          </a>
        ))}
      </div>

      <div className="flex-1" />
      <div className="border-t border-gray-100"></div>
      {/* User Info with Hover Logout */}
      <div className="group relative">
        <div
          className={`flex items-center gap-3 py-6 mb-2 px-6 transition-all duration-300 ${
            collapsed ? "justify-center px-2" : ""
          } hover:bg-gray-50 rounded-lg`}
          style={{ minHeight: 56 }}
        >
          <div className="min-w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-xl">
            <span role="img" aria-label="User">
              👨‍💼
            </span>
          </div>
          <span
            className={`flex flex-col transition-all duration-300 ease-in-out
              ${
                showLabels && !collapsed
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 pointer-events-none"
              }
              whitespace-nowrap${reallyHidden ? " hidden" : ""}`}
          >
            <span className="text-[14px] font-medium text-gray-900 leading-tight">
              {t("Sidebar.user.welcomeBack")} <span className="ml-1">👋</span>
            </span>
            <span className="text-xs text-gray-500">
              {user.firstName} {user.lastName}
            </span>
          </span>
          {showLabels && !collapsed && (
            <span className="ml-auto text-gray-400">
              <FaChevronRight size={16} />
            </span>
          )}
        </div>

        {/* Logout Button - Shows on hover */}
        <div
          className={`absolute bottom-full left-6 right-6 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            collapsed ? "left-2 right-2" : ""
          }`}
        >
          <LogoutButton
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-full ${
              collapsed ? "justify-center px-2" : ""
            }`}
            redirectTo="/login"
          >
            <TbLogout size={18} />
            {!collapsed && (
              <span className="transition-all duration-300 ease-in-out">
                {t("Sidebar.user.logout")}
              </span>
            )}
          </LogoutButton>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      {Hamburger}
      {/* Overlay for mobile modal */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden flex items-center justify-center bg-[#00000090] transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-label={t("Sidebar.accessibility.sidebarOverlay")}
        />
      )}
      {/* Sidebar content */}
      <div className="hidden md:block">{SidebarContent}</div>
      <div className="md:hidden">{SidebarContent}</div>
    </>
  );
}
