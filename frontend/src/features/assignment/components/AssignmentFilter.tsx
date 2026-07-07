import { Search, RotateCcw } from "lucide-react";
import { useAssignmentStore } from "../store/assignment.store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEPARTMENTS = ["Stitching", "Cutting", "Finishing", "Packing", "Embroidery"];
const SHIFTS = ["Morning", "Evening", "Night"];
const STATUSES = ["active", "pending", "completed", "cancelled"];

function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function AssignmentFilter() {
  const store = useAssignmentStore();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-zinc-950 flex-shrink-0 flex-wrap">
      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search assignment ID, worker, or machine..."
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder:text-white/30 h-10"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={store.departmentFilter} onValueChange={sv(store.setDepartmentFilter)}>
          <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={store.shiftFilter} onValueChange={sv(store.setShiftFilter)}>
          <SelectTrigger className="w-[120px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            {SHIFTS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={store.statusFilter} onValueChange={sv(store.setStatusFilter)}>
          <SelectTrigger className="w-[130px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={store.resetFilters}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors h-10 rounded-md hover:bg-white/5 whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
