import { useState, useMemo } from "react";
import { X, Search, Check, Cpu, Users, Layers, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanningWorker, PlanningMachine } from "../types/planning.types";

interface ResourceAllocationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  operationName: string;
  requiredMinutes: number;
  availableWorkers: PlanningWorker[];
  availableMachines: PlanningMachine[];
  selectedWorkerIds: number[];
  selectedMachineIds: number[];
  onSelectWorker: (id: number) => void;
  onSelectMachine: (id: number) => void;
}

export function ResourceAllocationDrawer({
  isOpen,
  onClose,
  operationName,
  requiredMinutes,
  availableWorkers,
  availableMachines,
  selectedWorkerIds,
  selectedMachineIds,
  onSelectWorker,
  onSelectMachine,
}: ResourceAllocationDrawerProps) {
  const [tab, setTab] = useState<'workers' | 'machines'>('workers');
  const [search, setSearch] = useState("");
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const groupedWorkers = useMemo(() => {
    let filtered = availableWorkers;
    if (showOnlyFree) {
      filtered = filtered.filter(w => w.assignments.length === 0);
    }
    
    filtered = filtered.filter(w => 
      w.firstName.toLowerCase().includes(search.toLowerCase()) || 
      w.employeeCode.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.grade.priority - a.grade.priority);

    // Group by department name
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach(w => {
      const dept = w.department?.name || "Unassigned Dept";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(w);
    });
    return grouped;
  }, [availableWorkers, search, showOnlyFree]);

  const groupedMachines = useMemo(() => {
    let filtered = availableMachines;
    if (showOnlyFree) {
      filtered = filtered.filter(m => m.assignments.length === 0);
    }

    filtered = filtered.filter(m => 
      m.machineName.toLowerCase().includes(search.toLowerCase()) || 
      m.machineCode.toLowerCase().includes(search.toLowerCase())
    );

    // Group by department name
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach(m => {
      const dept = m.department?.name || "Unassigned Dept";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(m);
    });
    return grouped;
  }, [availableMachines, search, showOnlyFree]);

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

        <div className="flex border-b border-white/10 bg-zinc-900/30">
          <button 
            onClick={() => setTab('workers')}
            className={cn(
              "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2",
              tab === 'workers' ? "border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5" : "text-white/50 hover:bg-white/5"
            )}
          >
            <Users className="w-4 h-4" /> Workers ({selectedWorkerIds.length})
          </button>
          <button 
            onClick={() => setTab('machines')}
            className={cn(
              "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2",
              tab === 'machines' ? "border-b-2 border-blue-500 text-blue-400 bg-blue-500/5" : "text-white/50 hover:bg-white/5"
            )}
          >
            <Cpu className="w-4 h-4" /> Machines ({selectedMachineIds.length})
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
          <button 
            onClick={() => setShowOnlyFree(!showOnlyFree)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors",
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
                  const isSelected = selectedWorkerIds.includes(worker.id);
                  const isBusy = worker.assignments.length > 0;

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
                          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">{worker.grade.name}</span>
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
                {machines.map(machine => {
                  const isSelected = selectedMachineIds.includes(machine.id);
                  const isBusy = machine.assignments.length > 0;

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
                          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">{machine.machineType.name}</span>
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
            ))
          )}
        </div>
      </div>
    </>
  );
}
