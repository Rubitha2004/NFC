import { useState, useMemo } from "react";
import { X, Search, Check, Cpu, Users, Layers, Filter, Server, Grid, List, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanningWorker, PlanningMachine } from "../types/planning.types";

interface ResourceAllocationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  operationName: string;
  requiredMinutes: number;
  requiredSkillId?: number | null;
  availableWorkers: PlanningWorker[];
  availableMachines: PlanningMachine[];
  selectedWorkerIds: number[];
  selectedMachineIds: number[];
  allSelectedWorkerIds?: number[];
  allSelectedMachineIds?: number[];
  onSelectWorker: (id: number) => void;
  onSelectMachine: (id: number) => void;
}

export function ResourceAllocationDrawer({
  isOpen,
  onClose,
  operationName,
  requiredMinutes,
  requiredSkillId,
  availableWorkers,
  availableMachines,
  selectedWorkerIds,
  selectedMachineIds,
  allSelectedWorkerIds = [],
  allSelectedMachineIds = [],
  onSelectWorker,
  onSelectMachine,
}: ResourceAllocationDrawerProps) {
  const [tab, setTab] = useState<'workers' | 'machines'>('machines');
  const [machineView, setMachineView] = useState<'linear' | 'visual' | 'layout'>('layout');
  const [search, setSearch] = useState("");
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const groupedWorkers = useMemo(() => {
    let filtered = availableWorkers || [];

    filtered = filtered.filter(w => 
      (w.firstName || "").toLowerCase().includes(search.toLowerCase()) || 
      (w.employeeCode || "").toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
      const hasReqSkillA = requiredSkillId ? (a as any).skills?.some((s: any) => s.skillId === requiredSkillId) : false;
      const hasReqSkillB = requiredSkillId ? (b as any).skills?.some((s: any) => s.skillId === requiredSkillId) : false;
      
      const isBusyA = (a.assignments?.length || 0) > 0 || allSelectedWorkerIds.includes(a.id);
      const isBusyB = (b.assignments?.length || 0) > 0 || allSelectedWorkerIds.includes(b.id);
      
      // 1. Skill Match Priority
      if (hasReqSkillA && !hasReqSkillB) return -1;
      if (!hasReqSkillA && hasReqSkillB) return 1;
      
      // 2. Free Priority
      if (!isBusyA && isBusyB) return -1;
      if (isBusyA && !isBusyB) return 1;
      
      // 3. Grade Priority
      return (b.grade?.priority || 0) - (a.grade?.priority || 0);
    });

    if (showOnlyFree) {
      filtered = filtered.filter(w => !((w.assignments?.length || 0) > 0 || allSelectedWorkerIds.includes(w.id)));
    }

    // Group by department name
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach(w => {
      const dept = w.department?.name || "Unassigned Dept";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(w);
    });
    return grouped;
  }, [availableWorkers, search, showOnlyFree, requiredSkillId, allSelectedWorkerIds]);

  const groupedMachines = useMemo(() => {
    let filtered = availableMachines || [];
    if (showOnlyFree) {
      filtered = filtered.filter(m => !((m.assignments?.length || 0) > 0 || allSelectedMachineIds.includes(m.id)));
    }

    filtered = filtered.filter(m => 
      (m.machineName || "").toLowerCase().includes(search.toLowerCase()) || 
      (m.machineCode || "").toLowerCase().includes(search.toLowerCase())
    );

    // Group by room, row, and department name
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach(m => {
      const dept = m.department?.name || "Unassigned Dept";
      const roomName = m.room?.name;
      const rowName = m.rowIndex ? `Row ${m.rowIndex}` : "";
      
      let groupKey = dept;
      if (roomName) {
        groupKey = `${roomName}${rowName ? ` - ${rowName}` : ''} (${dept})`;
      }
      
      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(m);
    });
    return grouped;
  }, [availableMachines, search, showOnlyFree, allSelectedMachineIds]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[500px] bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold">Allocate Resources</h2>
            <p className="text-sm text-emerald-400 mt-1">{operationName} | Req: {Math.ceil(requiredMinutes/60)} hrs</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={cn("px-6 py-3 border-b flex items-center justify-between text-sm font-semibold transition-colors", selectedMachineIds.length > 0 && selectedWorkerIds.length === selectedMachineIds.length ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : selectedMachineIds.length > 0 && selectedWorkerIds.length < selectedMachineIds.length ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-zinc-900/50 border-white/10 text-white/50")}>
          <span>Allocation Status:</span>
          <div className="flex gap-4">
             <span>Machines: {selectedMachineIds.length}</span>
             <span>Workers: {selectedWorkerIds.length} {selectedMachineIds.length > 0 ? `/ ${selectedMachineIds.length} required` : ""}</span>
          </div>
        </div>

        <div className="flex border-b border-white/10 bg-zinc-900/30">
          <button 
            onClick={() => setTab('workers')}
            className={cn(
              "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2",
              tab === 'workers' ? "border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5" : "text-white/50 hover:bg-white/5"
            )}
          >
            <Users className="w-4 h-4" /> Workers ({selectedWorkerIds?.length || 0})
          </button>
          <button 
            onClick={() => setTab('machines')}
            className={cn(
              "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2",
              tab === 'machines' ? "border-b-2 border-blue-500 text-blue-400 bg-blue-500/5" : "text-white/50 hover:bg-white/5"
            )}
          >
            <Cpu className="w-4 h-4" /> Machines ({selectedMachineIds?.length || 0})
          </button>
        </div>

        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text"
              placeholder={`Search ${tab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-white/30"
            />
          </div>
          {tab === 'machines' && (
            <div className="flex bg-zinc-900 border border-white/10 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setMachineView('layout')}
                className={cn("p-1.5 rounded-md transition-colors", machineView === 'layout' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                title="Factory Layout View"
              >
                <Map className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMachineView('visual')}
                className={cn("p-1.5 rounded-md transition-colors", machineView === 'visual' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMachineView('linear')}
                className={cn("p-1.5 rounded-md transition-colors", machineView === 'linear' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowOnlyFree(!showOnlyFree)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors shrink-0",
              showOnlyFree ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-zinc-900 border-white/10 text-white/60 hover:bg-white/5"
            )}
          >
            <Filter className="w-4 h-4" /> {showOnlyFree ? "Free Only" : "Show All"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {tab === 'workers' && (
            Object.entries(groupedWorkers).length === 0 ? (
               <div className="text-center py-10 text-white/40 text-sm">No workers found.</div>
            ) : Object.entries(groupedWorkers).map(([deptName, workers]) => (
              <div key={deptName} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white/80 pb-2 border-b border-white/5">
                  <Layers className="w-4 h-4 text-white/40" /> {deptName}
                </div>
                {workers.map(worker => {
                  const isSelected = selectedWorkerIds?.includes(worker.id);
                  const isBusy = (worker.assignments?.length || 0) > 0 || allSelectedWorkerIds.includes(worker.id);
                  const hasRequiredSkill = requiredSkillId 
                    ? (worker as any).skills?.some((s: any) => s.skillId === requiredSkillId) 
                    : false;

                  return (
                    <div 
                      key={worker.id}
                      onClick={() => onSelectWorker(worker.id)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
                        isSelected ? "bg-emerald-500/20 border-emerald-500/50" : "bg-zinc-900 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center border shrink-0",
                        isSelected ? "bg-emerald-500 border-emerald-500 text-zinc-900" : "border-white/20 text-transparent"
                      )}>
                        <Check className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{worker.firstName} {worker.lastName}</span>
                          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">{worker.grade?.name || "No Grade"}</span>
                          {hasRequiredSkill && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded shrink-0 border border-purple-500/30">
                              Skilled
                            </span>
                          )}
                        </div>
                        <div className="text-xs mt-1 flex items-center gap-3">
                          <span className="text-white/40">{worker.employeeCode}</span>
                          {isBusy ? (
                            <span className="text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded-full">Busy</span>
                          ) : (
                            <span className="text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">Free</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {tab === 'machines' && (
            Object.entries(groupedMachines).length === 0 ? (
               <div className="text-center py-10 text-white/40 text-sm">No machines found.</div>
            ) : Object.entries(groupedMachines).map(([deptName, machines]) => (
              <div key={deptName} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white/80 pb-2 border-b border-white/5">
                  <Layers className="w-4 h-4 text-white/40" /> {deptName}
                </div>
                {machineView === 'layout' ? (
                  <div className="relative bg-zinc-900/60 p-6 rounded-2xl border border-white/10 shadow-lg overflow-x-auto min-w-max">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-white/50">{machines.length} Machines</div>
                      <button 
                        onClick={() => {
                          const freeMachines = machines.filter(m => !((m.assignments?.length || 0) > 0 || allSelectedMachineIds.includes(m.id)));
                          // Select up to 5 free machines
                          const toSelect = freeMachines.slice(0, 5);
                          toSelect.forEach(m => {
                            if (!selectedMachineIds?.includes(m.id)) {
                              onSelectMachine(m.id);
                            }
                          });
                        }}
                        className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors"
                      >
                        Quick Select 5 Free
                      </button>
                    </div>
                    
                    {/* Minimal Conveyor */}
                    <div className="absolute left-6 right-6 top-[60%] h-6 bg-zinc-950 -translate-y-1/2 rounded-full border border-white/5 shadow-inner flex items-center justify-center overflow-hidden pointer-events-none">
                      <div className="w-full h-full opacity-20 animate-conveyor absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #ffffff 10px, #ffffff 12px)' }}></div>
                    </div>

                    <div className="relative z-10 flex gap-2 w-max items-center">
                      {[...machines].sort((a, b) => (a.position?.index || 0) - (b.position?.index || 0)).map((machine, idx) => {
                        const isSelected = selectedMachineIds?.includes(machine.id);
                        const isBusy = (machine.assignments?.length || 0) > 0 || allSelectedMachineIds.includes(machine.id);
                        
                        return (
                          <div 
                            key={machine.id}
                            onClick={() => onSelectMachine(machine.id)}
                            className={cn(
                              "w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-110",
                              isSelected ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10" 
                              : isBusy ? "bg-amber-500/10 border-amber-500/50 text-amber-500/50" 
                              : "bg-zinc-800 border-white/20 text-white/70 hover:border-white/50"
                            )}
                            title={`${machine.machineName} (${isBusy ? 'Busy' : isSelected ? 'Selected' : 'Free'})`}
                          >
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : machineView === 'visual' ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {machines.map(machine => {
                      const isSelected = selectedMachineIds?.includes(machine.id);
                      const isBusy = (machine.assignments?.length || 0) > 0 || allSelectedMachineIds.includes(machine.id);
                      
                      return (
                        <div 
                          key={machine.id}
                          onClick={() => onSelectMachine(machine.id)}
                          className={cn(
                            "aspect-square rounded-md flex flex-col items-center justify-center text-[10px] p-1 text-center transition-all cursor-pointer border",
                            isSelected ? "bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                            : isBusy ? "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:border-blue-500/50" 
                            : "bg-zinc-800 text-white/50 border-white/10 hover:border-white/30 hover:bg-zinc-700"
                          )}
                          title={machine.machineName}
                        >
                          <Server className={cn("w-5 h-5 mb-1", isBusy && !isSelected ? 'animate-pulse' : '')} />
                          <span className="font-mono font-bold truncate w-full px-1">{machine.machineCode}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {machines.map(machine => {
                      const isSelected = selectedMachineIds?.includes(machine.id);
                      const isBusy = (machine.assignments?.length || 0) > 0 || allSelectedMachineIds.includes(machine.id);

                      return (
                        <div 
                          key={machine.id}
                          onClick={() => onSelectMachine(machine.id)}
                          className={cn(
                            "p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
                            isSelected ? "bg-blue-500/20 border-blue-500/50" : "bg-zinc-900 border-white/5 hover:border-white/20"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center border shrink-0",
                            isSelected ? "bg-blue-500 border-blue-500 text-zinc-900" : "border-white/20 text-transparent"
                          )}>
                            <Check className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm truncate">{machine.machineName}</span>
                              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">{machine.machineType?.name || "No Type"}</span>
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-3">
                              <span className="text-white/40">{machine.machineCode}</span>
                              {isBusy ? (
                                <span className="text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded-full">Busy</span>
                              ) : (
                                <span className="text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">Free</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
