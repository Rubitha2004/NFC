import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { machineTypeService } from '../services/machineType.service';
import type { MachineType } from '../types/machineType.types';

export function useUpdateMachineType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MachineType> }) => 
      machineTypeService.updateMachineType(id, data),
    onSuccess: (_, variables) => {
      toast.success('Machine Type updated successfully');
      queryClient.invalidateQueries({ queryKey: ['machineTypes'] });
      queryClient.invalidateQueries({ queryKey: ['machineTypes', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update machine type');
    }
  });
}
