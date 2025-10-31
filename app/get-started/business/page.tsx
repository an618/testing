"use client";
import React, { useEffect, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlanStateRouting } from "@/hooks/usePlanStateRouting";
import { FormField } from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Dropdown from "@/components/ui/Dropdown";
import {
  PlanDetails,
  useCreatePlanDetails,
  usePlanDetails,
} from "@/services/plan-sponser";
import { FiLoader } from "react-icons/fi";

const initialState: PlanDetails = {
  legalName: "",
  ein: "",
  businessAddress: {
    street: "",
    apt: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    mailingDifferent: false,
    mailingStreet: "",
    mailingApt: "",
    mailingCity: "",
    mailingState: "",
    mailingPostalCode: "",
    mailingPhoneNumber: "",
  },
  entityType: "",
  payrollProvider: "Paylocity",
  payrollSchedule: { schedule: "", numberOfDays: 4 },
  estimatedEmployeeCount: 0,
  unionEmployees: false,
  leasedEmployees: false,
  existingRetirementPlan: false,
  relatedEntities: false,
  employmentStatus: "",
  businessSize: "",
  retirementPlanPriority: "",
  hasExisting401k: false,
  hasMultipleBusinesses: false,
};

interface AccordionSectionProps {
  title: string;
  isRequired?: boolean;
  currentValue?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hasError?: boolean;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isRequired = false,
  currentValue,
  isExpanded,
  onToggle,
  children,
  hasError = false,
}) => {
  return (
    <div
      className={`border rounded-lg mb-4 ${
        hasError ? "border-red-300" : "border-gray-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors cursor-pointer rounded-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{title}</span>
          {isRequired && (
            <span className="text-xs text-red-500 font-medium">*</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {currentValue && (
            <span className="text-sm text-gray-600">{currentValue}</span>
          )}
          <div
            className={`transition-transform duration-300 ease-in-out ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <FiChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 bg-white rounded-lg">{children}</div>
      )}
    </div>
  );
};

export default function BusinessPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const { data: planDetails, isLoading } = usePlanDetails();

  // Handle plan state routing
  usePlanStateRouting();

  const {
    mutateAsync: createPlanDetails,
    isPending: isSaving,
    error: saveError,
  } = useCreatePlanDetails();

  const [state, setState] = useState(initialState);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const toggleSection = (sectionName: string) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  const isSectionExpanded = (sectionName: string) =>
    activeSection === sectionName;

  const getDisplayValue = (
    key: string,
    value:
      | string
      | PlanDetails["businessAddress"]
      | PlanDetails["payrollSchedule"]
  ): string => {
    if (!value) return "";

    switch (key) {
      case "businessAddress":
        const address = value as unknown as PlanDetails["businessAddress"];
        if (address.street) {
          return `${address.street}${address.apt ? `, ${address.apt}` : ""}, ${
            address.city
          }, ${address.state} ${address.postalCode}`;
        }
        return "";
      case "mailingAddress":
        const mailingAddress =
          value as unknown as PlanDetails["businessAddress"];
        if (mailingAddress.mailingStreet) {
          return `${mailingAddress.mailingStreet}${
            mailingAddress.mailingApt ? `, ${mailingAddress.mailingApt}` : ""
          }, ${mailingAddress.mailingCity}, ${mailingAddress.mailingState} ${
            mailingAddress.mailingPostalCode
          }`;
        }
        return "";
      case "payrollSchedule":
        const schedule = value as unknown as {
          schedule: string;
          numberOfDays: number;
        };
        if (typeof schedule === "object" && schedule.schedule) {
          return `${schedule.schedule} (${schedule.numberOfDays} days)`;
        }
        return "";
      default:
        return String(value);
    }
  };

  useEffect(() => {
    if (planDetails) {
      setState(planDetails);
    }
  }, [planDetails]);

  // Validation function
  const validateBusinessDetails = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!state.legalName.trim()) {
      errors.legalName = t(
        "GetStarted.reviewBusiness.validationErrors.legalName"
      );
    }

    if (!state.ein.trim()) {
      errors.ein = t("GetStarted.reviewBusiness.validationErrors.ein");
    } else if (!/^\d{2}-\d{7}$/.test(state.ein.trim())) {
      errors.ein = t("GetStarted.reviewBusiness.validationErrors.einFormat");
    }

    if (!state.businessAddress.street?.trim()) {
      errors.businessAddress = t(
        "GetStarted.reviewBusiness.validationErrors.businessAddress"
      );
    }

    if (
      state.businessAddress.mailingDifferent &&
      !state.businessAddress.mailingStreet?.trim()
    ) {
      errors.mailingAddress = t(
        "GetStarted.reviewBusiness.validationErrors.mailingAddress"
      );
    }

    if (!state.entityType.trim()) {
      errors.entityType = t(
        "GetStarted.reviewBusiness.validationErrors.entityType"
      );
    }

    if (!state.payrollProvider.trim()) {
      errors.payrollProvider = t(
        "GetStarted.reviewBusiness.validationErrors.payrollProvider"
      );
    }

    if (
      typeof state.payrollSchedule === "object" &&
      !state.payrollSchedule.schedule?.trim()
    ) {
      errors.payrollSchedule = t(
        "GetStarted.reviewBusiness.validationErrors.payrollSchedule"
      );
    }

    if (state.leasedEmployees == undefined || state.leasedEmployees == null) {
      errors.leasedEmployees = t(
        "GetStarted.reviewBusiness.validationErrors.leasedEmployees"
      );
    }

    if (
      state.existingRetirementPlan == undefined ||
      state.existingRetirementPlan == null
    ) {
      errors.existingRetirementPlan = t(
        "GetStarted.reviewBusiness.validationErrors.existingRetirementPlan"
      );
    }

    return errors;
  };

  const handleSaveAndContinue = async () => {
    setValidationErrors({});
    const errors = validateBusinessDetails();
    console.log({ errors });
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const payrollSchedule = state.payrollSchedule as {
        schedule: string;
        numberOfDays: number;
      };

      const requestBody = {
        legalName: state.legalName,
        ein: state.ein,
        businessAddress: {
          street: state.businessAddress.street || "",
          apt: state.businessAddress.apt || "",
          city: state.businessAddress.city || "",
          state: state.businessAddress.state || "",
          postalCode: state.businessAddress.postalCode || "",
          phoneNumber: state.businessAddress.phoneNumber || "",
          mailingDifferent: state.businessAddress.mailingDifferent,
          mailingStreet: state.businessAddress.mailingStreet || "",
          mailingApt: state.businessAddress.mailingApt || "",
          mailingCity: state.businessAddress.mailingCity || "",
          mailingState: state.businessAddress.mailingState || "",
          mailingPostalCode: state.businessAddress.mailingPostalCode || "",
          mailingPhoneNumber: state.businessAddress.mailingPhoneNumber || "",
        },
        entityType: state.entityType,
        payrollProvider: state.payrollProvider,
        payrollSchedule: {
          schedule: payrollSchedule.schedule || "",
          numberOfDays: payrollSchedule.numberOfDays || 4,
        },
        unionEmployees: state.unionEmployees,
        leasedEmployees: state.leasedEmployees,
        existingRetirementPlan: state.existingRetirementPlan,
        relatedEntities: state.relatedEntities,
        employmentStatus: state.employmentStatus,
        businessSize: state.businessSize,
        retirementPlanPriority: state.retirementPlanPriority,
        hasExisting401k: state.hasExisting401k,
        hasMultipleBusinesses: state.hasMultipleBusinesses,
        estimatedEmployeeCount: state.estimatedEmployeeCount,
      };

      await createPlanDetails(requestBody);
      router.push(`/get-started/pricing`);
    } catch (error) {
      console.error("Failed to create company details:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-y-auto flex flex-col justify-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="flex flex-col items-center space-y-4">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-blue-600">Loading...</h2>
          <p className="text-gray-600 text-center">
            Please wait while we load your business information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center py-8 px-2 bg-gradient-to-tr from-brandStart to-brandEnd">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-blue-600">
          {t("GetStarted.reviewBusiness.title")}
        </h1>

        {saveError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FiX className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-800 text-sm">{saveError.message}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Legal Name Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.legalName")}
            isRequired={true}
            isExpanded={isSectionExpanded("legalName")}
            onToggle={() => toggleSection("legalName")}
            currentValue={getDisplayValue("legalName", state.legalName)}
            hasError={!!validationErrors.legalName}
          >
            <div className="space-y-4">
              <FormField label={""}>
                <input
                  type="text"
                  placeholder={t(
                    "GetStarted.reviewBusiness.placeholders.legalName"
                  )}
                  value={state.legalName}
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      legalName: e.target.value,
                    }));
                    if (validationErrors.legalName) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.legalName;
                        return newErrors;
                      });
                    }
                  }}
                  className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* EIN Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.ein")}
            isRequired={true}
            isExpanded={isSectionExpanded("ein")}
            onToggle={() => toggleSection("ein")}
            currentValue={getDisplayValue("ein", state.ein)}
            hasError={!!validationErrors.ein}
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                {t("GetStarted.reviewBusiness.helpText.ein")}
              </div>
              <FormField label={""}>
                <input
                  type="text"
                  placeholder={t("GetStarted.reviewBusiness.placeholders.ein")}
                  value={state.ein}
                  onChange={(e) => {
                    setState((prev) => ({ ...prev, ein: e.target.value }));
                    if (validationErrors.ein) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.ein;
                        return newErrors;
                      });
                    }
                  }}
                  className="w-full max-w-md rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Business Address Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.businessAddress")}
            isRequired={true}
            isExpanded={isSectionExpanded("businessAddress")}
            onToggle={() => toggleSection("businessAddress")}
            currentValue={getDisplayValue(
              "businessAddress",
              state.businessAddress
            )}
            hasError={!!validationErrors.businessAddress}
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {t("GetStarted.reviewBusiness.helpText.businessAddress")}
              </div>
              <FormField label={t("GetStarted.reviewBusiness.fields.street")}>
                <input
                  type="text"
                  placeholder={t(
                    "GetStarted.reviewBusiness.placeholders.street"
                  )}
                  value={state.businessAddress.street}
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      businessAddress: {
                        ...prev.businessAddress,
                        street: e.target.value,
                      },
                    }));
                    if (validationErrors.businessAddress) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.businessAddress;
                        return newErrors;
                      });
                    }
                  }}
                  className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                />
              </FormField>
              <FormField label={t("GetStarted.reviewBusiness.fields.apt")}>
                <input
                  type="text"
                  placeholder={t("GetStarted.reviewBusiness.placeholders.apt")}
                  value={state.businessAddress.apt}
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      businessAddress: {
                        ...prev.businessAddress,
                        apt: e.target.value,
                      },
                    }));
                    if (validationErrors.businessAddress) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.businessAddress;
                        return newErrors;
                      });
                    }
                  }}
                  className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t("GetStarted.reviewBusiness.fields.city")}>
                  <input
                    type="text"
                    placeholder={t(
                      "GetStarted.reviewBusiness.placeholders.city"
                    )}
                    value={state.businessAddress.city}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        businessAddress: {
                          ...prev.businessAddress,
                          city: e.target.value,
                        },
                      }));
                      if (validationErrors.businessAddress) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.businessAddress;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
                <FormField label={t("GetStarted.reviewBusiness.fields.state")}>
                  <input
                    type="text"
                    placeholder={t(
                      "GetStarted.reviewBusiness.placeholders.state"
                    )}
                    value={state.businessAddress.state}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        businessAddress: {
                          ...prev.businessAddress,
                          state: e.target.value,
                        },
                      }));
                      if (validationErrors.businessAddress) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.businessAddress;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label={t("GetStarted.reviewBusiness.fields.postalCode")}
                >
                  <input
                    type="text"
                    placeholder={t(
                      "GetStarted.reviewBusiness.placeholders.postalCode"
                    )}
                    value={state.businessAddress.postalCode}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        businessAddress: {
                          ...prev.businessAddress,
                          postalCode: e.target.value,
                        },
                      }));
                      if (validationErrors.businessAddress) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.businessAddress;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
                <FormField
                  label={t("GetStarted.reviewBusiness.fields.phoneNumber")}
                >
                  <input
                    type="text"
                    placeholder={t(
                      "GetStarted.reviewBusiness.placeholders.phoneNumber"
                    )}
                    value={state.businessAddress.phoneNumber}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        businessAddress: {
                          ...prev.businessAddress,
                          phoneNumber: e.target.value,
                        },
                      }));
                      if (validationErrors.businessAddress) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.businessAddress;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={state.businessAddress.mailingDifferent}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      businessAddress: {
                        ...prev.businessAddress,
                        mailingDifferent: e.target.checked,
                      },
                    }))
                  }
                  className="rounded border-gray-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                />
                <span className="text-sm text-gray-700">
                  {t("GetStarted.reviewBusiness.fields.mailingDifferent")}
                </span>
              </label>
            </div>
          </AccordionSection>

          {state.businessAddress.mailingDifferent && (
            <AccordionSection
              title={t("GetStarted.reviewBusiness.fields.mailingAddress")}
              isRequired={true}
              isExpanded={isSectionExpanded("mailingAddress")}
              onToggle={() => toggleSection("mailingAddress")}
              currentValue={getDisplayValue(
                "mailingAddress",
                state.businessAddress || ""
              )}
              hasError={!!validationErrors.mailingAddress}
            >
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  {t("GetStarted.reviewBusiness.helpText.mailingAddress")}
                </div>
                <FormField label={t("GetStarted.reviewBusiness.fields.street")}>
                  <input
                    type="text"
                    placeholder={t(
                      "GetStarted.reviewBusiness.placeholders.street"
                    )}
                    value={state.businessAddress.mailingStreet || ""}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        businessAddress: {
                          ...prev.businessAddress,
                          mailingStreet: e.target.value,
                        },
                      }));
                      if (validationErrors.mailingAddress) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.mailingAddress;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
                <FormField label={t("GetStarted.reviewBusiness.fields.apt")}>
                  <input
                    type="text"
                    placeholder={t(
                      "GetStarted.reviewBusiness.placeholders.apt"
                    )}
                    value={state.businessAddress.mailingApt || ""}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        businessAddress: {
                          ...prev.businessAddress,
                          mailingApt: e.target.value,
                        },
                      }));
                      if (validationErrors.businessAddress) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.businessAddress;
                          return newErrors;
                        });
                      }
                    }}
                    className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label={t("GetStarted.reviewBusiness.fields.city")}>
                    <input
                      type="text"
                      placeholder={t(
                        "GetStarted.reviewBusiness.placeholders.city"
                      )}
                      value={state.businessAddress.mailingCity || ""}
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          businessAddress: {
                            ...prev.businessAddress,
                            mailingCity: e.target.value,
                          },
                        }));
                        if (validationErrors.businessAddress) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.businessAddress;
                            return newErrors;
                          });
                        }
                      }}
                      className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                    />
                  </FormField>
                  <FormField
                    label={t("GetStarted.reviewBusiness.fields.state")}
                  >
                    <input
                      type="text"
                      placeholder={t(
                        "GetStarted.reviewBusiness.placeholders.state"
                      )}
                      value={state.businessAddress.mailingState || ""}
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          businessAddress: {
                            ...prev.businessAddress,
                            mailingState: e.target.value,
                          },
                        }));
                        if (validationErrors.businessAddress) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.businessAddress;
                            return newErrors;
                          });
                        }
                      }}
                      className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label={t("GetStarted.reviewBusiness.fields.postalCode")}
                  >
                    <input
                      type="text"
                      placeholder={t(
                        "GetStarted.reviewBusiness.placeholders.postalCode"
                      )}
                      value={state.businessAddress.mailingPostalCode || ""}
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          businessAddress: {
                            ...prev.businessAddress,
                            mailingPostalCode: e.target.value,
                          },
                        }));
                        if (validationErrors.businessAddress) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.businessAddress;
                            return newErrors;
                          });
                        }
                      }}
                      className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                    />
                  </FormField>
                  <FormField
                    label={t("GetStarted.reviewBusiness.fields.phoneNumber")}
                  >
                    <input
                      type="text"
                      placeholder={t(
                        "GetStarted.reviewBusiness.placeholders.phoneNumber"
                      )}
                      value={state.businessAddress.mailingPhoneNumber || ""}
                      onChange={(e) => {
                        setState((prev) => ({
                          ...prev,
                          businessAddress: {
                            ...prev.businessAddress,
                            mailingPhoneNumber: e.target.value,
                          },
                        }));
                        if (validationErrors.businessAddress) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.businessAddress;
                            return newErrors;
                          });
                        }
                      }}
                      className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                    />
                  </FormField>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* Entity Type Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.entityType")}
            isRequired={true}
            isExpanded={isSectionExpanded("entityType")}
            onToggle={() => toggleSection("entityType")}
            currentValue={getDisplayValue("entityType", state.entityType)}
            hasError={!!validationErrors.entityType}
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {t("GetStarted.reviewBusiness.helpText.entityType")}
              </div>
              <FormField label={""}>
                <Dropdown
                  options={[
                    "S Corporation",
                    "C Corporation",
                    "Professional Service Corporation",
                    "Sole Proprietorship",
                    "Partnership (including Limited Liability Partnership)",
                    "LLC - Taxed as Partnership",
                    "LLC - Taxed as Sole Proprietorship",
                    "LLC - Taxed as C Corp",
                    "LLC - Taxed as S Corp",
                    "Tax-exempt Corporation",
                    "Tax-exempt Association",
                  ]}
                  value={state.entityType}
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      entityType: value,
                    }));
                    if (validationErrors.entityType) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.entityType;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Payroll Provider Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.payrollProvider")}
            isRequired={true}
            isExpanded={isSectionExpanded("payrollProvider")}
            onToggle={() => toggleSection("payrollProvider")}
            currentValue={getDisplayValue(
              "payrollProvider",
              state.payrollProvider
            )}
            hasError={!!validationErrors.payrollProvider}
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {t("GetStarted.reviewBusiness.helpText.payrollProvider")}
              </div>
              <FormField label={""}>
                <Dropdown
                  options={[
                    "Gusto",
                    "ADP Run",
                    "ADP Enterprise",
                    "AlphaStaff",
                    "APS",
                  ]}
                  value={state.payrollProvider}
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      payrollProvider: value,
                    }));
                    if (validationErrors.payrollProvider) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.payrollProvider;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Payroll Schedule Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.payrollSchedule")}
            isRequired={true}
            isExpanded={isSectionExpanded("payrollSchedule")}
            onToggle={() => toggleSection("payrollSchedule")}
            currentValue={getDisplayValue(
              "payrollSchedule",
              state.payrollSchedule
            )}
            hasError={!!validationErrors.payrollSchedule}
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {t("GetStarted.reviewBusiness.helpText.payrollSchedule")}
              </div>
              <div className="text-sm text-gray-600">
                {t(
                  "GetStarted.reviewBusiness.helpText.payrollScheduleAdditional"
                )}{" "}
                <button className="text-primary-600 hover:text-primary-800 underline transition-colors duration-200">
                  {t("GetStarted.reviewBusiness.actions.addPayrollSchedule")}
                </button>
                .
              </div>
              <FormField label={""}>
                <Dropdown
                  options={[
                    "Every week",
                    "Every other week",
                    "The 1st and the 15th of the month",
                    "The 15th and the end of the month",
                    "Other - a Guideline rep will follow up",
                  ]}
                  value={
                    typeof state.payrollSchedule === "object"
                      ? state.payrollSchedule.schedule
                      : ""
                  }
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      payrollSchedule: {
                        ...(typeof prev.payrollSchedule === "object"
                          ? prev.payrollSchedule
                          : { schedule: "", numberOfDays: 4 }),
                        schedule: value,
                      },
                    }));
                    if (validationErrors.payrollSchedule) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.payrollSchedule;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>

              <FormField label={""}>
                <input
                  type="text"
                  value={state.payrollSchedule.numberOfDays.toString()}
                  onChange={(e) => {
                    setState((prev) => ({
                      ...prev,
                      payrollSchedule: {
                        ...prev.payrollSchedule,
                        numberOfDays: !Number.isNaN(parseInt(e.target.value))
                          ? parseInt(e.target.value)
                          : 0,
                      },
                    }));
                    if (validationErrors.payrollSchedule) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.payrollSchedule;
                        return newErrors;
                      });
                    }
                  }}
                  className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 outline-none transition-all duration-200 bg-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Estimated Employee Count Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.estimatedEmployeeCount")}
            isRequired={true}
            isExpanded={isSectionExpanded("estimatedEmployeeCount")}
            onToggle={() => toggleSection("estimatedEmployeeCount")}
            currentValue={getDisplayValue("businessSize", state.businessSize)}
            hasError={!!validationErrors.businessSize}
          >
            <div className="space-y-4">
              <FormField label={""}>
                <Dropdown
                  options={
                    [
                      { label: "0-5 employees", value: "0-5" },
                      { label: "6-50 employees", value: "6-50" },
                      { label: "51-100 employees", value: "51-100" },
                      { label: "101-500 employees", value: "101-500" },
                      { label: "500+ employees", value: "500+" },
                    ] as { label: string; value: string }[]
                  }
                  value={state.businessSize}
                  setValue={(value) => {
                    console.log({ value });
                    setState((prev) => ({
                      ...prev,
                      businessSize: value,
                    }));
                    if (validationErrors.businessSize) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.businessSize;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Union Employees Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.unionEmployees")}
            isRequired={true}
            isExpanded={isSectionExpanded("unionEmployees")}
            onToggle={() => toggleSection("unionEmployees")}
            currentValue={getDisplayValue(
              "unionEmployees",
              state.unionEmployees ? "Yes" : "No"
            )}
            hasError={!!validationErrors.unionEmployees}
          >
            <div className="space-y-4">
              <FormField label={""}>
                <Dropdown
                  options={["Yes", "No"]}
                  value={state.unionEmployees ? "Yes" : "No"}
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      unionEmployees: value === "Yes",
                    }));
                    if (validationErrors.unionEmployees) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.unionEmployees;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Leased Employees Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.leasedEmployees")}
            isRequired={true}
            isExpanded={isSectionExpanded("leasedEmployees")}
            onToggle={() => toggleSection("leasedEmployees")}
            currentValue={getDisplayValue(
              "leasedEmployees",
              state.leasedEmployees ? "Yes" : "No"
            )}
            hasError={!!validationErrors.leasedEmployees}
          >
            <div className="space-y-4">
              <FormField label={""}>
                <Dropdown
                  options={["Yes", "No"]}
                  value={state.leasedEmployees ? "Yes" : "No"}
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      leasedEmployees: value === "Yes",
                    }));
                    console.log({ value, validationErrors });
                    if (validationErrors.leasedEmployees) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.leasedEmployees;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Existing Retirement Plan Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.existingRetirementPlan")}
            isRequired={true}
            isExpanded={isSectionExpanded("existingRetirementPlan")}
            onToggle={() => toggleSection("existingRetirementPlan")}
            currentValue={getDisplayValue(
              "existingRetirementPlan",
              state.existingRetirementPlan ? "Yes" : "No"
            )}
            hasError={!!validationErrors.existingRetirementPlan}
          >
            <div className="space-y-4">
              <FormField
                label={""}
                helpText={validationErrors.existingRetirementPlan}
              >
                <Dropdown
                  options={["Yes", "No"]}
                  value={state.existingRetirementPlan ? "Yes" : "No"}
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      existingRetirementPlan: value === "Yes",
                    }));
                    if (validationErrors.existingRetirementPlan) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.existingRetirementPlan;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>

          {/* Related Entities Section */}
          <AccordionSection
            title={t("GetStarted.reviewBusiness.fields.relatedEntities")}
            isRequired={true}
            isExpanded={isSectionExpanded("relatedEntities")}
            onToggle={() => toggleSection("relatedEntities")}
            currentValue={getDisplayValue(
              "relatedEntities",
              state.relatedEntities ? "Yes" : "No"
            )}
            hasError={!!validationErrors.relatedEntities}
          >
            <div className="space-y-4">
              <FormField label={""}>
                <Dropdown
                  options={["Yes", "No"]}
                  value={state.relatedEntities ? "Yes" : "No"}
                  setValue={(value) => {
                    setState((prev) => ({
                      ...prev,
                      relatedEntities: value === "Yes",
                    }));
                    if (validationErrors.relatedEntities) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.relatedEntities;
                        return newErrors;
                      });
                    }
                  }}
                  className="bg-custom-lavender-100 border-custom-lavender-100"
                />
              </FormField>
            </div>
          </AccordionSection>
        </div>
        <div className="flex justify-center gap-4 mt-8 pt-6">
          <SecondaryButton
            text={t("GetStarted.reviewBusiness.navigation.back")}
            onClick={() => router.back()}
            className="!w-fit !px-6 !py-2"
            containerClassName="!w-fit"
          />
          <PrimaryButton
            text={
              isSaving
                ? t("GetStarted.reviewBusiness.navigation.saving")
                : t("GetStarted.reviewBusiness.navigation.saveAndContinue")
            }
            onClick={handleSaveAndContinue}
            className="!w-fit !px-6 !py-2"
            loading={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-static";
