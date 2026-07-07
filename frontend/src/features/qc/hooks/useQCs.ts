import { useQuery } from '@tanstack/react-query';
import { qcService } from '../services/qc.service';
import type { QCQueryParams } from '../types/qc.types';

export function useQCs(params?: QCQueryParams) {
  return useQuery({
    queryKey: ['qcs', params],
    queryFn: () => qcService.getAll(params),
  });
}

export function useQC(id: number) {
  return useQuery({
    queryKey: ['qcs', id],
    queryFn: () => qcService.getById(id),
    enabled: !!id,
  });
}
