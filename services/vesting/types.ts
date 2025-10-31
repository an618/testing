// Vesting schedule interface based on the API response
export interface VestingSchedule {
  id: string;
  tenantId: string | null;
  name: string;
  scheduleType: "graded" | "cliff" | "immediate";
  yearsToFullVest: number;
  description: string;
  isSystemDefault: boolean;
}
