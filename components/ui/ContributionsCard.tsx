"use client";

import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

export function ContributionsCard() {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-4xl shadow-sm border border-gray-200 h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("ContributionsCard.title")}
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          {t("ContributionsCard.viewAll")}
        </button>
      </div>

      <div className="space-y-3 flex-1">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            {t("ContributionsCard.currentPeriodContribution")}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            $2,222/- {t("ContributionsCard.perPeriod")}
          </p>
          <p className="text-sm text-gray-500">
            $1,000 {t("ContributionsCard.fromYou")} + $1,222{" "}
            {t("ContributionsCard.fromEmployer")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">
            {t("ContributionsCard.annualContribution")}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            $2,222/- {t("ContributionsCard.contributionIn2024")}
          </p>
          <p className="text-sm text-gray-500">
            $1,000 {t("ContributionsCard.fromYou")} + $1,222{" "}
            {t("ContributionsCard.fromEmployer")}
          </p>
        </div>

        <Link
          href="/participant-dashboard/contributions"
          className="w-full text-custom-tertiary-100 py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block mt-auto"
        >
          {t("ContributionsCard.manageContributions")}
        </Link>
      </div>
    </div>
  );
}
