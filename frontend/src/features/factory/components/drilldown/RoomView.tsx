import { useFactoryStore } from "../../store/factory.store";
import { MonitorSmartphone, LayoutList } from "lucide-react";
import type { FactoryRoom } from "../../types/factory.types";

interface RoomViewProps {
  facilityId: string;
  floorId: string;
  room: FactoryRoom;
}

export function RoomView({ facilityId, floorId, room }: RoomViewProps) {
  const { navigateLevel } = useFactoryStore();

  return (
    <div className="p-6 h-full overflow-y-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {room.lines.map((row) => {
          return (
            <div 
              key={row.id}
              onClick={() => navigateLevel('row', { facility: facilityId, floor: floorId, room: room.id, row: row.id })}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-zinc-800 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <LayoutList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {row.lineName}
                  </h3>
                  <p className="text-sm text-white/50">Row {row.lineNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-1">
                    <MonitorSmartphone className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Machines</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{row.machines.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
