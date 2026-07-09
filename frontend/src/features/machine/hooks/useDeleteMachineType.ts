import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { machineTypeService } from '../services/machineType.service';

export function useDeleteMachineType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => machineTypeService.deleteMachineType(id),
    onSuccess: (_, id) => {
      toast.success('Machine Type deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['machineTypes'] });
      queryClient.invalidateQueries({ queryKey: ['machineTypes', id] });
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete machine type');
    }
  });
}
