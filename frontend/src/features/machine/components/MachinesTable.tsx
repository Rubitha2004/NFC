import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Wrench,
  History,
  Users,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMachineStore } from "../store/machine.store";
import { useMachines } from "../hooks/useMachines";
import type { MachineData } from "../types/machine.types";
import {
  HealthBadge,
  HeartbeatCell,
  MachineAvatar,
} from "./MachineUIHelpers";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusChip } from "@/shared/components/ui/StatusChip";

const columnHelper = createColumnHelper<MachineData>();

export function MachinesTable() {
  const { data: machines = [], isLoading, error } = useMachines();
  const store = useMachineStore();

  const filtered = useMemo(() => machines.filter((m) => {
    if (store.departmentFilter !== "all" && m.department !== store.departmentFilter) return false;
    if (store.buildingFilter !== "all" && m.building !== store.buildingFilter) return false;
    if (store.floorFilter !== "all" && m.floor !== store.floorFilter) return false;
    if (store.productionLineFilter !== "all" && m.productionLine !== store.productionLineFilter) return false;
    if (store.typeFilter !== "all" && m.type !== store.typeFilter) return false;
    if (store.statusFilter !== "all" && m.status !== store.statusFilter) return false;
    if (store.healthFilter !== "all" && m.health !== store.healthFilter) return false;
    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase();
      if (!m.machineId.toLowerCase().includes(q) && !m.name.toLowerCase().includes(q) && !m.department.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [machines, store]);

  const columns = [
    columnHelper.display({
      id: "image",
      header: "Machine",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-3">
            <MachineAvatar machineId={m.machineId} type={m.type} />
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {m.name}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">{m.machineId}</p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("department", {
      header: "Department",
    }),

    columnHelper.accessor("type", {
      header: "Type",
    }),

    columnHelper.accessor("terminalName", {
      header: "Terminal",
      cell: (info) => info.getValue() ? (
        <span className="text-cyan-500 font-mono text-xs">{info.getValue()}</span>
      ) : (
        <span className="text-muted-foreground text-xs italic">No Terminal</span>
      ),
    }),

    columnHelper.display({
      id: "worker",
      header: "Worker",
      cell: ({ row }) => {
        const assignment = row.original.currentAssignment;
        if (!assignment) return <span className="text-muted-foreground text-xs italic">Unassigned</span>;
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[9px] font-bold text-primary">
              {assignment.workerName.charAt(0)}
            </div>
            <span className="text-foreground text-xs">{assignment.workerName}</span>
          </div>
        );
      },
    }),

    columnHelper.accessor("currentOperation", {
      header: "Operation",
      cell: (info) => info.getValue() ? (
        <span className="text-muted-foreground text-xs bg-muted rounded px-2 py-0.5">{info.getValue()}</span>
      ) : (
        <span className="text-muted-foreground text-xs italic">—</span>
      ),
    }),

    columnHelper.display({
      id: "bundle",
      header: "Bundle",
      cell: ({ row }) => {
        const bundle = row.original.currentBundle;
        if (!bundle) return <span className="text-muted-foreground text-xs italic">—</span>;
        return (
          <div>
            <p className="text-foreground font-mono text-xs">{bundle.bundleId}</p>
            <p className="text-muted-foreground text-[10px]">{bundle.style}</p>
          </div>
        );
      },
    }),

    columnHelper.accessor("health", {
      header: "Health",
      cell: (info) => <HealthBadge health={info.getValue()} score={info.row.original.healthScore} />,
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <StatusChip status={info.getValue()} />,
    }),

    columnHelper.accessor("lastHeartbeat", {
      header: "Heartbeat",
      cell: (info) => <HeartbeatCell timestamp={info.getValue()} />,
    }),

    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-muted-foreground text-xs">{m.machineId}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); store.setSelectedMachine(m.id); store.setDrawerTab("overview"); }}>
                <Eye className="w-4 h-4 text-blue-500 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Pencil className="w-4 h-4 text-amber-500 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); store.setSelectedMachine(m.id); store.setDrawerTab("maintenance"); }}>
                <Wrench className="w-4 h-4 text-orange-500 mr-2" /> Maintenance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); store.setSelectedMachine(m.id); store.setDrawerTab("timeline"); }}>
                <History className="w-4 h-4 text-cyan-500 mr-2" /> History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); store.setSelectedMachine(m.id); store.setDrawerTab("assignments"); }}>
                <Users className="w-4 h-4 text-purple-500 mr-2" /> Assignment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Loading machines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-destructive min-h-[400px]">
        <p>Failed to load machines.</p>
      </div>
    );
  }

  return (
    <DataTable 
      columns={columns as any} 
      data={filtered} 
      onRowClick={(row) => store.setSelectedMachine(row.id)}
      selectedRowId={store.selectedMachineId}
      className="border-0 border-t rounded-none shadow-none"
    />
  );
}
