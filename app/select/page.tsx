"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { tenantApi, Tenant } from "@/services/tenants";

function SelectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get("email");
    const storedEmail = localStorage.getItem("loginEmail");
    const userEmail = emailParam || storedEmail || "";

    if (userEmail) {
      setEmail(userEmail);
      fetchTenants(userEmail);
    } else {
      // No email found, redirect to login
      router.push("/login");
    }
  }, [searchParams, router]);

  const fetchTenants = async (userEmail: string) => {
    try {
      const data = await tenantApi.resolve(userEmail, "EMPLOYER");
      setTenants(data.tenants);
    } catch {
      setError("Failed to load tenants");
    }
  };

  const handleTenantSelect = async (tenant: Tenant) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get password from localStorage
      const password = localStorage.getItem("loginPassword");
      if (!password) {
        setError("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      // Sign in with selected tenant
      const result = await signIn("credentials", {
        username: email,
        password,
        realm: tenant.orgId,
        redirect: false,
      });

      if (result?.error) {
        setError("Login failed. Please try again.");
      } else if (result?.ok) {
        // Clear stored credentials
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("loginPassword");
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-5 m-6 md:m-12 p-6 sm:p-12 md:p-16">
          <div className="text-center">
            <h3 className="text-red-600 font-bold text-2xl md:text-3xl mb-4">
              Error
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-5 m-6 md:m-12 p-6 sm:p-12 md:p-16">
        <h3 className="text-primary font-bold text-2xl md:text-3xl text-center">
          Select Organization
        </h3>
        <p className="text-gray-600 text-center">
          Choose the organization you want to access
        </p>
        <div className="mt-6 md:mt-10 px-0 md:px-6 py-0 md:py-5 md:border border-custom-gray-100 rounded-2xl flex flex-col gap-3 md:gap-4">
          {tenants.map((tenant) => (
            <div
              onClick={() => !isLoading && handleTenantSelect(tenant)}
              key={tenant.orgId}
              className={`border border-custom-quaternary-100 rounded-xl py-3 md:py-5 px-3 flex items-center justify-between cursor-pointer hover:bg-custom-quaternary-100 hover:border-custom-gray-100 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div>
                <div className="text-custom-gray-700 font-semibold text-base md:text-lg">
                  {tenant.displayName}
                </div>
                <div className="text-custom-gray-500 text-xs md:text-sm">
                  Organization ID: {tenant.orgId}
                </div>
              </div>
              {isLoading ? (
                <Icon
                  icon="heroicons-solid:arrow-path"
                  className="w-6 h-6 text-custom-gray-700 animate-spin"
                />
              ) : (
                <Icon
                  icon="heroicons-solid:chevron-right"
                  className="w-6 h-6 text-custom-gray-700"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SelectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-5 m-6 md:m-12 p-6 sm:p-12 md:p-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <SelectPageContent />
    </Suspense>
  );
}
