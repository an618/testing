import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

type Option =
  | string
  | {
      label: string;
      value: string;
      highlight?: string;
    };

export default function MultiSelect({
  options,
  setValue,
  value,
  className,
  disabled,
  displayValues,
}: {
  options: Option[];
  setValue: (value: string[]) => void;
  value: string[];
  className?: string;
  disabled?: boolean;
  displayValues?: Record<string, string>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set default selection if value is empty
  useEffect(() => {
    if (value.length === 0 && options.length > 0) {
      const first = options[0];
      setValue([typeof first === "string" ? first : first.value]);
    }
  }, [value, options, setValue]);

  // Get label for selected values
  const selectedLabels = value.map((val) => {
    if (displayValues?.[val]) return displayValues[val];
    const match = options.find((opt) =>
      typeof opt === "string" ? opt === val : opt.value === val
    );
    return typeof match === "string" ? match : match?.label || val;
  });

  // Toggle a value on checkbox change
  const toggleValue = (selected: string) => {
    if (value.includes(selected)) {
      setValue(value.filter((v) => v !== selected));
    } else {
      setValue([...value, selected]);
    }
  };

  return (
    <div className="w-full relative font-sans" ref={dropdownRef}>
      <button
        id="Dropdown"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-white border border-custom-quaternary-100 rounded-xl p-3 text-left text-custom-gray-500 flex justify-between items-center focus:outline-none cursor-pointer ${className} ${
          disabled ? "!cursor-not-allowed" : ""
        }`}
      >
        <span className="truncate">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : "Select..."}
        </span>
        {disabled ? (
          <Icon icon="heroicons:lock-closed" className="w-4 h-4" />
        ) : (
          <Icon
            icon="heroicons:chevron-down"
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && (
        <ul
          tabIndex={-1}
          role="listbox"
          className="absolute mt-1 w-full bg-white border border-custom-quaternary-200 rounded-lg shadow-lg max-h-60 overflow-auto z-10 p-2 hide-scrollbar"
        >
          {options.map((option) => {
            const val = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            const highlight =
              typeof option === "string" ? null : option.highlight;

            return (
              <li
                key={val}
                role="option"
                aria-selected={value.includes(val)}
                onClick={() => toggleValue(val)}
                className={`p-3 cursor-pointer flex items-start hover:bg-custom-quaternary-100 border hover:border-secondary rounded-lg text-custom-gray-700 ${
                  value.includes(val)
                    ? "border-secondary bg-custom-quaternary-100"
                    : "border-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={value.includes(val)}
                  onChange={() => toggleValue(val)}
                  className="mt-1 mr-3 cursor-pointer accent-secondary min-w-4 min-h-4"
                />
                <div className="flex flex-col">
                  {highlight && (
                    <span className="text-xs font-semibold text-secondary mb-1">
                      {highlight}
                    </span>
                  )}
                  {label}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
