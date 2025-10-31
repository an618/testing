"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { FiInfo } from 'react-icons/fi';
import { useLanguage } from '@/hooks/useLanguage';

interface ContributionRateModalProps {
  value: string;
  onSave: (newValue: string) => void;
  onClose: () => void;
}

const options = ["3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%"];

export function ContributionRateModal({ value, onSave, onClose }: ContributionRateModalProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(value);
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
    onSave(selected);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.contributionRate.title')}
      description={t('GetStarted.modals.contributionRate.description')}
      onSave={handleSave}
    >
      <div className="mb-4">
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1A1A1A]"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          aria-label="Default employee contribution rate"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      
      <p className="text-xs text-[#1A1A1AB2] mb-4">
        {t('GetStarted.modals.contributionRate.info')}
      </p>
      
      <div className="flex items-start gap-2 bg-[#F6F6F6] rounded p-3 mb-6">
        <FiInfo size={20} className="text-[#6B7280]" />
        <span className="text-xs text-[#1A1A1AB2]">{t('GetStarted.modals.contributionRate.minimumContribution')}</span>
      </div>
    </Modal>
  );
} 