"use client";

import React from "react";
import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import { FaRegCalendar } from "react-icons/fa6";

interface CustomDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  status?: "error" | "warning";
  className?: string;
  disabled?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder,
  status,
  className = "",
  disabled = false,
}) => {
  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (onChange) {
      onChange(Array.isArray(dateString) ? dateString[0] : dateString);
    }
  };

  const dateValue = value ? dayjs(value, "DD-MM-YYYY") : null;

  return (
    <div className={`w-full ${className}`}>
      <DatePicker
        value={dateValue}
        onChange={handleChange}
        placeholder={placeholder}
        status={status}
        disabled={disabled}
        format="DD-MM-YYYY"
        style={{ width: "100%", height: "48px" }}
        className="rounded-[10px]"
        suffixIcon={<FaRegCalendar className="w-5 h-5 text-custom-gray-400" />}
      />
    </div>
  );
};

export default CustomDatePicker;
