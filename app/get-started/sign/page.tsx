"use client";
import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  DocumentViewerModal,
  DocumentData,
} from "@/components/DocumentViewerModal";
import { useLanguage } from "@/hooks/useLanguage";
import { useTrusteeSignature } from "@/services/trustee";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { HiDocumentText } from "react-icons/hi";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useDocumentsList } from "@/services/documents";

export default function SignPlanPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isPending, error } = useTrusteeSignature();
  const { data: documentsResponse } = useDocumentsList({
    tenantId: "9ddfcec7-8be6-41d9-b3c7-cc569805ccf7",
  });

  // Handle plan state routing
  usePlanStateRouting();

  const [checked, setChecked] = useState([false, false]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [documents, setDocuments] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (documentsResponse?.documents) {
      setDocuments(
        documentsResponse.documents.map((document) => ({
          title: document.fileKey,
          type: "pdf",
          url: document.downloadUrl,
        }))
      );
    }
  }, [documentsResponse]);

  const handleSignPlan = async () => {
    if (!checked[0] || !checked[1] || !firstName.trim() || !lastName.trim()) {
      return;
    }
    try {
      // await signTrustee({
      //   firstName: firstName.trim(),
      //   lastName: lastName.trim(),
      //   signatureText: `${firstName.trim()} ${lastName.trim()}`,
      //   isDocumentsRead: checked[0],
      //   isChangesUnderstood: checked[1],
      // });
      // On success, redirect or show success
      router.push(`/finch`);
    } catch (error) {
      console.error("Error signing trustee:", error);
      // Error handled by react-query
    }
  };

  const canSign =
    checked[0] && checked[1] && firstName.trim() && lastName.trim();

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-primary">
          {t("GetStarted.sign.title")}
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mx-2 md:mx-0">
            {error.message || t("GetStarted.sign.error.generic")}
          </div>
        )}
        <div className="bg-white rounded-3xl p-4 md:p-10 m-2 md:m-0">
          <div className="border border-custom-gray-100 rounded-lg p-3">
            {/* View all documents */}
            <div className="">
              <div className="font-semibold text-gray-700 mb-2">
                {t("GetStarted.sign.documents.title")}
              </div>
              <div className="text-gray-500 text-sm mb-4">
                {t("GetStarted.sign.documents.description.part1")}
              </div>

              {documents.length > 0 ? (
                <>
                  {" "}
                  {/* Document List */}
                  <div className="bg-custom-lavender-100 rounded-lg py-2.5 px-4 space-y-3">
                    {documents.map((document, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700 flex-1">
                          {document.title}
                        </span>
                        <PrimaryButton
                          icon={
                            <HiDocumentText size={16} className="min-w-4" />
                          }
                          text={t("GetStarted.sign.documents.viewButton")}
                          onClick={() => setModalOpen(true)}
                          className="!px-4 !py-2 !flex-shrink-0 !w-fit !text-base !font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="border border-secondary rounded-lg p-4 flex items-start gap-3">
                    <span className="mt-1">
                      <FiInfo size={16} className="text-secondary" />
                    </span>
                    <span className="text-sm text-custom-gray-500">
                      {t("GetStarted.sign.documents.notice")}
                    </span>
                  </div>
                </>
              )}

              {/* Info Notice */}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-10 mt-10">
          <div className="border border-custom-gray-100 rounded-3xl p-3">
            {/* Sign your plan */}
            <div>
              <div className="font-semibold text-gray-700 mb-3">
                {t("GetStarted.sign.signPlan.title")}
              </div>
              <div className="text-gray-500 text-sm mb-4">
                {t("GetStarted.sign.signPlan.description.part1")}
              </div>
              <div className="text-gray-500 text-sm mb-6">
                {t("GetStarted.sign.signPlan.description.part2")}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 cursor-pointer border border-custom-gray-100 rounded-xl p-3">
                  <input
                    type="checkbox"
                    checked={checked[0]}
                    onChange={() => setChecked((c) => [!c[0], c[1]])}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-500 leading-relaxed">
                    {t("GetStarted.sign.signPlan.confirmations.0")}
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer border border-custom-gray-100 rounded-xl p-3">
                  <input
                    type="checkbox"
                    checked={checked[1]}
                    onChange={() => setChecked((c) => [c[0], !c[1]])}
                    className="mt-1 w-4 h-4 min-w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-500 leading-relaxed">
                    {t("GetStarted.sign.signPlan.confirmations.1")}
                  </span>
                </label>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("GetStarted.sign.signPlan.form.firstName")}
                  </label>
                  <input
                    className="w-full bg-custom-lavender-100 outline-none rounded-lg px-3 py-2 text-gray-900"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t(
                      "GetStarted.sign.signPlan.form.firstNamePlaceholder"
                    )}
                    type="text"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {t("GetStarted.sign.signPlan.form.lastName")}
                  </label>
                  <input
                    className="w-full bg-custom-lavender-100 outline-none rounded-lg px-3 py-2 text-gray-900"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t(
                      "GetStarted.sign.signPlan.form.lastNamePlaceholder"
                    )}
                    type="text"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Signature */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  {t("GetStarted.sign.signPlan.signature.label")}
                </label>
                <div className="w-full rounded-lg px-3 py-4 bg-custom-lavender-100 min-h-[60px] flex items-center">
                  <span className="text-gray-500 text-sm">
                    {firstName && lastName
                      ? `${firstName} ${lastName}`
                      : t("GetStarted.sign.signPlan.signature.placeholder")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Text */}
        <div className="text-xs text-gray-500 text-center py-10">
          {t("GetStarted.sign.signPlan.agreement.text")}{" "}
          <a href="#" className="underline text-primary">
            {t("GetStarted.sign.signPlan.agreement.privacyPolicy")}
          </a>{" "}
          {t("GetStarted.sign.signPlan.agreement.and")}{" "}
          <a href="#" className="underline text-primary">
            {t("GetStarted.sign.signPlan.agreement.advBrochure")}
          </a>
          .
        </div>

        {/* <div className="flex justify-center gap-4 flex-col sm:flex-row">
          <button
            className="w-full sm:w-fit px-6 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-semibold"
            onClick={() => router.back()}
            type="button"
            disabled={isPending}
          >
            {t("GetStarted.sign.navigation.back")}
          </button>
          <button
            className={`w-full sm:w-fit px-6 py-2 rounded-full font-semibold transition-colors ${
              canSign && !isPending
                ? "bg-primary text-white hover:bg-primary-700"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
            onClick={handleSignPlan}
            disabled={!canSign || isPending}
            type="button"
          >
            {isPending
              ? t("GetStarted.sign.navigation.signingPlan")
              : t("GetStarted.sign.navigation.signPlan")}
          </button>
        </div> */}

        <div className="flex justify-center gap-4 mt-4 flex-col sm:flex-row">
          <SecondaryButton
            text={t("GetStarted.sign.navigation.back")}
            onClick={() => router.back()}
            className="!w-full sm:!w-fit !px-6 !py-2"
            containerClassName="!w-full sm:!w-fit"
          />
          <PrimaryButton
            text={
              isPending
                ? t("GetStarted.sign.navigation.signingPlan")
                : t("GetStarted.sign.navigation.signPlan")
            }
            onClick={handleSignPlan}
            disabled={!canSign || isPending}
            className="!w-full sm:!w-fit !px-6 !py-2"
          />
        </div>
      </div>
      <DocumentViewerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        documents={documents}
      />
    </div>
  );
}
