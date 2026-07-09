import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Room } from "../types/factory-layout.types";
import { machineService } from "@/features/machine/services/machine.service";

interface Props {
  isOpen: boolean;
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignMachineToRoomModal({ isOpen, room, onClose, onSuccess }: Props) {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        // We fetch all machines, then filter out those already assigned to another room
        // or just list them and assigning them changes their room.
        // Let's just list all active machines for simplicity.
        const data = await machineService.getMachines();
        // MachineAPIResponse doesn't expose roomId directly in mapped UI type, so we'll just allow any machine
        // to be assigned, moving it from its old room if necessary.
        setMachines(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) fetchMachines();
  }, [isOpen]);

  const handleAssign = async (machineCode: string) => {
    try {
      // In machine UI format, id is machineCode. But backend needs the numeric ID.
      // We will need the machine's backend ID to assign. 
      // Luckily we can fetch the actual machine numeric ID if we get the full list.
      // But we mapped it away. So let's re-fetch the raw API response for this machine to get its ID.
      const rawMachine = await machineService.getMachine(machineCode);
      // Wait, we can just find it in the original API. Or just implement a quick search.
      // Since mapMachineAPIToUI drops the DB id, let's just use a direct API call here.
      const { data } = await import("@/services/axios").then(m => m.default.get(`/machines?machineCode=${machineCode}`));
      const backendId = data.data.data[0].id;
      
      await machineService.assignRoom(backendId, { roomId: room.id, rowIndex: 0, positionIndex: 0 });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to assign machine.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Machine to {room.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-white/50 text-center py-4">Loading machines...</div>
          ) : machines.length === 0 ? (
            <div className="text-white/50 text-center py-4">No machines available.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {machines.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{m.name}</div>
                    <div className="text-xs text-white/50">{m.id} • {m.type} • {m.department}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleAssign(m.id)}>
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
