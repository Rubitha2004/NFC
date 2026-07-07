import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { machineService } from '../services/machine.service';
import type { MachineFormData } from '../types/machine.types';

export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MachineFormData> }) => 
      machineService.updateMachine(id, data),
    onSuccess: (_, variables) => {
      toast.success('Machine updated successfully');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machines', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update machine');
    }
  });
}
