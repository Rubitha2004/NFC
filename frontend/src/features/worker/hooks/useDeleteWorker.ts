import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workerService } from '../services/worker.service';

export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workerService.deleteWorker(id),
    onSuccess: (_, id) => {
      toast.success('Worker deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      queryClient.invalidateQueries({ queryKey: ['workers', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete worker');
    }
  });
}
