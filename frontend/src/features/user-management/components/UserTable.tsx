import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreVertical } from "lucide-react";
import { useUserStore } from "../store/user.store";
import { useUserRecords } from "../hooks/useUserData";
import type { AppUser } from "../types/user.types";
import { UserStatusBadge, UserRolePill } from "./UserUIHelpers";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const columnHelper = createColumnHelper<AppUser>();

export function UserTable() {
  const { users } = useUserRecords();
  const store = useUserStore();
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (store.departmentFilter !== "all" && u.department !== store.departmentFilter) return false;
      if (store.roleFilter !== "all" && u.role !== store.roleFilter) return false;
      if (store.statusFilter !== "all" && u.status !== store.statusFilter) return false;
      
      if (store.searchQuery) {
        const q = store.searchQuery.toLowerCase();
        return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.employeeId.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, store.searchQuery, store.departmentFilter, store.roleFilter, store.statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor("fullName", {
      header: "User",
      cell: (info) => {
        const u = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={u.profilePhoto} alt={u.fullName} className="w-8 h-8 rounded-full border border-white/10" />
            <div>
              <p className="text-sm font-bold text-white">{u.fullName}</p>
              <p className="text-xs text-white/40">{u.employeeId}</p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("email", {
      header: "Contact",
      cell: (info) => (
        <div>
          <p className="text-sm text-white/80">{info.getValue()}</p>
          {info.row.original.phone && <p className="text-xs text-white/40 font-mono">{info.row.original.phone}</p>}
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => <UserRolePill role={info.getValue()} />,
    }),
    columnHelper.accessor("department", {
      header: "Department",
      cell: (info) => <span className="text-white/70 text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <UserStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("lastLogin", {
      header: "Last Login",
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
        <div onClick={(e) => e.stopPropagation()}>
          <Popover>
            <PopoverTrigger className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white outline-none focus:outline-none">
              <MoreVertical className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 bg-zinc-900 border-white/10 p-1">
              <button 
                onClick={() => store.setSelectedUser(info.row.original.id)}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded"
              >
                View Details
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded">
                Edit User
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-white/10 rounded mt-1 border-t border-white/5">
                Reset Password
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-white/10 rounded">
                Lock Account
              </button>
            </PopoverContent>
          </Popover>
        </div>
      ),
    }),
  ], [store]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zinc-950">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
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
                  onClick={() => store.setSelectedUser(row.original.id)}
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
                  No users found matching your criteria.
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
          <span className="text-white font-medium">{table.getFilteredRowModel().rows.length}</span> users
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
