"use client";

import { useMemo } from "react";
import {
  useMasterVestingSchedules,
  VestingSchedule as ApiVestingSchedule,
} from "@/services/vesting";
import { VestingSchedule } from "@/services/vesting";

export const useVestingSchedules = () => {
  const {
    data: vestingSchedules = [],
    isLoading: loading,
    error,
  } = useMasterVestingSchedules();

  // Helper function to get schedule by name
  const getVestingScheduleByName = (
    name: string
  ): VestingSchedule | undefined => {
    return convertedSchedules.find((schedule) => schedule.name === name);
  };

  // Helper function to get schedule by ID
  const getVestingScheduleById = (id: string): VestingSchedule | undefined => {
    return convertedSchedules.find((schedule) => schedule.id === id);
  };

  // Convert API response to match the expected VestingSchedule type
  const convertedSchedules: VestingSchedule[] = useMemo(() => {
    return vestingSchedules.map((schedule: ApiVestingSchedule) => ({
      ...schedule,
      details: generateVestingDetails(schedule),
    }));
  }, [vestingSchedules]);

  return {
    vestingSchedules: convertedSchedules,
    loading,
    error,
    getVestingScheduleByName,
    getVestingScheduleById,
  };
};

// Helper function to generate vesting details based on schedule type
const generateVestingDetails = (schedule: ApiVestingSchedule): any[] => {
  if (schedule.scheduleType === "immediate") {
    return [{ yearsOfService: 0, vestedPercentage: 100 }];
  } else if (schedule.scheduleType === "cliff") {
    return [
      { yearsOfService: 0, vestedPercentage: 0 },
      { yearsOfService: schedule.yearsToFullVest, vestedPercentage: 100 },
    ];
  } else if (schedule.scheduleType === "graded") {
    const details = [];
    const yearlyVesting = 100 / schedule.yearsToFullVest;

    for (let year = 0; year <= schedule.yearsToFullVest; year++) {
      details.push({
        yearsOfService: year,
        vestedPercentage: Math.round(year * yearlyVesting),
      });
    }

    return details;
  }

  return [];
};
