"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, FAQ } from "@/components/ui/Modal";
import { FiInfo, FiLock } from 'react-icons/fi';
import { useLanguage } from '@/hooks/useLanguage';

interface TimeEmployedModalProps {
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}

const monthOptions = [
  { value: "0 months", label: "0 months" },
  { value: "3 months", label: "3 months" },
  { value: "6 months", label: "6 months" },
  { value: "12 months", label: "12 months" },
];

export function TimeEmployedModal({ value, onSave, onClose }: TimeEmployedModalProps) {
  const { t } = useLanguage();
  const [months, setMonths] = useState(value);
  const [faq1, setFaq1] = useState(false);
  const [faq2, setFaq2] = useState(false);
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
    onSave(months);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.timeEmployed.title')}
      description={t('GetStarted.modals.timeEmployed.description')}
      onSave={handleSave}
    >
      <div className="mb-4">
        <div className="mb-2">
          <div className="text-sm font-semibold text-[#1A1A1A]">{t('GetStarted.modals.timeEmployed.newHires.title')}</div>
          <div className="text-xs text-[#1A1A1AB2] mb-1">{t('GetStarted.modals.timeEmployed.newHires.description')}</div>
          <select
            className="w-40 border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]"
            value={months}
            onChange={e => setMonths(e.target.value)}
            aria-label="New hires months"
          >
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <div className="text-sm font-semibold text-[#1A1A1A]">{t('GetStarted.modals.timeEmployed.existingEmployees.title')}</div>
          <div className="text-xs text-[#1A1A1AB2] mb-1">{t('GetStarted.modals.timeEmployed.existingEmployees.description')}</div>
          <div className="w-40 border border-gray-200 rounded px-3 py-2 bg-gray-50 text-[#1A1A1A] flex items-center gap-2">
            {t('GetStarted.modals.timeEmployed.existingEmployees.value')}
            <span className="ml-1 text-gray-400" title={t('GetStarted.modals.timeEmployed.locked')}>
              <FiLock className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-2 bg-[#F6F6F6] rounded p-3 mb-4">
        <FiInfo size={20} className="text-[#6B7280]" />
        <span className="text-xs text-[#1A1A1AB2]">{t('GetStarted.modals.timeEmployed.info')}</span>
      </div>
      
      <FAQ
        question={t('GetStarted.modals.timeEmployed.faq.partTime.question')}
        answer={t('GetStarted.modals.timeEmployed.faq.partTime.answer')}
        isOpen={faq1}
        onToggle={() => setFaq1(!faq1)}
      />
      
      <FAQ
        question={t('GetStarted.modals.timeEmployed.faq.rehired.question')}
        answer={t('GetStarted.modals.timeEmployed.faq.rehired.answer')}
        isOpen={faq2}
        onToggle={() => setFaq2(!faq2)}
      />
    </Modal>
  );
} 