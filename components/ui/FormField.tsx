"use client";

import React from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  helpText?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ 
  label, 
  children, 
  helpText, 
  required = false, 
  className = "" 
}: FormFieldProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helpText && (
        <p className="text-xs text-[#1A1A1AB2] mt-1">{helpText}</p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  helpText?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  helpText,
  required = false,
  className = "",
  disabled = false,
}: SelectFieldProps) {
  return (
    <FormField label={label} helpText={helpText} required={required} className={className}>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

interface RadioGroupFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ 
    value: string; 
    label: string; 
    description?: string;
    badge?: string;
  }>;
  helpText?: string;
  required?: boolean;
  className?: string;
}

export function RadioGroupField({
  label,
  value,
  onChange,
  options,
  helpText,
  required = false,
  className = "",
}: RadioGroupFieldProps) {
  return (
    <FormField label={label} helpText={helpText} required={required} className={className}>
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={`relative border rounded-lg p-4 flex flex-col cursor-pointer transition-all ${
              value === option.value ? "border-black" : "border-gray-300"
            } ${option.badge ? "mt-2" : ""}`}
          >
            {option.badge && (
              <span className="absolute top-3 left-3 bg-[#FEF3C7] text-[#B45309] text-xs font-semibold px-2 py-0.5 rounded">
                {option.badge}
              </span>
            )}
            <span className="font-semibold text-[#1A1A1A] mb-1">{option.label}</span>
            {option.description && (
              <span className="text-sm text-[#1A1A1AB2] mb-2">{option.description}</span>
            )}
            <input
              type="radio"
              name={label.toLowerCase().replace(/\s+/g, '-')}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 accent-[#6C3DF4] w-5 h-5"
              aria-checked={value === option.value}
              aria-label={option.label}
            />
            {value === option.value && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                <FiCheckCircle size={20} className="text-[#6C3DF4]" />
              </span>
            )}
          </label>
        ))}
      </div>
    </FormField>
  );
}

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning';
  className?: string;
}

export function InfoBox({ children, variant = 'info', className = "" }: InfoBoxProps) {
  const variantStyles = {
    info: "bg-[#F6F6F6] text-[#1A1A1AB2]",
    success: "bg-green-50 text-green-800 border border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  };

  const icons = {
    info: <FiInfo size={20} className="mt-0.5 text-[#6B7280]" />,
    success: <FiCheckCircle size={20} className="mt-0.5 text-green-600" />,
    warning: <FiAlertCircle size={20} className="mt-0.5 text-yellow-600" />,
  };

  return (
    <div className={`flex items-start gap-2 rounded p-3 text-sm ${variantStyles[variant]} ${className}`}>
      {icons[variant]}
      <span className="flex-1">{children}</span>
    </div>
  );
} 