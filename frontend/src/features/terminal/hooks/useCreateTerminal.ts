import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { terminalService } from '../services/terminal.service';
import type { Terminal } from '../types/terminal.types';

export function useCreateTerminal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Terminal) => terminalService.createTerminal(data),
    onSuccess: () => {
      toast.success('Terminal created successfully');
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create terminal');
    }
  });
}
