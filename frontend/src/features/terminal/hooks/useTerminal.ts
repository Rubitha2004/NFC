import { useQuery } from '@tanstack/react-query';
import { terminalService } from '../services/terminal.service';

export function useTerminal(id: string | null) {
  return useQuery({
    queryKey: ['terminals', id],
    queryFn: () => terminalService.getTerminal(id!),
    enabled: !!id,
  });
}
