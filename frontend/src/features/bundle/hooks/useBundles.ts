import { useQuery } from '@tanstack/react-query';
import { bundleService } from '../services/bundle.service';
import type { BundleQueryParams } from '../types/bundle.types';

export function useBundles(params?: BundleQueryParams) {
  return useQuery({
    queryKey: ['bundles', params],
    queryFn: () => bundleService.getAll(params),
  });
}

export function useBundle(id: number) {
  return useQuery({
    queryKey: ['bundles', id],
    queryFn: () => bundleService.getById(id),
    enabled: !!id,
  });
}
