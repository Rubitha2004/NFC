import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { machineService } from '../services/machine.service';

export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => machineService.deleteMachine(id),
    onSuccess: (_, id) => {
      toast.success('Machine deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machines', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete machine');
    }
  });
}
