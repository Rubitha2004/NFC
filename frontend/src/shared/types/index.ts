// Shared application types

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "operator";
  avatar?: string;
  department?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "machine" | "worker" | "production" | "qc" | "attendance" | "bundle";
  priority: "high" | "medium" | "low";
  isRead: boolean;
  timestamp: Date;
}

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  children?: NavItem[];
  badge?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export type Theme = "light" | "dark" | "system";
