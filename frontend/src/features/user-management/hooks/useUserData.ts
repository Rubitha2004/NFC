import { useMemo } from "react";
import { useWorkers } from "../../worker/hooks/useWorkers";
import type { AppUser, UserRole, UserStatus, Permission } from "../types/user.types";

const DEFAULT_PERMS: Record<UserRole, Permission[]> = {
  "Administrator": [
    { module: "Dashboard", create: true, read: true, update: true, delete: true },
    { module: "Users", create: true, read: true, update: true, delete: true },
    { module: "Production", create: true, read: true, update: true, delete: true },
    { module: "QC", create: true, read: true, update: true, delete: true },
  ],
  "Production Manager": [
    { module: "Dashboard", create: true, read: true, update: true, delete: false },
    { module: "Production", create: true, read: true, update: true, delete: false },
    { module: "QC", create: false, read: true, update: false, delete: false },
  ],
  "Supervisor": [
    { module: "Dashboard", create: false, read: true, update: false, delete: false },
    { module: "Production", create: true, read: true, update: true, delete: false },
  ],
  "Quality Inspector": [
    { module: "Dashboard", create: false, read: true, update: false, delete: false },
    { module: "QC", create: true, read: true, update: true, delete: false },
  ],
  "Machine Operator": [
    { module: "Production", create: false, read: true, update: true, delete: false },
  ],
  "HR": [
    { module: "Users", create: true, read: true, update: true, delete: false },
    { module: "Attendance", create: true, read: true, update: true, delete: false },
  ],
  "Viewer": [
    { module: "Dashboard", create: false, read: true, update: false, delete: false },
  ]
};

const ROLES: UserRole[] = ["Administrator", "Production Manager", "Supervisor", "HR", "Quality Inspector", "Machine Operator", "Viewer"];
const STATUSES: UserStatus[] = ["Active", "Inactive", "Locked"];
const DEPARTMENTS = ["Management", "Production", "Quality", "Human Resources", "Maintenance"];

export function useUserRecords() {
  const { data: rawWorkers, isLoading, error } = useWorkers();

  const addUser = (data: any) => {
    console.warn("addUser not implemented with live API yet.");
  };

  const users: AppUser[] = useMemo(() => {
    if (!rawWorkers) return [];
    return rawWorkers.map((worker: any) => {
      let role: UserRole = "Machine Operator";
      const deptName = worker.department?.name || "";
      if (deptName.toLowerCase().includes('quality')) role = "Quality Inspector";
      if (deptName.toLowerCase().includes('management')) role = "Production Manager";

      return {
        id: worker.id.toString(),
        employeeId: worker.employeeCode,
        fullName: `${worker.firstName} ${worker.lastName}`,
        username: `${worker.firstName.toLowerCase()}.${worker.lastName.toLowerCase()}`,
        email: `${worker.firstName.toLowerCase()}.${worker.lastName.toLowerCase()}@smartfactory.local`,
        phone: worker.phone || `+1-555-0100`,
        department: deptName || "Production",
        role,
        status: (worker.status === 'ACTIVE' ? 'Active' : 'Inactive') as UserStatus,
        profilePhoto: `https://i.pravatar.cc/150?u=${worker.id}`,
        createdDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        permissions: DEFAULT_PERMS[role] || DEFAULT_PERMS["Viewer"],
        activityLog: []
      };
    });
  }, [rawWorkers]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === "Active").length;
    const inactive = users.filter(u => u.status === "Inactive").length;
    const locked = users.filter(u => u.status === "Locked").length;
    
    const admins = users.filter(u => u.role === "Administrator").length;
    const supervisors = users.filter(u => u.role === "Supervisor" || u.role === "Production Manager").length;
    const operators = users.filter(u => u.role === "Machine Operator").length;

    return { total, active, inactive, locked, admins, supervisors, operators };
  }, [users]);

  return {
    users,
    stats,
    addUser,
    ROLES,
    DEPARTMENTS,
    STATUSES,
  };
}
