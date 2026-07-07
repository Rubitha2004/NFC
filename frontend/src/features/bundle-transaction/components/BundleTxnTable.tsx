import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Package, User } from "lucide-react";
import { useBundleTxnStore } from "../store/bundle-txn.store";
import { useBundleTxnRecords } from "../hooks/useBundleTxnData";
import type { BundleTxn } from "../types/bundle-txn.types";
import { TxnStatusBadge } from "./BundleTxnUIHelpers";
import { Input } from "@/components/ui/input";

const columnHelper = createColumnHelper<BundleTxn>();

export function BundleTxnTable() {
  const { transactions } = useBundleTxnRecords();
  const store = useBundleTxnStore();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const filteredTxns = useMemo(() => {
    if (!store.searchQuery) return transactions;
    const q = store.searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.transactionId.toLowerCase().includes(q) ||
      t.bundleNumber.toLowerCase().includes(q) ||
      t.worker.toLowerCase().includes(q)
    );
  }, [transactions, store.searchQuery]);

  const columns = useMemo(() => [
    columnHelper.accessor("transactionId", {
      header: "Txn ID",
      cell: (info) => <span className="font-mono text-white/70 text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("bundleNumber", {
      header: "Bundle",
      cell: (info) => (
        <div className="flex items-center gap-1.5">
          <Package className="w-3 h-3 text-blue-400" />
          <span className="font-bold text-white">{info.getValue()}</span>
        </div>
      )
    }),
    columnHelper.display({
      id: "machine_transfer",
      header: "Machine Routing",
      cell: (info) => {
        const o = info.row.original;
        if (!o.fromMachine && !o.toMachine) return <span className="text-white/20">-</span>;
        
        return (
          <div className="flex items-center gap-2 text-xs font-mono">
            {o.fromMachine ? <span className="text-white/50">{o.fromMachine}</span> : <span className="text-white/20">-</span>}
            {o.toMachine && (
              <>
                <span className="text-white/30">→</span>
                <span className="text-emerald-400">{o.toMachine}</span>
              </>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor("worker", {
      header: "Worker",
      cell: (info) => (
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-white/40" />
          <span className="text-white/80 text-sm">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("operation", {
      header: "Operation",
      cell: (info) => <span className="text-white/60">{info.getValue()}</span>,
    }),
    columnHelper.accessor("timestamp", {
      header: "Time",
      cell: (info) => (
        <span className="text-white/50 text-xs font-mono">
          {new Date(info.getValue()).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
          })}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <TxnStatusBadge status={info.getValue()} />,
    }),
  ], []);

  const table = useReactTable({
    data: filteredTxns,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950">
      
      {/* Table Toolbar */}
      <div className="px-6 py-3 border-b border-white/[0.05] bg-zinc-950 flex items-center justify-between flex-shrink-0">
        <Input 
          placeholder="Search Transaction ID, Bundle, or Worker..." 
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-zinc-900/50 border-white/10 text-white"
        />
      </div>

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
                  onClick={() => store.setSelectedTxn(row.original.id)}
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
                  No transactions found matching your criteria.
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
