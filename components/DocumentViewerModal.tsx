"use client";
import React, { useState, useEffect, useRef } from "react";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Modal } from './ui/Modal';
import { useLanguage } from "@/hooks/useLanguage";

export interface DocumentData {
  title: string;
  type: "text" | "pdf";
  content?: string; // for text
  url?: string; // for pdf
}

interface DocumentViewerModalProps {
  open: boolean;
  onClose: () => void;
  documents: DocumentData[];
  initialIndex?: number;
  onSave?: (index: number) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ open, onClose, documents, initialIndex = 0, onSave }) => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(initialIndex);
  const [saved, setSaved] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setSaved(false);
    }
  }, [open, initialIndex]);

  useEffect(() => {
    if (open) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [open, onClose]);

  if (!open) return null;
  const doc = documents[index];
  const isFirst = index === 0;
  const isLast = index === documents.length - 1;

  // Save logic
  const handleSave = () => {
    setSaved(true);
    if (onSave) onSave(index);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={doc.title} showSaveButton={false} size="xl">
      <div ref={modalRef} className="w-full max-h-[90vh] flex flex-col relative">
        <div className="flex-1 overflow-y-auto px-6 py-4 text-sm text-gray-900" style={{ minHeight: 300 }}>
          {doc.type === "text" && (
            <div className="whitespace-pre-line" style={{ fontFamily: 'inherit' }}>{doc.content}</div>
          )}
          {doc.type === "pdf" && doc.url && (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-gray-100 rounded overflow-auto">
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={doc.url} theme="light" />
              </Worker>
              <div className="mt-2 text-xs text-gray-500">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline text-[#6C3DF4]">
                  {t('DocumentViewerModal.pdf.openInNewTab')}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 gap-2">
          <span className="text-xs text-gray-500">
            {t('DocumentViewerModal.counter', { current: index + 1, total: documents.length })}
          </span>
          <div className="flex gap-2 flex-1 justify-center">
            <button
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
              onClick={() => setIndex(i => i - 1)}
              disabled={isFirst}
              type="button"
            >
              {t('DocumentViewerModal.navigation.back')}
            </button>
            <button
              className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50"
              onClick={handleSave}
              type="button"
            >
              {saved ? t('DocumentViewerModal.actions.saved') : t('DocumentViewerModal.actions.saveDocument')}
            </button>
            <button
              className="px-4 py-2 rounded bg-[#6C3DF4] text-white font-semibold hover:bg-[#5327c6] focus:outline-none"
              onClick={() => isLast ? onClose() : setIndex(i => i + 1)}
              type="button"
            >
              {isLast ? t('DocumentViewerModal.navigation.finish') : t('DocumentViewerModal.navigation.nextDocument')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 