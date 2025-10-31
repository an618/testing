// Authentication constants
export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_MAX_AGE = 86400; // 24 hours in seconds
export const AUTH_COOKIE_PATH = "/";
export const AUTH_COOKIE_SECURE = true;
export const AUTH_COOKIE_SAME_SITE = "strict" as const;

// API constants
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.glidingpath.com";
export const API_TIMEOUT = 30000; // 30 seconds

// UI constants
export const MODAL_ANIMATION_DURATION = 200; // milliseconds
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Animation constants
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

export const TRANSITION_EASINGS = {
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Business constants
export const ENTITY_TYPES = [
  "S Corporation",
  "C Corporation",
  "Professional Service Corporation",
  "Sole Proprietorship",
  "Partnership (including Limited Liability Partnership)",
  "LLC - Taxed as Partnership",
  "LLC - Taxed as Sole Proprietorship",
  "LLC - Taxed as C Corp",
  "LLC - Taxed as S Corp",
  "Tax-exempt Corporation",
  "Tax-exempt Association",
] as const;

export const PAYROLL_PROVIDERS = [
  "Paylocity",
  "TriNet PEO",
  "Warp",
  "Workstream",
  "Zenoti",
  "iSolved",
  "Other",
] as const;

export const PAY_SCHEDULES = [
  "Every week",
  "Every other week",
  "The 1st and the 15th of the month",
  "The 15th and the end of the month",
  "Other - a Glidingpath rep will follow up",
] as const;

export const DAYS_BEFORE_PAYROLL = Array.from({ length: 22 }, (_, i) =>
  (i + 2).toString()
);

// Yes/No options for boolean fields
export const YES_NO_OPTIONS = ["Yes", "No"] as const;

// Employee count ranges
export const EMPLOYEE_COUNT_RANGES = [
  "1-10",
  "11-25",
  "26-50",
  "51-100",
  "101-250",
  "251-500",
  "501-1000",
  "1000+",
] as const;

// Retirement plan types
export const RETIREMENT_PLAN_TYPES = [
  "No existing plan",
  "401(k) plan",
  "403(b) plan",
  "SEP IRA",
  "SIMPLE IRA",
  "Traditional IRA",
  "Roth IRA",
  "Pension plan",
  "Other retirement plan",
] as const;

// Route constants
export const PROTECTED_ROUTES = {
  "/admin": ["admin"],
  "/employer": ["admin", "employer"],
  "/employee": ["admin", "employer", "employee"],
  "/dashboard": ["admin", "employer", "employee"],
} as const;

// Color constants
export const COLORS = {
  primary: "#6C3DF4",
  primaryHover: "#5327c6",
  text: "#1A1A1A",
  textSecondary: "#1A1A1AB2",
  background: "#ffffff",
  backgroundSecondary: "#F6F6F6",
  border: "#e5e7eb",
} as const;
