import { useLivePlanningResources } from "./hooks/useLivePlanningResources";
import { useLivePlanningTasks } from "./hooks/useLivePlanningTasks";
import { Activity, Users, Cpu, Server, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import api from "@/services/axios";

export default function ResourceAllocationPage() {
  const { data: resources, isLoading: loadingResources } = useLivePlanningResources();
  const { data: tasks, isLoading: loadingTasks } = useLivePlanningTasks();
  
  const [recommendations, setRecommendations] = useState<Record<number, any>>({});
  const [loadingRecs, setLoadingRecs] = useState<Record<number, boolean>>({});

  const pendingTasks = (tasks || []).filter(t => t.status === "CREATED" || t.status === "PLANNED");

  const runScheduler = async (taskId: number) => {
    setLoadingRecs(prev => ({ ...prev, [taskId]: true }));
    try {
      const { data } = await api.post(`/planning/scheduler/auto/${taskId}`);
      setRecommendations(prev => ({ ...prev, [taskId]: data }));
    } catch (err) {
      console.error("Failed to run scheduler", err);
    } finally {
      setLoadingRecs(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const applyRecommendation = async (taskId: number, rec: any) => {
    try {
      await api.patch(`/planning/tasks/${taskId}`, {
        status: "ASSIGNED",
        workerId: rec.recommendedWorker?.id,
        machineId: rec.recommendedMachine?.id,
        scheduledStart: rec.scheduledStart,
        scheduledEnd: rec.scheduledEnd
      });
      // Clear recommendation after applying
      setRecommendations(prev => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    } catch (err) {
      console.error("Failed to apply recommendation", err);
    }
  };

  if (loadingResources || loadingTasks || !resources) {
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
            {resources.workers.map((w: any) => {
              const isBusy = (w.assignments?.length || 0) > 0;
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
            {resources.machines.map((m: any) => {
              const isBusy = (m.assignments?.length || 0) > 0;
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

      {/* Auto Schedule Recommendations */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-purple-400">
            <Zap className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Auto-Scheduler Recommendations</h2>
          </div>
          <span className="text-sm text-white/50">{pendingTasks.length} pending tasks</span>
        </div>
        
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg">
            No pending tasks to schedule
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {pendingTasks.slice(0, 6).map(task => {
              const rec = recommendations[task.id];
              const isLoading = loadingRecs[task.id];

              return (
                <div key={task.id} className="bg-zinc-950 border border-white/5 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{task.taskId}</span>
                      <span className="text-[10px] uppercase font-bold bg-zinc-800 px-2 py-0.5 rounded">{task.status}</span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{task.operation?.operationName}</div>
                    <div className="text-xs text-white/50 mb-3">Quantity: {task.targetQuantity} • Est: {task.estimatedTime}m</div>
                  </div>

                  {rec ? (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mt-2">
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-white/40 block mb-0.5">Recommended Worker</span>
                          <span className="text-white font-medium">{rec.recommendedWorker ? `${rec.recommendedWorker.firstName} ${rec.recommendedWorker.lastName}` : 'None Available'}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block mb-0.5">Recommended Machine</span>
                          <span className="font-mono text-white/80">{rec.recommendedMachine?.machineCode || 'None Available'}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block mb-0.5">Skill Match</span>
                          <span className="text-emerald-400 font-medium">{rec.skillMatch}%</span>
                        </div>
                        <div>
                          <span className="text-white/40 block mb-0.5">Efficiency Score</span>
                          <span className="text-blue-400 font-medium">{rec.efficiency}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => applyRecommendation(task.id, rec)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Apply
                        </button>
                        <button 
                          onClick={() => runScheduler(task.id)}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-md transition-colors"
                        >
                          Recalculate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => runScheduler(task.id)}
                      disabled={isLoading}
                      className="w-full mt-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400 text-xs font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <Activity className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      Generate Recommendation
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
