"use client";
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RadioOption from "@/components/ui/RadioOption";
import Image from "next/image";
import Dropdown from "./ui/Dropdown";

export type SetValue = React.Dispatch<React.SetStateAction<string | number>>;

export interface EmployeeLoginStepData {
  title: string;
  subtitle?: string;
  options: string[];
  type: "investment-path" | "select" | "dropdown" | "radio";
  value: number | string;
  setValue: SetValue;
  icons?: string[];
}

export interface EmployeeLoginStepProps {
  data: EmployeeLoginStepData;
  setStep: (step: number) => void;
  step: number;
  isLastStep: boolean;
}

export function EmployeeLoginStep({
  data,
  setStep,
  step,
  isLastStep,
}: EmployeeLoginStepProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-xl md:text-xl font-semibold mb-6 text-center text-primary">
          {data.title}
        </h2>

        {data.type === "investment-path" && (
          <div className="flex flex-col gap-5">
            {data.options.map((option, idx) => (
              <div
                key={option}
                className="flex items-center gap-4 p-4 bg-[#F5F5F5] border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => {
                  data.setValue(idx);
                  setStep(step + 1);
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  {data.icons && data.icons[idx] && (
                    <Image
                      src={data.icons[idx]}
                      alt={`${option} icon`}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-custom-gray-700">{option}</h3>
                  <p className="text-sm text-custom-gray-500 mt-1">
                    {data.subtitle && data.subtitle.split("|")[idx]}
                  </p>
                </div>
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-custom-gray-400"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.type === "select" && (
          <div className="flex flex-col gap-4">
            {data.options.map((option, idx) => (
              <RadioOption
                key={option}
                option={option}
                selected={data.value as number}
                setSelected={data.setValue}
                idx={idx}
              />
            ))}
          </div>
        )}

        {data.type === "dropdown" && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-custom-gray-600">
              {t("EmployeeLogin.steps.retirementPlans.question")}
            </label>
            <Dropdown
              options={data.options}
              setValue={data.setValue}
              value={data.value as string}
              placeholder={t("EmployeeLogin.steps.retirementPlans.ageLabel")}
            />
          </div>
        )}

        {data.type === "radio" && (
          <div className="flex flex-col gap-4">
            {data.subtitle && (
              <p className="text-lg font-medium text-custom-gray-700 mb-2">
                {data.subtitle}
              </p>
            )}
            {data.options.map((option, idx) => (
              <RadioOption
                key={option}
                option={option}
                selected={data.value as number}
                setSelected={data.setValue}
                idx={idx}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-4">
        {step > 1 && (
          <SecondaryButton
            text={t("EmployeeLogin.navigation.back")}
            onClick={() => setStep(step - 1)}
          />
        )}
        {data.type === "investment-path" ? null : (
          <PrimaryButton
            text={t("EmployeeLogin.navigation.next")}
            onClick={() => {
              if (isLastStep) {
                // Handle completion logic here
                console.log("Employee login completed");
              } else {
                setStep(step + 1);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
