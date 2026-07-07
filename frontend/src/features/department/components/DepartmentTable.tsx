import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
  flexRender,
  type SortingState
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { useDepartmentStore } from '../store/department.store';
import { useDepartments } from '../hooks/useDepartments';
import { useDeleteDepartment } from '../hooks/useDeleteDepartment';
import type { Department } from '../types/department.types';
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Users, 
  Cog, 
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ── Skeleton Row ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + (i * 10) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Main Table ────────────────────────────────────────────────────────────────

export function DepartmentTable() {
  const store = useDepartmentStore();
  const [sorting, setSorting] = useState<SortingState>([]);

  const { departments, isLoading, isError, refetch, isFetching } = useDepartments();
  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  // Client-side filter (search / status / type)
  const filteredDepartments = useMemo(() => departments.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(store.searchQuery.toLowerCase()) || 
                        d.code.toLowerCase().includes(store.searchQuery.toLowerCase());
    const matchStatus = store.statusFilter === 'all' || d.status === store.statusFilter;
    return matchSearch && matchStatus;
  }), [departments, store.searchQuery, store.statusFilter]);

  const handleDelete = (dept: Department) => {
    if (!confirm(`Delete "${dept.name}"? This cannot be undone.`)) return;
    deleteDepartment(Number(dept.id));
  };

  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-white transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dept Code
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: ({ row }) => <span className="font-mono text-sm text-zinc-300">{row.original.code}</span>
    },
    {
      accessorKey: 'name',
      header: 'Department Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-white">{row.original.name}</div>
          <div className="text-xs text-white/50">{row.original.description || 'No description'}</div>
        </div>
      )
    },
    {
      accessorKey: 'workers',
      header: 'Resources',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs text-zinc-400">
          <div className="flex items-center gap-2"><Users className="w-3 h-3" /> {row.original.workers} Workers</div>
          <div className="flex items-center gap-2"><Cog className="w-3 h-3" /> {row.original.machines} Machines</div>
        </div>
      )
    },
    {
      accessorKey: 'productionLines',
      header: 'Tasks',
      cell: ({ row }) => (
        <span className="text-zinc-300 text-sm">{row.original.productionLines} tasks</span>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const styles = {
          active: 'bg-green-500/10 text-green-500 border-green-500/20',
          inactive: 'bg-red-500/10 text-red-500 border-red-500/20',
          maintenance: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-zinc-400 text-xs">
          {row.original.createdAt.toLocaleDateString()}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const dept = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70">
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-white/10 text-zinc-300">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                store.setSelectedDepartmentId(dept.id);
                store.setDetailsDrawerOpen(true);
              }} className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                <Eye className="w-4 h-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                <Users className="w-4 h-4 mr-2" /> View Workers
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                <Cog className="w-4 h-4 mr-2" /> View Machines
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                <BarChart3 className="w-4 h-4 mr-2" /> Department Report
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={() => handleDelete(dept)}
                disabled={isDeleting}
                className="cursor-pointer focus:bg-red-500/20 text-red-500 focus:text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data: filteredDepartments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: {
      pagination: { pageSize: 10 }
    }
  });

  // ── Error State ────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="bg-zinc-950 border border-white/10 rounded-xl p-12 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-white/70 mb-1 font-medium">Failed to load departments</p>
        <p className="text-white/40 text-sm mb-4">Check your connection and try again.</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-lg">
      {/* Refetch indicator */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 px-6 py-2 bg-blue-500/10 border-b border-blue-500/20">
          <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
          <span className="text-xs text-blue-400">Syncing data...</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white/50 uppercase bg-zinc-900/50 border-b border-white/10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-medium tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <motion.tbody 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="divide-y divide-white/5"
          >
            {/* Loading skeletons */}
            {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Data rows */}
            {!isLoading && table.getRowModel().rows.map(row => (
              <motion.tr 
                key={row.id}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                className="hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => {
                  store.setSelectedDepartmentId(row.original.id);
                  store.setDetailsDrawerOpen(true);
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap" onClick={(e) => {
                    if (cell.column.id === 'actions') e.stopPropagation();
                  }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}

            {/* Empty state */}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-white/30">
                    <Building2 className="w-10 h-10 opacity-20" />
                    <p className="font-medium">No departments found</p>
                    {store.searchQuery && (
                      <p className="text-xs">Try adjusting your search or filters</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-zinc-900/30">
        <span className="text-xs text-white/50">
          {isLoading ? 'Loading...' : `Showing ${table.getRowModel().rows.length} of ${filteredDepartments.length} results`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 text-white/70 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 text-white/70 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
