import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal, User, Loader2 } from 'lucide-react';

import { useWorkerStore } from '../store/worker.store';
import { useWorkers } from '../hooks/useWorkers';
import type { WorkerData } from '../types/worker.types';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/shared/components/ui/DataTable';

const columnHelper = createColumnHelper<WorkerData>();

export function WorkersTable() {
  const { data: workers = [], isLoading, error } = useWorkers();
  const store = useWorkerStore();

  // Apply filters
  const filteredWorkers = useMemo(() => workers.filter((w) => {
    if (store.departmentFilter !== 'all' && w.department !== store.departmentFilter) return false;
    if (store.gradeFilter !== 'all' && w.grade !== store.gradeFilter) return false;
    if (store.statusFilter !== 'all' && w.status !== store.statusFilter) return false;
    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase();
      if (!w.firstName.toLowerCase().includes(q) && 
          !w.lastName.toLowerCase().includes(q) &&
          !w.employeeCode.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  }), [
    workers,
    store.departmentFilter,
    store.gradeFilter,
    store.statusFilter,
    store.searchQuery
  ]);

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Worker',
      cell: (info) => {
        const worker = info.row.original;
        const initials = `${worker.firstName[0]}${worker.lastName[0]}`;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-white">{worker.firstName} {worker.lastName}</p>
              <p className="text-[10px] text-white/40">{worker.employeeCode}</p>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      cell: (info) => <span className="text-white/80">{info.getValue()}</span>
    }),
    columnHelper.accessor('grade', {
      header: 'Grade',
      cell: (info) => <Badge className="bg-white/10 text-white hover:bg-white/20 border-none shadow-none">{info.getValue()}</Badge>
    }),
    columnHelper.accessor('shift', {
      header: 'Shift',
      cell: (info) => <span className="text-white/70 text-xs">{info.getValue()}</span>
    }),
    columnHelper.display({
      id: 'assignment',
      header: 'Assignment',
      cell: ({ row }) => {
        const assignment = row.original.currentAssignment;
        if (!assignment) return <span className="text-white/30 italic text-xs">Unassigned</span>;
        return (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-mono text-xs">{assignment.machineId}</span>
          </div>
        );
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const val = info.getValue();
        if (val === 'active') return <Badge className="bg-emerald-500/10 text-emerald-400 border-none hover:bg-emerald-500/20 shadow-none">Active</Badge>;
        if (val === 'inactive') return <Badge className="bg-zinc-500/10 text-zinc-400 border-none hover:bg-zinc-500/20 shadow-none">Inactive</Badge>;
        return <Badge className="bg-amber-500/10 text-amber-400 border-none hover:bg-amber-500/20 shadow-none">On Leave</Badge>;
      }
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/50 hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )
    })
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-white/50">Loading workers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[400px]">
        <p className="text-red-400">Failed to load workers</p>
      </div>
    );
  }

  return (
    <DataTable 
      columns={columns as any}
      data={filteredWorkers}
      onRowClick={(row) => store.setSelectedWorker(row.id)}
      emptyIcon={<User className="w-8 h-8 opacity-40 mb-2" />}
      emptyMessage="No workers found."
    />
  );
}
