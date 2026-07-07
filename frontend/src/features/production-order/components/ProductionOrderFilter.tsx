import { Search, RotateCcw } from "lucide-react";
import { useProductionOrderStore } from "../store/production-order.store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductionOrders } from "../hooks/useProductionOrderData";

function sv(setter: (v: string) => void) {
  return (v: string | null) => setter(v ?? "");
}

export function ProductionOrderFilter() {
  const store = useProductionOrderStore();
  const { orders } = useProductionOrders();

  const CUSTOMERS = Array.from(new Set(orders.map(o => o.customerName))).filter(Boolean);
  const DEPARTMENTS = Array.from(new Set(orders.map(o => o.department))).filter(Boolean);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-zinc-950 flex-shrink-0 flex-wrap">
      {/* Search */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search order or style..."
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder:text-white/30 h-10"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={store.customerFilter} onValueChange={sv(store.setCustomerFilter)}>
          <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <SelectValue placeholder="Customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {CUSTOMERS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

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

        <Select value={store.statusFilter} onValueChange={sv(store.setStatusFilter)}>
          <SelectTrigger className="w-[130px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={store.priorityFilter} onValueChange={sv(store.setPriorityFilter)}>
          <SelectTrigger className="w-[120px] bg-zinc-900/50 border-white/10 h-10 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
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
