"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, FAQ } from "@/components/ui/Modal";
import { useLanguage } from '@/hooks/useLanguage';

interface AnnualIncreaseModalProps {
  value: {
    mode: "minimum" | "custom";
    annualIncrease?: string;
    maxContribution?: string;
  };
  onSave: (newValue: AnnualIncreaseModalProps["value"]) => void;
  onClose: () => void;
}

const annualOptions = ["1%", "2%", "3%", "4%", "5%"];
const maxOptions = ["10%", "12%", "15%", "18%", "20%"];

export function AnnualIncreaseModal({ value, onSave, onClose }: AnnualIncreaseModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"minimum" | "custom">(value.mode);
  const [annualIncrease, setAnnualIncrease] = useState(value.annualIncrease || "2%");
  const [maxContribution, setMaxContribution] = useState(value.maxContribution || "15%");
  const [faqOpen, setFaqOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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

  const handleSave = () => {
    if (mode === "minimum") {
      onSave({ mode: "minimum" });
    } else {
      onSave({ mode: "custom", annualIncrease, maxContribution });
    }
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.annualIncrease.title')}
      description={t('GetStarted.modals.annualIncrease.description')}
      onSave={handleSave}
    >
      <div className="mb-4">
        <span className="block font-semibold mb-2 text-[#1A1A1A]">{t('GetStarted.modals.annualIncrease.chooseOptions')}</span>
        <div className="flex flex-col gap-3">
          <label className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all ${mode === "minimum" ? "border-[#6C3DF4] bg-[#F6F6F6]" : "border-gray-300"}`}> 
            <input
              type="radio"
              className="accent-[#6C3DF4] mr-2"
              checked={mode === "minimum"}
              onChange={() => setMode("minimum")}
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#6C3DF4] mb-1">{t('GetStarted.modals.annualIncrease.minimumRequired')}</span>
              <span className="text-sm text-[#1A1A1A]">{t('GetStarted.modals.annualIncrease.minimumDescription')}</span>
            </div>
          </label>
          <label className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all ${mode === "custom" ? "border-[#6C3DF4] bg-[#F6F6F6]" : "border-gray-300"}`}> 
            <input
              type="radio"
              className="accent-[#6C3DF4] mr-2"
              checked={mode === "custom"}
              onChange={() => setMode("custom")}
            />
            <span className="text-sm text-[#1A1A1A]">{t('GetStarted.modals.annualIncrease.customize')}</span>
          </label>
        </div>
      </div>
      
      {mode === "custom" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">{t('GetStarted.modals.annualIncrease.annualIncreaseLabel')}</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1A1A1A]"
            value={annualIncrease}
            onChange={e => setAnnualIncrease(e.target.value)}
          >
            {annualOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">{t('GetStarted.modals.annualIncrease.maxContributionLabel')}</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1A1A1A]"
            value={maxContribution}
            onChange={e => setMaxContribution(e.target.value)}
          >
            {maxOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
      
      <FAQ
        question={t('GetStarted.modals.annualIncrease.faqQuestion')}
        answer={t('GetStarted.modals.annualIncrease.faqAnswer')}
        isOpen={faqOpen}
        onToggle={() => setFaqOpen(!faqOpen)}
      />
    </Modal>
  );
} 