import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentFormSchema, type AssignmentFormData } from "../types/assignment.types";
import { useAssignmentStore } from "../store/assignment.store";
import { useCreateAssignment } from "../hooks/useCreateAssignment";
import { useWorkersData } from "../../worker/hooks/useWorkersData";
import { useMachinesData } from "../../machine/hooks/useMachinesData";
import { useOperations } from "../../operation/hooks/useOperations";
import { useShifts } from "../../shift/hooks/useShifts";
import { useDepartments } from "../../department/hooks/useDepartments";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ClipboardList } from "lucide-react";

function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function AddAssignmentDialog() {
  const store = useAssignmentStore();
  const createMutation = useCreateAssignment();

  const { workers } = useWorkersData();
  const { machines } = useMachinesData();
  const { data: operations = [] } = useOperations();
  const { data: shifts = [] } = useShifts();
  const { departments = [] } = useDepartments();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema) as any,
    defaultValues: {
      workerId: "",
      machineId: "",
      department: "",
      operation: "",
      shift: "",
      productionOrderId: "",
      bundleId: "",
      targetQuantity: 100,
      priority: "medium",
      supervisor: "",
      remarks: "",
      startDate: new Date(),
      expectedEndDate: new Date(Date.now() + 86400000),
    },
  });

  function onSubmit(data: AssignmentFormData) {
    createMutation.mutate({
      workerId: parseInt(data.workerId),
      machineId: parseInt(data.machineId),
      operationId: parseInt(data.operation),
      shiftId: parseInt(data.shift),
      assignedBy: data.supervisor,
      remarks: data.remarks
    }, {
      onSuccess: () => {
        store.setAddDialogOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={store.isAddDialogOpen} onOpenChange={store.setAddDialogOpen}>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-white/10 p-0 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10 bg-zinc-900/50 flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="text-white font-bold">New Assignment</DialogTitle>
            <DialogDescription className="text-white/50 text-xs mt-0.5">
              Assign a worker to a machine and production bundle.
            </DialogDescription>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              
              <div className="col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Resources</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Worker</FormLabel>
                        <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 text-white">
                              <SelectValue placeholder="Select Worker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workers.map(w => (
                              <SelectItem key={w.id} value={String(w.id)}>{w.employeeCode} ({w.firstName} {w.lastName})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="machineId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Machine</FormLabel>
                        <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 text-white">
                              <SelectValue placeholder="Select Machine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {machines.map(m => (
                              <SelectItem key={m.id} value={String(m.id)}>{m.machineId} ({m.name})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="col-span-2 mt-4 space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Work Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Department</FormLabel>
                        <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 text-white">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((d: any) => (
                              <SelectItem key={d.id} value={String(d.id)}>{d.code || d.departmentCode || d.name} - {d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Operation</FormLabel>
                        <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 text-white">
                              <SelectValue placeholder="Select Operation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {operations.map(o => (
                              <SelectItem key={o.id} value={String(o.id)}>{o.name || (o as any).operationName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Shift</FormLabel>
                        <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 text-white">
                              <SelectValue placeholder="Select Shift" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shifts.map(s => (
                              <SelectItem key={s.id} value={String(s.id)}>{s.shiftName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Supervisor</FormLabel>
                        <FormControl>
                          <Input className="bg-zinc-900/50 border-white/10 h-10 text-white" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="col-span-2 mt-4 space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider">Production Order</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="productionOrderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Order ID</FormLabel>
                        <FormControl>
                          <Input className="bg-zinc-900/50 border-white/10 h-10 text-white" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bundleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Bundle ID</FormLabel>
                        <FormControl>
                          <Input className="bg-zinc-900/50 border-white/10 h-10 text-white" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Target Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-zinc-900/50 border-white/10 h-10 text-white" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-xs">Priority</FormLabel>
                        <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 h-10 text-white">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-rose-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => store.setAddDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-lg shadow-blue-900/20 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                Create Assignment
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
