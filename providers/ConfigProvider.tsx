"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useConfig } from "@/services/config/queries";
import { AppConfig } from "@/services/config/types";

interface ConfigContextType {
  config: AppConfig | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  // Only fetch config when user is authenticated
  const {
    data: config,
    isLoading,
    error,
  } = useConfig({
    enabled: status === "authenticated" && !!session,
  });

  return (
    <ConfigContext.Provider value={{ config, isLoading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useAppConfig must be used within a ConfigProvider");
  }
  return context;
}
