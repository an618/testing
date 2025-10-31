"use client";

import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import RadioOption from "./RadioOption";

export interface AccordionOption {
  id: string;
  label: string;
  value: string;
}

export interface AccordionProps {
  title: string;
  options: AccordionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  contentClassName?: string;
}

export default function Accordion({
  title,
  options,
  selectedValue,
  onSelect,
  isOpen = false,
  onToggle,
  className = "",
  contentClassName = "",
}: AccordionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

  const isAccordionOpen = onToggle ? isOpen : internalIsOpen;
  const handleToggle = () => {
    const newIsOpen = !isAccordionOpen;
    if (onToggle) {
      onToggle(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Accordion Header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 bg-custom-lavender-100 rounded-lg border-none "
        aria-expanded={isAccordionOpen}
        aria-controls="accordion-content"
      >
        <span className="text-left font-medium text-custom-gray-600 text-base">
          {title}
        </span>
        {isAccordionOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-custom-gray-600 " />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-custom-gray-600" />
        )}
      </button>

      {/* Accordion Content */}
      {isAccordionOpen && (
        <div
          id="accordion-content"
          className={`mt-6 space-y-4 ${contentClassName}`}
          role="region"
          aria-labelledby="accordion-header"
        >
          {options.map((option, idx) => (
            <RadioOption
              key={option.id}
              option={option.label}
              selected={selectedValue === option.value ? idx : -1}
              setSelected={() => onSelect(option.value)}
              idx={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
