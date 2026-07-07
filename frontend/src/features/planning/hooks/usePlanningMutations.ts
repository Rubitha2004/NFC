import { useMutation, useQueryClient } from '@tanstack/react-query';
import { planningService } from '../services/planning.service';
import type { CreateTaskPayload, UpdateTaskPayload } from '../types/planning.types';

export function usePlanningMutations() {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: (data: CreateTaskPayload) => planningService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning', 'tasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskPayload }) =>
      planningService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning', 'tasks'] });
    },
  });

  const autoSchedule = useMutation({
    mutationFn: (id: number) => planningService.runAutoScheduler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] });
    },
  });

  const publishPlan = useMutation({
    mutationFn: (data: any) => planningService.publishPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] });
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
    },
  });

  return { createTask, updateTask, autoSchedule, publishPlan };
}
