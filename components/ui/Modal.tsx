"use client";

import React, { useState, useEffect, useRef } from "react";
import { MODAL_ANIMATION_DURATION } from "@/utils/constants";
import { FiX, FiChevronDown } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveText?: string;
  showSaveButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSave,
  saveText = "Save",
  showSaveButton = true,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
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
      const timer = setTimeout(() => setShow(false), MODAL_ANIMATION_DURATION);
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
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  const modalClass = show ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none";
  const backdropClass = show ? "opacity-100" : "opacity-0 pointer-events-none";

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-${MODAL_ANIMATION_DURATION} bg-[#00000090] ${backdropClass}`} 
      aria-modal="true" 
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl shadow-lg p-6 w-full ${sizeClasses[size]} relative transform transition-all duration-${MODAL_ANIMATION_DURATION} ${modalClass}`} 
        style={{ transitionProperty: 'opacity, transform' }}
        tabIndex={-1}
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <FiX size={20} />
        </button>
        
        <h2 id="modal-title" className="text-xl font-bold mb-3 text-[#1A1A1A]">{title}</h2>
        
        {description && (
          <p id="modal-description" className="text-sm text-[#1A1A1AB2] mb-4">{description}</p>
        )}
        
        <div className="modal-content">
          {children}
        </div>
        
        {showSaveButton && (
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button 
              className="px-6 py-2 rounded bg-[#6C3DF4] text-white font-semibold hover:bg-[#5327c6] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors" 
              onClick={handleSave}
              type="button"
            >
              {saveText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface FAQProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function FAQ({ question, answer, isOpen, onToggle, className = "" }: FAQProps) {
  const faqId = `faq-${question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  
  return (
    <div className={`mb-6 ${className}`}>
      <button 
        className="flex items-center gap-2 text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded p-2 -m-2" 
        onClick={onToggle} 
        aria-expanded={isOpen} 
        aria-controls={faqId} 
        type="button"
      >
        <span className="flex-1 text-left">{question}</span>
        <FiChevronDown 
          className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`} 
          size={16}
        />
      </button>
      {isOpen && (
        <div 
          id={faqId} 
          className="mt-2 text-xs text-[#1A1A1AB2] bg-[#F6F6F6] rounded p-3 animate-in slide-in-from-top-2 duration-200"
        >
          {answer.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < answer.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
} 