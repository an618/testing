"use client";

import { PricingCards, SoloCard } from "@/components/PricingCards";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const { t } = useLanguage();
  const [isSolo, setIsSolo] = useState(false);

  // Call the plan state API
  usePlanStateRouting();

  useEffect(() => {
    const isSolo = localStorage.getItem("isSolo");
    if (isSolo) setIsSolo(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
      <h5 className="text-custom-gray-700 font-bold text-2xl md:text-3xl text-center mb-5 mt-10">
        {isSolo ? t("Pricing.soloTitle") : t("Pricing.title")}
      </h5>
      <p className="text-custom-gray-700 text-center text-sm md:text-base max-w-7xl mb-10 px-4">
        {t("Pricing.note")}
      </p>
      <div className="w-full">
        {isSolo ? (
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="max-w-4xl w-full">
              <SoloCard
                tier={{
                  name: "Solo 401(k)",
                  price: "$0",
                  period: " /month",
                  description:
                    "Maximum employee/employer contributions with tax benefits for self-employed individuals",
                  features: [
                    {
                      text: "Auto-Enrollment",
                    },
                    {
                      text: "Standard & custom portfolios",
                    },
                    {
                      text: "Employee & Employer contributions",
                    },
                    {
                      text: "Record-keeping & IRS reporting",
                    },
                    {
                      text: "Expert selected fund list",
                    },
                  ],
                  buttonText: "Get Started",
                  buttonVariant: "secondary",
                  note: {
                    title:
                      "Solo maximizes retirement savings for self-employed individuals (and their spouses)",
                    description:
                      "This plan option allows self-employed individuals to maximize their contributions both as employee and employer",
                  },
                }}
                handlePlanSelection={() => {}}
              />
            </div>
          </div>
        ) : (
          <PricingCards />
        )}
      </div>
    </div>
  );
}
