import { useFactoryStore } from "../../store/factory.store";
import { MonitorSmartphone, Columns } from "lucide-react";
import type { FactoryFloorLevel } from "../../types/factory.types";

interface FloorViewProps {
  facilityId: string;
  floor: FactoryFloorLevel;
}

export function FloorView({ facilityId, floor }: FloorViewProps) {
  const { navigateLevel } = useFactoryStore();

  return (
    <div className="p-6 h-full overflow-y-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {floor.rooms.map((room) => {
          const machineCount = room.lines.reduce((acc, line) => acc + line.machines.length, 0);

          return (
            <div 
              key={room.id}
              onClick={() => navigateLevel('room', { facility: facilityId, floor: floor.id, room: room.id })}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-zinc-800 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                  <Columns className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-sm text-white/50">{room.roomType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-1">
                    <Columns className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Rows</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{room.lines.length}</p>
                </div>
                <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-1">
                    <MonitorSmartphone className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Machines</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{machineCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
