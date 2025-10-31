"use client";
import React from "react";
import { FiCheck } from "react-icons/fi";

export interface StepperProps {
  totalSteps: number;
  currentStep: number; // 1-based index
}

export function Stepper({ totalSteps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 mt-2">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const step = idx + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 md:w-8 md:h-8 flex items-center justify-center rounded-full border-1 md:border-2 transition-all duration-200
                  ${
                    isCompleted
                      ? "bg-secondary border-custom-gray-700"
                      : isCurrent
                      ? "bg-white border-custom-gray-700"
                      : "bg-custom-gray-200 border-custom-gray-200"
                  }
                `}
              >
                {isCompleted ? (
                  <FiCheck className="w-3 h-3 md:w-5 md:h-5 text-black" />
                ) : isCurrent ? (
                  <FiCheck className="w-3 h-3 md:w-5 md:h-5 text-black" />
                ) : (
                  <span className="block w-3 h-3 md:w-5 md:h-5 rounded-full bg-custom-gray-200"></span>
                )}
              </div>
            </div>
            {step !== totalSteps && (
              <div
                className={`h-1 w-6 sm:w-10 md:h-2 md:w-16 flex items-center
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : "bg-white"
                  }
                `}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
