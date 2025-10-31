import React from "react";

const SecondaryButton = ({
  text,
  onClick,
  className,
  containerClassName,
}: {
  text: string;
  onClick: () => void;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={`p-[2px] rounded-full bg-gradient-to-r from-primary to-secondary shadow-md max-w-sm w-full ${containerClassName}`}
    >
      <button
        className={`w-full bg-white text-custom-gray-700 font-bold rounded-full py-3 text-lg md:text-xl hover:cursor-pointer transition-colors ${className}`}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default SecondaryButton;
