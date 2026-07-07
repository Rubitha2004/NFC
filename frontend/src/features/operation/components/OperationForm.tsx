import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useOperationStore } from "../store/operation.store";
import { operationSchema } from "../types/operation.types";
import type { Operation } from "../types/operation.types";
import { operationService } from "../services/operation.service";
import { toast } from "sonner";

import { useCreateOperation } from "../hooks/useCreateOperation";
import { useUpdateOperation } from "../hooks/useUpdateOperation";

export function OperationForm() {
  const { isFormOpen, setFormOpen, selectedOperation, setSelectedOperation } = useOperationStore();

  const isEdit = !!selectedOperation;
  const createMutation = useCreateOperation();
  const updateMutation = useUpdateOperation();

  const form = useForm<Operation>({
    resolver: zodResolver(operationSchema) as any,
    defaultValues: selectedOperation || {
      operationCode: "",
      name: "",
      department: "",
      description: "",
      smv: 1.0,
      requiredGrade: "C",
      requiredSkill: "",
      compatibleMachines: [],
      status: "active",
    },
  });

  // Reset form when selection changes
  useEffect(() => {
    if (selectedOperation) {
      form.reset(selectedOperation);
    } else {
      form.reset({
        operationCode: "",
        name: "",
        department: "",
        description: "",
        smv: 1.0,
        requiredGrade: "C",
        requiredSkill: "",
        compatibleMachines: [],
        status: "active",
      });
    }
  }, [selectedOperation, form]);

  const onSubmit = (data: Operation) => {
    if (isEdit && selectedOperation?.id) {
      updateMutation.mutate(
        { id: selectedOperation.id, data },
        { onSuccess: handleClose }
      );
    } else {
      createMutation.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedOperation(null);
  };
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Operation" : "Add New Operation"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="operationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operation Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ST-01" className="bg-zinc-900 border-zinc-800" {...field} />
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
                    <FormLabel>Operation Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Collar Stitch" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sewing" className="bg-zinc-900 border-zinc-800" {...field} />
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Operation description..." className="bg-zinc-900 border-zinc-800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="smv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMV (Minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="bg-zinc-900 border-zinc-800" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">Grade A</SelectItem>
                        <SelectItem value="B">Grade B</SelectItem>
                        <SelectItem value="C">Grade C</SelectItem>
                        <SelectItem value="D">Grade D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiredSkill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skill</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lockstitch" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="compatibleMachines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compatible Machines (Comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Single Needle, Overlock" 
                      className="bg-zinc-900 border-zinc-800" 
                      value={field.value?.join(", ")}
                      onChange={e => field.onChange(e.target.value.split(",").map(v => v.trim()).filter(Boolean))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="border-zinc-700 hover:bg-zinc-800" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500" disabled={isPending}>
                {isPending ? "Saving..." : (isEdit ? "Update" : "Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
