import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';

export function usePlanningDashboard() {
  return useQuery({
    queryKey: ['planning', 'dashboard'],
    queryFn: () => planningService.getDashboardMetrics(),
  });
}

export function usePlanningTasks() {
  return useQuery({
    queryKey: ['planning', 'tasks'],
    queryFn: () => planningService.getAllTasks(),
  });
}

export function usePlanningResources() {
  return useQuery<import('../types/planning.types').PlanningResources>({
    queryKey: ['planning', 'resources'],
    queryFn: () => planningService.getResourceAvailability(),
  });
}
