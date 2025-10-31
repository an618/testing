"use client";
import React, { useState } from "react";
import { Modal, FAQ } from "@/components/ui/Modal";
import { useLanguage } from "@/hooks/useLanguage";
import { useVestingSchedules } from "@/hooks/useVestingSchedules";
import { VestingSchedule } from "@/services/vesting";

interface VestingScheduleModalProps {
  value: string;
  onSave: (v: string, id: string) => void;
  onClose: () => void;
}

export function VestingScheduleModal({
  value,
  onSave,
  onClose,
}: VestingScheduleModalProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(value);
  const [selectedId, setSelectedId] = useState<string>("");
  const [faq, setFaq] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { vestingSchedules, loading, error, getVestingScheduleById } =
    useVestingSchedules();

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  const handleSave = () => {
    onSave(selected, selectedId);
    handleClose();
  };

  const handleScheduleChange = (scheduleId: string) => {
    const schedule = vestingSchedules.find((s) => s.id === scheduleId);
    if (schedule) {
      setSelected(schedule.name);
      setSelectedId(schedule.id);
    }
  };

  const getScheduleDescription = (schedule: VestingSchedule) => {
    if (schedule.scheduleType === "immediate") {
      return "Employees own the contributions as soon as they're made.";
    } else if (schedule.scheduleType === "cliff") {
      return `0% vested for first ${schedule.yearsToFullVest} years, 100% vested after ${schedule.yearsToFullVest} years.`;
    } else {
      return schedule.description;
    }
  };

  if (loading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={t("GetStarted.modals.vestingSchedule.loading.title")}
        showSaveButton={false}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C3DF4]"></div>
          <span className="ml-3 text-[#1A1A1A]">
            {t("GetStarted.modals.vestingSchedule.loading.message")}
          </span>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={t("GetStarted.modals.vestingSchedule.error.title")}
        showSaveButton={false}
      >
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            {t("GetStarted.modals.vestingSchedule.error.message")}
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.vestingSchedule.title")}
      description={t("GetStarted.modals.vestingSchedule.description")}
      onSave={handleSave}
    >
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
          {t("GetStarted.modals.vestingSchedule.label")}
        </label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]"
          value={selectedId}
          onChange={(e) => handleScheduleChange(e.target.value)}
          aria-label="Vesting schedule"
        >
          <option value="" disabled>
            {t("GetStarted.modals.vestingSchedule.placeholder")}
          </option>
          {vestingSchedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {schedule.name}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <div className="bg-[#F6F6F6] rounded p-3 text-sm text-[#1A1A1AB2] mb-4">
          {getVestingScheduleById(selectedId) &&
            getScheduleDescription(getVestingScheduleById(selectedId)!)}
        </div>
      )}

      <FAQ
        question={t("GetStarted.modals.vestingSchedule.faq.question")}
        answer={t("GetStarted.modals.vestingSchedule.faq.answer")}
        isOpen={faq}
        onToggle={() => setFaq(!faq)}
      />
    </Modal>
  );
}
