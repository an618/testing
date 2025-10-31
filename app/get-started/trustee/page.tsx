"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useTrusteeConfirmation } from "@/services/trustee";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Dropdown from "@/components/ui/Dropdown";
import { FormField } from "@/components/ui";
import { usePlanDetails } from "@/services/plan-sponser";

export default function TrusteePage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Handle plan state routing
  usePlanStateRouting();
  const [isTrustee, setIsTrustee] = useState("");
  const [trusteeDetails, setTrusteeDetails] = useState({
    title: "",
    legalName: "",
    emailId: "",
  });
  // const [checks] = useState([true, true, true]);
  const {
    mutateAsync: confirmTrustee,
    isPending,
    error,
  } = useTrusteeConfirmation();

  const { data: planDetails } = usePlanDetails();

  const handleSaveAndContinue = async () => {
    try {
      const payload = {
        isTrustee: isTrustee === "Yes",
        isAgree: true,
        isAuthorize: true,
        trusteeTitle: trusteeDetails.title,
        trusteeLegalName: trusteeDetails.legalName,
        trusteeEmail: trusteeDetails.emailId,
      };
      if (isTrustee === "No") {
        payload.trusteeTitle = "";
        payload.trusteeLegalName = "";
        payload.trusteeEmail = "";
      }
      const response = await confirmTrustee(payload);
      if (response && response.id) {
        localStorage.setItem("trusteeConfirmationId", response.id);
      }
      router.push(`/get-started/authorize`);
    } catch (e) {
      console.error("Error confirming trustee:", e);
      // Error is handled by react-query onError
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-primary">
          {t("GetStarted.trustee.title")}
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-10 m-2 md:m-0">
          <div className="border border-custom-lavender-100 rounded-lg p-6">
            <div className="text-sm text-gray-700 mb-4">
              {t("GetStarted.trustee.description.part1")}{" "}
              <a href="#" className="underline text-primary">
                {t("GetStarted.trustee.description.planTrustee")}
              </a>{" "}
              {t("GetStarted.trustee.description.part2")}
            </div>

            <div className="font-semibold text-gray-900 mb-4">
              {t("GetStarted.trustee.question", {
                company: planDetails?.legalName,
              })}
            </div>

            <div className="text-sm text-gray-700 mb-6">
              {t("GetStarted.trustee.description.part3", {
                company: planDetails?.legalName,
              })}
            </div>

            <div className="mb-6">
              <Dropdown
                options={["Yes", "No"]}
                value={isTrustee}
                setValue={setIsTrustee}
                className="bg-custom-lavender-100 border-custom-lavender-100"
              />
            </div>

            {isTrustee === "Yes" && (
              <div className="space-y-6 mb-6">
                <div className="text-sm text-gray-700 mb-4">
                  {t("GetStarted.trustee.forms.appointDetails")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label={t("GetStarted.trustee.forms.title")}>
                    <input
                      type="text"
                      placeholder={t(
                        "GetStarted.trustee.forms.placeholders.title"
                      )}
                      value={trusteeDetails.title}
                      onChange={(e) =>
                        setTrusteeDetails((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                    />
                  </FormField>

                  <FormField label={t("GetStarted.trustee.forms.legalName")}>
                    <input
                      type="text"
                      placeholder={t(
                        "GetStarted.trustee.forms.placeholders.legalName"
                      )}
                      value={trusteeDetails.legalName}
                      onChange={(e) =>
                        setTrusteeDetails((prev) => ({
                          ...prev,
                          legalName: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                    />
                  </FormField>
                </div>

                <FormField label={t("GetStarted.trustee.forms.emailId")}>
                  <input
                    type="email"
                    placeholder={t(
                      "GetStarted.trustee.forms.placeholders.emailId"
                    )}
                    value={trusteeDetails.emailId}
                    onChange={(e) =>
                      setTrusteeDetails((prev) => ({
                        ...prev,
                        emailId: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mx-2 md:mx-0">
            {error.message || t("GetStarted.trustee.error.generic")}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4 flex-col sm:flex-row">
          <SecondaryButton
            text={t("GetStarted.trustee.navigation.back")}
            onClick={() => router.back()}
            className="!w-full sm:!w-fit !px-6 !py-2"
            containerClassName="!w-full sm:!w-fit"
          />
          <PrimaryButton
            text={t("GetStarted.trustee.navigation.saveAndContinue")}
            onClick={handleSaveAndContinue}
            className="!w-full sm:!w-fit !px-6 !py-2"
            loading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
