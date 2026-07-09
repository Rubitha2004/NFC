import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { machineTypeService } from '../services/machineType.service';
import type { MachineType } from '../types/machineType.types';

export function useCreateMachineType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MachineType) => machineTypeService.createMachineType(data),
    onSuccess: () => {
      toast.success('Machine Type created successfully');
      queryClient.invalidateQueries({ queryKey: ['machineTypes'] });
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create machine type');
    }
  });
}
