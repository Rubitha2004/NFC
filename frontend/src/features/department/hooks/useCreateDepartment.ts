import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentService } from '../services/department.service';
import type { CreateDepartmentRequest } from '../types/department.types';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

/**
 * useCreateDepartment – mutation to create a new department.
 * Invalidates the departments query on success.
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentRequest) =>
      departmentService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['planning'] });
      toast.success('Department created successfully');
    },

    onError: (error: Error) => {
      const message = error.message || 'Failed to create department';
      toast.error(message);
    },
  });
}
