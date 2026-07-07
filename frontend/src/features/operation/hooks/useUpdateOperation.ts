import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { operationService } from '../services/operation.service';
import type { Operation } from '../types/operation.types';

export function useUpdateOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Operation> }) => 
      operationService.updateOperation(id, data),
    onSuccess: (_, variables) => {
      toast.success('Operation updated successfully');
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operations', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update operation');
    }
  });
}
