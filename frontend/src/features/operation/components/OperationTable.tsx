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
import { useOperationStore } from "../store/operation.store";
import type { Operation } from "../types/operation.types";
import { useOperations } from "../hooks/useOperations";
import { useDeleteOperation } from "../hooks/useDeleteOperation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const columnHelper = createColumnHelper<Operation>();

export function OperationTable() {
  const { setSelectedOperation, setDrawerOpen, setFormOpen } = useOperationStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();

  const { data: operations = [], isLoading, isRefetching, refetch } = useOperations();
  const deleteMutation = useDeleteOperation();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this operation?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    columnHelper.accessor("operationCode", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent">
          Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: info => <span className="font-mono font-medium text-purple-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Operation Name",
      cell: info => <span className="font-semibold text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("department", {
      header: "Department",
    }),
    columnHelper.accessor("smv", {
      header: "SMV (min)",
      cell: info => <Badge variant="secondary">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor("requiredGrade", {
      header: "Min Grade",
      cell: info => <span className="font-bold text-zinc-300">Grade {info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: info => {
        const status = info.getValue();
        return (
          <Badge variant="outline" className={cn(
            status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
          )}>
            {status.toUpperCase()}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (props) => {
        const op = props.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuItem onClick={() => { setSelectedOperation(op); setDrawerOpen(true); }} className="hover:bg-zinc-800 cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedOperation(op); setFormOpen(true); }} className="hover:bg-zinc-800 cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(op.id!)} className="text-red-500 hover:bg-red-500/10 hover:text-red-500 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    })
  ];

  const table = useReactTable({
    data: operations,
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
            placeholder="Search operations..."
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
                    setSelectedOperation(row.original);
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
                  No operations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
