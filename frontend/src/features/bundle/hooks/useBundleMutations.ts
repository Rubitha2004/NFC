import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bundleService } from '../services/bundle.service';
import type { CreateBundleRequest, UpdateBundleRequest } from '../types/bundle.types';

export function useBundleMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: CreateBundleRequest) => bundleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBundleRequest }) =>
      bundleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundles', variables.id] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => bundleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });

  return { create, update, remove };
}
