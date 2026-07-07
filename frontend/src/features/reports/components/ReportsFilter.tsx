import { RotateCcw, Calendar, Users, Settings, LayoutGrid, Clock } from "lucide-react";
import { useReportsStore } from "../store/reports.store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function ReportsFilter() {
  const store = useReportsStore();

  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.05] bg-zinc-900/30 flex-wrap">
      
      <div className="flex items-center gap-2 border-r border-white/10 pr-3">
        <Calendar className="w-4 h-4 text-white/40" />
        <Select value={store.dateFilter} onValueChange={sv(store.setDateFilter)}>
          <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10 h-8 text-xs">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="last_week">Last Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border-r border-white/10 pr-3">
        <LayoutGrid className="w-4 h-4 text-white/40" />
        <Select value={store.departmentFilter} onValueChange={sv(store.setDepartmentFilter)}>
          <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10 h-8 text-xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            <SelectItem value="cutting">Cutting</SelectItem>
            <SelectItem value="stitching">Stitching</SelectItem>
            <SelectItem value="finishing">Finishing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border-r border-white/10 pr-3">
        <Clock className="w-4 h-4 text-white/40" />
        <Select value={store.shiftFilter} onValueChange={sv(store.setShiftFilter)}>
          <SelectTrigger className="w-[110px] bg-zinc-950/50 border-white/10 h-8 text-xs">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border-r border-white/10 pr-3">
        <Users className="w-4 h-4 text-white/40" />
        <Select value={store.workerFilter} onValueChange={sv(store.setWorkerFilter)}>
          <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10 h-8 text-xs">
            <SelectValue placeholder="Worker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workers</SelectItem>
            <SelectItem value="w1">W-1042 (John)</SelectItem>
            <SelectItem value="w2">W-1043 (Jane)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border-r border-white/10 pr-3">
        <Settings className="w-4 h-4 text-white/40" />
        <Select value={store.machineFilter} onValueChange={sv(store.setMachineFilter)}>
          <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10 h-8 text-xs">
            <SelectValue placeholder="Machine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Machines</SelectItem>
            <SelectItem value="m1">MCH-1001</SelectItem>
            <SelectItem value="m2">MCH-1002</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        onClick={store.resetFilters}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors rounded hover:bg-white/5 ml-auto"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>

    </div>
  );
}
