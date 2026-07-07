import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { departmentService } from '../services/department.service';
import { mapDepartmentAPIToUI } from '../types/department.types';
import { DEPARTMENTS_QUERY_KEY } from './useDepartments';

/**
 * useDepartment – fetches a single department by numeric ID.
 */
export function useDepartment(id: number | null) {
  const query = useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, 'detail', id],
    queryFn: () => departmentService.getById(id!),
    enabled: id !== null && id > 0,
    staleTime: 30_000,
  });

  const department = useMemo(
    () => (query.data ? mapDepartmentAPIToUI(query.data) : null),
    [query.data]
  );

  return {
    department,
    rawData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
