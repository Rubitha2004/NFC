import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { departmentService } from '../services/department.service';
import { mapDepartmentAPIToUI } from '../types/department.types';
import type { DepartmentQueryParams } from '../types/department.types';

export const DEPARTMENTS_QUERY_KEY = 'departments';

/**
 * useDepartments – fetches all departments from the backend.
 * Returns both raw API data and UI-mapped data.
 */
export function useDepartments(params?: DepartmentQueryParams) {
  const query = useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, params],
    queryFn: () => departmentService.getAll(params),
    staleTime: 30_000,
  });

  const departments = useMemo(
    () => (query.data ?? []).map(mapDepartmentAPIToUI),
    [query.data]
  );

  return {
    departments,
    rawData: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
