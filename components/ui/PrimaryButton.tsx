import React from "react";
import { FiLoader } from "react-icons/fi";

const PrimaryButton = ({
  text,
  onClick,
  className,
  disabled,
  icon,
  loading = false,
}: {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}) => {
  return (
    <button
      type="submit"
      className={`max-w-sm bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full py-3 w-full text-lg md:text-xl shadow-md hover:cursor-pointer transition-colors flex items-center justify-center ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {loading ? (
          <FiLoader className="w-5 h-5 animate-spin" />
      ) : (
        text
      )}
    </button>
  );
};

export default PrimaryButton;
