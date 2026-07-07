import { useMemo } from "react";
import { useProductionOrders as useProductionOrdersQuery } from "./useProductionOrdersHooks";

export function useProductionOrders() {
  const { data: orders = [], isLoading, refetch, isRefetching } = useProductionOrdersQuery();

  const stats = useMemo(() => {
    const total = orders.length;
    const running = orders.filter(o => o.status === "running").length;
    const completed = orders.filter(o => o.status === "completed").length;
    const pending = orders.filter(o => o.status === "draft" || o.status === "planned").length;
    const delayed = orders.filter(o => o.status === "delayed").length;
    
    // Sum of output from running/completed orders as a dummy for "Today's Output"
    const todaysOutput = orders
      .filter(o => o.status === "running")
      .reduce((acc, curr) => acc + Math.floor(curr.targetQuantity * 0.05), 0);

    return { total, running, completed, pending, delayed, todaysOutput };
  }, [orders]);

  return {
    orders,
    stats,
    isLoading,
    refetch,
    isRefetching
  };
}
