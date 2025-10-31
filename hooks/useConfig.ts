import { useAppConfig } from '@/providers/ConfigProvider';
import { mergeConfigWithDefaults } from '@/utils/config-fallback';

export function useConfig() {
  const { config, isLoading, error } = useAppConfig();
  
  const safeConfig = config ? mergeConfigWithDefaults(config) : null;
  
  return {
    config: safeConfig,
    isLoading,
    error,
    getPlanStartDateConfig: () => safeConfig?.companyOnboardingConfig.planStartDateConfig,
    getOnboardingTasksDueIn: () => safeConfig?.companyOnboardingConfig.planStartDateConfig.onBoardingTasksDueIn ?? 60,
    getEmployeeInvitesSentIn: () => safeConfig?.companyOnboardingConfig.planStartDateConfig.employeeInvitesSentIn ?? 40,
    getPaycheckWithFirstContributionIn: () => safeConfig?.companyOnboardingConfig.planStartDateConfig.paycheckWithFirstContributionIn ?? 45,
  };
} 