"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, FAQ } from "@/components/ui/Modal";
import { ENTITY_TYPES, PAYROLL_PROVIDERS, PAY_SCHEDULES, DAYS_BEFORE_PAYROLL, YES_NO_OPTIONS, EMPLOYEE_COUNT_RANGES, RETIREMENT_PLAN_TYPES } from "@/utils/constants";
import { useLanguage } from "@/hooks/useLanguage";

// EIN Modal
export function EINModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
  const [input, setInput] = useState(value);
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
    onSave(input);
    handleClose();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.ein.title")}
      description={t("GetStarted.modals.businessDetails.ein.description")}
      onSave={handleSave}
    >
      <input 
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-[#1A1A1A]" 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder={t("GetStarted.modals.businessDetails.ein.placeholder")} 
      />
      
      <FAQ
        question={t("GetStarted.modals.businessDetails.ein.faq.question")}
        answer={t("GetStarted.modals.businessDetails.ein.faq.answer")}
        isOpen={faq}
        onToggle={() => setFaq(!faq)}
      />
    </Modal>
  );
}

// Business Address Modal
export interface BusinessAddressFields {
  street: string;
  apt: string;
  city: string;
  state: string;
  postal: string;
  phone: string;
  mailingDiffers: boolean;
}

export function BusinessAddressModal({ value, onSave, onClose }: { value: BusinessAddressFields; onSave: (v: BusinessAddressFields) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
  const [fields, setFields] = useState<BusinessAddressFields>(value || { street: "", apt: "", city: "", state: "", postal: "", phone: "", mailingDiffers: false });
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
    onSave(fields);
    handleClose();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.businessAddress.title")}
      description={t("GetStarted.modals.businessDetails.businessAddress.description")}
      onSave={handleSave}
    >
      <input 
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-[#1A1A1A]" 
        value={fields.street} 
        onChange={e => setFields(f => ({ ...f, street: e.target.value }))} 
        placeholder={t("GetStarted.modals.businessDetails.businessAddress.street")} 
      />
      <input 
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-[#1A1A1A]" 
        value={fields.apt} 
        onChange={e => setFields(f => ({ ...f, apt: e.target.value }))} 
        placeholder={t("GetStarted.modals.businessDetails.businessAddress.apt")} 
      />
      <div className="flex gap-2 mb-2">
        <input 
          className="w-1/3 border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]" 
          value={fields.city} 
          onChange={e => setFields(f => ({ ...f, city: e.target.value }))} 
          placeholder={t("GetStarted.modals.businessDetails.businessAddress.city")} 
        />
        <input 
          className="w-1/3 border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]" 
          value={fields.state} 
          onChange={e => setFields(f => ({ ...f, state: e.target.value }))} 
          placeholder={t("GetStarted.modals.businessDetails.businessAddress.state")} 
        />
        <input 
          className="w-1/3 border border-gray-300 rounded px-3 py-2 text-[#1A1A1A]" 
          value={fields.postal} 
          onChange={e => setFields(f => ({ ...f, postal: e.target.value }))} 
          placeholder={t("GetStarted.modals.businessDetails.businessAddress.postal")} 
        />
      </div>
      <input 
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 text-[#1A1A1A]" 
        value={fields.phone} 
        onChange={e => setFields(f => ({ ...f, phone: e.target.value }))} 
        placeholder={t("GetStarted.modals.businessDetails.businessAddress.phone")} 
      />
      <label className="flex items-center gap-2 mt-2 text-sm">
        <input 
          type="checkbox" 
          checked={fields.mailingDiffers} 
          onChange={e => setFields(f => ({ ...f, mailingDiffers: e.target.checked }))} 
        />
        {t("GetStarted.modals.businessDetails.businessAddress.mailingDiffers")}
      </label>
    </Modal>
  );
}

// Entity Type Modal
export function EntityTypeModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.entityType.title")}
      description={t("GetStarted.modals.businessDetails.entityType.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.entityType.placeholder")}</option>
        {ENTITY_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
}

// Payroll Provider Modal
export function PayrollProviderModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.payrollProvider.title")}
      description={t("GetStarted.modals.businessDetails.payrollProvider.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.payrollProvider.placeholder")}</option>
        {PAYROLL_PROVIDERS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
}

// Payroll Schedule Modal
export function PayrollScheduleModal({ value, onSave, onClose }: { value: { schedule: string; days: string }; onSave: (v: { schedule: string; days: string }) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
  const [schedule, setSchedule] = useState(value.schedule || "");
  const [days, setDays] = useState(value.days || "4");
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
    onSave({ schedule, days });
    handleClose();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.payrollSchedule.title")}
      description={t("GetStarted.modals.businessDetails.payrollSchedule.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-2" 
        value={schedule} 
        onChange={e => setSchedule(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.payrollSchedule.placeholder")}</option>
        {PAY_SCHEDULES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-4" 
        value={days} 
        onChange={e => setDays(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.payrollSchedule.daysBefore")}</option>
        {DAYS_BEFORE_PAYROLL.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      
      <FAQ
        question="What if I have owners?"
        answer="If you have owners, you may need to submit payroll on a different schedule. Please consult your plan administrator."
        isOpen={faq}
        onToggle={() => setFaq(!faq)}
      />
    </Modal>
  );
}

// Legal Name Modal
export function LegalNameModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
  const [input, setInput] = useState(value);
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
    onSave(input);
    handleClose();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.legalName.title")}
      description={t("GetStarted.modals.businessDetails.legalName.description")}
      onSave={handleSave}
    >
      <input 
        className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-[#1A1A1A]" 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder={t("GetStarted.modals.businessDetails.legalName.placeholder")} 
      />
    </Modal>
  );
}

// Estimated Employee Count Modal
export function EstimatedEmployeeCountModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.estimatedEmployeeCount.title")}
      description={t("GetStarted.modals.businessDetails.estimatedEmployeeCount.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.estimatedEmployeeCount.placeholder")}</option>
        {EMPLOYEE_COUNT_RANGES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
}

// Union Employees Modal
export function UnionEmployeesModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.unionEmployees.title")}
      description={t("GetStarted.modals.businessDetails.unionEmployees.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.unionEmployees.placeholder")}</option>
        {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
}

// Leased Employees Modal
export function LeasedEmployeesModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.leasedEmployees.title")}
      description={t("GetStarted.modals.businessDetails.leasedEmployees.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.leasedEmployees.placeholder")}</option>
        {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
}

// Existing Retirement Plan Modal
export function ExistingRetirementPlanModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.existingRetirementPlan.title")}
      description={t("GetStarted.modals.businessDetails.existingRetirementPlan.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.existingRetirementPlan.placeholder")}</option>
        {RETIREMENT_PLAN_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
}

// Related Entities Modal
export function RelatedEntitiesModal({ value, onSave, onClose }: { value: string; onSave: (v: string) => void; onClose: () => void }) {
  const { t, isClient } = useLanguage();
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

  if (!isClient) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("GetStarted.modals.businessDetails.relatedEntities.title")}
      description={t("GetStarted.modals.businessDetails.relatedEntities.description")}
      onSave={handleSave}
    >
      <select 
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] mb-6" 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled>{t("GetStarted.modals.businessDetails.relatedEntities.placeholder")}</option>
        {YES_NO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </Modal>
  );
} 