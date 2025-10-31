// Centralized query key definitions
export const queryKeys = {
  // Plan Types - only what you need for the single API
  auth: {
    login: ["login"] as const,
  },
  planTypes: {
    all: ["planTypes"] as const,
    lists: () => [...queryKeys.planTypes.all, "list"] as const,
  },
  // Pricing
  pricing: {
    all: ["pricing"] as const,
    core: () => [...queryKeys.pricing.all, "core"] as const,
  },
  // Vesting
  vesting: {
    all: ["vesting"] as const,
    master: () => [...queryKeys.vesting.all, "master"] as const,
  },
  // Config
  config: {
    all: ["config"] as const,
  },
  // Participants
  participants: {
    all: ["participants"] as const,
    list: (params?: { page?: number; size?: number; search?: string }) =>
      [...queryKeys.participants.all, "list", params] as const,
  },
} as const;
