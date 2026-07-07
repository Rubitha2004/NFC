import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const DASHBOARD_QUERY_KEYS = {
  overview: ['dashboard', 'overview'],
  liveFloor: ['dashboard', 'live-floor'],
  analytics: ['dashboard', 'analytics'],
};

export function useDashboardOverview() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overview,
    queryFn: () => dashboardService.getOverview(),
    refetchInterval: 5000, // Background refresh every 5 seconds
    staleTime: 4000,
  });
}

export function useLiveFloor() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.liveFloor,
    queryFn: () => dashboardService.getLiveFloor(),
    refetchInterval: 5000,
    staleTime: 4000,
  });
}
