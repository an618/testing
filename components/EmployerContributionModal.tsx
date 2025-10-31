"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, FAQ } from "@/components/ui/Modal";
import { FiInfo } from 'react-icons/fi';
import { useLanguage } from '@/hooks/useLanguage';
import { useVestingSchedules } from '@/hooks/useVestingSchedules';

interface EmployerContributionValue {
  type: string;
  percentage: string;
  vesting: string;
}

interface EmployerContributionModalProps {
  value: EmployerContributionValue;
  onSave: (v: EmployerContributionValue) => void;
  onClose: () => void;
}

const typeOptions = ["Employer match"];
const percentageOptions = ["4% basic", "Custom", "3.5% QACA"];

export function EmployerContributionModal({ value, onSave, onClose }: EmployerContributionModalProps) {
  const { t } = useLanguage();
  const { vestingSchedules, loading: vestingLoading } = useVestingSchedules();
  const [type, setType] = useState(value.type);
  const [percentage, setPercentage] = useState(value.percentage);
  const [vesting, setVesting] = useState(value.vesting);
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
    onSave({ 
      type, 
      percentage, 
      vesting,
    });
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.employerContribution.title')}
      description={t('GetStarted.modals.employerContribution.description')}
      onSave={handleSave}
    >
      <div className="flex flex-col gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
            {t('GetStarted.modals.employerContribution.contributionType.label')}
            <span title={t('GetStarted.modals.employerContribution.contributionType.tooltip')} className="text-gray-400 cursor-help">
              <FiInfo size={16} />
            </span>
          </label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]" value={type} onChange={e => setType(e.target.value)}>
            {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
            {t('GetStarted.modals.employerContribution.contributionPercentage.label')}
            <span title={t('GetStarted.modals.employerContribution.contributionPercentage.tooltip')} className="text-gray-400 cursor-help">
              <FiInfo size={16} />
            </span>
          </label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]" value={percentage} onChange={e => setPercentage(e.target.value)}>
            {percentageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
            {t('GetStarted.modals.employerContribution.vestingSchedule.label')}
            <span title={t('GetStarted.modals.employerContribution.vestingSchedule.tooltip')} className="text-gray-400 cursor-help">
              <FiInfo size={16} />
            </span>
          </label>
          <select 
            className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]" 
            value={vesting} 
            onChange={e => setVesting(e.target.value)}
            disabled={vestingLoading}
          >
            {vestingLoading ? (
              <option value="">Loading vesting schedules...</option>
            ) : (
              <>
                {vestingSchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
                <option value="Custom">Custom</option>
              </>
            )}
          </select>
          {!vestingLoading && vesting && vesting !== "Custom" && (
            <div className="mt-2 text-sm text-gray-600">
              {vestingSchedules.find(schedule => schedule.name === vesting)?.description}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-[#F6F6F6] rounded p-3 text-sm text-[#1A1A1AB2] mb-4">
        {t('GetStarted.modals.employerContribution.summary')}
      </div>
      
      <FAQ
        question={t('GetStarted.modals.employerContribution.faq.qaca.question')}
        answer={t('GetStarted.modals.employerContribution.faq.qaca.answer')}
        isOpen={faq1}
        onToggle={() => setFaq1(!faq1)}
      />
      
      <FAQ
        question={t('GetStarted.modals.employerContribution.faq.changeMind.question')}
        answer={t('GetStarted.modals.employerContribution.faq.changeMind.answer')}
        isOpen={faq2}
        onToggle={() => setFaq2(!faq2)}
      />
    </Modal>
  );
} 