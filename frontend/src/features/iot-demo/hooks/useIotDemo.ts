import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socketService } from '@/services/socket';
import { useIotDemoStore } from '../store/iot-demo.store';
import { attendanceService } from '@/features/attendance/services/attendance.service';
import type { DemoActivityLog } from '../types/iot-demo.types';

export function useIotDemo() {
  const queryClient = useQueryClient();
  const { strategy, selectedOrderId, setSelectedOrderId, addLog, setLogs } = useIotDemoStore();

  // 1. Order Workflow Context Query
  const contextQuery = useQuery({
    queryKey: ['iot-demo-context', selectedOrderId],
    queryFn: () => strategy.getContext(selectedOrderId ?? undefined),
    staleTime: 5000,
  });

  // Automatically select IN_PROGRESS order or first order if none selected
  useEffect(() => {
    if (contextQuery.data?.orders?.length && !selectedOrderId) {
      const inProgressOrder = contextQuery.data.orders.find((o: any) => o.status === 'IN_PROGRESS');
      setSelectedOrderId(inProgressOrder ? inProgressOrder.id : contextQuery.data.orders[0].id);
    }
  }, [contextQuery.data, selectedOrderId, setSelectedOrderId]);

  // 2. Attendance Query
  const attendancesQuery = useQuery({
    queryKey: ['attendances'],
    queryFn: attendanceService.getTodayAttendance,
    staleTime: 5000,
  });

  // 3. Activity Logs Query
  const logsQuery = useQuery({
    queryKey: ['iot-demo-logs'],
    queryFn: () => strategy.getLogs(),
    staleTime: 5000,
  });

  useEffect(() => {
    if (logsQuery.data) {
      setLogs(logsQuery.data);
    }
  }, [logsQuery.data, setLogs]);

  // Real-time WebSocket Listeners
  useEffect(() => {
    const socket = socketService.connect();

    const invalidateAll = () => {
      queryClient.invalidateQueries({ queryKey: ['iot-demo-context'] });
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    };

    socket.on('attendance.updated', invalidateAll);
    socket.on('machine.updated', invalidateAll);
    socket.on('bundle.updated', invalidateAll);
    socket.on('dashboard.refresh', invalidateAll);

    const handleLog = (entry: DemoActivityLog) => {
      addLog(entry);
    };
    socket.on('iot.demo.log', handleLog);

    return () => {
      socket.off('attendance.updated', invalidateAll);
      socket.off('machine.updated', invalidateAll);
      socket.off('bundle.updated', invalidateAll);
      socket.off('dashboard.refresh', invalidateAll);
      socket.off('iot.demo.log', handleLog);
    };
  }, [queryClient, addLog]);

  // Mutations
  const toggleWorkerMutation = useMutation({
    mutationFn: (workerId: number) => strategy.toggleWorker(workerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iot-demo-context'] });
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });

  const toggleMachineMutation = useMutation({
    mutationFn: ({ machineId, targetStatus }: { machineId: number; targetStatus?: string }) =>
      strategy.toggleMachine(machineId, targetStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iot-demo-context'] });
    },
  });

  const advanceBundleMutation = useMutation({
    mutationFn: (bundleId: number) => strategy.advanceBundle(bundleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iot-demo-context'] });
    },
  });

  const resetDemoMutation = useMutation({
    mutationFn: (productionOrderId?: number) => strategy.resetDemo(productionOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iot-demo-context'] });
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      useIotDemoStore.getState().clearLogs();
    },
  });

  const context = contextQuery.data || {
    orders: [],
    selectedOrder: null,
    tasks: [],
    operations: [],
    bundles: [],
  };

  const attendances = (attendancesQuery.data as any)?.data?.data || (attendancesQuery.data as any)?.data || attendancesQuery.data || [];

  return {
    context,
    orders: context.orders || [],
    selectedOrder: context.selectedOrder || null,
    tasks: context.tasks || [],
    operations: context.operations || [],
    bundles: context.bundles || [],
    attendances: Array.isArray(attendances) ? attendances : [],
    isLoading: contextQuery.isLoading,
    toggleWorker: toggleWorkerMutation.mutate,
    isTogglingWorker: toggleWorkerMutation.isPending,
    toggleMachine: toggleMachineMutation.mutate,
    isTogglingMachine: toggleMachineMutation.isPending,
    advanceBundle: advanceBundleMutation.mutate,
    isAdvancingBundle: advanceBundleMutation.isPending,
    resetDemo: resetDemoMutation.mutate,
    isResettingDemo: resetDemoMutation.isPending,
  };
}
