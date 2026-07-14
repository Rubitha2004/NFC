import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFactoryData } from './hooks/useFactoryData';
import { LayoutList, Map as MapIcon, Search, ChevronRight, Layers, Box, Cpu, Server, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMachineStore } from "../machine/store/machine.store";
import { MachineDetailsDrawer } from "../machine/components/MachineDetailsDrawer";
import type { FactoryFloorLevel, FactoryRoom, Machine } from './types/factory.types';

export default function LiveFactoryPage() {
  const { config, allMachines, loading } = useFactoryData();
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <div className="text-emerald-500 animate-pulse font-medium">Loading factory layout...</div>
      </div>
    );
  }

  const buildings = config.buildings || [];
  const floors = buildings[0]?.floors || [];

  const selectedFloor = floors.find(f => f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(r => r.id === selectedRoomId);

  // Filter floors based on search
  const filteredFloors = floors.filter(f => {
    if (!search) return true;
    if (f.name.toLowerCase().includes(search.toLowerCase())) return true;
    // Check if any room matches
    if (f.rooms.some(r => r.name.toLowerCase().includes(search.toLowerCase()))) return true;
    // Check if any machine in the floor matches
    const floorMachineIds = f.rooms.flatMap(r => r.lines.flatMap(l => l.machines.map(m => m.id)));
    const matchingMachines = allMachines.filter(m => floorMachineIds.includes(m.id) && (m.machineNumber.toLowerCase().includes(search.toLowerCase()) || m.worker?.name.toLowerCase().includes(search.toLowerCase())));
    return matchingMachines.length > 0;
  });

  const totalGlobalFloors = floors.length;
  const totalGlobalMachines = allMachines.length;
  const assignedGlobalMachines = allMachines.filter(m => m.status === 'running').length;
  const idleGlobalMachines = allMachines.filter(m => m.status !== 'running').length;

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Header & Breadcrumbs */}
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <button 
            onClick={() => { setSelectedFloorId(null); setSelectedRoomId(null); }}
            className={cn("hover:text-white transition-colors", !selectedFloorId ? "text-emerald-400 font-bold" : "text-white/50")}
          >
            Factory
          </button>
          
          {selectedFloorId && (
            <>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <button 
                onClick={() => setSelectedRoomId(null)}
                className={cn("hover:text-white transition-colors", selectedFloorId && !selectedRoomId ? "text-emerald-400 font-bold" : "text-white/50")}
              >
                {selectedFloor?.name}
              </button>
            </>
          )}

          {selectedRoomId && (
            <>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <span className="text-emerald-400 font-bold">
                {selectedRoom?.name}
              </span>
            </>
          )}
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text"
            placeholder="Search floors, rooms, machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-white/30 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        {!selectedFloorId && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl">
              <div className="text-3xl font-bold text-white mb-1">{totalGlobalFloors}</div>
              <div className="text-xs text-white/50 uppercase font-semibold">Total Floors</div>
            </div>
            <div className="bg-zinc-900 border border-white/10 p-4 rounded-xl">
              <div className="text-3xl font-bold text-white mb-1">{totalGlobalMachines}</div>
              <div className="text-xs text-white/50 uppercase font-semibold">Total Machines</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-emerald-400 mb-1">{assignedGlobalMachines}</div>
              <div className="text-xs text-emerald-500/70 uppercase font-semibold">Assigned (Running)</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-amber-400 mb-1">{idleGlobalMachines}</div>
              <div className="text-xs text-amber-500/70 uppercase font-semibold">Idle / Offline / Empty</div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 px-4 py-3 bg-white/5 border border-white/10 rounded-xl w-max shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-400" />
            <span className="text-sm font-medium text-white/80">Occupied / Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400" />
            <span className="text-sm font-medium text-white/80">Available / Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400" />
            <span className="text-sm font-medium text-white/80">Maintenance / Offline</span>
          </div>
        </div>

        {!selectedFloorId ? (
          <FloorSelection floors={filteredFloors} onSelect={setSelectedFloorId} />
        ) : !selectedRoomId ? (
          <RoomSelection rooms={selectedFloor!.rooms} onSelect={setSelectedRoomId} />
        ) : (
          <RoomLayout room={selectedRoom!} search={search} />
        )}
      </div>
      
      {/* Machine Details Drawer */}
      <MachineDetailsDrawer />
    </div>
  );
}

// ─── Floor Selection ─────────────────────────────────────────────────────────

function FloorSelection({ floors, onSelect }: { floors: FactoryFloorLevel[], onSelect: (id: string) => void }) {
  if (floors.length === 0) return <div className="text-center text-white/40 py-20">No floors found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {floors.map(floor => {
        const totalRooms = floor.rooms.length;
        const allFloorMachines = floor.rooms.flatMap(r => r.lines.flatMap(l => l.machines));
        const totalMachines = allFloorMachines.length;
        const assignedMachines = allFloorMachines.filter(m => m.status === 'running').length;
        const idleMachines = allFloorMachines.filter(m => m.status !== 'running').length;
        const assignedPercentage = totalMachines === 0 ? 0 : Math.round((assignedMachines / totalMachines) * 100);

        return (
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            key={floor.id}
            onClick={() => onSelect(floor.id)}
            className="group cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-emerald-500/50 hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] flex flex-col justify-between overflow-hidden relative"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{floor.name}</h3>
                <p className="text-sm text-white/40">Floor Level {floor.floorNumber}</p>
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-emerald-400">{assignedPercentage}% Assigned</span>
                <span className="text-white/40">{totalMachines} Total</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${assignedPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 relative z-10">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5 shadow-inner">
                <div className="text-xl font-bold text-white mb-1">{totalRooms}</div>
                <div className="text-[10px] text-white/50 uppercase font-semibold">Rooms</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5 shadow-inner">
                <div className="text-xl font-bold text-white mb-1">{totalMachines}</div>
                <div className="text-[10px] text-white/50 uppercase font-semibold">Machines</div>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20 shadow-inner">
                <div className="text-xl font-bold text-emerald-400 mb-1">{assignedMachines}</div>
                <div className="text-[10px] text-emerald-500/70 uppercase font-semibold">Assigned</div>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20 shadow-inner">
                <div className="text-xl font-bold text-amber-400 mb-1">{idleMachines}</div>
                <div className="text-[10px] text-amber-500/70 uppercase font-semibold">Idle</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Room Selection ──────────────────────────────────────────────────────────

function RoomSelection({ rooms, onSelect }: { rooms: FactoryRoom[], onSelect: (id: string) => void }) {
  if (rooms.length === 0) return <div className="text-center text-white/40 py-20">No rooms found on this floor.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map(room => {
        const totalRows = room.lines.length;
        const allRoomMachines = room.lines.flatMap(l => l.machines);
        const totalMachines = allRoomMachines.length;
        const assignedMachines = allRoomMachines.filter(m => m.status === 'running').length;
        const idleMachines = allRoomMachines.filter(m => m.status !== 'running').length;
        const assignedPercentage = totalMachines === 0 ? 0 : Math.round((assignedMachines / totalMachines) * 100);

        return (
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            key={room.id}
            onClick={() => onSelect(room.id)}
            className="group cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-blue-500/50 hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.15)] flex flex-col justify-between overflow-hidden relative"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{room.name}</h3>
                <p className="text-sm text-white/40 capitalize">{room.roomType || 'Production'} Room</p>
              </div>
            </div>

            <div className="relative z-10 mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-blue-400">{assignedPercentage}% Assigned</span>
                <span className="text-white/40">{totalMachines} Total</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${assignedPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 relative z-10">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5 shadow-inner">
                <div className="text-xl font-bold text-white mb-1">{totalRows}</div>
                <div className="text-[10px] text-white/50 uppercase font-semibold">Rows</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5 shadow-inner">
                <div className="text-xl font-bold text-white mb-1">{totalMachines}</div>
                <div className="text-[10px] text-white/50 uppercase font-semibold">Machines</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 shadow-inner">
                <div className="text-xl font-bold text-blue-400 mb-1">{assignedMachines}</div>
                <div className="text-[10px] text-blue-500/70 uppercase font-semibold">Assigned</div>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20 shadow-inner">
                <div className="text-xl font-bold text-amber-400 mb-1">{idleMachines}</div>
                <div className="text-[10px] text-amber-500/70 uppercase font-semibold">Idle</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Room Layout (Machines Grid) ─────────────────────────────────────────────

const ROW_PREFIXES = ['A', 'B', 'C', 'D'];
function RoomLayout({ room, search }: { room: FactoryRoom, search: string }) {
  
  const numRows = room.rowsCount || 4;
  const machinesPerRow = room.machinesPerRow || 35;

  const rows = Array.from({ length: numRows }, (_, i) => {
    const prefix = ROW_PREFIXES[i] || `R${i+1}`;
    const lineName = `Line ${prefix}`;
    const roomLine = room.lines.find(l => l.lineNumber === i + 1); 
    const rowMachines = roomLine?.machines || [];

    return (
      <div key={i} className="mb-16 last:mb-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-sm font-medium text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 shadow-sm">
            {rowMachines.length} / {machinesPerRow} Machines Active
          </div>
        </div>
        
        <div className="relative bg-zinc-900/60 p-8 rounded-3xl border border-white/10 shadow-2xl overflow-x-auto min-w-max">
           {/* Center Table / Conveyor */}
           <div className="absolute left-8 right-8 top-1/2 h-10 bg-zinc-950 -translate-y-1/2 rounded-full border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
             {/* Animated Conveyor Belt Pattern */}
             <div className="w-full h-full opacity-30 animate-conveyor absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #ffffff 10px, #ffffff 12px)' }}></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"></div>
             
             {/* Centered Row Name */}
             <div className="relative z-10 bg-zinc-900/90 backdrop-blur-md px-6 py-1 rounded-full border border-white/20 text-white font-bold tracking-widest shadow-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {lineName}
             </div>
           </div>
           
           {/* Slots */}
           <div className="relative z-10 w-full min-w-max flex flex-col gap-12 pt-2 pb-2">
             <div className="flex gap-4">
               {Array.from({ length: Math.ceil(machinesPerRow / 2) }, (_, slotIdx) => {
                  const absoluteIndex = slotIdx * 2; 
                  const machine = rowMachines.find(m => m.position?.index === absoluteIndex);
                  return <MachineNode key={absoluteIndex} label={`${prefix}${absoluteIndex + 1}`} number={absoluteIndex + 1} machine={machine} search={search} />;
               })}
             </div>
             <div className="flex gap-4 pl-10">
               {Array.from({ length: Math.floor(machinesPerRow / 2) }, (_, slotIdx) => {
                  const absoluteIndex = slotIdx * 2 + 1; 
                  const machine = rowMachines.find(m => m.position?.index === absoluteIndex);
                  return <MachineNode key={absoluteIndex} label={`${prefix}${absoluteIndex + 1}`} number={absoluteIndex + 1} machine={machine} search={search} />;
               })}
             </div>
           </div>
        </div>
      </div>
    );
  });

  return (
    <div className="w-full pb-10">
      {rows}
    </div>
  );
}

function MachineNode({ label, number, machine, search }: { label: string, number: number, machine?: Machine, search: string }) {
  
  const isMatch = search && machine && (
    machine.machineNumber.toLowerCase().includes(search.toLowerCase()) || 
    (machine.worker && machine.worker.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (!machine) {
    return (
      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col justify-center items-center shrink-0 shadow-inner" title="Not Assigned to Floor">
        <span className="text-xl font-bold text-white/10 mb-0.5">{label}</span>
      </div>
    );
  }

  // Determine States
  const isOffline = machine.status === 'offline' || machine.status === 'maintenance';
  const hasWorker = !!machine.worker;
  
  // Dummy Simulation for Presentation based on Machine ID
  const machineIdNum = parseInt(machine.id.replace(/\D/g, '') || '0');
  const dummyState = machineIdNum % 3;
  
  const isWorking = hasWorker && dummyState === 0;
  const isAssignedNotWorking = hasWorker && dummyState === 1;
  const isSittingNoBundle = hasWorker && dummyState === 2;

  let statusColor = 'border-white/10 bg-white/[0.02]';
  let dotColor = 'bg-white/20';
  let textColor = 'text-white/30';
  let statusText = 'Not in Use';

  if (isOffline) {
    statusColor = 'border-red-600 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    dotColor = 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
    textColor = 'text-red-400';
    statusText = 'Machine Problem';
  } else if (isWorking) {
    statusColor = 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]';
    textColor = 'text-emerald-400';
    statusText = 'Working';
  } else if (isSittingNoBundle) {
    statusColor = 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
    dotColor = 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]';
    textColor = 'text-blue-400';
    statusText = 'Sitting (No Bundle)';
  } else if (isAssignedNotWorking) {
    statusColor = 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
    textColor = 'text-amber-400';
    statusText = 'Assigned (Not Started)';
  } else {
    // Blank/Unassigned state
    statusText = 'Blank / Unassigned';
  }

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ y: 0, scale: 0.95 }}
      onClick={() => {
        if (machine?.machineNumber) {
          useMachineStore.getState().setSelectedMachine(machine.machineNumber);
        }
      }}
      className={cn(
        "w-16 h-16 rounded-xl border-x border-t border-b-4 flex flex-col items-center justify-center shrink-0 relative group cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-colors",
        statusColor,
        isMatch ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950 scale-110 z-10" : "",
        isMatch && isWorking ? "shadow-[0_0_20px_rgba(16,185,129,0.5)]" : ""
      )}
      title={`${label} - ${machine.worker?.name || 'Not Assigned'}`}
    >
      {hasWorker && !isOffline && (
        <div className={cn("absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 transition-all duration-300", dotColor)} />
      )}
      
      {isOffline && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>
      )}

      <span className={cn("text-xl font-black tracking-tighter relative z-10", textColor)}>
        {label}
      </span>
      
      {/* Tooltip on hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-max z-30 shadow-2xl">
        <div className="text-sm font-bold text-white mb-1">{label}</div>
        <div className="flex items-center gap-2 mb-1.5">
            <div className={cn("w-2 h-2 rounded-full", dotColor)} />
            <span className={cn("text-xs font-semibold", textColor)}>{statusText}</span>
        </div>
        <div className="text-xs text-white/70 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> {machine.worker?.name || 'No Worker Assigned'}
        </div>
      </div>
    </motion.div>
  );
}