"use client";
import React, { useState } from "react";

interface AgeOption {
  value: string;
  label: string;
}

interface AgeDropdownProps {
  options: AgeOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function AgeDropdown({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select your age",
}: AgeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleOptionClick = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <div
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors"
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-between">
          <span
            className={`${selectedOption ? "text-gray-900" : "text-gray-500"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleOptionClick(option.value)}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    selectedValue === option.value
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedValue === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                  )}
                </div>
              </div>
              <span className="text-gray-900 font-medium">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




