import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { terminalService } from '../services/terminal.service';

export function useDeleteTerminal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => terminalService.deleteTerminal(id),
    onSuccess: (_, id) => {
      toast.success('Terminal deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
      queryClient.invalidateQueries({ queryKey: ['terminals', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete terminal');
    }
  });
}
