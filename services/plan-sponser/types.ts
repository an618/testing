export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

// Plan State interface
export interface PlanState {
  createdAt: string;
  currentState: string;
  tenantId: string;
  updatedAt: string;
}

// Plan Details interface
export interface PlanDetails {
  legalName: string;
  ein: string;
  businessAddress: {
    street: string;
    apt: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
    mailingDifferent: boolean;
    mailingStreet: string;
    mailingApt: string;
    mailingCity: string;
    mailingState: string;
    mailingPostalCode: string;
    mailingPhoneNumber: string;
  };
  entityType: string;
  payrollProvider: string;
  payrollSchedule: {
    schedule: string;
    numberOfDays: number;
  };
  estimatedEmployeeCount: number;
  unionEmployees: boolean;
  leasedEmployees: boolean;
  existingRetirementPlan: boolean;
  relatedEntities: boolean;
  employmentStatus: string;
  businessSize: string;
  retirementPlanPriority: string;
  hasExisting401k: boolean;
  hasMultipleBusinesses: boolean;
}

// Plan Start Date interface
export interface PlanStartDate {
  startDate: string;
  onboardingTasksDue: string;
  employeeInvitesSent: string;
  paycheckWithFirstContribution: string;
  tenantPlanId: string;
}

// Request interfaces based on the API
export interface EmployeeContributionConfig {
  hasEmployeeContribution: boolean;
  defaultContributionRate: number;
  isAutoEnrollment: boolean;
  enrollmentStartRate: number;
  enrollmentAnnualIncrease: number;
  enrollmentMaxRate: number;
  enrollmentMaxContributionRate: number;
}

export interface EmployerContributionRule {
  ruleType: string;
  basicMatchFirstPercent: number;
  basicMatchFirstRate: number;
  basicMatchSecondPercent: number;
  basicMatchSecondRate: number;
  flexibleMatchPercent: number;
  nonElectivePercent: number;
  matchPercentage: number;
  matchLimitPercent: number;
  vestingScheduleId: string;
  tenantVestingScheduleId: string;
}

export interface ProfitSharingConfig {
  isEnabled: boolean;
  defaultContribution: string;
  proRataPercentage: number;
  flatDollarAmount: number;
  comparabilityFormula: string;
  vestingScheduleId: string;
  tenantVestingScheduleId: string;
}

export interface CompanyPlanRequest {
  tenantId: string;
  planTypeId: string;
  employeeContributionConfig: {
    hasEmployeeContribution: boolean;
    defaultContributionRate: number;
    isAutoEnrollment: boolean;
    enrollmentAnnualIncrease: number;
    enrollmentMaxRate: number;
  };
  eligibility: {
    minimumEntryAge: number;
    timeEmployedMonths: number;
  };
}

// Extended interface for Safe Harbor plans with additional fields
export interface SafeHarborPlanRequest extends CompanyPlanRequest {
  safeHarborType: "basic" | "custom" | "nonelective";
  employerContributionConfig: {
    type: "match" | "nonelective" | "none";
    matchPercentage?: number;
    matchLimitPercent?: number;
    nonElectivePercent?: number;
    vestingSchedule: string;
  };
  profitSharingConfig: {
    isEnabled: boolean;
    formula: string;
    vestingSchedule: string;
  };
  autoEnrollmentConfig: {
    defaultContributionRate: number;
    annualIncrease: number;
    maxContributionRate: number;
  };
}

export interface CompanyPlanResponse {
  id: string;
  // Add other response fields as needed
}

// Plan Type interface based on the API response
export interface PlanType {
  id: string;
  name: string;
  description: string;
  monthlyCost: number;
  perParticipantFee: number;
  employerContribution: string;
  employeeContributionLimit: number;
  complianceProtection: string;
  taxCredit: string;
}
