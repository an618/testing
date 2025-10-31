"use client";
import React, { useState } from "react";
import { Starter401kLimitationsModal } from "../../../components/Starter401kLimitationsModal";
import { useRouter } from "next/navigation";
import {
  CompanyPlanRequest,
  useCreateCompanyPlan,
} from "@/services/plan-sponser";
import { usePlanTypes } from "@/services/plan-sponser";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import { Icon } from "@iconify/react";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import InputWithDropdown from "@/components/ui/InputWithDropdown";
import { dropdownConfigs } from "@/config/dropdownConfig";

const Starter401kPlanPage = () => {
  const { t } = useLanguage();
  const router = useRouter();

  // Handle plan state routing
  usePlanStateRouting();

  const {
    mutateAsync: createCompanyPlan,
    error: saveError,
    isPending: isSaving,
  } = useCreateCompanyPlan();
  const { data: planTypes = [] } = usePlanTypes();
  const [annualIncrease, setAnnualIncrease] = useState<{
    mode: "minimum" | "custom";
    annualIncrease?: string;
    maxContribution?: string;
  }>({ mode: "minimum" });
  const [showLimitations, setShowLimitations] = useState(false);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [isExclusions, setIsExclusions] = useState("None");
  const [defaultRate, setDefaultRate] = useState("3");

  const handleSaveAndContinue = async () => {
    try {
      // Find the Starter 401(k) plan type
      const starterPlan = planTypes.find(
        (plan) => plan.name === "Starter 401(k)"
      );
      if (!starterPlan) {
        throw new Error("Starter 401(k) plan type not found");
      }

      // Parse annual increase values
      const enrollmentAnnualIncrease =
        annualIncrease.mode === "minimum"
          ? 1.0
          : parseFloat(annualIncrease.annualIncrease?.replace("%", "") || "2");

      const enrollmentMaxRate =
        annualIncrease.mode === "minimum"
          ? 15.0
          : parseFloat(
              annualIncrease.maxContribution?.replace("%", "") || "15"
            );

      // Create the request body based on UI fields
      const requestBody = {
        tenantId: "tenant-123", // This should come from user context
        planTypeId: starterPlan.id,
        employeeContributionConfig: {
          hasEmployeeContribution: true,
          defaultContributionRate: parseFloat(defaultRate),
          isAutoEnrollment: true,
          enrollmentAnnualIncrease,
          enrollmentMaxRate,
        },
        eligibility: {
          minimumEntryAge: 18,
          timeEmployedMonths: 0,
        },
      };

      // Call the API
      const result = await createCompanyPlan(requestBody as CompanyPlanRequest);

      // Navigate to next step with the company plan ID
      if (result.id) {
        router.push(`/get-started/business`);
      }
    } catch (error) {
      console.error("Failed to create company plan:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mt-8 text-primary">
          {t("GetStarted.starter.title")}
        </h1>
        <p className="text-center text-xl text-custom-gray-600 mt-3">
          {t("GetStarted.starter.description")}
        </p>
        {/* Error message */}
        {saveError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <Icon
                icon="heroicons:exclamation-triangle"
                className="w-5 h-5 text-red-400 mr-2"
              />
              <span className="text-red-800 text-sm">{saveError.message}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-10 flex flex-col mt-10">
          <h2 className="font-semibold text-custom-gray-600 text-base">
            {t("GetStarted.starter.employeeEligibility.title")}
          </h2>
          <p className="text-base mt-3 text-custom-gray-400">
            {t("GetStarted.starter.employeeEligibility.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
            <InputWithDropdown
              title={t("GetStarted.starter.employeeEligibility.minimumAge")}
              options={dropdownConfigs.minimumAge.options}
              value={"18"}
              displayValues={dropdownConfigs.minimumAge.getDisplayValues(
                t,
                dropdownConfigs.minimumAge.options
              )}
              disabled={true}
              setValue={() => {}}
            />
            <InputWithDropdown
              title={t("GetStarted.starter.employeeEligibility.timeEmployed")}
              options={dropdownConfigs.timeEmployed.options}
              value={"0"}
              displayValues={dropdownConfigs.timeEmployed.getDisplayValues(
                t,
                dropdownConfigs.timeEmployed.options
              )}
              disabled={true}
              setValue={() => {}}
            />
            <InputWithDropdown
              title={t("GetStarted.starter.employeeEligibility.exclusions")}
              options={dropdownConfigs.exclusions.options}
              value={isExclusions}
              setValue={(value) => setIsExclusions(value as string)}
            />
            {isExclusions === "Select from list" && (
              <InputWithDropdown
                title={t(
                  "GetStarted.starter.employeeEligibility.selectFromList"
                )}
                options={dropdownConfigs.exclusionsList.options}
                value={exclusions}
                setValue={(value) => setExclusions(value as string[])}
              />
            )}
          </div>
        </div>
        {/* Auto-enrolled employees */}
        <div className="bg-white rounded-xl p-10 flex flex-col mt-6">
          <h2 className="font-semibold text-custom-gray-600 text-base">
            {t("GetStarted.starter.autoEnrolled.title")}
          </h2>
          <p className="text-base mt-3 text-custom-gray-400">
            {t("GetStarted.starter.autoEnrolled.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
            <InputWithDropdown
              title={t("GetStarted.starter.autoEnrolled.defaultRate")}
              options={dropdownConfigs.defaultRate.options}
              value={defaultRate}
              displayValues={dropdownConfigs.defaultRate.getDisplayValues(
                dropdownConfigs.defaultRate.options
              )}
              setValue={(value) => setDefaultRate(value as string)}
            />
            <InputWithDropdown
              title={t("GetStarted.starter.autoEnrolled.annualIncrease")}
              options={dropdownConfigs.annualIncrease.options}
              value={annualIncrease.mode}
              setValue={(value) => {
                setAnnualIncrease({
                  mode: value as "minimum" | "custom",
                  annualIncrease: undefined,
                  maxContribution: undefined,
                });
              }}
            />
          </div>

          {annualIncrease.mode === "custom" && (
            <div className="mt-7 border-t border-custom-quaternary-200 pt-7">
              <InputWithDropdown
                title={t(
                  "GetStarted.modals.annualIncrease.annualIncreaseLabel"
                )}
                options={dropdownConfigs.annualRates.options}
                value={annualIncrease.annualIncrease || "2"}
                setValue={(value) => {
                  setAnnualIncrease({
                    mode: "custom",
                    annualIncrease: value as string,
                    maxContribution: annualIncrease.maxContribution,
                  });
                }}
              />
              <InputWithDropdown
                title={t(
                  "GetStarted.modals.annualIncrease.maxContributionLabel"
                )}
                options={dropdownConfigs.maxContributions.options}
                value={annualIncrease.maxContribution || "15"}
                setValue={(value) => {
                  setAnnualIncrease({
                    annualIncrease: annualIncrease.annualIncrease,
                    mode: "custom",
                    maxContribution: value as string,
                  });
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-7 p-4 border border-secondary rounded-xl">
            <Icon
              icon="heroicons:information-circle"
              className="min-w-6 min-h-6 text-secondary"
            />
            <p className="text-base text-custom-gray-400">
              {t("GetStarted.starter.autoEnrolled.info")}
            </p>
          </div>
        </div>

        <div className="mt-10 gap-4 w-full flex justify-center items-center">
          <div className="flex gap-4 w-full md:w-fit">
            <SecondaryButton
              text={t("GetStarted.starter.navigation.back")}
              onClick={() => router.back()}
              className="!w-full md:!min-w-fit !px-6 !py-2"
            />
            <PrimaryButton
              text={t("GetStarted.starter.navigation.saveAndContinue")}
              onClick={() => {
                setShowLimitations(true);
              }}
              className="!w-full md:!min-w-fit !px-6 !py-2"
            />
          </div>
        </div>
      </div>
      {showLimitations && (
        <Starter401kLimitationsModal
          onClose={() => setShowLimitations(false)}
          onContinue={handleSaveAndContinue}
          disabled={isSaving}
        />
      )}
    </div>
  );
};

export const dynamic = "force-static";
export default Starter401kPlanPage;
