import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentFormSchema, type DepartmentFormData } from '../types/department.types';
import { useDepartmentStore } from '../store/department.store';
import { useCreateDepartment } from '../hooks/useCreateDepartment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Building2, Loader2 } from 'lucide-react';

export function AddDepartmentDialog() {
  const store = useDepartmentStore();
  const { mutate: createDepartment, isPending } = useCreateDepartment();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema) as any,
    defaultValues: {
      code: '',
      name: '',
      description: '',
      status: 'active',
    }
  });

  const onSubmit = (formData: DepartmentFormData) => {
    // Map frontend status to backend RecordStatus
    const backendStatus = formData.status === 'active' ? 'ACTIVE' : 'INACTIVE';

    createDepartment(
      {
        code: formData.code,
        name: formData.name,
        description: formData.description || undefined,
        status: backendStatus,
      },
      {
        onSuccess: () => {
          store.setAddDialogOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={store.isAddDialogOpen} onOpenChange={store.setAddDialogOpen}>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-5 h-5 text-blue-400" />
            Add New Department
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Create a new department in the factory. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Department Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. DEPT-01" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Department Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Assembly Line 1" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70">Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of operations" className="bg-zinc-900 border-white/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70">Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 border-white/10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => store.setAddDialogOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Department
                  </>
                )}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
