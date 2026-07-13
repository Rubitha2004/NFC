import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Cpu, ArrowRight, CheckCircle, X, Layers, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanningMachine, PlanningWorker } from "../types/planning.types";
import { useFactoryData } from "../../factory/hooks/useFactoryData";

interface AllocationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationName: string;
  availableWorkers: PlanningWorker[];
  availableMachines: PlanningMachine[];
  initialSelectedMachineIds: number[];
  initialSelectedWorkerIds: number[];
  onSave: (machineIds: number[], workerIds: number[]) => void;
}

export function AllocationWizardModal({
  isOpen,
  onClose,
  operationName,
  availableWorkers,
  availableMachines,
  initialSelectedMachineIds,
  initialSelectedWorkerIds,
  onSave,
}: AllocationWizardModalProps) {
  const [step, setStep] = useState<"machines" | "workers">("machines");
  const [selectedMachineIds, setSelectedMachineIds] = useState<number[]>([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([]);
  
  // Factory Layout integration
  const { config, loading: loadingLayout } = useFactoryData();
  const floors = config?.buildings?.[0]?.floors || [];
  
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Initialize with the most relevant floor/room
  useEffect(() => {
    if (selectedFloorId || floors.length === 0) return;

    let targetFloorId = floors[0].id;
    let targetRoomId = floors[0].rooms?.[0]?.id || null;

    // Try to find a floor/room that contains any of the available machines
    const machineRoomNames = new Set(availableMachines.map(m => m.room?.name).filter(Boolean));
    
    if (machineRoomNames.size > 0) {
      for (const floor of floors) {
        const matchingRoom = floor.rooms.find(r => machineRoomNames.has(r.name));
        if (matchingRoom) {
          targetFloorId = floor.id;
          targetRoomId = matchingRoom.id;
          break;
        }
      }
    } else {
      // Find first floor with rooms
      const floorWithRooms = floors.find(f => f.rooms.length > 0);
      if (floorWithRooms) {
        targetFloorId = floorWithRooms.id;
        targetRoomId = floorWithRooms.rooms[0].id;
      }
    }

    setSelectedFloorId(targetFloorId);
    setSelectedRoomId(targetRoomId);
  }, [floors, selectedFloorId, availableMachines]);

  useEffect(() => {
    if (isOpen) {
      setSelectedMachineIds(initialSelectedMachineIds);
      setSelectedWorkerIds(initialSelectedWorkerIds);
      setStep("machines");
    }
  }, [isOpen, initialSelectedMachineIds, initialSelectedWorkerIds]);


  const handleNext = () => {
    if (step === "machines") {
      setStep("workers");
    } else {
      onSave(selectedMachineIds, selectedWorkerIds);
    }
  };

  const toggleMachine = (id: number) => {
    setSelectedMachineIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const toggleWorker = (id: number) => {
    setSelectedWorkerIds(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  // Map available machines by machine Code/Number so we can identify them quickly
  const availableMachinesMap = new Map<string, PlanningMachine>();
  availableMachines.forEach(m => availableMachinesMap.set(m.machineCode, m));

  const selectedFloor = floors.find(f => f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(r => r.id === selectedRoomId);
  const roomLines = selectedRoom?.lines || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-950/50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Resource Allocation
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-sm">
                {operationName}
              </span>
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-white/50">
              <span className={cn("transition-colors", step === "machines" ? "text-white font-semibold" : "")}>
                1. Machine Selection
              </span>
              <ArrowRight className="w-3 h-3" />
              <span className={cn("transition-colors", step === "workers" ? "text-white font-semibold" : "")}>
                2. Worker Selection
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            {step === "machines" && (
              <motion.div
                key="machines"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <div className="mb-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-blue-500" /> Factory Floor Layout
                    </h3>
                    <div className="text-sm text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full">
                      {selectedMachineIds.length} Selected
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 px-3 border-r border-white/10">
                      <Layers className="w-4 h-4 text-white/40" />
                      <select 
                        className="bg-transparent text-sm text-white outline-none cursor-pointer"
                        value={selectedFloorId || ''}
                        onChange={(e) => {
                          setSelectedFloorId(e.target.value);
                          const newFloor = floors.find(f => f.id === e.target.value);
                          if (newFloor && newFloor.rooms.length > 0) {
                            setSelectedRoomId(newFloor.rooms[0].id);
                          } else {
                            setSelectedRoomId(null);
                          }
                        }}
                      >
                        {floors.map(f => (
                          <option key={f.id} value={f.id} className="bg-zinc-900">{f.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3">
                      <Box className="w-4 h-4 text-white/40" />
                      <select 
                        className="bg-transparent text-sm text-white outline-none cursor-pointer"
                        value={selectedRoomId || ''}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        disabled={!selectedFloor || selectedFloor.rooms.length === 0}
                      >
                        {selectedFloor?.rooms.length === 0 && (
                           <option value="" disabled className="bg-zinc-900">No rooms available</option>
                        )}
                        {selectedFloor?.rooms.map(r => (
                          <option key={r.id} value={r.id} className="bg-zinc-900">{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-zinc-950 rounded-xl border border-white/5 p-8 overflow-y-auto overflow-x-auto custom-scrollbar">
                  
                  <div className="w-full pb-10 space-y-16">
                    {loadingLayout ? (
                      <div className="flex items-center justify-center h-40 text-blue-400 animate-pulse">Loading Factory Layout...</div>
                    ) : !selectedRoomId ? (
                      <div className="text-center py-20 text-white/40 border border-dashed border-white/10 rounded-2xl">
                        Please select a valid Room.
                      </div>
                    ) : roomLines.length === 0 ? (
                      <div className="text-center py-20 text-white/40 border border-dashed border-white/10 rounded-2xl">
                        No production lines found in this room.
                      </div>
                    ) : (
                      roomLines.map((line, rowIdx) => {
                        const prefix = ['A', 'B', 'C', 'D'][rowIdx] || `R${rowIdx+1}`;
                        const lineName = line.name || `Line ${prefix}`;
                        const MACHINES_PER_ROW = 35;
                        
                        return (
                          <div key={line.id || rowIdx} className="w-full">
                            <div className="relative bg-zinc-900/60 p-8 rounded-3xl border border-white/10 shadow-2xl min-w-max">
                              {/* Center Conveyor */}
                              <div className="absolute left-8 right-8 top-1/2 h-10 bg-zinc-950 -translate-y-1/2 rounded-full border border-white/10 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full opacity-30 animate-conveyor absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #ffffff 10px, #ffffff 12px)' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"></div>
                                <div className="relative z-10 bg-zinc-900/90 backdrop-blur-md px-6 py-1 rounded-full border border-white/20 text-white font-bold tracking-widest shadow-xl flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  {lineName}
                                </div>
                              </div>
                              
                              {/* Slots */}
                              <div className="relative z-10 w-full min-w-max flex flex-col gap-12">
                                {/* Top Row (Even Indices) */}
                                <div className="flex gap-2">
                                  {Array.from({ length: Math.ceil(MACHINES_PER_ROW / 2) }).map((_, slotIdx) => {
                                    const absoluteIndex = slotIdx * 2;
                                    const machineData = line.machines.find(m => m.position?.index === absoluteIndex);
                                    const planningMachine = machineData ? availableMachinesMap.get(machineData.machineNumber) : undefined;
                                    
                                    // If planningMachine exists, it's available. Else, it's busy/unavailable.
                                    const isAvailable = !!planningMachine;
                                    let reason = 'Available for assignment';
                                    if (machineData) {
                                      if (machineData.worker) {
                                        reason = `Currently assigned to ${machineData.worker.name} (${machineData.worker.employeeId})`;
                                      } else if (machineData.status === 'maintenance') {
                                        reason = 'Under maintenance';
                                      } else if (machineData.status === 'offline') {
                                        reason = 'Machine is offline';
                                      } else if (!planningMachine) {
                                        reason = `Not suitable for this operation (Type: ${machineData.machineType})`;
                                      }
                                    }

                                    const displayMachine = planningMachine || (machineData ? { 
                                      id: -1, 
                                      machineCode: machineData.machineNumber, 
                                      machineName: machineData.machineType || 'Machine', 
                                      departmentId: 0, 
                                      assignments: [{}] 
                                    } : undefined);

                                    return (
                                      <MachineNode 
                                        key={absoluteIndex} 
                                        label={`${prefix}${absoluteIndex + 1}`} 
                                        number={absoluteIndex + 1} 
                                        machine={displayMachine} 
                                        reason={reason}
                                        isSelected={planningMachine ? selectedMachineIds.includes(planningMachine.id) : false}
                                        onClick={() => planningMachine && toggleMachine(planningMachine.id)}
                                        forceBusy={!isAvailable && !!machineData}
                                      />
                                    );
                                  })}
                                </div>
                                {/* Bottom Row (Odd Indices) */}
                                <div className="flex gap-2 pl-6">
                                  {Array.from({ length: Math.floor(MACHINES_PER_ROW / 2) }).map((_, slotIdx) => {
                                    const absoluteIndex = slotIdx * 2 + 1;
                                    const machineData = line.machines.find(m => m.position?.index === absoluteIndex);
                                    const planningMachine = machineData ? availableMachinesMap.get(machineData.machineNumber) : undefined;
                                    
                                    const isAvailable = !!planningMachine;
                                    let reason = 'Available for assignment';
                                    if (machineData) {
                                      if (machineData.worker) {
                                        reason = `Currently assigned to ${machineData.worker.name} (${machineData.worker.employeeId})`;
                                      } else if (machineData.status === 'maintenance') {
                                        reason = 'Under maintenance';
                                      } else if (machineData.status === 'offline') {
                                        reason = 'Machine is offline';
                                      } else if (!planningMachine) {
                                        reason = `Not suitable for this operation (Type: ${machineData.machineType})`;
                                      }
                                    }

                                    const displayMachine = planningMachine || (machineData ? { 
                                      id: -1, 
                                      machineCode: machineData.machineNumber, 
                                      machineName: machineData.machineType || 'Machine', 
                                      departmentId: 0, 
                                      assignments: [{}] 
                                    } : undefined);

                                    return (
                                      <MachineNode 
                                        key={absoluteIndex} 
                                        label={`${prefix}${absoluteIndex + 1}`} 
                                        number={absoluteIndex + 1} 
                                        machine={displayMachine} 
                                        reason={reason}
                                        isSelected={planningMachine ? selectedMachineIds.includes(planningMachine.id) : false}
                                        onClick={() => planningMachine && toggleMachine(planningMachine.id)}
                                        forceBusy={!isAvailable && !!machineData}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {step === "workers" && (
              <motion.div
                key="workers"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-500" /> Assign Workers
                  </h3>
                  <div className="text-sm text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                    {selectedWorkerIds.length} Selected
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar content-start flex-1 p-2">
                  {availableWorkers.map(w => {
                    const isSelected = selectedWorkerIds.includes(w.id);
                    const isBusy = (w.assignments?.length || 0) > 0 && !isSelected;

                    return (
                      <div 
                        key={w.id}
                        onClick={() => !isBusy && toggleWorker(w.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                            : isBusy
                              ? "border-white/5 bg-zinc-950 opacity-50 cursor-not-allowed"
                              : "border-white/10 bg-zinc-900 hover:border-white/30"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 shrink-0">
                          <Users className={cn("w-5 h-5", isSelected ? "text-emerald-400" : "text-white/40")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white truncate">{w.firstName} {w.lastName}</div>
                          <div className="text-[10px] text-white/50 font-mono mt-0.5">{w.employeeCode} | {w.grade?.name}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {availableWorkers.length === 0 && (
                    <div className="col-span-full text-center py-10 text-white/40">
                      No workers available for assignment.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-white/10 bg-zinc-950/50 flex justify-between items-center shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            {step === "workers" && (
              <button 
                onClick={() => setStep("machines")}
                className="px-5 py-2.5 rounded-lg font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Back to Machines
              </button>
            )}
            <button 
              onClick={handleNext}
              className={cn(
                "px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg",
                step === "machines" 
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20" 
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20"
              )}
            >
              {step === "machines" ? "OK, Next" : "OK, Confirm Assignment"}
              {step === "machines" && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MachineNode({ label, number, machine, reason, isSelected, onClick, forceBusy = false }: { label: string, number: number, machine?: PlanningMachine, reason?: string, isSelected: boolean, onClick: () => void, forceBusy?: boolean }) {
  if (!machine) {
    return (
      <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col justify-center items-center shrink-0 shadow-inner" title="Not Assigned to Floor">
        <span className="text-xl font-bold text-white/10 mb-0.5">{number}</span>
        <span className="text-[8px] font-bold text-white/20">{label}</span>
      </div>
    );
  }

  const isBusy = forceBusy || ((machine.assignments?.length || 0) > 0 && !isSelected);
  
  const statusColor = isSelected ? 'border-emerald-600 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
                      isBusy ? 'border-red-600/50 bg-red-500/10 cursor-not-allowed opacity-80' : 
                      'border-amber-500 bg-amber-500/10 hover:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)] cursor-pointer';

  const dotColor = isSelected ? 'bg-emerald-400' : isBusy ? 'bg-red-500' : 'bg-amber-400';

  return (
    <motion.div 
      whileHover={!isBusy ? { y: -4, scale: 1.05 } : {}}
      whileTap={!isBusy ? { y: 0, scale: 0.95 } : {}}
      onClick={() => !isBusy && onClick()}
      className={cn(
        "w-16 h-16 rounded-xl border-x border-t border-b-4 flex flex-col items-center justify-center shrink-0 relative group shadow-[0_4px_10px_rgba(0,0,0,0.3)]",
        statusColor
      )}
      title={`${machine.machineName} (${machine.machineCode})\n${reason || (isBusy ? 'Unavailable' : 'Available')}`}
    >
      <div className={cn("absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 transition-all duration-300", dotColor)} />
      
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
           <X className="w-8 h-8 text-red-500" strokeWidth={3} />
        </div>
      )}

      <span className={cn("text-xl font-black mb-0.5 tracking-tighter relative z-10", isSelected ? "text-emerald-400" : isBusy ? "text-red-400" : "text-amber-400")}>
        {number}
      </span>
      
      <span className="text-[9px] font-bold text-white/60 tracking-wider relative z-10">
        {machine.machineCode}
      </span>
      
      {isSelected && (
        <div className="absolute -bottom-1 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      )}
    </motion.div>
  );
}
