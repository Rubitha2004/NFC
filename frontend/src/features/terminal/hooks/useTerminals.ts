import { useQuery } from '@tanstack/react-query';
import { terminalService } from '../services/terminal.service';

export function useTerminals() {
  return useQuery({
    queryKey: ['terminals'],
    queryFn: () => terminalService.getTerminals(),
  });
}
