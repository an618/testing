"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { RadioGroupField, InfoBox } from "@/components/ui/FormField";
import { useModal } from "@/hooks/useModal";
import { useLanguage } from '@/hooks/useLanguage';

interface ProfitSharingFormulaModalProps {
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}

export function ProfitSharingFormulaModal({ value, onSave, onClose }: ProfitSharingFormulaModalProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(value);
  const { isOpen, handleClose } = useModal({ onClose, initialOpen: true });

  const options = [
    {
      value: "Pro-rata",
      label: t('GetStarted.modals.profitSharingFormula.options.proRata.label'),
      description: t('GetStarted.modals.profitSharingFormula.options.proRata.description'),
    },
    {
      value: "Flat dollar",
      label: t('GetStarted.modals.profitSharingFormula.options.flatDollar.label'),
      description: t('GetStarted.modals.profitSharingFormula.options.flatDollar.description'),
    },
    {
      value: "New comparability",
      label: t('GetStarted.modals.profitSharingFormula.options.newComparability.label'),
      description: t('GetStarted.modals.profitSharingFormula.options.newComparability.description'),
      badge: t('GetStarted.modals.profitSharingFormula.options.newComparability.badge'),
    },
  ];

  const handleSave = () => {
    onSave(selected);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.profitSharingFormula.title')}
      description={t('GetStarted.modals.profitSharingFormula.description')}
      onSave={handleSave}
      size="lg"
    >
      <RadioGroupField
        label={t('GetStarted.modals.profitSharingFormula.label')}
        value={selected}
        onChange={setSelected}
        options={options}
        helpText={t('GetStarted.modals.profitSharingFormula.helpText')}
      />
      
      <InfoBox variant="info" className="mb-4">
        {t('GetStarted.modals.profitSharingFormula.info')}
      </InfoBox>
    </Modal>
  );
} 