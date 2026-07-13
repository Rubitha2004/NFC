import { useQuery } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';

export function usePlanningDashboard() {
  return useQuery({
    queryKey: ['planning', 'dashboard'],
    queryFn: () => planningService.getDashboardMetrics(),
  });
}

export function usePlanningHistory() {
  return useQuery({
    queryKey: ['planning', 'history'],
    queryFn: () => planningService.getHistory(),
  });
}

