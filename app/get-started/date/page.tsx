"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useConfig } from "@/hooks/useConfig";
import { AppConfig } from "@/services/config";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import Dropdown from "@/components/ui/Dropdown";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { planSponserApi } from "@/services/plan-sponser";

// Generate dynamic start dates based on current date with 1-month intervals
function generateStartDates(config?: AppConfig): string[] {
  const dates: string[] = [];
  const currentDate = new Date();

  // Calculate minimum days ahead based on config
  const minDaysAhead = config
    ? config.companyOnboardingConfig.planStartDateConfig.onBoardingTasksDueIn +
      config.companyOnboardingConfig.planStartDateConfig.employeeInvitesSentIn
    : 100; // Fallback if no config

  // Calculate minimum start date
  const minStartDate = new Date(currentDate);
  minStartDate.setDate(currentDate.getDate() + minDaysAhead);

  // Generate 12 months of dates starting from the minimum start date
  for (let i = 0; i < 12; i++) {
    const date = new Date(minStartDate);
    date.setMonth(minStartDate.getMonth() + i);
    dates.push(
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }

  return dates;
}

function calculateImportantDates(startDate: string, config: AppConfig) {
  const {
    onBoardingTasksDueIn,
    employeeInvitesSentIn,
    paycheckWithFirstContributionIn,
  } = config.companyOnboardingConfig.planStartDateConfig;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const start = new Date(startDate);

  const onboardingDate = new Date(start);
  onboardingDate.setDate(onboardingDate.getDate() - onBoardingTasksDueIn);

  const invitesDate = new Date(onboardingDate);
  invitesDate.setDate(invitesDate.getDate() - employeeInvitesSentIn);

  const paycheckDate = new Date(invitesDate);
  paycheckDate.setDate(
    paycheckDate.getDate() + paycheckWithFirstContributionIn
  );

  return {
    onboarding: formatDate(onboardingDate),
    invites: formatDate(invitesDate),
    paycheck: formatDate(paycheckDate),
  };
}

export default function PlanStartDatePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { config, isLoading } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  // Handle plan state routing
  usePlanStateRouting();

  // Generate start dates based on config
  const startDates = useMemo(() => {
    return generateStartDates(config || undefined);
  }, [config]);

  const [selected, setSelected] = useState("");

  // Update selected when startDates are available
  useEffect(() => {
    if (startDates.length > 0 && !selected) {
      setSelected(startDates[0]);
    }
  }, [startDates, selected]);

  const importantDates = useMemo(() => {
    if (!config || !selected) return null;
    return calculateImportantDates(selected, config);
  }, [selected, config]);

  const handleSaveAndContinue = async () => {
    if (!config || !selected || !importantDates) {
      console.error("Missing required data for saving");
      return;
    }

    try {
      // Convert dates to ISO format (YYYY-MM-DD)
      const formatDateForAPI = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setIsSaving(true);
      await planSponserApi.savePlanStartDate({
        startDate: formatDateForAPI(selected),
        onboardingTasksDue: formatDateForAPI(importantDates.onboarding),
        employeeInvitesSent: formatDateForAPI(importantDates.invites),
        paycheckWithFirstContribution: formatDateForAPI(
          importantDates.paycheck
        ),
        tenantPlanId: crypto.randomUUID(), // UUID
      });

      setIsSaving(false);
      // Navigate to next page on success
      router.push(`/get-started/trustee`);
    } catch (error) {
      setIsSaving(false);
      console.error("Error saving plan start date:", error);
      // You can add error handling UI here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-primary">
          {t("GetStarted.planStartDate.title")}
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-10 m-2 md:m-0">
          <div className="border border-custom-lavender-100 rounded-lg p-3">
            <div>
              <div className="font-semibold text-gray-900 mb-1">
                {t("GetStarted.planStartDate.startDate.label")}
              </div>
              <div className="text-sm text-gray-700 mb-4">
                {t("GetStarted.planStartDate.startDate.description")}
              </div>

              <div className="flex items-center justify-between mb-4">
                <Dropdown
                  options={startDates}
                  value={selected}
                  setValue={setSelected}
                  className="!bg-custom-lavender-100 !border-custom-lavender-100"
                />
              </div>
            </div>

            {importantDates && (
              <div className="bg-custom-lavender-100 rounded-lg px-4 py-2.5">
                <div className="font-semibold text-gray-700 mb-5">
                  {t("GetStarted.planStartDate.importantDates.title")}
                </div>
                <div className="space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-gray-400">
                      {t("GetStarted.planStartDate.importantDates.onboarding")}
                    </span>
                    <span className="text-gray-400  ">
                      {importantDates.onboarding}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-gray-400">
                      {t("GetStarted.planStartDate.importantDates.invites")}
                    </span>
                    <span className="text-gray-400  ">
                      {importantDates.invites}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-gray-400">
                      {t("GetStarted.planStartDate.importantDates.paycheck")}
                    </span>
                    <span className="text-gray-400  ">
                      {importantDates.paycheck}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4 flex-col sm:flex-row">
          <SecondaryButton
            text={t("GetStarted.planStartDate.navigation.back")}
            onClick={() => router.back()}
            className="!w-full sm:!w-fit !px-6 !py-2"
            containerClassName="!w-full sm:!w-fit"
          />
          <PrimaryButton
            text={
              isSaving
                ? "Saving..."
                : t("GetStarted.planStartDate.navigation.saveAndContinue")
            }
            onClick={handleSaveAndContinue}
            className="!w-full sm:!w-fit !px-6 !py-2"
            loading={isSaving}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
