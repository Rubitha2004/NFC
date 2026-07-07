import { usePlanningResources } from "./hooks/usePlanning";
import { Activity, Users, Cpu, Server } from "lucide-react";

export default function ResourceAllocationPage() {
  const { data: resources, isLoading: loading } = usePlanningResources();

  if (loading || !resources) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Resource Allocation</h1>
          <p className="text-sm text-white/50 mt-1">Real-time availability of machines and workforce</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Workers Grid */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
          <div className="flex items-center mb-4 text-emerald-400">
            <Users className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Worker Availability Heatmap</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {resources.workers.map(w => {
              const isBusy = w.assignments.length > 0;
              return (
                <div key={w.id} className={`aspect-square rounded-md flex flex-col items-center justify-center text-[10px] p-1 text-center transition-colors ${isBusy ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`} title={`${w.firstName} ${w.lastName} - ${w.grade?.name}`}>
                  <span className="font-bold truncate w-full">{w.firstName}</span>
                  <span className="opacity-70 mt-1">{w.employeeCode}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Machines Grid */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
          <div className="flex items-center mb-4 text-blue-400">
            <Cpu className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Machine Utilization Grid</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {resources.machines.map(m => {
              const isBusy = m.assignments.length > 0;
              return (
                <div key={m.id} className={`aspect-square rounded-md flex flex-col items-center justify-center text-[10px] p-1 text-center transition-colors ${isBusy ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-zinc-800 text-white/50 border border-white/10'}`} title={m.machineName}>
                  <Server className={`w-4 h-4 mb-1 ${isBusy ? 'animate-pulse' : ''}`} />
                  <span className="font-mono font-bold">{m.machineCode}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
