import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit } from "lucide-react";
import type { Floor, Room } from "../types/factory-layout.types";
import { roomService } from "../services/room.service";
import { Button } from "@/components/ui/button";
import { AddRoomDialog } from "./AddRoomDialog";
import { EditRoomDialog } from "./EditRoomDialog";
import { AssignMachineToRoomModal } from "./AssignMachineToRoomModal";

interface Props {
  floor: Floor;
  onClose: () => void;
  onUpdate: () => void;
}

export function FloorDetailsDrawer({ floor, onClose, onUpdate }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [assignRoomToMachine, setAssignRoomToMachine] = useState<Room | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getAll(floor.id);
      setRooms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [floor.id]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await roomService.delete(id);
      fetchRooms();
      onUpdate();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete room.";
      alert(errorMessage);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">{floor.name}</h2>
            <p className="text-sm text-white/50">Manage rooms and machine assignments</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white/50 hover:text-white" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Rooms</h3>
            <Button size="sm" onClick={() => setIsAddRoomOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Room
            </Button>
          </div>

          {loading ? (
            <div className="text-white/50 text-center py-8">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
              <p className="text-white/50">No rooms configured on this floor.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{room.name}</h4>
                      <p className="text-sm text-white/50">{room.roomType || "General"} • {room.rowsCount} Rows × {room.machinesPerRow || 35} Machines</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button variant="ghost" size="sm" onClick={() => setEditingRoom(room)} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs">
                        <Edit className="w-3 h-3 mr-1" /> Change layout
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(room.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                    <span className="text-sm text-white/60">
                      <span className="font-bold text-white">{room._count?.machines || 0}</span> Machines Assigned
                    </span>
                    {/* The user explicitly requested to decouple machine assignment from floor/room creation, so we hide this or make it less prominent. Usually assignments happen in Planning Board anyway. */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAddRoomOpen && (
        <AddRoomDialog 
          isOpen={isAddRoomOpen} 
          floorId={floor.id}
          onClose={() => setIsAddRoomOpen(false)} 
          onSuccess={() => { fetchRooms(); onUpdate(); }} 
        />
      )}

      {editingRoom && (
        <EditRoomDialog
          isOpen={true}
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSuccess={() => { fetchRooms(); onUpdate(); }}
        />
      )}

      {assignRoomToMachine && (
        <AssignMachineToRoomModal
          isOpen={true}
          room={assignRoomToMachine}
          onClose={() => setAssignRoomToMachine(null)}
          onSuccess={fetchRooms}
        />
      )}
    </>
  );
}
