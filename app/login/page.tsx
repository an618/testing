"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTenantResolve } from "@/services/tenants";

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handlePasswordToggle = () => setShowPassword((prev) => !prev);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use the tenant resolve hook - disabled by default, only called on demand
  const {
    data: resolveData,
    isLoading: isResolving,
    error: resolveError,
    refetch: refetchTenants,
  } = useTenantResolve(email.trim(), "EMPLOYER", false);

  const handleTenantResolution = useCallback(async () => {
    if (!resolveData) {
      setError(t("Login.error"));
      setIsLoading(false);
      return;
    }

    if (!resolveData.tenants || resolveData.tenants.length === 0) {
      setError(t("Login.error"));
      setIsLoading(false);
      return;
    }

    // Check if user has multiple tenants
    if (resolveData.tenants.length > 1) {
      // Multiple tenants found - store credentials and redirect to selection page
      localStorage.setItem("loginEmail", email.trim());
      localStorage.setItem("loginPassword", password);
      router.push("/select");
      return;
    }

    // Single tenant - proceed with login using orgId as realm
    const orgId = resolveData.tenants[0]?.orgId;
    if (!orgId) {
      setError(t("Login.error"));
      setIsLoading(false);
      return;
    }

    // Use NextAuth signIn with the resolved orgId as realm
    const result = await signIn("credentials", {
      username: email.trim(),
      password,
      realm: orgId,
      redirect: false,
    });

    if (result?.error) {
      setError(t("Login.error"));
    } else if (result?.ok) {
      // Redirect to dashboard on successful login
      router.push("/dashboard");
    }

    setIsLoading(false);
  }, [resolveData, email, password, router, t]);

  // Handle tenant resolution when data comes back
  useEffect(() => {
    if (resolveData) {
      handleTenantResolution();
    }
  }, [resolveData, handleTenantResolution]);

  // Handle resolve error
  useEffect(() => {
    if (resolveError) {
      setError(t("Login.error"));
      setIsLoading(false);
    }
  }, [resolveError, t]);

  const handleSubmit = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setError(t("Login.error"));
      return;
    }

    setError(null);
    setIsLoading(true);

    // Trigger the tenant resolve API call immediately when user clicks login
    await refetchTenants();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-5 m-6 md:m-12 p-6 sm:p-12 md:p-16">
        <div className="flex flex-col gap-2 md:gap-3">
          <label
            className="text-lg md:text-xl font-medium text-custom-gray-700"
            htmlFor="email"
          >
            {t("Login.email.label")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder={t("Login.email.placeholder")}
            className={`border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm md:text-base text-custom-gray-500 placeholder:text-custom-gray-500 ${
              error ? "border-red-500" : ""
            }`}
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label
            className="text-lg md:text-xl font-medium text-custom-gray-700"
            htmlFor="password"
          >
            {t("Login.password.label")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Login.password.placeholder")}
              className="border border-gray-300 rounded-xl px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm md:text-base pr-10 text-custom-gray-500 placeholder:text-custom-gray-500"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={
                showPassword
                  ? t("Login.accessibility.hidePassword")
                  : t("Login.accessibility.showPassword")
              }
              onClick={handlePasswordToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary focus:outline-none cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <Icon icon="heroicons-solid:eye" className="w-5 h-5" />
              ) : (
                <Icon icon="heroicons-solid:eye-off" className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end mt-2">
            <a
              href="#"
              className="text-sm md:text-lg text-custom-gray-700 hover:underline"
            >
              {t("Login.forgotPassword")}
            </a>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <PrimaryButton
            text={t("Login.submitButton")}
            onClick={handleSubmit}
            loading={isLoading || isResolving}
          />
        </div>
        <div className="text-center text-custom-gray-400 text-sm md:text-lg font-medium mt-2">
          {t("Login.signUpPrompt")}{" "}
          <Link
            href="/register"
            className="font-semibold text-custom-gray-700 hover:underline"
          >
            {t("Login.signUpLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
