import { Search, RotateCcw } from "lucide-react";
import { useUserStore } from "../store/user.store";
import { useUserRecords } from "../hooks/useUserData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function UserFilter() {
  const store = useUserStore();
  const { ROLES, DEPARTMENTS, STATUSES } = useUserRecords();

  const uniqueStatuses = Array.from(new Set(STATUSES));

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-zinc-950 flex-shrink-0 flex-wrap">
      
      {/* Search */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search Name, ID or Email..."
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder:text-white/30 h-10"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={store.departmentFilter} onValueChange={sv(store.setDepartmentFilter)}>
          <SelectTrigger className="w-[170px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <span className="text-white/40 mr-1">Department:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={store.roleFilter} onValueChange={sv(store.setRoleFilter)}>
          <SelectTrigger className="w-[150px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <span className="text-white/40 mr-1">Role:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={store.statusFilter} onValueChange={sv(store.setStatusFilter)}>
          <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <span className="text-white/40 mr-1">Status:</span>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {uniqueStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
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
