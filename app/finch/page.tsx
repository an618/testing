"use client";

import { useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useFinch } from "@/hooks/useFinch";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Icon } from "@iconify/react";

export default function FinchPage() {
  const { t, isClient } = useLanguage();
  const { connectFinch, isLoading, isError } = useFinch();

  // Handle plan state routing
  usePlanStateRouting();

  const handleConnectFinch = useCallback(() => {
    connectFinch();
  }, [connectFinch]);

  // Use a key to force re-render after hydration to avoid mismatches
  const formKey = isClient ? "client" : "server";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-8 m-6 md:m-12 p-6 sm:p-12 md:p-16">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Icon icon="heroicons:link" className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-custom-gray-700 mb-3">
            {t("Finch.main.title")}
          </h1>
          <p className="text-base md:text-lg text-custom-gray-500 max-w-2xl mx-auto">
            {t("Finch.main.subtitle")}
          </p>
        </div>

        {/* Error Message */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="w-5 h-5 text-red-500 flex-shrink-0"
            />
            <p className="text-sm text-red-600">
              {t("Finch.main.errorMessage")}
            </p>
          </div>
        )}

        {/* Action Section */}
        <div className="flex flex-col items-center gap-4">
          <PrimaryButton
            text={
              isLoading
                ? t("Finch.main.connectingButton")
                : t("Finch.main.connectButton")
            }
            onClick={handleConnectFinch}
            loading={isLoading}
            key={formKey}
          />

          {/* Trust Indicators */}
          <div className="flex items-center gap-6 text-xs text-custom-gray-400">
            <div className="flex items-center gap-1">
              <Icon icon="heroicons:shield-check" className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="heroicons:lock-closed" className="w-4 h-4" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
              <span>GDPR Ready</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center">
          <p className="text-sm text-custom-gray-400">
            By connecting with Finch, you agree to our{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
