"use client";

import React, { useState, useRef, useCallback } from "react";
import { FiUpload, FiX, FiFile, FiCheck } from "react-icons/fi";

interface FileLoaderProps {
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function FileLoader({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ["*"],
  maxSize = 10,
  className = "",
  placeholder = "Drag and drop a file here, or click to select",
  disabled = false,
}: FileLoaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        return `File size must be less than ${maxSize}MB`;
      }

      // Check file type if specific types are specified
      if (acceptedTypes.length > 0 && !acceptedTypes.includes("*")) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const mimeType = file.type;

        const isValidType = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension === type.substring(1);
          }
          return mimeType.includes(type);
        });

        if (!isValidType) {
          return `File type not supported. Accepted types: ${acceptedTypes.join(
            ", "
          )}`;
        }
      }

      return null;
    },
    [acceptedTypes, maxSize]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError("");
    onFileRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileRemove]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-red-300 bg-red-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <FiCheck className="w-5 h-5" />
              <span className="text-sm font-medium">File selected</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FiFile className="w-4 h-4" />
              <span className="text-sm">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(selectedFile.size)})
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm transition-colors"
            >
              <FiX className="w-4 h-4" />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <FiUpload className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500">Max file size: {maxSize}MB</p>
          </div>
        )}

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
