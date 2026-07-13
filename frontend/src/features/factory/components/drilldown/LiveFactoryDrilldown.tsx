import { useEffect } from "react";
import { useFactoryData } from "../../hooks/useFactoryData";
import { useFactoryStore } from "../../store/factory.store";
import { ChevronRight, Home } from "lucide-react";
import { FacilityView } from "./FacilityView";
import { FloorView } from "./FloorView";
import { RoomView } from "./RoomView";
import { RowView } from "./RowView";

export function LiveFactoryDrilldown() {
  const { config, loading } = useFactoryData();
  const { currentLevel, selectedFacility, selectedFloor, selectedRoom, selectedRow, navigateLevel } = useFactoryStore();

  // Initial load auto-skip logic
  useEffect(() => {
    if (loading || !config || config.buildings.length === 0) return;
    
    // Auto-select first facility if none selected
    if (!selectedFacility) {
      const facility = config.buildings[0];
      
      // Auto-skip logic
      if (facility.floors.length === 1) {
        const floor = facility.floors[0];
        if (floor.rooms.length === 1) {
          const room = floor.rooms[0];
          navigateLevel('room', { facility: facility.id, floor: floor.id, room: room.id });
        } else {
          navigateLevel('floor', { facility: facility.id, floor: floor.id });
        }
      } else {
        navigateLevel('facility', { facility: facility.id });
      }
    }
  }, [loading, config, selectedFacility, navigateLevel]);

  if (loading || !config) {
    return <div className="p-8 text-white/50 animate-pulse">Loading Factory Layout...</div>;
  }

  // Find currently selected entities
  const facility = config.buildings.find(b => b.id === selectedFacility) || config.buildings[0];
  const floor = facility?.floors.find(f => f.id === selectedFloor);
  const room = floor?.rooms.find(r => r.id === selectedRoom);
  const row = room?.lines.find(l => l.id === selectedRow);

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-zinc-900/50 text-sm overflow-x-auto whitespace-nowrap">
        <button 
          onClick={() => navigateLevel('facility')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-colors ${currentLevel === 'facility' ? 'text-white font-medium' : 'text-white/50 hover:text-white'}`}
        >
          <Home className="w-4 h-4" />
          {facility?.name || 'Facilities'}
        </button>

        {selectedFloor && floor && (
          <>
            <ChevronRight className="w-4 h-4 text-white/20" />
            <button 
              onClick={() => navigateLevel('floor')}
              className={`px-2 py-1 rounded hover:bg-white/5 transition-colors ${currentLevel === 'floor' ? 'text-white font-medium' : 'text-white/50 hover:text-white'}`}
            >
              {floor.name}
            </button>
          </>
        )}

        {selectedRoom && room && currentLevel !== 'facility' && currentLevel !== 'floor' && (
          <>
            <ChevronRight className="w-4 h-4 text-white/20" />
            <button 
              onClick={() => navigateLevel('room')}
              className={`px-2 py-1 rounded hover:bg-white/5 transition-colors ${currentLevel === 'room' ? 'text-white font-medium' : 'text-white/50 hover:text-white'}`}
            >
              {room.name}
            </button>
          </>
        )}

        {selectedRow && row && currentLevel === 'row' && (
          <>
            <ChevronRight className="w-4 h-4 text-white/20" />
            <button 
              className={`px-2 py-1 rounded hover:bg-white/5 transition-colors text-white font-medium cursor-default`}
            >
              {row.lineName}
            </button>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {currentLevel === 'facility' && facility && <FacilityView building={facility} />}
        {currentLevel === 'floor' && floor && <FloorView facilityId={facility.id} floor={floor} />}
        {currentLevel === 'room' && room && floor && <RoomView facilityId={facility.id} floorId={floor.id} room={room} />}
        {currentLevel === 'row' && row && <RowView row={row} />}
      </div>
    </div>
  );
}
