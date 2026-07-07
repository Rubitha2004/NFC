import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService, stageLogService, qcCheckService } from '../services/tag-workflow.service';

// ─── Tag Hooks ────────────────────────────────────────────────────────────────

export function useTags() {
  return useQuery({ queryKey: ['tags'], queryFn: () => tagService.getAll() });
}

export function useAvailableTags() {
  return useQuery({ queryKey: ['tags', 'available'], queryFn: () => tagService.getAvailable() });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tagCode, assignedBy }: { tagCode: string; assignedBy?: string }) =>
      tagService.create(tagCode, assignedBy),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
}

export function useAssignTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bundleId, assignedBy }: { id: number; bundleId: number; assignedBy?: string }) =>
      tagService.assign(id, bundleId, assignedBy),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
}

export function useReleaseTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagService.release(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
}

// ─── Stage Log Hooks ──────────────────────────────────────────────────────────

export function useStageLogs(bundleId?: number) {
  return useQuery({
    queryKey: ['stage-logs', bundleId],
    queryFn: () => stageLogService.getAll(bundleId),
  });
}

export function useScanIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: stageLogService.scanIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stage-logs'] });
      qc.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useScanOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ logId, remarks }: { logId: number; remarks?: string }) =>
      stageLogService.scanOut(logId, remarks),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stage-logs'] }),
  });
}

// ─── QC Check Hooks ───────────────────────────────────────────────────────────

export function useQCChecks(filters?: { bundleId?: number; qcTier?: string; status?: string }) {
  return useQuery({
    queryKey: ['qc-checks', filters],
    queryFn: () => qcCheckService.getAll(filters),
  });
}

export function useCreateQCCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: qcCheckService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['qc-checks'] });
      qc.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}
