import { ROUTES } from "./constants";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "live-factory": "Live Factory",
  departments: "Departments",
  workers: "Workers",
  machines: "Machines",
  "machine-types": "Machine Types",
  terminals: "Terminals",
  operations: "Operations",
  shifts: "Shifts",
  assignments: "Assignments",
  attendance: "Attendance",
  "production-orders": "Production Orders",
  bundles: "Bundles",
  qc: "QC Inspection",
  reports: "Reports",
  settings: "Settings",
  login: "Login",
  new: "New",
  edit: "Edit",
  details: "Details",
};

export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] ?? segment;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label,
      path: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
};

export { ROUTES };
