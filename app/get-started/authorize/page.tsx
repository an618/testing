"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

const company = "Yatra";

export default function AuthorizePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [checks, setChecks] = useState([false, false, false]);

  const checkboxTexts = [
    t("GetStarted.trustee.agreements.emailAddresses", { company }),
    t("GetStarted.trustee.agreements.investmentManager"),
    t("GetStarted.trustee.agreements.planAdministrator"),
  ];

  const handleSaveAndContinue = async () => {
    try {
      // await confirmTrustee({
      //   isTrustee: false,
      //   isAgree: checks[0],
      //   isAuthorize: checks[1] && checks[2], // Both investment manager and plan admin authorization
      // });

      router.push(`/get-started/sign`);
    } catch (e) {
      console.error("Error confirming trustee:", e);
      // Error is handled by react-query onError
    }
  };

  const handleCheckboxChange = (index: number) => {
    setChecks((prev) => prev.map((check, i) => (i === index ? !check : check)));
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-primary">
          {t("GetStarted.authorize.title")}
        </h1>

        <div className="bg-white rounded-3xl p-4 md:p-10 m-2 md:m-0">
          <div className="border border-custom-primary-100 rounded-lg p-6">
            <div className="text-base text-gray-700 font-medium mb-6">
              {t("GetStarted.authorize.subtitle")}
            </div>

            <div className="space-y-4">
              {checkboxTexts.map((text, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border border-custom-quaternary-100 rounded-xl px-4 py-5"
                >
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={checks[index]}
                    onChange={() => handleCheckboxChange(index)}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor={`checkbox-${index}`}
                    className="text-sm text-gray-500 leading-relaxed cursor-pointer"
                  >
                    {text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mx-2 md:mx-0">
            {error.message || t("GetStarted.authorize.error.generic")}
          </div>
        )} */}

        <div className="flex justify-center gap-4 mt-4 flex-col sm:flex-row">
          <SecondaryButton
            text={t("GetStarted.authorize.navigation.back")}
            onClick={() => router.back()}
            className="!w-full sm:!w-fit !px-6 !py-2"
            containerClassName="!w-full sm:!w-fit"
          />
          <PrimaryButton
            disabled={checks.some((check) => !check)}
            text={
              // isPending
              //   ? t("GetStarted.authorize.navigation.saving")
              t("GetStarted.authorize.navigation.saveAndContinue")
            }
            onClick={handleSaveAndContinue}
            className="!w-full sm:!w-fit !px-6 !py-2"
          />
        </div>
      </div>
    </div>
  );
}
