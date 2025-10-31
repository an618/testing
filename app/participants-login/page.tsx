"use client";

import React, { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Icon } from "@iconify/react/dist/iconify.js";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import { CustomDatePicker } from "@/lib/DatePicker";
import { AiFillEyeInvisible } from "react-icons/ai";

export default function ParticipantLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    lastName: "",
    ssnOrEmployeeId: "",
    dateOfBirth: "",
  });
  const [showSSN, setShowSSN] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "failed" | null
  >(null);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showResetCard, setShowResetCard] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });
  const [resetData, setResetData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showUserName, setShowUserName] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("ParticipantLogin.errors.lastNameRequired");
    }

    if (!formData.ssnOrEmployeeId.trim()) {
      newErrors.ssnOrEmployeeId = t("ParticipantLogin.errors.ssnRequired");
    } else if (formData.ssnOrEmployeeId.length < 4) {
      newErrors.ssnOrEmployeeId = t("ParticipantLogin.errors.ssnMinLength");
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = t("ParticipantLogin.errors.dateRequired");
    } else {
      // Basic date validation for DD-MM-YYYY format
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        newErrors.dateOfBirth = t("ParticipantLogin.errors.dateFormat");
      } else {
        // Additional validation to check if the date is valid
        const [day, month, year] = formData.dateOfBirth.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month - 1 ||
          date.getDate() !== day
        ) {
          newErrors.dateOfBirth = t("ParticipantLogin.errors.dateFormat");
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setVerificationAttempted(true);

    try {
      // TODO: Implement actual participant authentication logic
      // For now, simulate verification with random success/failure
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate random verification result for demo purposes
      const isSuccessful = Math.random() > 0.5;

      if (isSuccessful) {
        setVerificationStatus("success");
        // Show login card after successful verification
        setTimeout(() => {
          setShowLoginCard(true);
        }, 1500);
      } else {
        setVerificationStatus("failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setVerificationStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = (
    password: string
  ): "weak" | "medium" | "strong" => {
    if (password.length < 8) return "weak";

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update password strength when password changes
    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }

    if (!loginData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (loginData.password !== loginData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateLoginForm()) {
      return;
    }

    setIsOtpLoading(true);

    try {
      // TODO: Implement actual OTP sending logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, redirect to dashboard after OTP
      router.push("/participant-dashboard");
    } catch (error) {
      console.error("OTP sending error:", error);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResetInputChange = (field: string, value: string) => {
    setResetData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (resetErrors[field]) {
      setResetErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateResetForm = () => {
    const newErrors: Record<string, string> = {};

    if (!resetData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(resetData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!resetData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (resetData.password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }

    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetLink = async () => {
    if (!validateResetForm()) {
      return;
    }

    setIsResetLoading(true);

    try {
      // TODO: Implement actual reset link sending logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, show success message or redirect
      alert("Reset link sent to your email!");
      setShowResetCard(false);
      setShowLoginCard(true);
    } catch (error) {
      console.error("Reset link sending error:", error);
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd px-4">
      <div className="bg-white rounded-3xl shadow-lg w-[750px] p-8 relative">
        {!showLoginCard && !showResetCard ? (
          // Identity Verification Form
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                {t("ParticipantLogin.title")}
              </h1>
              <p className="text-custom-gray-600 text-sm">
                {t("ParticipantLogin.subtitle")}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  {t("ParticipantLogin.lastName.label")}
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder={t("ParticipantLogin.lastName.placeholder")}
                  className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* SSN or Employee ID */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  {t("ParticipantLogin.ssnOrEmployeeId.label")}
                </label>
                <div className="relative">
                  <input
                    type={showSSN ? "text" : "password"}
                    value={formData.ssnOrEmployeeId}
                    onChange={(e) =>
                      handleInputChange(
                        "ssnOrEmployeeId",
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    placeholder={t(
                      "ParticipantLogin.ssnOrEmployeeId.placeholder"
                    )}
                    className={`w-full px-4 py-3 pr-10 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                      errors.ssnOrEmployeeId
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSSN(!showSSN)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-gray-700"
                    aria-label={
                      showSSN
                        ? t("ParticipantLogin.accessibility.hideSSN")
                        : t("ParticipantLogin.accessibility.showSSN")
                    }
                  >
                    <Icon
                      icon={showSSN ? "heroicons:eye-slash" : "heroicons:eye"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                {errors.ssnOrEmployeeId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ssnOrEmployeeId}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  {t("ParticipantLogin.dateOfBirth.label")}
                </label>
                <CustomDatePicker
                  value={formData.dateOfBirth}
                  onChange={(value) => handleInputChange("dateOfBirth", value)}
                  placeholder={t("ParticipantLogin.dateOfBirth.placeholder")}
                  status={errors.dateOfBirth ? "error" : undefined}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Security Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="security"
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded-[10px] focus:ring-blue-500"
                />
                <label
                  htmlFor="security"
                  className="text-sm text-custom-gray-600"
                >
                  {t("ParticipantLogin.securityCheckbox")}
                </label>
              </div>
            </div>

            {/* Security Banner - Only show after verification attempt */}
            {verificationAttempted && verificationStatus === "success" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-[10px] flex items-center gap-3">
                <Icon
                  icon="heroicons:lock-closed"
                  className="w-5 h-5 text-green-600"
                />
                <span className="text-sm text-green-700 font-medium">
                  {t("ParticipantLogin.securityBanner")}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <PrimaryButton
                text={t("ParticipantLogin.submitButton")}
                onClick={handleSubmit}
                loading={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              />
            </div>

            {/* Verification Failed Message - Only show after verification attempt */}
            {verificationAttempted && verificationStatus === "failed" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-[10px] flex items-center gap-3">
                <Icon
                  icon="heroicons:information-circle"
                  className="w-5 h-5 text-red-600"
                />
                <div>
                  <p className="text-red-600 text-sm font-medium">
                    {t("ParticipantLogin.verificationFailed.title")}
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    {t("ParticipantLogin.verificationFailed.message")}
                  </p>
                </div>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}
          </>
        ) : showResetCard ? (
          // Reset Password Card
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                Reset Your Password & Get Back In!
              </h1>
            </div>

            {/* Reset Form */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  Email Id
                </label>
                <input
                  type="email"
                  value={resetData.email}
                  onChange={(e) =>
                    handleResetInputChange("email", e.target.value)
                  }
                  placeholder="Enter your email id"
                  className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                    resetErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {resetErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {resetErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    value={resetData.password}
                    onChange={(e) =>
                      handleResetInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-10 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                      resetErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-gray-700"
                  >
                    <AiFillEyeInvisible className="w-5 h-5" />
                  </button>
                </div>
                {resetErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {resetErrors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Send Link Button */}
            <div className="mt-8 flex justify-center">
              <PrimaryButton
                text="Send Link"
                onClick={handleSendResetLink}
                loading={isResetLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              />
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-custom-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => {
                    setShowResetCard(false);
                    setShowLoginCard(true);
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Login
                </button>
              </p>
            </div>
          </>
        ) : (
          // Login Card
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                Access Your Account — Log In Today
              </h1>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  Email Id:
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    handleLoginInputChange("email", e.target.value)
                  }
                  placeholder="dummy@companymail.com"
                  className={`w-full px-4 py-3 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                    loginErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.email}
                  </p>
                )}
              </div>
              {/* User Name (Optional) */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  User Name{" "}
                  <span className="text-custom-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showUserName ? "text" : "password"}
                    value={loginData.userName ?? ""}
                    onChange={(e) => {
                      // Sanitize input: remove leading/trailing whitespace and limit length
                      const sanitizedValue = e.target.value
                        .trimStart()
                        .slice(0, 50);
                      handleLoginInputChange("userName", sanitizedValue);
                    }}
                    placeholder="Enter your user name (if any)"
                    className={`w-full px-4 py-3 pr-10 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                      loginErrors.userName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    autoComplete="username"
                    maxLength={50}
                    inputMode="text"
                    aria-label="User Name (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserName(!showUserName)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-gray-700"
                  >
                    <AiFillEyeInvisible className="w-5 h-5" />
                  </button>
                </div>
                {loginErrors.userName && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.userName}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      handleLoginInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-10 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                      loginErrors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-gray-700"
                  >
                    <AiFillEyeInvisible className="w-5 h-5" />
                  </button>
                </div>

                {/* Password Validation Indicators */}
                {loginData.password && (
                  <div className="mt-2 space-y-1">
                    {/* Password Strength Indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          passwordStrength === "weak"
                            ? "bg-red-500"
                            : passwordStrength === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        Password Strength{" "}
                        {passwordStrength.charAt(0).toUpperCase() +
                          passwordStrength.slice(1)}
                      </span>
                    </div>

                    {/* Minimum Length Validation */}
                    {loginData.password.length < 8 && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <span className="text-red-500 text-sm">✕</span>
                        </div>
                        <span className="text-sm text-red-500">
                          Must be at least 8 characters
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-custom-gray-600 mb-2">
                  Confirm Password:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={loginData.confirmPassword}
                    onChange={(e) =>
                      handleLoginInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Enter your confirm password"
                    className={`w-full px-4 py-3 pr-10 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-normal text-custom-gray-500 ${
                      loginErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-gray-700"
                  >
                    <AiFillEyeInvisible className="w-5 h-5" />
                  </button>
                </div>
                {loginErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Send OTP Button */}
            <div className="mt-8 flex justify-center">
              <PrimaryButton
                text="Send OTP"
                onClick={handleSendOtp}
                loading={isOtpLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowLoginCard(false);
                  setShowResetCard(true);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-2 text-center">
              <p className="text-sm text-custom-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setShowLoginCard(false)}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
