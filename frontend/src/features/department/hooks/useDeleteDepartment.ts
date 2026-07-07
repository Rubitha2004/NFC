import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/department.service';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

/**
 * useDeleteDepartment – mutation to delete a department.
 * Invalidates the departments query on success.
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => departmentService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
      toast.success('Department deleted successfully');
    },

    onError: (error: Error) => {
      const message = error.message || 'Failed to delete department';
      toast.error(message);
    },
  });
}
