import { z } from 'zod';

// ──────────────────────────────────────────────
// Backend API Response Types
// ──────────────────────────────────────────────

/** Mirrors the Prisma Department model */
export interface DepartmentAPI {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  _count?: {
    workers: number;
    machines: number;
    productionTasks: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

export interface DepartmentsResponse extends ApiResponse<DepartmentAPI[]> {
  total: number;
}

// ──────────────────────────────────────────────
// Frontend UI Model (flattened for components)
// ──────────────────────────────────────────────

export interface Department {
  id: string;           // string for UI (from numeric id)
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';

  // Derived from _count relations
  workers: number;
  machines: number;
  productionLines: number;

  // Placeholder display fields (not in DB, used for UI)
  manager: string;
  type: string;
  building?: string;
  floor?: string;
  room?: string;
  efficiency: number;
  currentProduction: number;
  targetProduction: number;

  createdAt: Date;
  updatedAt: Date;
}

// ──────────────────────────────────────────────
// Form Validation Schema
// ──────────────────────────────────────────────

export const departmentFormSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").max(10),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(255).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']),
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;

// ──────────────────────────────────────────────
// API Request Types
// ──────────────────────────────────────────────

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateDepartmentRequest {
  code?: string;
  name?: string;
  description?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
}

// ──────────────────────────────────────────────
// Query Params
// ──────────────────────────────────────────────

export interface DepartmentQueryParams {
  search?: string;
  status?: string;
}

// ──────────────────────────────────────────────
// Mapper: API → UI model
// ──────────────────────────────────────────────

export function mapDepartmentAPIToUI(dept: DepartmentAPI): Department {
  return {
    id: String(dept.id),
    code: dept.code,
    name: dept.name,
    description: dept.description ?? undefined,
    status: dept.status === 'ACTIVE' ? 'active' : 'inactive',
    workers: dept._count?.workers ?? 0,
    machines: dept._count?.machines ?? 0,
    productionLines: dept._count?.productionTasks ?? 0,
    // UI placeholder fields
    manager: 'Unassigned',
    type: 'Production',
    efficiency: 0,
    currentProduction: 0,
    targetProduction: 0,
    createdAt: new Date(dept.createdAt),
    updatedAt: new Date(dept.updatedAt),
  };
}

// ──────────────────────────────────────────────
// Legacy types (kept for drawer compatibility)
// ──────────────────────────────────────────────

export interface WorkerSummary {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent' | 'leave';
  skill: string;
}

export interface MachineSummary {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  utilization: number;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'creation' | 'manager_change' | 'production' | 'maintenance' | 'other';
}
