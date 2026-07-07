import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye } from "lucide-react";
import { useQCStore } from "../store/qc.store";
import { useQCs } from "../hooks/useQCs";
import type { QCInspection } from "../types/qc.types";
import { QCStatusBadge } from "./QCUIHelpers";
import { Loader2 } from "lucide-react";

const columnHelper = createColumnHelper<QCInspection>();

export function QCTable() {
  const { data: inspections = [], isLoading, error } = useQCs();
  const store = useQCStore();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const filteredInspections = useMemo(() => {
    return inspections.filter((i) => {
      if (store.bundleFilter !== "all" && i.bundleNumber !== store.bundleFilter) return false;
      if (store.poFilter !== "all" && i.productionOrder !== store.poFilter) return false;
      if (store.workerFilter !== "all" && i.worker !== store.workerFilter) return false;
      if (store.machineFilter !== "all" && i.machine !== store.machineFilter) return false;
      if (store.departmentFilter !== "all" && i.department !== store.departmentFilter) return false;
      
      if (store.searchQuery) {
        const q = store.searchQuery.toLowerCase();
        return i.inspectionId.toLowerCase().includes(q) || i.inspector.toLowerCase().includes(q) || i.bundleNumber.toLowerCase().includes(q);
      }
      return true;
    });
  }, [inspections, store.searchQuery, store.bundleFilter, store.poFilter, store.workerFilter, store.machineFilter, store.departmentFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor("inspectionId", {
      header: "Inspection ID",
      cell: (info) => <span className="font-mono text-white/70 text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("bundleNumber", {
      header: "Bundle",
      cell: (info) => <span className="font-bold text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("worker", {
      header: "Worker",
      cell: (info) => <span className="text-white/80 text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("machine", {
      header: "Machine",
      cell: (info) => <span className="text-emerald-400 font-mono text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("operation", {
      header: "Operation",
      cell: (info) => <span className="text-white/60">{info.getValue()}</span>,
    }),
    columnHelper.accessor("inspector", {
      header: "Inspector",
      cell: (info) => <span className="text-blue-400 text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("result", {
      header: "Result",
      cell: (info) => <QCStatusBadge result={info.getValue()} />,
    }),
    columnHelper.accessor("defectCount", {
      header: "Defects",
      cell: (info) => {
        const val = info.getValue();
        return (
          <span className={`font-bold ${val > 0 ? "text-rose-400" : "text-white/20"}`}>
            {val}
          </span>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => (
        <span className="text-white/50 text-xs font-mono">
          {new Date(info.getValue()).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <button
          onClick={(e) => { e.stopPropagation(); store.setSelectedInspection(info.row.original.id); }}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ], [store]);

  const table = useReactTable({
    data: filteredInspections,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-white/50">Loading QC inspections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[400px]">
        <p className="text-red-400">Failed to load QC inspections</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur-md border-b border-white/10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-white transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUp className="w-3 h-3" />,
                        desc: <ChevronDown className="w-3 h-3" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => store.setSelectedInspection(row.original.id)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-white/40">
                  No inspections found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.05] bg-zinc-950 flex-shrink-0">
        <div className="text-sm text-white/50">
          Showing <span className="text-white font-medium">{table.getRowModel().rows.length}</span> of{" "}
          <span className="text-white font-medium">{table.getFilteredRowModel().rows.length}</span> records
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
