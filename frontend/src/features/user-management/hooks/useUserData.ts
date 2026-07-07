import { useMemo } from "react";
import { create } from "zustand";
import type { AppUser, UserRole, UserStatus, UserFormValues, Permission } from "../types/user.types";

function seeded(seed: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

const ROLES: UserRole[] = ["Administrator", "Production Manager", "Supervisor", "HR", "Quality Inspector", "Machine Operator", "Viewer"];
const STATUSES: UserStatus[] = ["Active", "Active", "Active", "Inactive", "Locked"];
const DEPARTMENTS = ["Management", "Production", "Quality", "Human Resources", "Maintenance"];

const FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"];

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

function generateMockUsers(count: number): AppUser[] {
  const now = new Date().getTime();
  
  return Array.from({ length: count }).map((_, i) => {
    const seed = i * 42;
    const fn = FIRST_NAMES[seeded(seed, FIRST_NAMES.length)];
    const ln = LAST_NAMES[seeded(seed + 1, LAST_NAMES.length)];
    const role = ROLES[seeded(seed + 2, ROLES.length)];
    const status = STATUSES[seeded(seed + 3, STATUSES.length)];
    
    let dept = DEPARTMENTS[1]; // default Production
    if (role === "Administrator") dept = "Management";
    if (role === "HR") dept = "Human Resources";
    if (role === "Quality Inspector") dept = "Quality";

    const createdTimeOffset = seeded(seed + 4, 300) * 86400000;
    const loginTimeOffset = seeded(seed + 5, 48) * 3600000;

    return {
      id: `usr_${i + 1}`,
      employeeId: `EMP-${1000 + i}`,
      fullName: `${fn} ${ln}`,
      username: `${fn.toLowerCase()}.${ln.toLowerCase()}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@smartfactory.local`,
      phone: `+1-555-01${seeded(seed + 6, 90) + 10}`,
      department: dept,
      role,
      status,
      
      profilePhoto: `https://i.pravatar.cc/150?u=${i + 100}`,
      
      createdDate: new Date(now - createdTimeOffset).toISOString(),
      lastLogin: new Date(now - loginTimeOffset).toISOString(),
      
      permissions: DEFAULT_PERMS[role] || DEFAULT_PERMS["Viewer"],
      activityLog: [
        { id: 'al1', timestamp: new Date(now - loginTimeOffset).toISOString(), action: "Logged In successfully" },
        { id: 'al2', timestamp: new Date(now - loginTimeOffset - 3600000).toISOString(), action: "Viewed Dashboard" }
      ]
    };
  });
}

interface UserDataStore {
  users: AppUser[];
  addUser: (data: UserFormValues) => void;
}

const useInternalUserStore = create<UserDataStore>((set) => ({
  users: generateMockUsers(85),
  addUser: (data) => set((state) => {
    const newUser: AppUser = {
      id: `usr_new_${Date.now()}`,
      employeeId: `EMP-${2000 + state.users.length}`,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      department: data.department,
      role: data.role,
      status: data.status,
      profilePhoto: `https://i.pravatar.cc/150?u=${Date.now()}`,
      createdDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      permissions: DEFAULT_PERMS[data.role] || DEFAULT_PERMS["Viewer"],
      activityLog: [
        { id: 'al1', timestamp: new Date().toISOString(), action: "Account created" }
      ]
    };
    return { users: [newUser, ...state.users] };
  })
}));

export function useUserRecords() {
  const { users, addUser } = useInternalUserStore();

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
