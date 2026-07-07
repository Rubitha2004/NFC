import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { operationService } from '../services/operation.service';

export function useDeleteOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => operationService.deleteOperation(id),
    onSuccess: (_, id) => {
      toast.success('Operation deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operations', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete operation');
    }
  });
}
