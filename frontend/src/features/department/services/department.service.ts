import apiClient from '@/services/axios';
import type {
  DepartmentAPI,
  ApiResponse,
  DepartmentsResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentQueryParams,
} from '@/features/department/types/department.types';

const BASE = '/departments';

export const departmentService = {
  /**
   * GET /api/v1/departments
   * Fetch all departments with optional search/filter
   */
  async getAll(params?: DepartmentQueryParams): Promise<DepartmentAPI[]> {
    const { data } = await apiClient.get<DepartmentsResponse>(BASE, { params });
    return data.data;
  },

  /**
   * GET /api/v1/departments/:id
   * Fetch a single department by ID
   */
  async getById(id: number): Promise<DepartmentAPI> {
    const { data } = await apiClient.get<ApiResponse<DepartmentAPI>>(`${BASE}/${id}`);
    return data.data;
  },

  /**
   * POST /api/v1/departments
   * Create a new department
   */
  async create(payload: CreateDepartmentRequest): Promise<DepartmentAPI> {
    const { data } = await apiClient.post<ApiResponse<DepartmentAPI>>(BASE, payload);
    return data.data;
  },

  /**
   * PUT /api/v1/departments/:id
   * Update an existing department
   */
  async update(id: number, payload: UpdateDepartmentRequest): Promise<DepartmentAPI> {
    const { data } = await apiClient.put<ApiResponse<DepartmentAPI>>(`${BASE}/${id}`, payload);
    return data.data;
  },

  /**
   * DELETE /api/v1/departments/:id
   * Delete a department
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
