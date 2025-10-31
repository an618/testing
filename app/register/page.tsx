"use client";
import React, { useEffect, useState } from "react";
import { Stepper } from "@/components/Stepper";
import { useLanguage } from "@/hooks/useLanguage";
import {
  RegisterStep,
  RegisterStepData,
  SetValue,
} from "@/components/RegisterStep";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useEmployeeRegistration } from "@/services/employee-registration";
import { useCreatePlanDetails } from "@/services/plan-sponser/queries";
import { PlanDetails } from "@/services/plan-sponser/types";
import { signIn, useSession } from "next-auth/react";

interface RegistrationFormData {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function RegisterFlow() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [formData, setFormData] = useState<RegistrationFormData>({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [describe, setDescribed] = useState(0);
  const [businessSize, setBusinessSize] = useState(0);
  const [priority, setPriority] = useState(0);
  const [retirementPlan, setRetirementPlan] = useState(0);
  const [multipleBusinesses, setMultipleBusinesses] = useState(0);
  const [payrollProvider, setPayrollProvider] = useState("");

  // Employee registration mutation
  const registerEmployee = useEmployeeRegistration();

  // Plan details mutation
  const { mutateAsync: createPlanDetails, isPending: isSavingPlanDetails } =
    useCreatePlanDetails();

  // Logic to handle derived fields
  const generateOrganizationSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const getEmailDomain = (email: string): string => {
    return email.split("@")[1] || "";
  };

  const getUsername = (email: string): string => {
    return email;
  };

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    // Organization Name validation (not numbers only)
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = t("Register.form.errors.organizationName");
    } else if (/^\d+$/.test(formData.organizationName.trim())) {
      newErrors.organizationName = t(
        "Register.form.errors.organizationNameNumbers"
      );
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("Register.form.errors.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("Register.form.errors.emailInvalid");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("Register.form.errors.password");
    } else if (formData.password.length < 8) {
      newErrors.password = t("Register.form.errors.passwordLength");
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("Register.form.errors.confirmPassword");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "Register.form.errors.confirmPasswordMatch"
      );
    }

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t("Register.form.errors.firstName");
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("Register.form.errors.lastName");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Prepare the registration data
    const registrationData = {
      organizationName: formData.organizationName.trim(),
      organizationSlug: generateOrganizationSlug(formData.organizationName),
      email: formData.email.trim(),
      username: getUsername(formData.email),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      emailDomain: getEmailDomain(formData.email),
      description: " ", // Hardcoded as requested
    };

    // Call the actual employee registration API
    const response = await registerEmployee.mutateAsync(registrationData);

    if (response) {
      // Use NextAuth signIn with the resolved orgId as realm
      const result = await signIn("credentials", {
        username: registrationData.email,
        password: formData.password,
        realm: `org_${registrationData.organizationSlug}`,
        redirect: false,
      });

      if (result?.error) {
        setSaveError(new Error(t("Login.error")));
      } else if (result?.ok) {
        // Proceed to next step instead of redirecting
        setStep(step + 1);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && step === 1) {
      setStep(step + 1);
    }
  }, [step, isLoggedIn]);

  // Handle plan details submission
  const submitPlanDetails = async () => {
    setSaveError(null);
    const planDetailsData = mapToPlanDetails();
    await createPlanDetails(planDetailsData);
  };

  // Handle last step submission
  const handleLastStepSubmit = async () => {
    await submitPlanDetails();
  };

  const describeOptions = [
    t("Register.steps.describe.options.0"),
    t("Register.steps.describe.options.1"),
    t("Register.steps.describe.options.2"),
    t("Register.steps.describe.options.3"),
  ];

  const buisnessSizeOptions = [
    t("Register.steps.businessSize.options.0"),
    t("Register.steps.businessSize.options.1"),
    t("Register.steps.businessSize.options.2"),
    t("Register.steps.businessSize.options.3"),
    t("Register.steps.businessSize.options.4"),
  ];

  const priorityOptions = [
    t("Register.steps.priority.options.0"),
    t("Register.steps.priority.options.1"),
    t("Register.steps.priority.options.2"),
    t("Register.steps.priority.options.3"),
    t("Register.steps.priority.options.4"),
  ];

  const retirementPlanOptions = [
    t("Register.steps.retirementPlan.options.0"),
    t("Register.steps.retirementPlan.options.1"),
  ];

  const multipleBusinessesOptions = [
    t("Register.steps.multipleBusinesses.options.0"),
    t("Register.steps.multipleBusinesses.options.1"),
  ];

  const payrollProviderOptions = [
    "Gusto",
    "ADP Run",
    "ADP Enterprise",
    "AlphaStaff",
    "APS",
  ];

  // Original stepper steps
  const steps: RegisterStepData[] = [
    {
      title: t("Register.steps.describe.title"),
      options: describeOptions,
      type: "select",
      value: describe,
      setValue: setDescribed as SetValue,
    },
    {
      title: t("Register.steps.businessSize.title"),
      options: buisnessSizeOptions,
      type: "select",
      value: businessSize,
      setValue: setBusinessSize as SetValue,
    },
    {
      title: t("Register.steps.priority.title"),
      options: priorityOptions,
      type: "select",
      value: priority,
      setValue: setPriority as SetValue,
    },
    {
      title: t("Register.steps.retirementPlan.title"),
      options: retirementPlanOptions,
      type: "select",
      value: retirementPlan,
      setValue: setRetirementPlan as SetValue,
    },
    {
      title: t("Register.steps.multipleBusinesses.title"),
      options: multipleBusinessesOptions,
      type: "select",
      value: multipleBusinesses,
      setValue: setMultipleBusinesses as SetValue,
    },
    {
      title: t("Register.steps.payrollProvider.title"),
      options: payrollProviderOptions,
      type: "dropdown",
      value: payrollProvider,
      setValue: setPayrollProvider as SetValue,
    },
  ];

  // Map form data to plan details payload
  const mapToPlanDetails = (): PlanDetails => {
    return {
      legalName: formData.organizationName,
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
      payrollProvider: payrollProvider,
      payrollSchedule: {
        schedule: "",
        numberOfDays: 0,
      },
      estimatedEmployeeCount: 0,
      unionEmployees: false,
      leasedEmployees: false,
      existingRetirementPlan: retirementPlan === 0,
      relatedEntities: false,
      employmentStatus: describeOptions[describe],
      businessSize: buisnessSizeOptions[businessSize]?.split(" ")[0],
      retirementPlanPriority: priorityOptions[priority],
      hasExisting401k: retirementPlan === 0,
      hasMultipleBusinesses: multipleBusinesses === 0,
    };
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 md:items-center pt-8 md:pt-0 md:justify-center bg-gradient-to-tr from-brandStart to-brandEnd px-2">
      <Stepper totalSteps={steps.length + 1} currentStep={step} />
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-xl flex flex-col gap-8 md:min-h-[600px] justify-center">
        {step === 1 ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-custom-gray-700 mb-2">
                {t("Register.form.title")}
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-custom-gray-700 mb-2"
                >
                  {t("Register.form.fields.organizationName")} *
                </label>
                <input
                  id="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) =>
                    handleInputChange("organizationName", e.target.value)
                  }
                  placeholder={t("Register.form.placeholders.organizationName")}
                  className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base text-custom-gray-700 placeholder:text-custom-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.organizationName ? "border-red-500" : ""
                  }`}
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organizationName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-custom-gray-700 mb-2"
                >
                  {t("Register.form.fields.email")} *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("Register.form.placeholders.email")}
                  className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base text-custom-gray-700 placeholder:text-custom-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-custom-gray-700 mb-2"
                  >
                    {t("Register.form.fields.firstName")} *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder={t("Register.form.placeholders.firstName")}
                    className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base text-custom-gray-700 placeholder:text-custom-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-custom-gray-700 mb-2"
                  >
                    {t("Register.form.fields.lastName")} *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder={t("Register.form.placeholders.lastName")}
                    className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base text-custom-gray-700 placeholder:text-custom-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-custom-gray-700 mb-2"
                  >
                    {t("Register.form.fields.password")} *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={t("Register.form.placeholders.password")}
                    className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base text-custom-gray-700 placeholder:text-custom-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-custom-gray-700 mb-2"
                  >
                    {t("Register.form.fields.confirmPassword")} *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder={t(
                      "Register.form.placeholders.confirmPassword"
                    )}
                    className={`border border-custom-gray-300 rounded-xl px-4 py-3 w-full text-base text-custom-gray-700 placeholder:text-custom-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center gap-4 mt-6">
                <PrimaryButton
                  text={
                    registerEmployee.isPending
                      ? t("Register.form.submittingButton")
                      : t("Register.form.submitButton")
                  }
                  onClick={handleSubmit}
                  disabled={registerEmployee.isPending}
                />
              </div>
            </div>
          </>
        ) : (
          <RegisterStep
            data={steps[step - 2]}
            setStep={setStep}
            step={step}
            isLastStep={step === steps.length + 1}
            onLastStepSubmit={handleLastStepSubmit}
            isSubmitting={isSavingPlanDetails}
            saveError={saveError}
          />
        )}
      </div>
    </div>
  );
}
