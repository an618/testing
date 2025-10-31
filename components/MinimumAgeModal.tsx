"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, FAQ } from "@/components/ui/Modal";
import { useLanguage } from '@/hooks/useLanguage';

interface MinimumAgeModalProps {
  value: string;
  onSave: (v: string) => void;
  onClose: () => void;
}

const ageOptions = ["18", "19", "20", "21"];

export function MinimumAgeModal({ value, onSave, onClose }: MinimumAgeModalProps) {
  const { t } = useLanguage();
  // Extract the number from the formatted string (e.g., "At least 19 years old" -> "19")
  const extractAge = (str: string) => {
    const match = str.match(/(\d+)/);
    return match ? match[1] : "18";
  };
  const [age, setAge] = useState(extractAge(value));
  const [faq, setFaq] = useState(false);
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
    // Save the formatted string instead of just the number
    onSave(`At least ${age} years old`);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('GetStarted.modals.minimumAge.title')}
      description={t('GetStarted.modals.minimumAge.description')}
      onSave={handleSave}
    >
      <div className="mb-4">
        <select
          className="w-32 border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]"
          value={age}
          onChange={e => setAge(e.target.value)}
          aria-label="Minimum age"
        >
          {ageOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      
      <FAQ
        question={t('GetStarted.modals.minimumAge.faq.question')}
        answer={t('GetStarted.modals.minimumAge.faq.answer')}
        isOpen={faq}
        onToggle={() => setFaq(!faq)}
      />
    </Modal>
  );
} 