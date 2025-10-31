"use client";

import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { PlanType, usePlanTypes } from "@/services/plan-sponser";
import { useLanguage } from "@/hooks/useLanguage";
import { FiAlertTriangle, FiCheck } from "react-icons/fi";

interface PricingFeature {
  text: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: "primary" | "secondary";
  highlighted?: boolean;
  note?: {
    title: string;
    description: string;
  };
}

// Loading component
const LoadingCards: FC = () => {
  // const { t } = useLanguage();

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <div className="h-5 w-5 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Error component
const ErrorCards: FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1200px] px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <FiAlertTriangle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("Pricing.error.title")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("Pricing.error.tryAgainButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert API data to pricing tier format
const convertPlanTypeToPricingTier = (
  planType: unknown,
  t: unknown
): PricingTier => {
  const pt = planType as PlanType;
  const translate = t as (
    key: string,
    options?: Record<string, unknown>
  ) => string;
  const features: PricingFeature[] = [
    {
      text: translate("Pricing.features.monthlyCost", { cost: pt.monthlyCost }),
    },
    {
      text: translate("Pricing.features.perParticipantFee", {
        fee: pt.perParticipantFee,
      }),
    },
    {
      text: translate("Pricing.features.employerContribution", {
        contribution: pt.employerContribution,
      }),
    },
    {
      text: translate("Pricing.features.employeeLimit", {
        limit: pt.employeeContributionLimit?.toLocaleString(),
      }),
    },
    {
      text: translate("Pricing.features.compliance", {
        protection: pt.complianceProtection,
      }),
    },
    { text: translate("Pricing.features.taxCredit", { credit: pt.taxCredit }) },
  ];

  return {
    name: pt.name,
    price:
      pt.monthlyCost === 0
        ? translate("Pricing.common.free")
        : `$${pt.monthlyCost}`,
    period: translate("Pricing.common.period"),
    description: pt.description,
    features,
    buttonText: translate("Pricing.common.getStartedButton"),
    buttonVariant: pt.name === "Safe Harbor 401(k)" ? "primary" : "secondary",
    highlighted: pt.name === "Safe Harbor 401(k)",
  };
};

interface CardProps {
  tier: PricingTier;
  handlePlanSelection: (name: string) => void;
}

export const Card: FC<CardProps> = ({ tier, handlePlanSelection }) => {
  const { t } = useLanguage();
  return (
    <div key={tier.name} className="flex flex-col gap-2 w-full">
      <h5 className="text-custom-gray-700 font-medium text-base md:text-lg text-center">
        {/* {tier.note?.title} */}
      </h5>
      <p className="text-custom-gray-400 text-center mb-10 text-sm md:text-base">
        {/* {tier.note?.description} */}
      </p>
      <div
        className={`rounded-lg relative border p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg ${
          tier.highlighted
            ? "border-blue-500 bg-white shadow-lg bg-gradient-to-b from-white to-blue-50"
            : "border-gray-200 bg-white"
        }`}
      >
        {tier.highlighted && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-6 py-2.5 rounded-full text-white text-sm">
            {t("Pricing.common.popular")}
          </div>
        )}
        <h3
          className={`text-lg font-semibold ${
            tier.highlighted ? "text-primary" : "text-custom-gray-500"
          }`}
        >
          {tier.name}
        </h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold tracking-tight text-custom-gray-700">
            {tier.price}
          </span>
          {tier.period && (
            <span className="ml-1 text-sm font-normal text-custom-gray-500">
              {tier.period}
            </span>
          )}
        </div>
        <p className="mt-4 text-sm text-custom-gray-500">{tier.description}</p>
        <button
          className={`mt-6 w-full rounded-full px-4 py-2 text-sm font-semibold cursor-pointer ${
            tier.buttonVariant === "primary"
              ? "bg-gradient-to-r from-primary to-secondary text-white"
              : "bg-custom-gray-700 text-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary transition-all duration-300 ease-in-out"
          }`}
          onClick={() => handlePlanSelection(tier.name)}
        >
          {tier.buttonText}
        </button>
        <ul className="mt-8 space-y-4 border-t border-[#1A1A1A2E] pt-8 border-dashed">
          {tier.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              <FiCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="ml-2 text-sm text-custom-gray-700">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const SoloCard: FC<CardProps> = ({ tier, handlePlanSelection }) => {
  return (
    <div key={tier.name} className="flex flex-col gap-2 w-full">
      <h5 className="text-custom-gray-700 font-medium text-base md:text-lg text-center">
        {tier.note?.title}
      </h5>
      <p className="text-custom-gray-400 text-center mb-10 text-sm md:text-base">
        {tier.note?.description}
      </p>
      <div
        className={`rounded-lg relative border p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg border-gray-200 bg-white`}
      >
        <h3
          className={`text-lg font-semibold text-custom-gray-500 text-center`}
        >
          {tier.name}
        </h3>
        <div className="mt-4 flex items-baseline text-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-custom-gray-700">
            {tier.price}
          </span>
          {tier.period && (
            <span className="ml-1 text-sm font-normal text-custom-gray-500">
              {tier.period}
            </span>
          )}
        </div>
        <p className="mt-4 text-sm text-custom-gray-500 text-center">
          {tier.description}
        </p>
        <div className="flex justify-center">
          <button
            className={`mt-6 w-full rounded-full px-4 py-2 text-sm font-semibold cursor-pointer text-white bg-custom-gray-700 max-w-xs`}
            onClick={() => handlePlanSelection(tier.name)}
          >
            {tier.buttonText}
          </button>
        </div>
        <ul className="mt-4 space-y-4 pt-8 grid grid-cols-2 gap-1">
          {tier.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              <FiCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="ml-2 text-sm text-custom-gray-700">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const PricingCards: FC = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const {
    data: planTypes = [],
    isLoading: loading,
    error,
    refetch,
  } = usePlanTypes();

  const getStartedRoute = (name: string) => {
    switch (name) {
      case "Starter 401(k)":
        return "/get-started/starter";
      case "Safe Harbor 401(k)":
        return "/get-started/safe-harbor";
      case "Traditional 401(k)":
        return "/get-started/traditional";
      case "Solo 401(k)":
        return "/get-started/solo";
      default:
        return "/get-started";
    }
  };

  const handlePlanSelection = (planName: string) => {
    // Navigate to the appropriate page
    router.push(getStartedRoute(planName));
  };

  // Show loading state
  if (loading) {
    return <LoadingCards />;
  }

  // Show error state
  if (error) {
    return <ErrorCards error={error.message} onRetry={refetch} />;
  }

  // Convert API data to pricing tiers
  const pricingTiers: PricingTier[] = planTypes.map((planType) =>
    convertPlanTypeToPricingTier(planType, t)
  );

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              tier={tier}
              handlePlanSelection={handlePlanSelection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
