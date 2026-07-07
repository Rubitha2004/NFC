import { useState } from "react";
import { 
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  RefreshCw
} from "lucide-react";
import { useShiftStore } from "../store/shift.store";
import type { Shift } from "../types/shift.types";
import { useShifts } from "../hooks/useShifts";
import { useDeleteShift } from "../hooks/useDeleteShift";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const columnHelper = createColumnHelper<Shift>();

export function ShiftTable() {
  const { setSelectedShift, setDrawerOpen, setFormOpen } = useShiftStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();

  const { data: shifts = [], isLoading, isRefetching, refetch } = useShifts();
  const deleteMutation = useDeleteShift();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    columnHelper.accessor("shiftCode", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent">
          Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: info => <span className="font-mono font-medium text-emerald-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor("shiftName", {
      header: "Shift Name",
      cell: info => <span className="font-semibold text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => `${row.startTime} - ${row.endTime}`, {
      id: "schedule",
      header: "Schedule",
      cell: info => <span className="text-zinc-300 whitespace-nowrap">{info.getValue()}</span>,
    }),
    columnHelper.accessor("attendanceCount", {
      header: "Attendance",
      cell: info => {
        const row = info.row.original;
        const pct = Math.round((row.attendanceCount / (row.assignedWorkers || 1)) * 100);
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{row.attendanceCount}/{row.assignedWorkers}</span>
            <Badge variant="secondary" className="text-xs">{pct}%</Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor("productionCompleted", {
      header: "Production",
      cell: info => {
        const row = info.row.original;
        const pct = Math.round((row.productionCompleted / (row.productionTarget || 1)) * 100);
        return (
          <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-400">{row.productionCompleted}</span>
              <span className="text-zinc-500">{row.productionTarget}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all", pct >= 100 ? "bg-emerald-500" : pct > 50 ? "bg-amber-500" : "bg-red-500")}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: info => {
        const status = info.getValue();
        return (
          <Badge variant="outline" className={cn(
            status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
            status === "completed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
            "bg-amber-500/10 text-amber-500 border-amber-500/20"
          )}>
            {status.toUpperCase()}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (props) => {
        const shift = props.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuItem onClick={() => { setSelectedShift(shift); setDrawerOpen(true); }} className="hover:bg-zinc-800 cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedShift(shift); setFormOpen(true); }} className="hover:bg-zinc-800 cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(shift.id!)} className="text-red-500 hover:bg-red-500/10 hover:text-red-500 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    })
  ];

  const table = useReactTable({
    data: shifts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shifts..."
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            className="pl-9 bg-background border-border text-sm"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 hover:bg-zinc-800"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isRefetching && "animate-spin")} />
          Refresh
        </Button>
      </div>
      
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        )}
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedShift(row.original);
                    setDrawerOpen(true);
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} onClick={(e) => {
                      if (cell.column.id === 'actions') {
                        e.stopPropagation();
                      }
                    }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No shifts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
