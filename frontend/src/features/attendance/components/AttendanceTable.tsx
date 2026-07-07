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
  History,
  ClipboardList,
  RefreshCw,
  Clock
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAttendanceStore } from "../store/attendance.store";
import { useAttendanceRecords } from "../hooks/useAttendanceData";
import type { AttendanceRecord } from "../types/attendance.types";
import { AttendanceStatusBadge, WorkerAvatarCell } from "./AttendanceUIHelpers";

const columnHelper = createColumnHelper<AttendanceRecord>();

export function AttendanceTable() {
  const { records, isLoading, isRefetching, refetch } = useAttendanceRecords();
  const store = useAttendanceStore();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const filtered = useMemo(() => records.filter((r) => {
    if (store.departmentFilter !== "all" && r.department !== store.departmentFilter) return false;
    if (store.shiftFilter !== "all" && r.shift !== store.shiftFilter) return false;
    if (store.statusFilter !== "all" && r.status !== store.statusFilter) return false;
    
    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase();
      if (
        !r.workerName.toLowerCase().includes(q) &&
        !r.employeeCode.toLowerCase().includes(q) &&
        !r.nfcCardId.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  }), [records, store.departmentFilter, store.shiftFilter, store.statusFilter, store.searchQuery]);

  const columns = useMemo(() => [
    columnHelper.accessor("workerName", {
      header: "Worker",
      cell: (info) => <WorkerAvatarCell name={info.getValue()} employeeCode={info.row.original.employeeCode} />,
    }),
    columnHelper.accessor("department", {
      header: "Department",
      cell: (info) => <span className="text-white/80 text-sm">{info.getValue()}</span>
    }),
    columnHelper.accessor("shift", {
      header: "Shift",
      cell: (info) => <span className="text-white/60 text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("checkIn", {
      header: "Check In",
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-white/20">-</span>;
        return <span className="font-mono text-white/80 text-xs">{new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
      }
    }),
    columnHelper.accessor("checkOut", {
      header: "Check Out",
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-white/20">-</span>;
        return <span className="font-mono text-white/80 text-xs">{new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>;
      }
    }),
    columnHelper.accessor("workingHours", {
      header: "Working Hrs",
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-white/20">-</span>;
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-white/90 text-sm">{val}h</span>
            {(info.row.original.overtimeHours ?? 0) > 0 && (
              <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-1 py-0.5 rounded">
                +{info.row.original.overtimeHours}h OT
              </span>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <AttendanceStatusBadge status={info.getValue()} isLate={info.row.original.isLate} />
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white flex items-center justify-center outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 w-40">
              <DropdownMenuItem
                className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  store.setSelectedWorker(r.workerId);
                }}
              >
                <Eye className="w-4 h-4 text-blue-400" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2">
                <Pencil className="w-4 h-4 text-amber-400" /> Edit Entry
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white/80 focus:text-white focus:bg-white/5 cursor-pointer gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Adjust Time
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
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-950 px-6 py-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">Attendance Records</h2>
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
                    onClick={() => store.setSelectedWorker(row.original.workerId)}
                    className={cn(
                      "border-white/5 cursor-pointer hover:bg-white/[0.025] transition-colors group",
                      store.selectedWorkerId === row.original.workerId &&
                        "bg-blue-500/[0.04] border-l-2 border-l-blue-500/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
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
                      <p>No records match your filters.</p>
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
