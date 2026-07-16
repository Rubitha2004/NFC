import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { socketService } from '@/services/socket';
import api from '@/services/axios';

export function useOperationBundles(operationId: number | null) {
  const queryClient = useQueryClient();
  const queryKey = ['planning', 'operation-bundles', operationId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!operationId) return [];
      const { data } = await api.get(`/planning/operations/${operationId}/bundles`);
      return data as any[];
    },
    enabled: operationId !== null,
    staleTime: 0,
    refetchInterval: 15_000, // also poll every 15s as a fallback
  });

  useEffect(() => {
    if (!operationId) return;
    const socket = socketService.connect();
    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    socket.on('bundle.updated', invalidate);
    socket.on('reconnect', invalidate);

    return () => {
      socket.off('bundle.updated', invalidate);
      socket.off('reconnect', invalidate);
    };
  }, [operationId, queryClient]);

  return query;
}

/** Fetch all active terminals for the terminal dropdown */
export function useTerminals() {
  return useQuery({
    queryKey: ['planning', 'terminals'],
    queryFn: async () => {
      const { data } = await api.get('/planning/terminals');
      return data as { id: number; terminalCode: string; terminalName: string | null }[];
    },
    staleTime: 60_000,
  });
}
