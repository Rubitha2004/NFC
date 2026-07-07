import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { operationService } from '../services/operation.service';
import type { Operation } from '../types/operation.types';

export function useCreateOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Operation) => operationService.createOperation(data),
    onSuccess: () => {
      toast.success('Operation created successfully');
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create operation');
    }
  });
}
