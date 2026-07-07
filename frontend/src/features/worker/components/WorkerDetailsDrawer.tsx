import * as React from 'react';
import { useWorkerStore } from '../store/worker.store';
import { useWorker } from '../hooks/useWorker';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { User, Wrench, Package, Clock, Loader2 } from 'lucide-react';

export function WorkerDetailsDrawer() {
  const store = useWorkerStore();
  const { data: worker, isLoading } = useWorker(store.selectedWorkerId);

  const [activeTab, setActiveTab] = React.useState('profile');

  if (!store.isDrawerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md lg:max-w-xl bg-zinc-950 border-l border-white/10 p-0 text-white overflow-hidden flex flex-col shadow-2xl">
      {isLoading || !worker ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-white/50">Loading worker details...</p>
        </div>
      ) : (
        <>
          {/* Header section with photo */}
          <div className="bg-zinc-900/50 p-6 border-b border-white/10 flex-shrink-0 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-bold text-2xl text-blue-400">
                {worker.firstName[0]}{worker.lastName[0]}
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {worker.firstName} {worker.lastName}
                </div>
                <p className="text-sm text-white/50">{worker.employeeCode} • {worker.department}</p>
                
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Grade {worker.grade}</Badge>
                  <Badge variant="outline" className="text-white/60 border-white/10">{worker.primarySkill}</Badge>
                  <Badge className={worker.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-none" : "bg-amber-500/10 text-amber-400 border-none"}>
                    {worker.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            <button onClick={() => store.setDrawerOpen(false)} className="text-white/40 hover:text-white p-2">✕</button>
          </div>

      {/* Tabs section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 border-b border-white/10 flex-shrink-0">
          <div className="flex bg-transparent h-12 w-full justify-start overflow-x-auto hide-scrollbar gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center px-3 h-12 text-sm font-medium border-b-2 gap-2 transition-colors cursor-pointer",
                activeTab === 'profile' ? "border-blue-500 text-white" : "border-transparent text-white/50 hover:text-white"
              )}
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={cn(
                "flex items-center px-3 h-12 text-sm font-medium border-b-2 gap-2 transition-colors cursor-pointer",
                activeTab === 'attendance' ? "border-blue-500 text-white" : "border-transparent text-white/50 hover:text-white"
              )}
            >
              <Clock className="w-4 h-4" /> Attendance
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={cn(
                "flex items-center px-3 h-12 text-sm font-medium border-b-2 gap-2 transition-colors cursor-pointer",
                activeTab === 'assignments' ? "border-blue-500 text-white" : "border-transparent text-white/50 hover:text-white"
              )}
            >
              <Wrench className="w-4 h-4" /> Assignment
            </button>
            <button
              onClick={() => setActiveTab('production')}
              className={cn(
                "flex items-center px-3 h-12 text-sm font-medium border-b-2 gap-2 transition-colors cursor-pointer",
                activeTab === 'production' ? "border-blue-500 text-white" : "border-transparent text-white/50 hover:text-white"
              )}
            >
              <Package className="w-4 h-4" /> Production
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-2 gap-4">
              <ProfileField label="Employee ID" value={worker.employeeCode} />
              <ProfileField label="NFC Card ID" value={worker.nfcCardId || "Not assigned"} />
              <ProfileField label="Department" value={worker.department} />
              <ProfileField label="Primary Skill" value={worker.primarySkill} />
              <ProfileField label="Joining Date" value={new Date(worker.joiningDate).toLocaleDateString()} />
              <ProfileField label="Shift" value={worker.shift} />
              <ProfileField label="Email" value={worker.email || "N/A"} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="text-white/50 text-sm text-center py-12">
              <Clock className="w-8 h-8 mx-auto mb-3 opacity-20" />
              Detailed attendance logs will appear here.
            </div>
          )}
          
          {activeTab === 'assignments' && (
            <div>
              {worker.currentAssignment ? (
                <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Current Assignment</h3>
                  <p className="text-white font-medium">Machine {worker.currentAssignment.machineId}</p>
                  <p className="text-white/50 text-sm mt-1">Operation: {worker.currentAssignment.operation}</p>
                  <p className="text-white/30 text-xs mt-3">Assigned at {new Date(worker.currentAssignment.assignedAt).toLocaleTimeString()}</p>
                </div>
              ) : (
                <div className="text-center py-12 text-white/50 text-sm">
                  <Wrench className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  No active machine assignment.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'production' && (
            <div className="text-white/50 text-sm text-center py-12">
              <Package className="w-8 h-8 mx-auto mb-3 opacity-20" />
              Daily production targets and completed pieces will appear here.
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg">
      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
