import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { socketService } from '@/services/socket';
import { planningService } from '../services/planning.service';

const DASHBOARD_KEY = ['planning', 'dashboard'] as const;
const HISTORY_KEY = ['planning', 'history'] as const;

// Events that should trigger a refresh of planning metrics and history
const LIVE_EVENTS = [
  'bundle.updated',
  'assignment.created',
  'assignment.updated',
  'assignment.released',
];

export function usePlanningDashboard() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: () => planningService.getDashboardMetrics(),
    staleTime: 0,
  });

  useEffect(() => {
    const socket = socketService.connect();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });

    LIVE_EVENTS.forEach(evt => socket.on(evt, invalidate));
    socket.on('reconnect', invalidate);

    return () => {
      LIVE_EVENTS.forEach(evt => socket.off(evt, invalidate));
      socket.off('reconnect', invalidate);
    };
  }, [queryClient]);

  return query;
}

export function usePlanningHistory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: HISTORY_KEY,
    queryFn: () => planningService.getHistory(),
    staleTime: 0,
  });

  useEffect(() => {
    const socket = socketService.connect();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: HISTORY_KEY });

    LIVE_EVENTS.forEach(evt => socket.on(evt, invalidate));
    socket.on('reconnect', invalidate);

    return () => {
      LIVE_EVENTS.forEach(evt => socket.off(evt, invalidate));
      socket.off('reconnect', invalidate);
    };
  }, [queryClient]);

  return query;
}
