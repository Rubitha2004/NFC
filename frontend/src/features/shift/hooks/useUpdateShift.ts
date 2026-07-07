import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { shiftService } from '../services/shift.service';
import type { Shift } from '../types/shift.types';

export function useUpdateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shift> }) => 
      shiftService.updateShift(id, data),
    onSuccess: (_, variables) => {
      toast.success('Shift updated successfully');
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shifts', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update shift');
    }
  });
}
