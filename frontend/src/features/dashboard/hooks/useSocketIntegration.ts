import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from '@/services/socket';
import { useSocketStore } from '@/store/useSocketStore';
import { DASHBOARD_QUERY_KEYS } from './useDashboardQueries';
// import { dashboardService } from '../services/dashboard.service';
import type { AlertItem, TimelineEvent } from '../types/factory.types';

export function useSocketIntegration() {
  const queryClient = useQueryClient();
  const setStatus = useSocketStore((state) => state.setStatus);
  const addAlert = useSocketStore((state) => state.addAlert);
  const addTimelineEvent = useSocketStore((state) => state.addTimelineEvent);

  useEffect(() => {
    const socket = socketService.connect();

    // Connection Events
    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('reconnect_attempt', () => setStatus('reconnecting'));

    // Re-fetch all data gently when reconnected after a drop to ensure no missed events
    socket.on('reconnect', () => {
      setStatus('connected');
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.liveFloor });
    });

    // Helper to trigger a background refetch
    const triggerDashboardUpdate = () => {
      // In a highly optimized system, we would mutate the cache directly based on the event payload.
      // E.g. queryClient.setQueryData(...)
      // For now, since the backend might send partial payloads, we can trigger a targeted refetch
      // or if we know the payload shape, we mutate directly.
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.liveFloor });
    };

    // Listeners for all requested events
    const events = [
      'attendance.updated',
      'assignment.updated',
      'bundle.created',
      'bundle.started',
      'bundle.completed',
      'bundle.transferred',
      'qc.completed',
      'machine.updated',
      'terminal.updated',
      'dashboard.updated'
    ];

    events.forEach(eventName => {
      socket.on(eventName, (payload: any) => {
        // 1. Update React Query Cache
        triggerDashboardUpdate();
        
        // 2. Add to Timeline
        // Map backend event name to TimelineEvent type
        let tType: TimelineEvent['type'] = 'machine_online'; // fallback
        if (eventName.includes('attendance')) tType = eventName.includes('out') ? 'attendance_out' : 'attendance_in';
        if (eventName.includes('bundle.start')) tType = 'bundle_start';
        if (eventName.includes('bundle.complet')) tType = 'bundle_complete';
        if (eventName.includes('qc.complet')) tType = payload?.passed ? 'qc_pass' : 'qc_fail';
        if (eventName.includes('offline')) tType = 'machine_offline';
        
        addTimelineEvent({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: tType,
          description: payload?.message || `Received: ${eventName}`,
          machineId: payload?.machineId,
        });

        // 3. Add to Alerts if it's an error or warning
        if (payload?.isAlert || eventName.includes('offline') || eventName.includes('reject')) {
          
          let aType: AlertItem['type'] = 'production_target';
          if (eventName.includes('offline')) aType = 'machine_offline';
          if (eventName.includes('qc')) aType = 'qc_reject';
          if (eventName.includes('absent')) aType = 'worker_absent';
          
          addAlert({
            type: aType,
            title: eventName,
            description: payload?.message || 'Action required immediately.',
            timestamp: new Date(),
            priority: payload?.level || 'medium',
            machineId: payload?.machineId
          });
        }
      });
    });

    return () => {
      events.forEach(eventName => socket.off(eventName, () => {}));
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reconnect_attempt');
      socket.off('reconnect');
      // Do not disconnect the socket here if we want global persistent connection,
      // but if this hook mounts once at App level, it's fine.
    };
  }, [queryClient, setStatus, addAlert, addTimelineEvent]);
}
