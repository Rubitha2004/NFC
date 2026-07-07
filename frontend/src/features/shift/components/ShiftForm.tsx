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
import { useShiftStore } from "../store/shift.store";
import { shiftSchema } from "../types/shift.types";
import type { Shift } from "../types/shift.types";
import { shiftService } from "../services/shift.service";
import { toast } from "sonner";

import { useCreateShift } from "../hooks/useCreateShift";
import { useUpdateShift } from "../hooks/useUpdateShift";

export function ShiftForm() {
  const { isFormOpen, setFormOpen, selectedShift, setSelectedShift } = useShiftStore();

  const isEdit = !!selectedShift;
  const createMutation = useCreateShift();
  const updateMutation = useUpdateShift();

  const form = useForm<Shift>({
    resolver: zodResolver(shiftSchema) as any,
    defaultValues: selectedShift || {
      shiftCode: "",
      shiftName: "",
      startTime: "",
      endTime: "",
      breakDuration: 45,
      supervisor: "",
      status: "upcoming",
    },
  });

  // Reset form when selection changes
  useEffect(() => {
    if (selectedShift) {
      form.reset(selectedShift);
    } else {
      form.reset({
        shiftCode: "",
        shiftName: "",
        startTime: "",
        endTime: "",
        breakDuration: 45,
        supervisor: "",
        status: "upcoming",
      });
    }
  }, [selectedShift, form]);

  const onSubmit = (data: Shift) => {
    if (isEdit && selectedShift?.id) {
      updateMutation.mutate(
        { id: selectedShift.id, data },
        { onSuccess: handleClose }
      );
    } else {
      createMutation.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedShift(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Shift" : "Add New Shift"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shiftCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MORN-A" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shiftName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Morning Shift A" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="breakDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Break Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-zinc-900 border-zinc-800" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
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
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Smith" className="bg-zinc-900 border-zinc-800" {...field} />
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
