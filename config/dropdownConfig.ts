export const dropdownConfigs = {
  minimumAge: {
    options: ["18", "19", "20", "21", "22", "23", "24", "25"],
    getDisplayValues: (t: Function, options: string[]) =>
      Object.fromEntries(
        options.map((age) => [
          age,
          t("GetStarted.starter.employeeEligibility.minimumAgeValue", { age }),
        ])
      ),
  },

  timeEmployed: {
    options: ["0", "3", "6", "9", "12"],
    getDisplayValues: (t: Function, options: string[]) =>
      Object.fromEntries(
        options.map((time) => [
          time,
          time === "0"
            ? t("GetStarted.starter.employeeEligibility.noRequirement")
            : t("GetStarted.starter.employeeEligibility.timeEmployedValue", {
                time,
              }),
        ])
      ),
  },

  exclusions: {
    options: ["None", "Select from list"],
  },

  exclusionsList: {
    options: [
      "Part time employees",
      "Union employees",
      "Non-resident aliens",
      "Interns or Trainees",
      "Temporary or seasonal workers",
    ],
  },

  defaultRate: {
    options: ["3", "4", "5", "6", "7", "8", "9", "10", "12", "15"],
    getDisplayValues: (options: string[]) =>
      Object.fromEntries(options.map((rate) => [rate, `${rate}%`])),
  },

  annualIncrease: {
    options: [
      {
        label: "2% annual increase until 10%",
        value: "minimum",
        highlight: "Minimum required",
      },
      {
        label: "Customize the annual increase rate",
        value: "custom",
      },
    ],
  },

  annualRates: {
    options: ["1", "2", "3", "4", "5"].map((option) => ({
      label: `${option}%`,
      value: option,
    })),
  },

  maxContributions: {
    options: ["10", "12", "15", "18", "20"].map((option) => ({
      label: `${option}%`,
      value: option,
    })),
  },

  // Safe Harbor specific configurations
  employerContributionType: {
    options: [
      "4% basic match",
      "Employer match",
      "Custom match",
      "Non-elective contribution",
    ],
  },

  employerContributionPercentage: {
    options: ["3% basic", "4% basic", "5% basic", "6% basic"],
  },

  employerVesting: {
    options: ["Immediate", "2 year cliff", "3 year cliff", "6 year graded"],
  },

  profitSharingDefault: {
    options: ["None", "3%", "5%", "10%"],
  },

  profitSharingFormula: {
    options: (t: Function) => [
      {
        label: "Pro-rata",
        value: "Pro-rata",
        description: t(
          "GetStarted.safeHarbor.summary.profitSharing.formulas.proRata.description"
        ),
      },
      {
        label: "Flat dollar",
        value: "Flat dollar",
        description: t(
          "GetStarted.safeHarbor.summary.profitSharing.formulas.flatDollar.description"
        ),
      },
      {
        label: "New comparability",
        value: "New comparability",
        highlight: t(
          "GetStarted.safeHarbor.summary.profitSharing.enterpriseFeature"
        ),
        description: t(
          "GetStarted.safeHarbor.summary.profitSharing.formulas.newComparability.description"
        ),
      },
    ],
  },

  profitSharingVesting: {
    options: ["2 year cliff", "3 year cliff", "6 year graded", "Immediate"],
  },
};
