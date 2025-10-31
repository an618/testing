"use client";
import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RadioOption from "@/components/ui/RadioOption";
import { useRouter } from "next/navigation";
import Dropdown from "./ui/Dropdown";
import { FiX } from "react-icons/fi";

export type SetValue = React.Dispatch<React.SetStateAction<string | number>>;

export interface RegisterStepData {
  title: string;
  subtitle?: string;
  options: string[];
  type: "select" | "email" | "dropdown";
  value: number | string;
  setValue: SetValue;
}

export interface RegisterStepProps {
  data: RegisterStepData;
  setStep: (step: number) => void;
  step: number;
  isLastStep: boolean;
  onLastStepSubmit?: () => Promise<void>;
  isSubmitting?: boolean;
  saveError?: Error | null;
}

export function RegisterStep({
  data,
  setStep,
  step,
  isLastStep,
  onLastStepSubmit,
  isSubmitting = false,
  saveError,
}: RegisterStepProps) {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Clear error when user interacts with the form
  const clearError = () => {
    if (error) setError(null);
  };

  // Handle step navigation and submission
  const handleStepAction = async () => {
    if (data.type === "email") {
      if (
        (data.value as string).trim() === "" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.value as string)
      ) {
        setError(t("Register.steps.email.error"));
        return;
      }
    }

    if (isLastStep) {
      if (onLastStepSubmit) {
        try {
          await onLastStepSubmit();
          router.push("/pricing");
        } catch {
          setError("Failed to save details. Please try again.");
        }
      } else {
        router.push("/pricing");
      }
    } else {
      setStep(step + 1);
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl md:text-xl font-semibold text-custom-gray-700 mb-6">
          {data.title}
        </h2>

        {/* Show loading state when submitting
        {isSubmitting && (
          <div className="mb-6">
            <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <FiLoader className="animate-spin h-5 w-5" />
                <span className="text-sm font-medium">
                  Saving your plan details...
                </span>
              </div>
              <p className="text-xs text-green-500 mt-2">
                Please wait while we process your information
              </p>
            </div>
          </div>
        )} */}

        {/* Show save error if present */}
        {saveError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FiX className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-800 text-sm">{saveError.message}</span>
            </div>
          </div>
        )}

        {data.type === "select" && (
          <div className="flex flex-col gap-4">
            {data.options.map((option, idx) => (
              <RadioOption
                key={option}
                option={option}
                selected={data.value as number}
                setSelected={(value) => {
                  clearError();
                  data.setValue(value);
                }}
                idx={idx}
              />
            ))}
          </div>
        )}
        {data.type === "dropdown" && (
          <Dropdown
            options={data.options}
            setValue={(value) => {
              clearError();
              data.setValue(value);
            }}
            value={data.value as string}
          />
        )}

        {data.type === "email" && (
          <>
            <input
              id="email"
              type="email"
              value={data.value as string}
              onChange={(e) => {
                data.setValue(e.target.value);
                setError(null);
              }}
              placeholder={t("Register.steps.email.placeholder")}
              className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base focus:outline-none text-custom-gray-500 ${
                error ? "border-red-500" : ""
              }`}
              autoComplete="email"
            />
          </>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
      )}
      <div className="flex justify-center gap-6 mt-4">
        {step > 2 && (
          <SecondaryButton
            text={t("Register.navigation.back")}
            onClick={() => setStep(step - 1)}
          />
        )}
        <PrimaryButton
          text={
            isSubmitting
              ? "Saving plan details..."
              : data.type === "email"
              ? t("Register.navigation.signUp")
              : t("Register.navigation.next")
          }
          onClick={handleStepAction}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
}
