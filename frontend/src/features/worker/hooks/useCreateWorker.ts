import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workerService } from '../services/worker.service';
import type { WorkerFormData } from '../types/worker.types';

export function useCreateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkerFormData) => workerService.createWorker(data),
    onSuccess: () => {
      toast.success('Worker created successfully');
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create worker');
    }
  });
}
