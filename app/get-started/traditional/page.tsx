"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateCompanyPlan } from "@/services/plan-sponser";
import { usePlanTypes } from "@/services/plan-sponser";
import { useLanguage } from "@/hooks/useLanguage";
import { useVestingSchedules } from "@/hooks/useVestingSchedules";
import { Icon } from "@iconify/react";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import InputWithDropdown from "@/components/ui/InputWithDropdown";
import Dropdown from "@/components/ui/Dropdown";
import { dropdownConfigs } from "@/config/dropdownConfig";
import { EnhancedModal } from "@/components/ui/EnhancedModal";

const TraditionalPlanPage = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const {
    mutateAsync: createCompanyPlan,
    isPending: isSaving,
    error: saveError,
  } = useCreateCompanyPlan();
  const { data: planTypes = [] } = usePlanTypes();
  const { vestingSchedules, loading: vestingLoading } = useVestingSchedules();

  // State for employer contribution
  const [employerContributionType, setEmployerContributionType] =
    useState("Employer match");
  const [employerContributionPercentage, setEmployerContributionPercentage] =
    useState("100% match up to 3%");
  const [employerVesting, setEmployerVesting] = useState("2 year cliff");

  // State for employee eligibility
  const [minimumAge, setMinimumAge] = useState("21");
  const [timeEmployed, setTimeEmployed] = useState("0");
  const [exclusions, setExclusions] = useState("None");
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);

  // State for auto-enrollment
  const [defaultContributionRate, setDefaultContributionRate] = useState("5");
  const [annualIncrease, setAnnualIncrease] = useState<{
    mode: "minimum" | "custom";
    annualIncrease?: string;
    maxContribution?: string;
  }>({ mode: "minimum" });

  // State for profit sharing
  const [profitSharingDefault, setProfitSharingDefault] = useState("None");
  const [profitSharingFormula, setProfitSharingFormula] = useState("Pro-rata");
  const [profitSharingVesting, setProfitSharingVesting] = useState("");

  // State for modal
  const [showNondiscriminationModal, setShowNondiscriminationModal] =
    useState(false);

  // Set default vesting schedule when data is loaded
  useEffect(() => {
    if (vestingSchedules.length > 0 && !profitSharingVesting) {
      setProfitSharingVesting(vestingSchedules[0].id);
    }
  }, [vestingSchedules, profitSharingVesting]);

  const handleSaveAndContinue = () => {
    setShowNondiscriminationModal(true);
  };

  const handleConfirmNondiscrimination = async () => {
    try {
      // Find the Traditional 401(k) plan type
      const traditionalPlan = planTypes.find((plan) =>
        plan.name.toLowerCase().includes("traditional")
      );
      if (!traditionalPlan) {
        throw new Error("Traditional 401(k) plan type not found");
      }

      // Parse annual increase values
      const enrollmentAnnualIncrease =
        annualIncrease.mode === "minimum"
          ? 2.0
          : parseFloat(annualIncrease.annualIncrease?.replace("%", "") || "2");

      const enrollmentMaxRate =
        annualIncrease.mode === "minimum"
          ? 10.0
          : parseFloat(
              annualIncrease.maxContribution?.replace("%", "") || "10"
            );

      // Create the request body based on UI fields
      const requestBody = {
        tenantId: "tenant-123", // This should come from user context
        planTypeId: traditionalPlan.id,
        employeeContributionConfig: {
          hasEmployeeContribution: true,
          defaultContributionRate: parseFloat(defaultContributionRate),
          isAutoEnrollment: true,
          enrollmentAnnualIncrease,
          enrollmentMaxRate,
        },
        eligibility: {
          minimumEntryAge: parseInt(minimumAge),
          timeEmployedMonths: parseInt(timeEmployed),
        },
        employerContributionConfig: {
          type: "match",
          matchPercentage: 100,
          matchLimitPercent: 3,
          vestingSchedule: employerVesting,
        },
        profitSharingConfig: {
          isEnabled: profitSharingDefault !== "None",
          formula: profitSharingFormula,
          vestingSchedule: profitSharingVesting,
        },
      };

      // Call the API
      const result = await createCompanyPlan(requestBody);

      // Navigate to next step with the company plan ID
      if (result.id) {
        router.push(`/get-started/business`);
      }
    } catch (error) {
      console.error("Failed to create company plan:", error);
    }
  };

  const handleSeeOtherPlans = () => {
    setShowNondiscriminationModal(false);
    router.push("/pricing");
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mt-8 text-primary">
          {t("GetStarted.traditional.title")}
        </h1>
        <p className="text-center text-xl text-custom-gray-600 mt-3">
          {t("GetStarted.traditional.description")}
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

        {/* Set up Employer contribution */}
        <div className="bg-white rounded-xl p-10 flex flex-col mt-10">
          <h2 className="font-semibold text-custom-gray-600 text-base">
            {t("GetStarted.traditional.employerContribution.title")}
          </h2>
          <p className="text-base mt-3 text-custom-gray-400">
            {t("GetStarted.traditional.employerContribution.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
            <InputWithDropdown
              title={t(
                "GetStarted.traditional.employerContribution.contributionType"
              )}
              options={dropdownConfigs.employerContributionType.options}
              value={employerContributionType}
              setValue={(value) => setEmployerContributionType(value as string)}
            />
          </div>
          {employerContributionType === "Employer match" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7 border-t border-custom-quaternary-300 pt-7">
                <InputWithDropdown
                  title={t(
                    "GetStarted.traditional.employerContribution.percentageQuestion"
                  )}
                  options={
                    dropdownConfigs.employerContributionPercentage.options
                  }
                  value={employerContributionPercentage}
                  setValue={(value) =>
                    setEmployerContributionPercentage(value as string)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
                <InputWithDropdown
                  title={t(
                    "GetStarted.traditional.employerContribution.vestingQuestion"
                  )}
                  options={dropdownConfigs.employerVesting.options}
                  value={employerVesting}
                  setValue={(value) => setEmployerVesting(value as string)}
                />
              </div>
            </>
          )}
        </div>

        {/* Employee eligibility */}
        <div className="bg-white rounded-xl p-10 flex flex-col mt-6">
          <h2 className="font-semibold text-custom-gray-600 text-base">
            {t("GetStarted.traditional.employeeEligibility.title")}
          </h2>
          <p className="text-base mt-3 text-custom-gray-400">
            {t("GetStarted.traditional.employeeEligibility.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
            <InputWithDropdown
              title={t("GetStarted.traditional.employeeEligibility.minimumAge")}
              options={dropdownConfigs.minimumAge.options}
              value={minimumAge}
              displayValues={dropdownConfigs.minimumAge.getDisplayValues(
                t,
                dropdownConfigs.minimumAge.options
              )}
              setValue={(value) => setMinimumAge(value as string)}
            />
            <InputWithDropdown
              title={t(
                "GetStarted.traditional.employeeEligibility.timeEmployed"
              )}
              options={dropdownConfigs.timeEmployed.options}
              value={timeEmployed}
              displayValues={dropdownConfigs.timeEmployed.getDisplayValues(
                t,
                dropdownConfigs.timeEmployed.options
              )}
              setValue={(value) => setTimeEmployed(value as string)}
            />
            <InputWithDropdown
              title={t(
                "GetStarted.traditional.employerContribution.exclusions"
              )}
              options={dropdownConfigs.exclusions.options}
              value={exclusions}
              setValue={(value) => setExclusions(value as string)}
            />
            {exclusions === "Select from list" && (
              <InputWithDropdown
                title={t(
                  "GetStarted.traditional.employerContribution.selectExclusions"
                )}
                options={dropdownConfigs.exclusionsList.options}
                value={selectedExclusions}
                setValue={(value) => setSelectedExclusions(value as string[])}
              />
            )}
          </div>
        </div>

        {/* Auto-enrolled employees */}
        <div className="bg-white rounded-xl p-10 flex flex-col mt-6">
          <h2 className="font-semibold text-custom-gray-600 text-base">
            {t("GetStarted.traditional.autoEnrolled.title")}
          </h2>
          <p className="text-base mt-3 text-custom-gray-400">
            {t("GetStarted.traditional.autoEnrolled.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base text-custom-gray-700">
                  {t("GetStarted.traditional.autoEnrolled.defaultRate")}
                </h2>
                <Icon
                  icon="heroicons:information-circle"
                  className="w-5 h-5 text-gray-400"
                />
              </div>
              <Dropdown
                className="!bg-custom-lavender-100 border-none !rounded-lg"
                options={dropdownConfigs.defaultRate.options}
                setValue={(value: string) => setDefaultContributionRate(value)}
                value={defaultContributionRate}
                displayValues={dropdownConfigs.defaultRate.getDisplayValues(
                  dropdownConfigs.defaultRate.options
                )}
              />
              <p className="text-sm text-custom-gray-500">
                {t("GetStarted.traditional.autoEnrolled.defaultRateNote")}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base text-custom-gray-700">
                  {t("GetStarted.traditional.autoEnrolled.annualIncrease")}
                </h2>
                <Icon
                  icon="heroicons:information-circle"
                  className="w-5 h-5 text-gray-400"
                />
              </div>
              <Dropdown
                className="!bg-custom-lavender-100 border-none !rounded-lg"
                options={dropdownConfigs.annualIncrease.options}
                setValue={(value: string) => {
                  setAnnualIncrease({
                    mode: value as "minimum" | "custom",
                    annualIncrease: undefined,
                    maxContribution: undefined,
                  });
                }}
                value={annualIncrease.mode}
              />
            </div>
          </div>

          {annualIncrease.mode === "custom" && (
            <div className="mt-7 border-t border-custom-quaternary-200 pt-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithDropdown
                  title={t(
                    "GetStarted.traditional.autoEnrolled.annualIncreaseRate"
                  )}
                  options={dropdownConfigs.annualRates.options}
                  value={annualIncrease.annualIncrease || "3"}
                  setValue={(value) => {
                    setAnnualIncrease({
                      mode: "custom",
                      annualIncrease: value as string,
                      maxContribution: annualIncrease.maxContribution,
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
                <InputWithDropdown
                  title={t(
                    "GetStarted.traditional.autoEnrolled.maximumContributionRate"
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
            </div>
          )}

          {/* Information box */}
          <div className="flex items-center gap-3 mt-7 p-4 border border-secondary rounded-xl">
            <Icon
              icon="heroicons:information-circle"
              className="min-w-6 min-h-6 text-secondary"
            />
            <p className="text-base text-custom-gray-400">
              {t("GetStarted.traditional.autoEnrolled.infoBox")}
            </p>
          </div>
        </div>

        {/* Profit sharing feature */}
        <div className="bg-white rounded-xl p-10 flex flex-col mt-6">
          <h2 className="font-semibold text-custom-gray-600 text-base">
            {t("GetStarted.traditional.profitSharing.title")}
          </h2>
          <p className="text-base mt-3 text-custom-gray-400">
            {t("GetStarted.traditional.profitSharing.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
            <div className="flex flex-col gap-2">
              <h2 className="text-base text-custom-gray-700">
                {t("GetStarted.traditional.profitSharing.defaultContribution")}
              </h2>
              <div className="flex items-center gap-2">
                <Dropdown
                  className="!bg-custom-lavender-100 border-none !rounded-lg flex-1"
                  options={dropdownConfigs.profitSharingDefault.options}
                  setValue={(value: string) => setProfitSharingDefault(value)}
                  value={profitSharingDefault}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-base text-custom-gray-700">
                {t("GetStarted.traditional.profitSharing.profitSharingFormula")}
              </h2>
              <Dropdown
                className="!bg-custom-lavender-100 border-none !rounded-lg"
                options={dropdownConfigs.profitSharingFormula.options(t)}
                setValue={(value: string) => setProfitSharingFormula(value)}
                value={profitSharingFormula}
              />
            </div>
            <InputWithDropdown
              title={t("GetStarted.traditional.profitSharing.vestingSchedule")}
              options={vestingSchedules.map((schedule) => ({
                label: schedule.name,
                value: schedule.id,
              }))}
              value={profitSharingVesting}
              setValue={(value) => setProfitSharingVesting(value as string)}
              disabled={vestingLoading}
            />
          </div>

          {/* Pro-rata note */}
          {profitSharingFormula === "Pro-rata" && (
            <div className="flex items-center gap-3 mt-4 p-4 border border-secondary rounded-xl">
              <Icon
                icon="heroicons:information-circle"
                className="min-w-6 min-h-6 text-secondary"
              />
              <p className="text-base text-custom-gray-400">
                {t("GetStarted.traditional.profitSharing.proRataNote")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 gap-4 w-full flex justify-center items-center">
          <div className="flex gap-4 w-full md:w-fit">
            <SecondaryButton
              text={t("GetStarted.traditional.navigation.back")}
              onClick={() => router.back()}
              className="!w-full md:!min-w-fit !px-6 !py-2"
            />
            <PrimaryButton
              text={t("GetStarted.traditional.navigation.saveAndContinue")}
              onClick={handleSaveAndContinue}
              className="!w-full md:!min-w-fit !px-6 !py-2"
            />
          </div>
        </div>
      </div>

      {/* Nondiscrimination Modal */}
      <EnhancedModal
        isOpen={showNondiscriminationModal}
        onClose={() => setShowNondiscriminationModal(false)}
        title={t("GetStarted.modals.nondiscrimination.title")}
        description={t("GetStarted.modals.nondiscrimination.description")}
        primaryButton={{
          text: t("GetStarted.modals.nondiscrimination.understand"),
          onClick: handleConfirmNondiscrimination,
          loading: isSaving,
        }}
        secondaryButton={{
          text: t("GetStarted.modals.nondiscrimination.seeOtherPlans"),
          onClick: handleSeeOtherPlans,
        }}
        size="lg"
      >
        <div className="space-y-4">
          {/* Corrections list */}
          <div className="space-y-2">
            <ul className="list-disc list-inside space-y-1 text-sm text-custom-gray-600">
              <li>{t("GetStarted.modals.nondiscrimination.corrections.0")}</li>
              <li>{t("GetStarted.modals.nondiscrimination.corrections.1")}</li>
            </ul>
          </div>

          {/* Compliance note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Icon
              icon="heroicons:shield-check"
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-blue-800">
              {t("GetStarted.modals.nondiscrimination.complianceNote")}
            </p>
          </div>
        </div>
      </EnhancedModal>
    </div>
  );
};

export const dynamic = "force-static";
export default TraditionalPlanPage;
