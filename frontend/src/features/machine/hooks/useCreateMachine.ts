import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { machineService } from '../services/machine.service';
import type { MachineFormData } from '../types/machine.types';

export function useCreateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MachineFormData) => machineService.createMachine(data),
    onSuccess: () => {
      toast.success('Machine created successfully');
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create machine');
    }
  });
}
