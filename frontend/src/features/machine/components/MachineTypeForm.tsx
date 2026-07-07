import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMachineTypeStore } from "../store/machineType.store";
import { machineTypeSchema } from "../types/machineType.types";
import type { MachineType } from "../types/machineType.types";

import { useCreateMachineType } from "../hooks/useCreateMachineType";
import { useUpdateMachineType } from "../hooks/useUpdateMachineType";

export function MachineTypeForm() {
  const { isFormOpen, setFormOpen, selectedMachineType, setSelectedMachineType } = useMachineTypeStore();

  const isEdit = !!selectedMachineType;
  const createMutation = useCreateMachineType();
  const updateMutation = useUpdateMachineType();

  const form = useForm<MachineType>({
    resolver: zodResolver(machineTypeSchema) as any,
    defaultValues: selectedMachineType || {
      typeCode: "",
      typeName: "",
      manufacturer: "",
      description: "",
      capacity: 1000,
      powerRating: "",
      speed: "",
      supportedOperations: [],
      maintenanceIntervalDays: 30,
      status: "active",
      totalMachines: 0,
      averageEfficiency: 0,
    },
  });

  // Reset form when selection changes
  useEffect(() => {
    if (selectedMachineType) {
      form.reset(selectedMachineType);
    } else {
      form.reset({
        typeCode: "",
        typeName: "",
        manufacturer: "",
        description: "",
        capacity: 1000,
        powerRating: "",
        speed: "",
        supportedOperations: [],
        maintenanceIntervalDays: 30,
        status: "active",
        totalMachines: 0,
        averageEfficiency: 0,
      });
    }
  }, [selectedMachineType, form]);

  const onSubmit = (data: MachineType) => {
    if (isEdit && selectedMachineType?.id) {
      updateMutation.mutate(
        { id: selectedMachineType.id, data },
        { onSuccess: handleClose }
      );
    } else {
      createMutation.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedMachineType(null);
  };
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Machine Type" : "Add New Machine Type"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="typeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SN-01" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Single Needle" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Juki" className="bg-zinc-900 border-zinc-800" {...field} />
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
                        <SelectItem value="maintenance">Maintenance</SelectItem>
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
                    <Textarea placeholder="Machine type description..." className="bg-zinc-900 border-zinc-800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-zinc-900 border-zinc-800" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="powerRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Rating</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 220V, 400W" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speed</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 4500 RPM" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
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
