import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { shiftService } from '../services/shift.service';
import type { Shift } from '../types/shift.types';

export function useCreateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Shift) => shiftService.createShift(data),
    onSuccess: () => {
      toast.success('Shift created successfully');
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create shift');
    }
  });
}
