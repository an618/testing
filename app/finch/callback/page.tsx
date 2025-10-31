"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useFinch } from "@/hooks/useFinch";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Icon } from "@iconify/react";

function FinchCallbackContent() {
  const { t, isClient } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendCallback, isLoading, isError, callbackData } = useFinch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const hasSentCallback = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        console.error("Finch OAuth error:", { error, errorDescription });
        setError(errorDescription || t("Finch.callback.error.defaultError"));
        setStatus("error");
        return;
      }

      if (code && !hasSentCallback.current) {
        hasSentCallback.current = true;
        try {
          const response = await sendCallback(code);

          if (response?.access_token) {
            // Detect if user is on a mobile device
            const isMobile = /iPhone|iPad|iPod|Android/i.test(
              navigator.userAgent
            );

            if (isMobile) {
              // Try to open your app via deep link
              window.location.href =
                "com.glidingpath://finch/callback?code=" +
                encodeURIComponent(code);

              // Optional: You can add a small timeout here, but don't redirect anywhere
              // This means if the app is not installed, the user stays on this web page
            } else {
              // Not mobile, stay on web and maybe show some message or UI here
              console.log("Not a mobile device - stay on web");
            }
          }
        } catch (error) {
          console.error("Error sending callback to backend:", error);
          setError(t("Finch.callback.error.callbackError"));
          setStatus("error");
        }
      } else if (!code) {
        setError(t("Finch.callback.error.noCodeError"));
        setStatus("error");
      }
    };
    handleCallback();
  }, [searchParams, t, sendCallback]);

  // Handle callback response
  useEffect(() => {
    if (callbackData) {
      if (callbackData.access_token) {
        setSuccessMessage(
          callbackData.message || t("Finch.callback.success.defaultMessage")
        );
        setStatus("success");
      } else {
        setError(
          callbackData.message || t("Finch.callback.error.defaultError")
        );
        setStatus("error");
      }
    }
  }, [callbackData, t]);

  // Handle callback error from mutation
  useEffect(() => {
    if (isError && !callbackData) {
      // Only set error if we don't have callback data (meaning the API call failed)
      setError(t("Finch.callback.error.callbackError"));
      setStatus("error");
    }
  }, [isError, callbackData, t]);

  const handleContinue = () => {
    // Navigate to dashboard or next step
    router.push("/dashboard");
  };

  const handleTryAgain = () => {
    router.push("/finch");
  };

  // Use a key to force re-render after hydration to avoid mismatches
  const formKey = isClient ? "client" : "server";

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-8 m-6 md:m-12 p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Icon
                  icon="heroicons:arrow-path"
                  className="w-8 h-8 text-white animate-spin"
                />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-custom-gray-700 mb-3">
              {t("Finch.callback.loading.title")}
            </h1>
            <p className="text-base md:text-lg text-custom-gray-500 max-w-2xl mx-auto">
              {t("Finch.callback.loading.subtitle")}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-3 text-sm text-custom-gray-400">
              <Icon icon="heroicons:shield-check" className="w-4 h-4" />
              <span>Securing your connection...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-8 m-6 md:m-12 p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Icon icon="heroicons:x-mark" className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-custom-gray-700 mb-3">
              {t("Finch.callback.error.title")}
            </h1>
            <p className="text-base md:text-lg text-custom-gray-500 max-w-2xl mx-auto">
              {error}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <Icon
              icon="heroicons:exclamation-triangle"
              className="w-5 h-5 text-red-500 flex-shrink-0"
            />
            <p className="text-sm text-red-600">
              Don&apos;t worry, you can try connecting again.
            </p>
          </div>

          <div className="flex justify-center">
            <PrimaryButton
              text={t("Finch.callback.error.tryAgainButton")}
              onClick={handleTryAgain}
              key={formKey}
            />
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-8 m-6 md:m-12 p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Icon icon="heroicons:check" className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-custom-gray-700 mb-3">
              {t("Finch.callback.success.title")}
            </h1>
            <p className="text-base md:text-lg text-custom-gray-500 max-w-2xl mx-auto">
              {successMessage}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <Icon
              icon="heroicons:check-circle"
              className="w-5 h-5 text-green-500 flex-shrink-0"
            />
            <p className="text-sm text-green-600">
              Your payroll system is now connected and ready to use.
            </p>
          </div>

          <div className="flex justify-center">
            <PrimaryButton
              text={t("Finch.callback.success.continueButton")}
              onClick={handleContinue}
              key={formKey}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-custom-gray-400">
              You can now access your payroll data and manage your 401(k) plan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-8 m-6 md:m-12 p-6 sm:p-12 md:p-16">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Icon
                icon="heroicons:arrow-path"
                className="w-8 h-8 text-white animate-spin"
              />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-custom-gray-700 mb-3">
            Loading...
          </h1>
          <p className="text-base md:text-lg text-custom-gray-500 max-w-2xl mx-auto">
            Please wait while we prepare your connection.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FinchCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FinchCallbackContent />
    </Suspense>
  );
}
