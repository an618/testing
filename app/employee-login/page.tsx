"use client";
import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Icon } from "@iconify/react/dist/iconify.js";
import Accordion from "@/components/ui/Accordion";
import SecondaryButton from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";

export default function EmployeeLoginFlow() {
  const { t } = useLanguage();
  const router = useRouter();
  const [showRetirementQuestions, setShowRetirementQuestions] = useState(false);
  const [selectedInvestmentPath, setSelectedInvestmentPath] = useState<
    number | null
  >(null);

  // State for retirement questions
  const [retirementAge, setRetirementAge] = useState("");
  const [incomeSecurity, setIncomeSecurity] = useState("");
  const [investmentFamiliarity, setInvestmentFamiliarity] = useState("");
  const [marketReaction, setMarketReaction] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [returnExpectation, setReturnExpectation] = useState("");
  const [retirementConfidence, setRetirementConfidence] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  const investmentPathData = [
    {
      title: t("EmployeeLogin.steps.investmentPath.options.personalize.title"),
      subtitle: t(
        "EmployeeLogin.steps.investmentPath.options.personalize.subtitle"
      ),
      icon: "heroicons:adjustments-horizontal",
    },
    {
      title: t("EmployeeLogin.steps.investmentPath.options.default.title"),
      subtitle: t(
        "EmployeeLogin.steps.investmentPath.options.default.subtitle"
      ),
      icon: "heroicons:cog-6-tooth",
    },
    {
      title: t("EmployeeLogin.steps.investmentPath.options.custom.title"),
      subtitle: t("EmployeeLogin.steps.investmentPath.options.custom.subtitle"),
      icon: "heroicons:pencil-square",
    },
  ];

  // Retirement questions data
  const retirementQuestions = [
    {
      id: "retirementAge",
      title: t("EmployeeLogin.retirementQuestions.retirementAge.question"),
      options: [
        {
          id: "before60",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementAge.options.before60"
          ),
          value: "before60",
        },
        {
          id: "60to64",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementAge.options.60to64"
          ),
          value: "60to64",
        },
        {
          id: "65to69",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementAge.options.65to69"
          ),
          value: "65to69",
        },
        {
          id: "70orlater",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementAge.options.70orlater"
          ),
          value: "70orlater",
        },
        {
          id: "notSure",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementAge.options.notSure"
          ),
          value: "notSure",
        },
      ],
      selectedValue: retirementAge,
      onSelect: setRetirementAge,
    },
    {
      id: "incomeSecurity",
      title: t("EmployeeLogin.retirementQuestions.incomeSecurity.question"),
      options: [
        {
          id: "veryUnpredictable",
          label: t(
            "EmployeeLogin.retirementQuestions.incomeSecurity.options.veryUnpredictable"
          ),
          value: "veryUnpredictable",
        },
        {
          id: "somewhatStable",
          label: t(
            "EmployeeLogin.retirementQuestions.incomeSecurity.options.somewhatStable"
          ),
          value: "somewhatStable",
        },
        {
          id: "stable",
          label: t(
            "EmployeeLogin.retirementQuestions.incomeSecurity.options.stable"
          ),
          value: "stable",
        },
        {
          id: "verySecure",
          label: t(
            "EmployeeLogin.retirementQuestions.incomeSecurity.options.verySecure"
          ),
          value: "verySecure",
        },
      ],
      selectedValue: incomeSecurity,
      onSelect: setIncomeSecurity,
    },
    {
      id: "investmentFamiliarity",
      title: t(
        "EmployeeLogin.retirementQuestions.investmentFamiliarity.question"
      ),
      options: [
        {
          id: "noExperience",
          label: t(
            "EmployeeLogin.retirementQuestions.investmentFamiliarity.options.noExperience"
          ),
          value: "noExperience",
        },
        {
          id: "limited",
          label: t(
            "EmployeeLogin.retirementQuestions.investmentFamiliarity.options.limited"
          ),
          value: "limited",
        },
        {
          id: "moderate",
          label: t(
            "EmployeeLogin.retirementQuestions.investmentFamiliarity.options.moderate"
          ),
          value: "moderate",
        },
        {
          id: "advanced",
          label: t(
            "EmployeeLogin.retirementQuestions.investmentFamiliarity.options.advanced"
          ),
          value: "advanced",
        },
      ],
      selectedValue: investmentFamiliarity,
      onSelect: setInvestmentFamiliarity,
    },
    {
      id: "marketReaction",
      title: t("EmployeeLogin.retirementQuestions.marketReaction.question"),
      options: [
        {
          id: "sellEverything",
          label: t(
            "EmployeeLogin.retirementQuestions.marketReaction.options.sellEverything"
          ),
          value: "sellEverything",
        },
        {
          id: "reduceInvestments",
          label: t(
            "EmployeeLogin.retirementQuestions.marketReaction.options.reduceInvestments"
          ),
          value: "reduceInvestments",
        },
        {
          id: "stayInvested",
          label: t(
            "EmployeeLogin.retirementQuestions.marketReaction.options.stayInvested"
          ),
          value: "stayInvested",
        },
        {
          id: "investMore",
          label: t(
            "EmployeeLogin.retirementQuestions.marketReaction.options.investMore"
          ),
          value: "investMore",
        },
      ],
      selectedValue: marketReaction,
      onSelect: setMarketReaction,
    },
    {
      id: "riskTolerance",
      title: t("EmployeeLogin.retirementQuestions.riskTolerance.question"),
      options: [
        {
          id: "avoidedRisk",
          label: t(
            "EmployeeLogin.retirementQuestions.riskTolerance.options.avoidedRisk"
          ),
          value: "avoidedRisk",
        },
        {
          id: "smallRisks",
          label: t(
            "EmployeeLogin.retirementQuestions.riskTolerance.options.smallRisks"
          ),
          value: "smallRisks",
        },
        {
          id: "moderateRisks",
          label: t(
            "EmployeeLogin.retirementQuestions.riskTolerance.options.moderateRisks"
          ),
          value: "moderateRisks",
        },
        {
          id: "aggressiveRisks",
          label: t(
            "EmployeeLogin.retirementQuestions.riskTolerance.options.aggressiveRisks"
          ),
          value: "aggressiveRisks",
        },
      ],
      selectedValue: riskTolerance,
      onSelect: setRiskTolerance,
    },
    {
      id: "returnExpectation",
      title: t("EmployeeLogin.retirementQuestions.returnExpectation.question"),
      options: [
        {
          id: "lowRisk",
          label: t(
            "EmployeeLogin.retirementQuestions.returnExpectation.options.lowRisk"
          ),
          value: "lowRisk",
        },
        {
          id: "moderateRisk",
          label: t(
            "EmployeeLogin.retirementQuestions.returnExpectation.options.moderateRisk"
          ),
          value: "moderateRisk",
        },
        {
          id: "higherRisk",
          label: t(
            "EmployeeLogin.retirementQuestions.returnExpectation.options.higherRisk"
          ),
          value: "higherRisk",
        },
        {
          id: "veryHighRisk",
          label: t(
            "EmployeeLogin.retirementQuestions.returnExpectation.options.veryHighRisk"
          ),
          value: "veryHighRisk",
        },
      ],
      selectedValue: returnExpectation,
      onSelect: setReturnExpectation,
    },
    {
      id: "retirementConfidence",
      title: t(
        "EmployeeLogin.retirementQuestions.retirementConfidence.question"
      ),
      options: [
        {
          id: "notConfident",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementConfidence.options.notConfident"
          ),
          value: "notConfident",
        },
        {
          id: "somewhatConfident",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementConfidence.options.somewhatConfident"
          ),
          value: "somewhatConfident",
        },
        {
          id: "confident",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementConfidence.options.confident"
          ),
          value: "confident",
        },
        {
          id: "veryConfident",
          label: t(
            "EmployeeLogin.retirementQuestions.retirementConfidence.options.veryConfident"
          ),
          value: "veryConfident",
        },
      ],
      selectedValue: retirementConfidence,
      onSelect: setRetirementConfidence,
    },
  ];

  const handleInvestmentPathClick = (index: number) => {
    setSelectedInvestmentPath(index);
    if (index === 0) {
      // Personalize option
      setShowRetirementQuestions(true);
    }
  };

  const handleAccordionToggle = (questionId: string, isOpen: boolean) => {
    if (isOpen) {
      // Close any currently open accordion
      if (openAccordion && openAccordion !== questionId) {
        // Mark the previously open accordion as closed without selection if no value was selected
      }
      setOpenAccordion(questionId);
    } else {
      // Accordion is being closed
      setOpenAccordion(null);
    }
  };

  const isFieldRequired = (questionId: string, selectedValue: string) => {
    return hasAttemptedValidation && !selectedValue;
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 md:items-center pt-8 md:pt-0 md:justify-center bg-gradient-to-tr from-brandStart to-brandEnd px-2">
      <div
        className={`bg-white rounded-3xl py-6 md:py-10 px-4 md:px-20 w-full flex flex-col gap-5 justify-center ${
          showRetirementQuestions ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {!showRetirementQuestions ? (
          <>
            <h3 className="font-bold text-center mb-5 text-2xl text-primary">
              {t("EmployeeLogin.steps.investmentPath.title")}
            </h3>
            {investmentPathData.map((option, idx) => (
              <div
                key={option.title}
                className={`flex items-center gap-2 px-3 py-4 rounded-xl transition-colors cursor-pointer ${
                  selectedInvestmentPath === idx
                    ? "bg-custom-lavender-100 border-2 border-primary"
                    : "bg-neutral-100 hover:bg-neutral-200"
                }`}
                onClick={() => handleInvestmentPathClick(idx)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary text-white rounded-lg flex items-center justify-center flex-shrink-0 p-1.5">
                  <Icon
                    icon={option.icon}
                    className="min-w-6 min-h-6 text-white"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-custom-gray-700">
                    {option.title}
                  </h3>
                  <p className="text-base text-custom-gray-400">
                    {option.subtitle}
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
          </>
        ) : (
          <>
            <h3 className="font-bold text-center mb-5 text-2xl text-primary">
              {t("EmployeeLogin.retirementQuestionsTitle")}
            </h3>
            <div className="space-y-8">
              {retirementQuestions.map((question) => (
                <Accordion
                  key={question.id}
                  title={question.title}
                  options={question.options}
                  selectedValue={question.selectedValue}
                  onSelect={(value) => {
                    question.onSelect(value);
                  }}
                  isOpen={openAccordion === question.id}
                  onToggle={(isOpen) =>
                    handleAccordionToggle(question.id, isOpen)
                  }
                  className={
                    isFieldRequired(question.id, question.selectedValue)
                      ? "border-2 border-red-500 rounded-lg"
                      : ""
                  }
                />
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-15">
              <SecondaryButton
                text={t("Register.navigation.back")}
                onClick={() => setShowRetirementQuestions(false)}
              />

              <PrimaryButton
                text={t("Register.navigation.next")}
                onClick={() => {
                  setHasAttemptedValidation(true);
                  // Check if all required fields are filled
                  const allFieldsFilled = retirementQuestions.every(
                    (question) => question.selectedValue
                  );
                  if (allFieldsFilled) {
                    // Redirect to participant dashboard
                    router.push("/participant-dashboard");
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
