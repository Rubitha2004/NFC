import React, { useState } from "react";
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
import { floorService } from "../services/floor.service";
import { roomService } from "../services/room.service";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  floorNumber: z.number().int(),
  factoryName: z.string().optional(),
  roomsCount: z.number().int().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFloorDialog({ isOpen, onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", floorNumber: 1, factoryName: "Main Factory", roomsCount: 0 },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const newFloor = await floorService.create({
        name: data.name,
        floorNumber: data.floorNumber,
        factoryName: data.factoryName,
      });

      // Automatically create the requested number of default rooms
      if (data.roomsCount > 0 && newFloor && newFloor.id) {
        for (let i = 1; i <= data.roomsCount; i++) {
          await roomService.create({
            name: `Room ${i}`,
            floorId: newFloor.id,
            roomType: "Production",
            rowsCount: 4,
            machinesPerRow: 35,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create floor.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Floor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Name</FormLabel>
                <FormControl><Input {...field} className="bg-zinc-900 border-white/10" placeholder="e.g. Ground Floor" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="floorNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                  <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-zinc-900 border-white/10" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="roomsCount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Auto-create Rooms</FormLabel>
                  <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-zinc-900 border-white/10" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <p className="text-xs text-white/40">If you specify auto-create rooms, standard rooms (4x35 capacity) will be instantly created in this floor without requiring immediate machine assignments.</p>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Floor"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
