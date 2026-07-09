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
import { floorService } from "../services/floor.service";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  floorNumber: z.number().int(),
  factoryName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFloorDialog({ isOpen, onClose, onSuccess }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", floorNumber: 1, factoryName: "Main Factory" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await floorService.create(data);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
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
            <FormField control={form.control} name="floorNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Number</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-zinc-900 border-white/10" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Floor</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
