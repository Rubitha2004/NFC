import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workerService } from '../services/worker.service';
import type { WorkerFormData } from '../types/worker.types';

export function useUpdateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkerFormData> }) => 
      workerService.updateWorker(id, data),
    onSuccess: (_, variables) => {
      toast.success('Worker updated successfully');
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['workers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update worker');
    }
  });
}
