import { useMemo } from "react";
import { useQCs } from "./useQCs";

const DEPARTMENTS = ["Stitching", "Finishing", "Packing"];
const OPERATIONS = ["Collar Stitching", "Side Seam", "Hemming", "Button Attach"];
const WORKERS = ["W-1042 (John Doe)", "W-1043 (Jane Smith)", "W-1044 (Alice Fox)"];
const MACHINES = ["MCH-1001", "MCH-1002", "MCH-2001"];
const POS = ["PO-2026001", "PO-2026002"];
const INSPECTORS = ["Insp-01 (Sarah)", "Insp-02 (Mike)"];
const BUNDLES = ["BND-10041", "BND-10042", "BND-10043"];

export function useQCRecords() {
  const { data: inspections = [], isLoading, error } = useQCs();

  const stats = useMemo(() => {
    const passed = inspections.filter(i => i.result === "Pass").length;
    const failed = inspections.filter(i => i.result === "Fail").length;
    const rework = inspections.filter(i => i.result === "Rework").length;
    const pending = inspections.filter(i => i.result === "Pending").length;
    const total = passed + failed + rework;

    const passPercentage = total > 0 ? (passed / total) * 100 : 0;

    return { passed, failed, rework, pending, passPercentage: passPercentage.toFixed(1) };
  }, [inspections]);

  // addInspection mock function to keep UI components from crashing if they use it
  const addInspection = () => {
    console.warn("addInspection is not implemented with live API yet.");
  };

  return { 
    inspections, 
    stats, 
    addInspection, 
    isLoading, 
    error,
    DEPARTMENTS,
    OPERATIONS,
    WORKERS,
    MACHINES,
    POS,
    INSPECTORS,
    BUNDLES,
  };
}
