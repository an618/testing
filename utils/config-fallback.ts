import { AppConfig } from '@/services/config/types';

export const DEFAULT_CONFIG: AppConfig = {
  companyOnboardingConfig: {
    planStartDateConfig: {
      onBoardingTasksDueIn: 60,
      employeeInvitesSentIn: 40,
      paycheckWithFirstContributionIn: 45,
    },
  },
};

export function mergeConfigWithDefaults(config: Partial<AppConfig>): AppConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    companyOnboardingConfig: {
      ...DEFAULT_CONFIG.companyOnboardingConfig,
      ...config.companyOnboardingConfig,
      planStartDateConfig: {
        ...DEFAULT_CONFIG.companyOnboardingConfig.planStartDateConfig,
        ...config.companyOnboardingConfig?.planStartDateConfig,
      },
    },
  };
} 