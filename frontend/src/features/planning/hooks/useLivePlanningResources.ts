import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { socketService } from '@/services/socket';
import { planningService } from '../services/planning.service';

export const PLANNING_RESOURCES_KEY = ['planning', 'resources'] as const;

const LIVE_EVENTS = [
  'worker.created', 'worker.updated', 'worker.status_changed',
  'machine.created', 'machine.updated',
  'skill.assigned', 'skill.revoked',
  'assignment.created', 'assignment.released', 'assignment.updated',
];

export function useLivePlanningResources() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PLANNING_RESOURCES_KEY,
    queryFn: () => planningService.getResourceAvailability(),
    staleTime: 0, // planning data must never be trusted beyond the last live event
  });

  useEffect(() => {
    const socket = socketService.connect();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: PLANNING_RESOURCES_KEY });

    LIVE_EVENTS.forEach(evt => socket.on(evt, invalidate));
    socket.on('reconnect', invalidate); // catch anything missed while disconnected

    return () => {
      LIVE_EVENTS.forEach(evt => socket.off(evt, invalidate));
      socket.off('reconnect', invalidate);
    };
  }, [queryClient]);

  return query;
}
