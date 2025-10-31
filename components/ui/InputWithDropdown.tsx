"use client";

import React from "react";
import Dropdown from "./Dropdown";
import MultiSelect from "./MultiSelect";

/**
 * InputWithDropdown - A reusable component for form fields with dropdown or multi-select functionality
 *
 * This component automatically renders either a Dropdown or MultiSelect based on the value type:
 * - string value: renders Dropdown component
 * - string[] value: renders MultiSelect component
 *
 * Usage:
 * <InputWithDropdown
 *   title="Field Title"
 *   options={["option1", "option2"]}
 *   value={selectedValue}
 *   setValue={setSelectedValue}
 *   displayValues={{ "option1": "Display Name 1" }}
 *   disabled={false}
 * />
 */

interface InputWithDropdownProps {
  title: string;
  options: string[] | { label: string; value: string }[];
  value: string | string[];
  displayValues?: Record<string, string>;
  disabled?: boolean;
  setValue: (value: string | string[]) => void;
  className?: string;
}

const InputWithDropdown: React.FC<InputWithDropdownProps> = ({
  title,
  options,
  value,
  displayValues,
  disabled = false,
  setValue,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h2 className="text-base text-custom-gray-700">{title}</h2>
      {typeof value === "string" ? (
        <Dropdown
          className="!bg-custom-lavender-100 border-none !rounded-lg"
          options={options}
          setValue={setValue}
          value={value}
          disabled={disabled}
          displayValues={displayValues}
        />
      ) : (
        <MultiSelect
          className="!bg-custom-lavender-100 border-none !rounded-lg"
          options={options}
          setValue={setValue}
          value={value}
        />
      )}
    </div>
  );
};

export default InputWithDropdown;
