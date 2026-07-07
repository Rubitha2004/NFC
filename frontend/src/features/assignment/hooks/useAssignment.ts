import { useQuery } from '@tanstack/react-query';
import { assignmentService } from '../services/assignment.service';

export function useAssignment(id: string | null) {
  return useQuery({
    queryKey: ['assignments', id],
    queryFn: () => assignmentService.getAssignmentById(id!),
    enabled: !!id,
  });
}
