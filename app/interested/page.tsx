"use client";
import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/components/ui/SecondaryButton";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    {
      name: t("Interested.options.0.name"),
      desc: t("Interested.options.0.desc"),
    },
    {
      name: t("Interested.options.1.name"),
      desc: t("Interested.options.1.desc"),
    },
    {
      name: t("Interested.options.2.name"),
      desc: t("Interested.options.2.desc"),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col gap-5 m-6 md:m-12 p-6 sm:p-12 md:p-16 items-center">
        <h3 className="text-primary font-bold text-2xl md:text-3xl text-center">
          {t("Interested.title")}
        </h3>
        <div className="mt-6 md:mt-10 px-0 md:px-6 py-0 md:py-5 md:border border-custom-gray-100 rounded-2xl flex flex-col gap-3 md:gap-4">
          {options.map((acc) => (
            <label
              key={acc.name}
              className={`flex-1 p-4 gap-4 border rounded-xl py-3 md:py-5 px-3 flex items-center justify-between cursor-pointer hover:bg-custom-quaternary-100 hover:border-secondary transition-colors ${
                selected === acc.name
                  ? "border-secondary"
                  : "border-custom-quaternary-100"
              }`}
            >
              <input
                type="radio"
                checked={selected === acc.name}
                onChange={() => setSelected(acc.name)}
                className="accent-secondary min-w-5 min-h-5 w-5 h-5"
                aria-checked={selected === acc.name}
              />
              <span className="font-medium text-[#1A1A1A]">
                <div className="text-custom-gray-700 font-semibold text-base md:text-lg">
                  {acc.name}
                </div>
                <div className="text-custom-gray-500 text-xs md:text-sm">
                  {acc.desc}
                </div>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md w-full">
          <SecondaryButton
            text={t("Interested.backButton")}
            onClick={() => {
              router.push("/login");
            }}
          />
          <PrimaryButton
            text={t("Interested.submitButton")}
            onClick={() => {
              if (selected) {
                router.push("/register");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
