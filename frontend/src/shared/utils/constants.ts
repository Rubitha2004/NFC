// Application-wide constants
export const APP_NAME = "FactoryOS";
export const APP_DESCRIPTION = "Smart Factory ERP & Production Management System";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : "http://localhost:5000/api/v1";
export const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const NAVBAR_HEIGHT = 60;

export const THEME_STORAGE_KEY = "factory-os-theme";
export const SIDEBAR_STORAGE_KEY = "factory-os-sidebar";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  LIVE_FACTORY: "/live-factory",
  DEPARTMENTS: "/departments",
  WORKERS: "/workers",
  MACHINES: "/machines",
  MACHINE_TYPES: "/machine-types",
  TERMINALS: "/terminals",
  OPERATIONS: "/operations",
  SHIFTS: "/shifts",
  ASSIGNMENTS: "/assignments",
  ATTENDANCE: "/attendance",
  PRODUCTION_ORDERS: "/production-orders",
  BUNDLES: "/bundles",
  QC: "/qc",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  NOT_FOUND: "*",
} as const;

export const NOTIFICATION_PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;
