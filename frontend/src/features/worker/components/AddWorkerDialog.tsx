import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkerStore } from '../store/worker.store';

import { useCreateWorker } from '../hooks/useCreateWorker';
import { workerFormSchema, type WorkerFormData } from '../types/worker.types';
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
import { Save, UserPlus, Loader2 } from 'lucide-react';

// Base UI Select passes `string | null` — coerce null → "" for react-hook-form
function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function AddWorkerDialog() {
  const store = useWorkerStore();
  const createWorkerMutation = useCreateWorker();
  
  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerFormSchema) as any,
    defaultValues: {
      employeeCode: '',
      firstName: '',
      lastName: '',
      department: '',
      grade: 'C',
      primarySkill: '',
      shift: 'Morning',
      status: 'active',
      joiningDate: new Date(),
    }
  });

  function onSubmit(data: WorkerFormData) {
    createWorkerMutation.mutate(data, {
      onSuccess: () => {
        store.setAddDialogOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={store.isAddDialogOpen} onOpenChange={store.setAddDialogOpen}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="w-5 h-5 text-blue-400" />
            Add New Worker
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Enter the details of the new employee. They will be added to the factory roster immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Employee Code</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-001" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nfcCardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">NFC Card ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tap card or enter ID" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Department</FormLabel>
                    <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-white/10">
                          <SelectValue placeholder="Select dept" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Stitching">Stitching</SelectItem>
                        <SelectItem value="Cutting">Cutting</SelectItem>
                        <SelectItem value="Finishing">Finishing</SelectItem>
                        <SelectItem value="Packing">Packing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Grade</FormLabel>
                    <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-white/10">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Grade A (Expert)</SelectItem>
                        <SelectItem value="B">Grade B (Advanced)</SelectItem>
                        <SelectItem value="C">Grade C (Intermediate)</SelectItem>
                        <SelectItem value="D">Grade D (Trainee)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primarySkill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Primary Skill</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Single Needle" className="bg-zinc-900 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70">Assigned Shift</FormLabel>
                    <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-white/10">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => store.setAddDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createWorkerMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {createWorkerMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Worker
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
