"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiX, FiInfo } from "react-icons/fi";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

interface EnhancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  primaryButton?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export function EnhancedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryButton,
  secondaryButton,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: EnhancedModalProps) {
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setShow(true);
      // Focus the modal when it opens
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard event handling
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  const modalClass = show
    ? "opacity-100 scale-100"
    : "opacity-0 scale-95 pointer-events-none";
  const backdropClass = show ? "opacity-100" : "opacity-0 pointer-events-none";

  const sizeClasses = {
    sm: "max-w-sm mx-4",
    md: "max-w-md mx-4",
    lg: "max-w-lg mx-4",
    xl: "max-w-xl mx-4",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 bg-black/60 ${backdropClass} p-4`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} relative transform transition-all duration-200 ${modalClass}`}
        style={{ transitionProperty: "opacity, transform" }}
        tabIndex={-1}
      >
        {/* Purple Header */}
        <div className="bg-custom-quaternary-300 rounded-t-xl px-4 sm:px-6 py-3 sm:py-4 relative min-h-10 sm:min-h-12">
          {showCloseButton && (
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-custom-gray-700 hover:text-custom-gray-600 focus:outline-none rounded cursor-pointer"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX
                size={18}
                className="text-custom-gray-700 sm:w-5 sm:h-5"
                color="currentColor"
              />
            </button>
          )}
        </div>

        {/* White Body */}
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <h2
            id="modal-title"
            className="text-sm sm:text-base font-semibold text-custom-gray-600"
          >
            {title}
          </h2>
          {description && (
            <p
              id="modal-description"
              className="text-sm sm:text-base text-custom-gray-400 mt-2 sm:mt-3"
            >
              {description}
            </p>
          )}

          <div className="modal-content mt-4 sm:mt-6">{children}</div>

          {/* Buttons */}
          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-5">
              {secondaryButton && (
                <SecondaryButton
                  text={secondaryButton.text}
                  onClick={secondaryButton.onClick}
                  className="!px-3 sm:!px-4 !py-2 !w-full sm:!w-fit !font-medium !text-sm sm:!text-xl"
                  containerClassName="!w-full sm:!w-fit"
                />
              )}

              {primaryButton && (
                <PrimaryButton
                  text={primaryButton.text}
                  onClick={primaryButton.onClick}
                  className="!px-3 sm:!px-4 !py-2 !w-full sm:!w-fit !font-medium !text-sm sm:!text-xl"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Info icon component for use in modals
export function InfoIcon({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <FiInfo
      size={size}
      className={`text-gray-400 ${className}`}
      title="Additional information"
    />
  );
}
