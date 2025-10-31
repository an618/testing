"use client";

import { useState, useEffect, useCallback } from "react";
import { MODAL_ANIMATION_DURATION } from "@/utils/constants";

interface UseModalOptions {
  onClose?: () => void;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  initialOpen?: boolean;
}

export function useModal(options: UseModalOptions = {}) {
  const { 
    onClose, 
    closeOnEscape = true, 
    closeOnBackdropClick = true,
    initialOpen = false 
  } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (onClose) {
      setTimeout(onClose, MODAL_ANIMATION_DURATION);
    }
  }, [onClose]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  // Keyboard event handling
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close, closeOnEscape]);

  return {
    isOpen,
    open,
    close,
    handleClose,
    closeOnBackdropClick,
  };
} 