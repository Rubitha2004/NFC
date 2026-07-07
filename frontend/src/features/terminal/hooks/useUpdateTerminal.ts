import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { terminalService } from '../services/terminal.service';
import type { Terminal } from '../types/terminal.types';

export function useUpdateTerminal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Terminal> }) => 
      terminalService.updateTerminal(id, data),
    onSuccess: (_, variables) => {
      toast.success('Terminal updated successfully');
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
      queryClient.invalidateQueries({ queryKey: ['terminals', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update terminal');
    }
  });
}
