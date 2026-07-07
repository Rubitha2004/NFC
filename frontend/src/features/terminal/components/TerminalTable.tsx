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
import { useTerminalStore } from "../store/terminal.store";
import type { Terminal } from "../types/terminal.types";
import { terminalService } from "../services/terminal.service";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const columnHelper = createColumnHelper<Terminal>();

export function TerminalTable() {
  const { setSelectedTerminal, setDrawerOpen, setFormOpen } = useTerminalStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();

  const { data: terminals = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['terminals'],
    queryFn: terminalService.getTerminals,
    refetchInterval: 15000, // Re-fetch every 15s to simulate live status
  });

  const deleteMutation = useMutation({
    mutationFn: terminalService.deleteTerminal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terminals"] });
      queryClient.invalidateQueries({ queryKey: ["terminalKPIs"] });
      toast.success("Terminal deleted successfully");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this terminal?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    columnHelper.accessor("terminalId", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent">
          Terminal ID <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: info => <span className="font-mono font-medium text-emerald-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Terminal Name",
      cell: info => <span className="font-semibold text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("machine", {
      header: "Machine",
    }),
    columnHelper.accessor("ipAddress", {
      header: "IP Address",
      cell: info => <span className="font-mono text-zinc-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor("lastHeartbeat", {
      header: "Last Heartbeat",
      cell: info => {
        const val = info.getValue();
        return val ? <span className="text-xs text-zinc-400">{formatDistanceToNow(new Date(val), { addSuffix: true })}</span> : "Never";
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: info => {
        const status = info.getValue();
        const isOnline = status === "online";
        const isLost = status === "heartbeat_lost";
        return (
          <div className="flex items-center gap-2">
            {isOnline && <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>}
            <Badge variant="outline" className={cn(
              isOnline ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
              isLost ? "bg-red-500/10 text-red-500 border-red-500/20" :
              status === "maintenance" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
              "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
            )}>
              {status.toUpperCase().replace("_", " ")}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (props) => {
        const type = props.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuItem onClick={() => { setSelectedTerminal(type); setDrawerOpen(true); }} className="hover:bg-zinc-800 cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedTerminal(type); setFormOpen(true); }} className="hover:bg-zinc-800 cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(type.id!)} className="text-red-500 hover:bg-red-500/10 hover:text-red-500 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    })
  ];

  const table = useReactTable({
    data: terminals,
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
            placeholder="Search terminals..."
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
                    setSelectedTerminal(row.original);
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
                  No terminals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
