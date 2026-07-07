import { useQuery } from '@tanstack/react-query';
import { assignmentService } from '../services/assignment.service';

export function useAssignments(params?: any) {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => assignmentService.getAssignments(params),
  });
}
