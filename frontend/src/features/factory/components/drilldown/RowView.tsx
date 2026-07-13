import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, User, Settings2, Activity, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductionLine, Machine } from "../../types/factory.types";

interface RowViewProps {
  row: ProductionLine;
}

const columnHelper = createColumnHelper<Machine>();

export function RowView({ row }: RowViewProps) {
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const columns = useMemo(() => [
    columnHelper.accessor("machineNumber", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent text-white/70">
          Machine Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: info => <span className="font-mono text-emerald-400 font-medium">{info.getValue() as string}</span>,
    }),
    columnHelper.accessor("machineType", {
      header: "Type",
      cell: info => <span className="text-white">{info.getValue() as string}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: info => {
        const status = info.getValue() as string;
        return (
          <Badge variant="outline" className={
            status === 'running' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
            status === 'maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            status === 'idle' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
            'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
          }>
            <Activity className="w-3 h-3 mr-1" />
            {status.toUpperCase()}
          </Badge>
        );
      },
    }),
    columnHelper.accessor(row => row.worker?.name, {
      id: "operatorName",
      header: "Operator",
      cell: info => {
        const operator = info.getValue() as string | undefined;
        return operator ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User className="w-3 h-3 text-blue-400" />
            </div>
            <span className="text-white text-sm">{operator}</span>
          </div>
        ) : (
          <span className="text-white/30 text-sm italic">Unassigned</span>
        );
      },
    }),
    columnHelper.accessor(row => row.assignment?.operationName, {
      id: "operationName",
      header: "Operation",
      cell: info => {
        const op = info.getValue() as string | undefined;
        return op ? (
          <div className="flex items-center gap-2 text-white text-sm">
            <Settings2 className="w-3 h-3 text-zinc-400" />
            {op}
          </div>
        ) : (
          <span className="text-white/30 text-sm italic">No operation</span>
        );
      },
    }),
    columnHelper.accessor("networkStatus", {
      header: "Network",
      cell: info => {
        const net = info.getValue() as string;
        return (
          <div className="flex items-center gap-2 text-sm">
            <Cpu className={`w-3 h-3 ${net === 'online' ? 'text-emerald-500' : 'text-rose-500'}`} />
            <span className={net === 'online' ? 'text-emerald-500' : 'text-rose-500'}>
              {net === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: row.machines,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6 h-full overflow-y-auto w-full bg-zinc-950">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{row.lineName}</h2>
        <p className="text-white/50">Viewing {row.machines.length} machines in this row.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white/50 uppercase bg-zinc-900 border-b border-white/10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-white/50">
                  No machines found in this row.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
