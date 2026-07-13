import apiClient from "@/services/axios";
import type {
  PlanningDashboardMetrics,
  ProductionTask,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../types/planning.types";

export const planningService = {
  getDashboardMetrics: async (): Promise<PlanningDashboardMetrics> => {
    const res = await apiClient.get("/planning/dashboard");
    return res.data;
  },

  getAllTasks: async (): Promise<ProductionTask[]> => {
    const res = await apiClient.get("/planning/tasks");
    return res.data;
  },

  getTaskById: async (id: number): Promise<ProductionTask> => {
    const res = await apiClient.get(`/planning/tasks/${id}`);
    return res.data;
  },

  createTask: async (data: CreateTaskPayload): Promise<ProductionTask> => {
    const res = await apiClient.post("/planning/tasks", data);
    return res.data;
  },

  updateTask: async (id: number, data: UpdateTaskPayload): Promise<ProductionTask> => {
    const res = await apiClient.patch(`/planning/tasks/${id}`, data);
    return res.data;
  },

  getResourceAvailability: async () => {
    const res = await apiClient.get("/planning/resources");
    return res.data;
  },

  runAutoScheduler: async (id: number) => {
    const res = await apiClient.post(`/planning/scheduler/auto/${id}`);
    return res.data;
  },

  publishPlan: async (data: any) => {
    const res = await apiClient.post("/planning/publish", data);
    return res.data;
  },

  getHistory: async () => {
    const res = await apiClient.get("/planning/history");
    return res.data;
  },
};
