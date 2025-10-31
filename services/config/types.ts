export interface PlanStartDateConfig {
  onBoardingTasksDueIn: number;
  employeeInvitesSentIn: number;
  paycheckWithFirstContributionIn: number;
}

export interface CompanyOnboardingConfig {
  planStartDateConfig: PlanStartDateConfig;
}

export interface AppConfig {
  companyOnboardingConfig: CompanyOnboardingConfig;
} 