import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/department.service';
import type { UpdateDepartmentRequest } from '../types/department.types';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

/**
 * useUpdateDepartment – mutation to update an existing department.
 * Invalidates the departments query on success.
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDepartmentRequest }) =>
      departmentService.update(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [DEPARTMENTS_QUERY_KEY, 'detail', variables.id],
      });
      toast.success('Department updated successfully');
    },

    onError: (error: Error) => {
      const message = error.message || 'Failed to update department';
      toast.error(message);
    },
  });
}
