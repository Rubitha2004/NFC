import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { machineFormSchema, type MachineFormData } from "../types/machine.types";
import { useMachineStore } from "../store/machine.store";
import { useCreateMachine } from "../hooks/useCreateMachine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { Save, Cpu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { roomService } from "@/features/factory-layout/services/room.service";
import type { Room } from "@/features/factory-layout/types/factory-layout.types";

const MACHINE_TYPES = [
  "Single Needle",
  "Double Needle",
  "Overlock",
  "Flatlock",
  "Interlock",
  "Bar Tack",
  "Button Hole",
  "Feed Off Arm",
  "Embroidery",
  "Cutting",
] as const;

const DEPARTMENTS = ["Stitching", "Cutting", "Finishing", "Packing", "Embroidery"];
const STATUSES = ["running", "idle", "offline", "maintenance", "error"] as const;

// Base UI Select passes `string | null` — coerce null → "" for react-hook-form
function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function AddMachineDialog() {
  const store = useMachineStore();
  const createMachineMutation = useCreateMachine();
  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    if (store.isAddDialogOpen) {
      roomService.getAll().then(setRooms).catch(console.error);
    }
  }, [store.isAddDialogOpen]);

  const form = useForm<MachineFormData>({
    resolver: zodResolver(machineFormSchema) as any,
    defaultValues: {
      machineId: "",
      name: "",
      department: "",
      type: "Single Needle",
      building: "",
      floor: "",
      room: "",
      productionLine: "",
      terminalId: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      status: "idle",
      notes: "",
    },
  });

  function onSubmit(data: MachineFormData) {
    createMachineMutation.mutate(data, {
      onSuccess: () => {
        store.setAddDialogOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={store.isAddDialogOpen} onOpenChange={store.setAddDialogOpen}>
      <DialogContent className="sm:max-w-[640px] bg-zinc-950 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-orange-400" />
            </div>
            Add New Machine
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Register a new machine in the factory. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">

            {/* ── Identity ─────────────────────────────────────────── */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">
                Machine Identity
              </p>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="machineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs">Machine ID *</FormLabel>
                      <FormControl>
                        <Input
                          id="new-machine-id"
                          placeholder="M-001"
                          className="bg-zinc-900 border-white/10 font-mono h-10"
                          {...field}
                        />
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
                      <FormLabel className="text-white/70 text-xs">Machine Name *</FormLabel>
                      <FormControl>
                        <Input
                          id="new-machine-name"
                          placeholder="Single Needle Mk.3"
                          className="bg-zinc-900 border-white/10 h-10"
                          {...field}
                        />
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
                      <FormLabel className="text-white/70 text-xs">Department *</FormLabel>
                      <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            id="new-machine-dept"
                            className="bg-zinc-900 border-white/10 h-10"
                          >
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs">Machine Type *</FormLabel>
                      <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            id="new-machine-type"
                            className="bg-zinc-900 border-white/10 h-10"
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MACHINE_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Location ──────────────────────────────────────────── */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">
                Location
              </p>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs">Assign Room</FormLabel>
                      <Select onValueChange={sv(field.onChange)} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-900 border-white/10 h-10">
                            <SelectValue placeholder="Select a room (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None (Assign later)</SelectItem>
                          {rooms.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                              {r.name} (Floor {r.floor?.floorNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Configuration ─────────────────────────────────────── */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">
                Configuration
              </p>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terminalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs">Terminal ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="T-001"
                          className="bg-zinc-900 border-white/10 font-mono h-10"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs">Purchase Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-zinc-900 border-white/10 h-10"
                          {...field}
                        />
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
                      <FormLabel className="text-white/70 text-xs">Initial Status</FormLabel>
                      <Select onValueChange={sv(field.onChange)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-900 border-white/10 h-10">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs">Notes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional notes..."
                          className="bg-zinc-900 border-white/10 h-10"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Footer ────────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => store.setAddDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-machine-btn"
                disabled={createMachineMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
              >
                {createMachineMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Register Machine
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
