import { Search, RotateCcw } from 'lucide-react';
import { useWorkerStore } from '../store/worker.store';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function WorkersFilter() {
  const store = useWorkerStore();

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 px-6 py-4 border-b border-white/[0.05] bg-zinc-950 flex-shrink-0">
      
      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search worker by name or code..."
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          className="pl-9 bg-zinc-900/50 border-white/10 text-white placeholder:text-white/30 h-10"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        
        <Select value={store.departmentFilter} onValueChange={(v) => store.setDepartmentFilter(v || 'all')}>
          <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/10 h-10">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Stitching">Stitching</SelectItem>
            <SelectItem value="Cutting">Cutting</SelectItem>
            <SelectItem value="Finishing">Finishing</SelectItem>
            <SelectItem value="Packing">Packing</SelectItem>
          </SelectContent>
        </Select>

        <Select value={store.gradeFilter} onValueChange={(v) => store.setGradeFilter(v || 'all')}>
          <SelectTrigger className="w-[120px] bg-zinc-900/50 border-white/10 h-10">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="A">Grade A</SelectItem>
            <SelectItem value="B">Grade B</SelectItem>
            <SelectItem value="C">Grade C</SelectItem>
            <SelectItem value="D">Grade D</SelectItem>
          </SelectContent>
        </Select>

        <Select value={store.statusFilter} onValueChange={(v) => store.setStatusFilter(v || 'all')}>
          <SelectTrigger className="w-[140px] bg-zinc-900/50 border-white/10 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={store.resetFilters}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors h-10 rounded-md hover:bg-white/5 whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
