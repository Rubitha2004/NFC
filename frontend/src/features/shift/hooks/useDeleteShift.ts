import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { shiftService } from '../services/shift.service';

export function useDeleteShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shiftService.deleteShift(id),
    onSuccess: (_, id) => {
      toast.success('Shift deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shifts', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete shift');
    }
  });
}
