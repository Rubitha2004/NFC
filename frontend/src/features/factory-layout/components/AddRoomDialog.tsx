import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roomService } from "../services/room.service";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  roomType: z.string().optional(),
  rowsCount: z.number().int().min(1).default(3),
  machinesPerRow: z.number().int().min(1).default(35),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  floorId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRoomDialog({ isOpen, floorId, onClose, onSuccess }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", roomType: "Stitching", rowsCount: 3, machinesPerRow: 35 },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await roomService.create({ ...data, floorId });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to create room.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Room Name</FormLabel>
                <FormControl><Input {...field} className="bg-zinc-900 border-white/10" placeholder="e.g. Line 1" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="roomType" render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Stitching">Stitching</SelectItem>
                    <SelectItem value="Finishing">Finishing</SelectItem>
                    <SelectItem value="Embroidery">Embroidery</SelectItem>
                    <SelectItem value="QC">QC</SelectItem>
                    <SelectItem value="Packing">Packing</SelectItem>
                    <SelectItem value="Cutting">Cutting</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rowsCount" render={({ field }) => (
              <FormItem>
                <FormLabel>Layout Rows Count</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-zinc-900 border-white/10" /></FormControl>
                <p className="text-xs text-white/40">Number of rows to wrap machines into on the dashboard. You can change this later at any time.</p>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="machinesPerRow" render={({ field }) => (
              <FormItem>
                <FormLabel>Machines per Row</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-zinc-900 border-white/10" /></FormControl>
                <p className="text-xs text-white/40">Default capacity for each row. You can change this later at any time.</p>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Room</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
