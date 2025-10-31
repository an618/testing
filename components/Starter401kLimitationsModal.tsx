"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { EnhancedModal, InfoIcon } from "@/components/ui/EnhancedModal";
import { useLanguage } from "@/hooks/useLanguage";

interface Starter401kLimitationsModalProps {
  onClose: () => void;
  onContinue: () => void;
  disabled: boolean;
}

export function Starter401kLimitationsModal({
  onClose,
  onContinue,
  disabled,
}: Starter401kLimitationsModalProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  const handleContinue = () => {
    onContinue();
    handleClose();
  };

  const handleSeeOtherPlans = () => {
    router.push("/pricing");
    handleClose();
  };

  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.limitations.title")}
      description={t("GetStarted.modals.limitations.description")}
      secondaryButton={{
        text: t("GetStarted.modals.limitations.seeOtherPlans"),
        onClick: handleSeeOtherPlans,
      }}
      primaryButton={{
        text: disabled
          ? t("GetStarted.modals.limitations.saving")
          : t("GetStarted.modals.limitations.understand"),
        onClick: handleContinue,
        disabled: disabled,
        loading: disabled,
      }}
      size="lg"
    >
      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-custom-gray-700">
        <li className="flex items-start gap-2">
          <span className="w-1 h-1 bg-custom-gray-700 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
          <span className="font-semibold">
            {t("GetStarted.modals.limitations.limitations.0")}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1 h-1 bg-custom-gray-700 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
          <span className="font-semibold">
            {t("GetStarted.modals.limitations.limitations.1")}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1 h-1 bg-custom-gray-700 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-semibold">
              {t("GetStarted.modals.limitations.limitations.2")}
            </span>
            <InfoIcon size={14} className="text-secondary sm:w-4 sm:h-4" />
          </div>
        </li>
      </ul>
    </EnhancedModal>
  );
}
