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
import { useTerminalStore } from "../store/terminal.store";
import { terminalSchema } from "../types/terminal.types";
import type { Terminal } from "../types/terminal.types";
import { useCreateTerminal } from "../hooks/useCreateTerminal";
import { useUpdateTerminal } from "../hooks/useUpdateTerminal";
import { toast } from "sonner";

export function TerminalForm() {
  const { isFormOpen, setFormOpen, selectedTerminal, setSelectedTerminal } = useTerminalStore();

  const isEdit = !!selectedTerminal;
  const createMutation = useCreateTerminal();
  const updateMutation = useUpdateTerminal();

  const form = useForm<Terminal>({
    resolver: zodResolver(terminalSchema),
    defaultValues: selectedTerminal || {
      terminalId: "",
      name: "",
      machine: "",
      department: "",
      ipAddress: "",
      macAddress: "",
      firmwareVersion: "v2.1.4",
      status: "online",
    },
  });

  // Reset form when selection changes
  useEffect(() => {
    if (selectedTerminal) {
      form.reset(selectedTerminal);
    } else {
      form.reset({
        terminalId: "",
        name: "",
        machine: "",
        department: "",
        ipAddress: "",
        macAddress: "",
        firmwareVersion: "v2.1.4",
        status: "online",
      });
    }
  }, [selectedTerminal, form]);

  const onSubmit = (data: Terminal) => {
    if (isEdit && selectedTerminal?.id) {
      updateMutation.mutate(
        { id: selectedTerminal.terminalId, data }, // The backend expects terminalCode for updates if we match id. Wait, the hook accepts id.
        { onSuccess: handleClose }
      );
    } else {
      createMutation.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedTerminal(null);
  };
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Terminal" : "Add New Terminal"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="terminalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminal ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. NFC-T01" className="bg-zinc-900 border-zinc-800" {...field} />
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
                    <FormLabel>Terminal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Line A Entry Node" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="machine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Machine</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MCH-1001" className="bg-zinc-900 border-zinc-800" {...field} />
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
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 192.168.1.50" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="macAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAC Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 00:1A:2B:3C:4D:5E" className="bg-zinc-900 border-zinc-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firmwareVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmware Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. v2.1.4" className="bg-zinc-900 border-zinc-800" {...field} />
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
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="heartbeat_lost">Heartbeat Lost</SelectItem>
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
