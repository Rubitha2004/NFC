import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreHorizontal, Eye, Link2, GitBranch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBundleStore } from "../store/bundle.store";
import { useBundles } from "../hooks/useBundles";
import type { Bundle } from "../types/bundle.types";
import { BundleStatusBadge, BundleProgressBar } from "./BundleUIHelpers";
import { Loader2 } from "lucide-react";

const columnHelper = createColumnHelper<Bundle>();

export function BundleTable() {
  const { data: bundles = [], isLoading, error } = useBundles();
  const store = useBundleStore();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const filteredBundles = useMemo(() => {
    return bundles.filter((b) => {
      if (store.poFilter !== "all" && b.productionOrder !== store.poFilter) return false;
      if (store.operationFilter !== "all" && b.operation !== store.operationFilter) return false;
      if (store.departmentFilter !== "all" && b.department !== store.departmentFilter) return false;
      if (store.statusFilter !== "all" && b.status !== store.statusFilter) return false;
      
      if (store.searchQuery) {
        const q = store.searchQuery.toLowerCase();
        return b.bundleNumber.toLowerCase().includes(q) || b.productionOrder.toLowerCase().includes(q) || b.operation.toLowerCase().includes(q);
      }
      return true;
    });
  }, [bundles, store.searchQuery, store.poFilter, store.operationFilter, store.departmentFilter, store.statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor("bundleNumber", {
      header: "Bundle #",
      cell: (info) => <span className="font-mono text-white font-bold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("productionOrder", {
      header: "Order",
      cell: (info) => (
        <div className="flex items-center gap-1.5">
          <Link2 className="w-3 h-3 text-white/40" />
          <span className="text-blue-400 font-medium hover:underline cursor-pointer">{info.getValue()}</span>
        </div>
      )
    }),
    columnHelper.accessor("operation", {
      header: "Operation",
      cell: (info) => <span className="text-white/80">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "location",
      header: "Location",
      cell: (info) => {
        const o = info.row.original;
        if (o.status === "completed") return <span className="text-white/30 text-xs">Completed</span>;
        
        return (
          <div className="flex flex-col gap-0.5 text-xs">
            {o.currentMachine ? <span className="text-emerald-400 font-mono">{o.currentMachine}</span> : <span className="text-white/20">-</span>}
            {o.currentWorker ? <span className="text-white/70">{o.currentWorker}</span> : <span className="text-white/20">-</span>}
          </div>
        );
      }
    }),
    columnHelper.display({
      id: "progress",
      header: "Progress",
      cell: (info) => {
        const o = info.row.original;
        return (
          <div className="w-32 xl:w-40">
            <BundleProgressBar target={o.targetPieces} completed={o.completedPieces} defective={o.defectivePieces} />
          </div>
        );
      }
    }),
    columnHelper.accessor("startedTime", {
      header: "Started",
      cell: (info) => {
        const val = info.getValue();
        if (!val) return <span className="text-white/20">-</span>;
        return <span className="text-white/60 text-xs">{new Date(val).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>;
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <BundleStatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white outline-none flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-white/10 text-white">
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); store.setSelectedBundle(info.row.original.id); }}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                <GitBranch className="w-4 h-4 mr-2" /> Split Bundle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ], [store]);

  const table = useReactTable({
    data: filteredBundles,
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
        <p className="text-white/50">Loading bundles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 min-h-[400px]">
        <p className="text-red-400">Failed to load bundles</p>
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
                  onClick={() => store.setSelectedBundle(row.original.id)}
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
                  No bundles found matching your criteria.
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
          <span className="text-white font-medium">{table.getFilteredRowModel().rows.length}</span> bundles
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
