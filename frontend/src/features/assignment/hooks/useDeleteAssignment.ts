import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignmentService } from '../services/assignment.service';

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentService.releaseAssignment(id),
    onSuccess: (_, id) => {
      toast.success('Assignment released successfully');
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to release assignment');
    }
  });
}
