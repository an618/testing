"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

export function LogoutButton({
  className = "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
  children = "Logout",
  redirectTo = "/login",
}: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: redirectTo,
      redirect: true,
    });
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}
