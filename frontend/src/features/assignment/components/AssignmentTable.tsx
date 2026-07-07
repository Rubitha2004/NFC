import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowRightLeft,
  History,
  ClipboardList,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAssignmentStore } from "../store/assignment.store";
import { useAssignmentsData } from "../hooks/useAssignmentsData";
import type { AssignmentData } from "../types/assignment.types";
import { AssignmentStatusBadge, AssignmentPriorityBadge, WorkerAvatarCell } from "./AssignmentUIHelpers";

import { useDeleteAssignment } from "../hooks/useDeleteAssignment";

const columnHelper = createColumnHelper<AssignmentData>();

export function AssignmentTable() {
  const { assignments, isLoading, isRefetching, refetch } = useAssignmentsData();
  const store = useAssignmentStore();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const filtered = useMemo(() => assignments.filter((a) => {
    if (store.departmentFilter !== "all" && a.department !== store.departmentFilter) return false;
    if (store.shiftFilter !== "all" && a.shift !== store.shiftFilter) return false;
    if (store.statusFilter !== "all" && a.status !== store.statusFilter) return false;
    
    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase();
      if (
        !a.assignmentId.toLowerCase().includes(q) &&
        !a.worker.name.toLowerCase().includes(q) &&
        !a.worker.employeeCode.toLowerCase().includes(q) &&
        !a.machine.machineId.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  }), [assignments, store.departmentFilter, store.shiftFilter, store.statusFilter, store.searchQuery]);

  const deleteMutation = useDeleteAssignment();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to release this assignment?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor("assignmentId", {
      header: "ID",
      cell: (info) => <span className="font-mono text-white/70 text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("worker", {
      header: "Worker",
      cell: (info) => <WorkerAvatarCell name={info.getValue().name} employeeCode={info.getValue().employeeCode} />,
    }),
    columnHelper.accessor("machine", {
      header: "Machine",
      cell: (info) => (
        <div>
          <p className="text-white/90 text-sm">{info.getValue().name}</p>
          <p className="text-white/40 text-[10px] font-mono">{info.getValue().machineId}</p>
        </div>
      ),
    }),
    columnHelper.accessor("operation", {
      header: "Operation",
      cell: (info) => <span className="text-white/80 text-sm">{info.getValue()}</span>
    }),
    columnHelper.accessor("production", {
      header: "Order / Bundle",
      cell: (info) => (
        <div>
          <p className="text-white/80 font-mono text-xs">{info.getValue().orderId}</p>
          <p className="text-white/40 text-[10px]">{info.getValue().bundleId}</p>
        </div>
      ),
    }),
    columnHelper.accessor("shift", {
      header: "Shift",
      cell: (info) => <span className="text-white/60 text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => <AssignmentPriorityBadge priority={info.getValue()} />
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <AssignmentStatusBadge status={info.getValue()} />
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const a = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white flex items-center justify-center outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 w-48">
              <DropdownMenuLabel className="text-white/50 text-xs font-mono">{a.assignmentId}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              
              <DropdownMenuItem
                className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  store.setSelectedAssignment(a.id);
                }}
              >
                <Eye className="w-4 h-4 text-blue-400" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2">
                <Pencil className="w-4 h-4 text-amber-400" /> Edit Assignment
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2" onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Release Assignment
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" /> Transfer Worker
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2">
                <History className="w-4 h-4 text-cyan-400" /> Assignment History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ], [store]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-950 px-6 py-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">Assignment Board</h2>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", isRefetching && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/40 flex-1 overflow-hidden flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-950/50 flex items-center justify-center z-20">
            <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        )}
        <div className="flex-1 overflow-auto relative">
          <Table>
            <TableHeader className="bg-zinc-950/80 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-white/10 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white/40 text-[11px] font-bold h-10 tracking-widest uppercase cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" && <ChevronUp className="w-3 h-3" />}
                        {header.column.getIsSorted() === "desc" && <ChevronDown className="w-3 h-3" />}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => store.setSelectedAssignment(row.original.id)}
                    className={cn(
                      "border-white/5 cursor-pointer hover:bg-white/[0.025] transition-colors group",
                      store.selectedAssignmentId === row.original.id &&
                        "bg-blue-500/[0.04] border-l-2 border-l-blue-500/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-white/30">
                      <ClipboardList className="w-8 h-8 mb-2 opacity-40" />
                      <p>No assignments match your filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-zinc-950/60 flex-shrink-0">
          <div className="text-xs text-white/40">
            Showing <span className="text-white/70 font-semibold">{table.getRowModel().rows.length}</span> of <span className="text-white/70 font-semibold">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-md bg-zinc-900 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-md bg-zinc-900 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
