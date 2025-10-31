import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

export default function Dropdown({
  options,
  setValue,
  value,
  className,
  disabled,
  displayValues,
  placeholder,
}: {
  options:
    | string[]
    | {
        label: string;
        value: string;
        highlight?: string;
        description?: string;
      }[];
  setValue: (value: string) => void;
  value: string;
  className?: string;
  disabled?: boolean;
  displayValues?: Record<string, string>;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  useEffect(() => {
    if (value === "" && options.length > 0 && !placeholder) {
      setValue(typeof options[0] === "string" ? options[0] : options[0].value);
    }
  }, [value, options, setValue, placeholder]);

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
        <span
          className={value === "" && placeholder ? "text-custom-gray-400" : ""}
        >
          {value === "" && placeholder
            ? placeholder
            : displayValues?.[value] ||
              (
                options.find((option) =>
                  typeof option === "object" ? option.value === value : false
                ) as { label: string; value: string }
              )?.label ||
              value}
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
          className="absolute mt-1 w-full bg-white border border-custom-quaternary-200 rounded-lg shadow-lg max-h-60 overflow-auto z-50 p-2 hide-scrollbar"
        >
          {options.map((option) => (
            <li
              key={typeof option === "string" ? option : option.value}
              role="option"
              aria-selected={
                value === (typeof option === "string" ? option : option.value)
              }
              onClick={() => {
                setValue(typeof option === "string" ? option : option.value);
                setIsOpen(false);
              }}
              className={`p-3 cursor-pointer flex items-center hover:bg-custom-quaternary-100 border hover:border-secondary rounded-lg text-custom-gray-700 ${
                value === (typeof option === "string" ? option : option.value)
                  ? "border-secondary bg-custom-quaternary-100"
                  : "border-transparent"
              }`}
            >
              <input
                type="radio"
                name="provider"
                checked={
                  value === (typeof option === "string" ? option : option.value)
                }
                onChange={() => {}}
                className="mr-3 cursor-pointer accent-secondary min-w-4 min-h-4"
              />
              <div className="flex flex-col">
                {typeof option === "object" && option.highlight && (
                  <span className="text-xs font-semibold text-secondary mb-1">
                    {option.highlight}
                  </span>
                )}
                <span
                  className={`${
                    typeof option === "object" && option.description
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  {typeof option === "string" ? option : option.label}
                </span>
                {typeof option === "object" && option.description && (
                  <span className="text-sm text-custom-gray-500 mt-1">
                    {option.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
