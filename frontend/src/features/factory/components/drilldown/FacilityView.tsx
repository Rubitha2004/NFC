import { useFactoryStore } from "../../store/factory.store";
import { Building2, Layers, MonitorSmartphone } from "lucide-react";
import type { FactoryBuilding } from "../../types/factory.types";

interface FacilityViewProps {
  building: FactoryBuilding;
}

export function FacilityView({ building }: FacilityViewProps) {
  const { navigateLevel } = useFactoryStore();

  return (
    <div className="p-6 h-full overflow-y-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {building.floors.map((floor) => {
          const roomCount = floor.rooms.length;
          const machineCount = floor.rooms.reduce((acc, room) => 
            acc + room.lines.reduce((lAcc, line) => lAcc + line.machines.length, 0)
          , 0);

          return (
            <div 
              key={floor.id}
              onClick={() => navigateLevel('floor', { facility: building.id, floor: floor.id })}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-zinc-800 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {floor.name}
                  </h3>
                  <p className="text-sm text-white/50">Level {floor.floorNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-zinc-950 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Rooms</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{roomCount}</p>
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
