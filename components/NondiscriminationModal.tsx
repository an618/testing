"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '@/hooks/useLanguage';

interface NondiscriminationModalProps {
  onClose: () => void;
  onContinue: () => void;
}

export function NondiscriminationModal({ onClose, onContinue }: NondiscriminationModalProps) {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.nondiscrimination.title')}
      description={t('GetStarted.modals.nondiscrimination.description')}
      showSaveButton={false}
    >
      <ul className="mb-4 text-sm text-[#1A1A1A] list-disc pl-5">
        <li>{t('GetStarted.modals.nondiscrimination.corrections.0')}</li>
        <li>{t('GetStarted.modals.nondiscrimination.corrections.1')}</li>
      </ul>
      
      <div className="flex items-start gap-2 bg-[#F6F6F6] rounded p-3 mb-6">
        <FiCheckCircle size={20} className="text-green-600" />
        <span className="text-xs text-[#1A1A1AB2] font-semibold">{t('GetStarted.modals.nondiscrimination.complianceNote')}</span>
      </div>
      
      <div className="flex justify-between gap-2 border-t pt-4">
        <button
          className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold cursor-pointer"
          onClick={() => router.push("/pricing")}
          type="button"
        >
          {t('GetStarted.modals.nondiscrimination.seeOtherPlans')}
        </button>
        <button
          className="px-4 py-2 rounded bg-[#6C3DF4] text-white font-semibold hover:bg-[#5327c6] focus:outline-none cursor-pointer"
          onClick={handleContinue}
          type="button"
        >
          {t('GetStarted.modals.nondiscrimination.understand')}
        </button>
      </div>
    </Modal>
  );
} 