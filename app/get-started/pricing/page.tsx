"use client";
import React, { useState } from "react";
import { FiInfo, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useCorePricing } from "@/services/pricing";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

function InfoIcon() {
  const { t, isClient } = useLanguage();

  if (!isClient) {
    return null;
  }

  return (
    <span
      className="inline-block align-middle ml-1 text-gray-400"
      title={t("GetStarted.reviewPricing.accessibility.moreInfo")}
      aria-label={t("GetStarted.reviewPricing.accessibility.moreInfo")}
    >
      <FiInfo size={16} />
    </span>
  );
}

export default function ReviewCorePricingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isNavigating, setIsNavigating] = useState(false);

  // Handle plan state routing
  usePlanStateRouting();

  const { data: pricing, isLoading, error, refetch } = useCorePricing();

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
          <p className="text-primary">
            {t("GetStarted.reviewPricing.loading.information")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="text-center max-w-md">
          <FiAlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-white mb-2">
            {t("GetStarted.reviewPricing.error.title")}
          </h2>
          <p className="text-white mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100 transition-colors"
          >
            {t("GetStarted.reviewPricing.error.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="text-center">
          <p className="text-primary">
            {t("GetStarted.reviewPricing.loading.noPricing")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-primary">
          {t("GetStarted.reviewPricing.title")}
        </h1>

        <div className="bg-white rounded-3xl p-4 md:p-10 m-2 md:m-0">
          <div className="border border-custom-gray-100 rounded-3xl p-3">
            {/* Tax Credit Information */}
            <div className="rounded-3xl mb-4">
              <div className="text-base text-gray-700">
                {t("GetStarted.reviewPricing.taxCreditInfo.text")}
              </div>
            </div>

            <div className="bg-custom-lavender-100 rounded-lg px-4 py-2.5">
              {/* Employer pays (Plan Administration) */}
              <div className="mb-6">
                <div className="font-semibold text-gray-700 mb-3">
                  {t("GetStarted.reviewPricing.employerPays.title")}
                </div>
                <div className="space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-gray-400">
                      {t("GetStarted.reviewPricing.employerPays.baseFee")}{" "}
                      <InfoIcon />
                    </span>
                    <span className="font-medium text-gray-400">
                      ${pricing.baseFee}
                      {t("GetStarted.reviewPricing.units.perMonth")}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-gray-400">
                      {t(
                        "GetStarted.reviewPricing.employerPays.participantFee"
                      )}{" "}
                      <InfoIcon />
                    </span>
                    <span className="font-medium text-gray-400">
                      ${pricing.participantFee}{" "}
                      {t("GetStarted.reviewPricing.units.perParticipantMonth")}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <span className="text-gray-400">
                      {t("GetStarted.reviewPricing.employerPays.accountFee")}{" "}
                      <InfoIcon />
                    </span>
                    <span className="font-medium text-gray-400">
                      ${pricing.employeeAccountFee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employer pays (Investment Management) */}
              <div>
                <div className="font-semibold text-gray-700 mb-3">
                  {t("GetStarted.reviewPricing.employerPaysInvestment.title")}
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <span className="text-gray-400">
                    {t(
                      "GetStarted.reviewPricing.employerPaysInvestment.accountFee"
                    )}{" "}
                    <InfoIcon />
                  </span>
                  <span className="font-medium text-gray-400">
                    ${pricing.employerAccountFee}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4 flex-col sm:flex-row">
          <SecondaryButton
            text={t("GetStarted.reviewPricing.navigation.back")}
            onClick={() => router.back()}
            className="!w-full sm:!w-fit !px-6 !py-2"
            containerClassName="!w-full sm:!w-fit"
          />
          <PrimaryButton
            text={t("GetStarted.reviewPricing.navigation.saveAndContinue")}
            onClick={() => {
              setIsNavigating(true);
              router.push(`/get-started/date`);
            }}
            className="!w-full sm:!w-fit !px-6 !py-2"
            loading={isNavigating}
          />
        </div>
      </div>
    </div>
  );
}
