import React from "react";

const RadioOption = ({
  option,
  selected,
  setSelected,
  idx,
}: {
  option: string;
  selected: number;
  setSelected: (idx: number) => void;
  idx: number;
}) => {
  // Parse the option to separate parent and child parts
  const parseOption = (text: string) => {
    // Look for the pattern: "Parent - Child description"
    const dashIndex = text.indexOf(" - ");
    if (dashIndex !== -1) {
      return {
        parent: text.substring(0, dashIndex),
        child: text.substring(dashIndex + 3),
      };
    }
    // If no dash pattern, return the whole text as parent
    return {
      parent: text,
      child: "",
    };
  };

  const { parent, child } = parseOption(option);

  return (
    <label
      key={option}
      className={`flex items-center border rounded-md px-4 py-3 cursor-pointer transition-all duration-150
                ${
                  selected === idx
                    ? "border-secondary bg-custom-quaternary-100"
                    : "border-gray-200 bg-white hover:border-secondary"
                }
              `}
    >
      <input
        type="radio"
        name="priority"
        checked={selected === idx}
        onChange={() => setSelected(idx)}
        className="accent-secondary min-w-4 min-h-4 mr-3"
      />
      <p className="flex flex-1 text-base font-normal text-custom-gray-700 whitespace-wrap ">
        {parent} &nbsp;
        {child && (
          <span className="text-base font-normal text-custom-gray-500 whitespace-break-spaces">
            - &nbsp;{child}
          </span>
        )}
      </p>
    </label>
  );
};

export default RadioOption;
