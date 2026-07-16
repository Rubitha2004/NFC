import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
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
import apiClient from "@/services/axios";
import { useDepartments } from "@/features/department/hooks/useDepartments";

import { useCreateOperation } from "../hooks/useCreateOperation";
import { useUpdateOperation } from "../hooks/useUpdateOperation";

function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: { id: number; name: string; code: string }[] }>("/skills");
      return data.data;
    },
    staleTime: 60_000,
  });
}

export function OperationForm() {
  const { isFormOpen, setFormOpen, selectedOperation, setSelectedOperation } = useOperationStore();
  const { departments } = useDepartments();
  const { data: skills = [] } = useSkills();

  const isEdit = !!selectedOperation;
  const createMutation = useCreateOperation();
  const updateMutation = useUpdateOperation();

  const form = useForm<Operation>({
    resolver: zodResolver(operationSchema) as any,
    defaultValues: selectedOperation || {
      operationCode: "",
      name: "",
      department: "",
      departmentId: undefined,
      description: "",
      smv: 1.0,
      requiredGrade: "",
      requiredSkill: "",
      requiredSkillId: undefined,
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
        departmentId: undefined,
        description: "",
        smv: 1.0,
        requiredGrade: "",
        requiredSkill: "",
        requiredSkillId: undefined,
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

              {/* Department dropdown — real data */}
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        const id = Number(val);
                        field.onChange(id);
                        const dept = departments.find(d => Number(d.id) === id);
                        if (dept) form.setValue("department", dept.name);
                      }}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map(d => (
                          <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            <div className="grid grid-cols-2 gap-4">
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

              {/* Required Skill dropdown — real data */}
              <FormField
                control={form.control}
                name="requiredSkillId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skill</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        const id = Number(val);
                        field.onChange(id);
                        const skill = skills.find(s => s.id === id);
                        if (skill) form.setValue("requiredSkill", skill.name);
                      }}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue placeholder="Select skill" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skills.map(s => (
                          <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
