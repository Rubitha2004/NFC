import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qcService } from '../services/qc.service';
import type { CreateQCRequest, UpdateQCRequest } from '../types/qc.types';

export function useQCMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: CreateQCRequest) => qcService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qcs'] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQCRequest }) =>
      qcService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['qcs'] });
      queryClient.invalidateQueries({ queryKey: ['qcs', variables.id] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => qcService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qcs'] });
    },
  });

  return { create, update, remove };
}
