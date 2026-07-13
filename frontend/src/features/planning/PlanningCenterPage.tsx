import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Play, ArrowRight, Package, Settings2, Layers, Cog, CheckCircle, Wand2, Users, Cpu, ShieldAlert, CheckSquare, Clock } from "lucide-react";
import { useProductionOrders } from "../production-order/hooks/useProductionOrderData";
import { useLivePlanningResources } from "./hooks/useLivePlanningResources";
import { useOperations } from "../operation/hooks/useOperations";
import { usePlanningMutations } from "./hooks/usePlanningMutations";
import { usePlanningDashboard, usePlanningHistory } from "./hooks/usePlanning";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "../production-order/components/ProductionOrderUIHelpers";
import type { OrderStatus } from "../production-order/types/production-order.types";
import { CapacityGauge } from "./components/CapacityGauge";
import { AllocationWizardModal } from "./components/AllocationWizardModal";
import { BundleTagsModal } from "./components/BundleTagsModal";

export default function PlanningCenterPage() {
  const { orders, isLoading: loadingOrders } = useProductionOrders();
  const { data: resources, isLoading: loadingResources } = useLivePlanningResources();
  const { data: operations = [], isLoading: loadingOps } = useOperations();
  const { publishPlan } = usePlanningMutations();
  const { data: metrics, isLoading: loadingMetrics } = usePlanningDashboard();
  const { data: historyData = [], isLoading: loadingHistory } = usePlanningHistory();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [bundlesCount, setBundlesCount] = useState<number>(1);
  const [selectedOperations, setSelectedOperations] = useState<Set<number>>(new Set());
  const [assignments, setAssignments] = useState<Record<number, { workerIds: number[], machineIds: number[] }>>({});
  
  // Drawer state
  const [activeOperationId, setActiveOperationId] = useState<number | null>(null);

  // Tags Modal state
  const [generatedBundles, setGeneratedBundles] = useState<{ quantity: number }[] | null>(null);
  const [publishedOrderNumber, setPublishedOrderNumber] = useState<string>("");

  const pendingOrders = useMemo(() => {
    const targetStatus: OrderStatus = "planned";
    return orders.filter(o => o.status === targetStatus);
  }, [orders]);

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setAssignments({});
    setBundlesCount(1);
    setSelectedOperations(new Set());
    setActiveOperationId(null);
  };

  const handleToggleOperation = (opId: number) => {
    setSelectedOperations(prev => {
      const next = new Set(prev);
      if (next.has(opId)) next.delete(opId);
      else next.add(opId);
      return next;
    });
  };

  const handleToggleWorker = (opId: number, workerId: number) => {
    setAssignments(prev => {
      const current = prev[opId] || { workerIds: [], machineIds: [] };
      const exists = current.workerIds.includes(workerId);
      return {
        ...prev,
        [opId]: {
          ...current,
          workerIds: exists ? current.workerIds.filter(id => id !== workerId) : [...current.workerIds, workerId]
        }
      };
    });
  };

  const handleToggleMachine = (opId: number, machineId: number) => {
    setAssignments(prev => {
      const current = prev[opId] || { workerIds: [], machineIds: [] };
      const exists = current.machineIds.includes(machineId);
      return {
        ...prev,
        [opId]: {
          ...current,
          machineIds: exists ? current.machineIds.filter(id => id !== machineId) : [...current.machineIds, machineId]
        }
      };
    });
  };

  const handleAutoPlan = () => {
    if (!selectedOrder || !resources) return;
    
    const newAssignments: Record<number, { workerIds: number[], machineIds: number[] }> = {};
    
    // Sort workers by grade priority (highest first) and try to stick to primary department
    const sortedWorkers = [...resources.workers].sort((a, b) => (b.grade?.priority || 0) - (a.grade?.priority || 0));
    const availableWorkers = sortedWorkers.filter(w => (w.assignments?.length || 0) === 0);
    const availableMachines = resources.machines.filter((m: any) => (m.assignments?.length || 0) === 0);

    let machineIndex = 0;

    const activeOps = operations.filter(op => selectedOperations.has(Number(op.id)));

    activeOps.forEach(op => {
      const requiredMinutes = Math.ceil(selectedOrder.targetQuantity * (op as any).smv);
      const requiredWorkers = Math.ceil(requiredMinutes / 480); // Assuming 8 hr shift
      
      const wIds: number[] = [];
      const mIds: number[] = [];
      
      // Filter available workers by required skill if applicable
      const reqSkillId = (op as any).requiredSkillId;
      const qualifiedWorkers = reqSkillId 
        ? availableWorkers.filter(w => (w as any).skills?.some((s: any) => s.skillId === reqSkillId))
        : availableWorkers;

      for(let i=0; i<requiredWorkers; i++) {
        // We find the next available qualified worker
        const nextWorker = qualifiedWorkers.find(w => !wIds.includes(w.id));
        if(nextWorker) wIds.push(nextWorker.id);
        
        if(machineIndex < availableMachines.length) mIds.push(availableMachines[machineIndex++].id);
      }
      
      if (op.id) newAssignments[Number(op.id)] = { workerIds: wIds, machineIds: mIds };
    });

    setAssignments(newAssignments);
  };

  const handlePublish = () => {
    if (!selectedOrder) return;

    const bundles: { quantity: number }[] = [];
    const qtyPerBundle = Math.floor(selectedOrder.targetQuantity / bundlesCount);
    let remainingQty = selectedOrder.targetQuantity;

    for (let i = 0; i < bundlesCount; i++) {
      const q = (i === bundlesCount - 1) ? remainingQty : qtyPerBundle;
      bundles.push({ quantity: q });
      remainingQty -= q;
    }

    const assignmentArray: any[] = [];
    Object.entries(assignments).forEach(([opIdStr, alloc]) => {
      const opId = Number(opIdStr);
      const count = Math.min(alloc?.workerIds?.length || 0, alloc?.machineIds?.length || 0);
      for(let i = 0; i < count; i++) {
        assignmentArray.push({
          operationId: opId,
          workerId: alloc.workerIds[i],
          machineId: alloc.machineIds[i]
        });
      }
    });

    if (selectedOperations.size === 0) {
      alert("Please define the Operation Routing (Step 1) before publishing.");
      return;
    }

    publishPlan.mutate({
      productionOrderId: Number(selectedOrder.id),
      bundles,
      assignments: assignmentArray,
      operations: Array.from(selectedOperations)
    }, {
      onSuccess: () => {
        setPublishedOrderNumber(selectedOrder.orderNumber);
        setGeneratedBundles(bundles);
        setSelectedOrderId(null);
        toast.success("Plan published and tags assigned successfully.");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || err.message || "Failed to publish plan");
      }
    });
  };

  const isLoading = loadingOrders || loadingResources || loadingOps || loadingMetrics || loadingHistory;
  const isPublishing = publishPlan.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const activeOp = activeOperationId ? operations.find(o => Number(o.id) === activeOperationId) : null;
  const activeOpReqMinutes = activeOp && selectedOrder ? Math.ceil(selectedOrder.targetQuantity * (activeOp as any).smv) : 0;

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-hidden relative">
      
      {/* Dashboard Section */}
      {metrics && (
        <div className="flex-shrink-0 p-4 border-b border-white/10 bg-zinc-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Orders */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Orders</h3>
                <Package className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{metrics.orders.active}</span>
                <span className="text-[10px] font-medium text-white/40 uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-white/50 pt-1 border-t border-white/5 mt-1">
                <span>Tot: {metrics.orders.total}</span>
                <span className="text-emerald-500">Done: {metrics.orders.completed}</span>
              </div>
            </motion.div>

            {/* Bundles */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Bundles</h3>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{metrics.bundles.active}</span>
                <span className="text-[10px] font-medium text-white/40 uppercase">Running</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-white/50 pt-1 border-t border-white/5 mt-1">
                <span className="text-amber-500 flex items-center"><Clock className="w-3 h-3 mr-1" /> Wait: {metrics.bundles.waiting}</span>
              </div>
            </motion.div>

            {/* Workers */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Workers</h3>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{metrics.workers.available}</span>
                <span className="text-[10px] font-medium text-white/40 uppercase">Avail</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-white/50 pt-1 border-t border-white/5 mt-1">
                <span>Tot: {metrics.workers.total}</span>
                <span className="text-amber-500">Busy: {metrics.workers.busy}</span>
              </div>
            </motion.div>

            {/* Machines */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">Machines</h3>
                <Cpu className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{metrics.machines.available}</span>
                <span className="text-[10px] font-medium text-white/40 uppercase">Avail</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-white/50 pt-1 border-t border-white/5 mt-1">
                <span>Tot: {metrics.machines.total}</span>
                <span className="text-amber-500">Busy: {metrics.machines.busy}</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
      
      {/* Bundle Tags Modal */}
      <BundleTagsModal 
        isOpen={generatedBundles !== null}
        onClose={() => setGeneratedBundles(null)}
        orderNumber={publishedOrderNumber}
        bundles={generatedBundles || []}
      />

      {/* Allocation Wizard Modal */}
      <AllocationWizardModal 
        isOpen={activeOperationId !== null}
        onClose={() => setActiveOperationId(null)}
        operationName={(activeOp as any)?.name || ""}
        availableWorkers={resources?.workers || []}
        availableMachines={resources?.machines || []}
        initialSelectedWorkerIds={activeOperationId ? (assignments[activeOperationId]?.workerIds || []) : []}
        initialSelectedMachineIds={activeOperationId ? (assignments[activeOperationId]?.machineIds || []) : []}
        onSave={(machineIds, workerIds) => {
          if (activeOperationId) {
            setAssignments(prev => ({
              ...prev,
              [activeOperationId]: {
                workerIds,
                machineIds
              }
            }));
            setActiveOperationId(null);
          }
        }}
      />

      {/* Left Sidebar: PO Queue */}
      <div className="w-80 border-r border-white/10 bg-zinc-900/30 flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-bold">Unplanned Orders</h2>
          <p className="text-xs text-white/50 mt-1">Select an order to start planning</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {pendingOrders.length === 0 ? (
            <div className="text-center p-6 text-white/40 text-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
              All caught up! No pending orders.
            </div>
          ) : (
            pendingOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => handleSelectOrder(order.id)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all",
                  selectedOrderId === order.id 
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-zinc-900 border-white/10 hover:border-white/30"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="text-sm font-medium mb-1 truncate">{order.customerName} - {order.styleNumber}</div>
                <div className="text-xs text-white/60 flex items-center justify-between">
                  <span>Qty: {order.targetQuantity}</span>
                  <span className="text-emerald-400 font-medium">Priority: {order.priority}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Canvas: Planning Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {selectedOrder ? (
          <>
            <div className="p-6 border-b border-white/10 flex-shrink-0 bg-zinc-900/50">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">{selectedOrder.orderNumber} - Smart Plan</h1>
                  <p className="text-sm text-white/60 mt-1">{selectedOrder.customerName} | {selectedOrder.styleNumber} | Dept: {selectedOrder.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleAutoPlan}
                    className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-4 py-2.5 rounded-lg font-semibold transition-all border border-blue-500/30"
                  >
                    <Wand2 className="w-4 h-4" /> Auto-Plan
                  </button>
                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all"
                  >
                    {isPublishing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Publish to IoT
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Step 1: Operation Routing & Allocation */}
              <section className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><CheckSquare className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-lg font-bold">1. Define Operation Routing & Allocate</h2>
                    <p className="text-xs text-white/50">Select operations and allocate workers & machines immediately</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {operations.map(op => {
                    const isSelected = selectedOperations.has(Number(op.id));
                    const alloc = assignments[Number(op.id)] || { workerIds: [], machineIds: [] };
                    const isMismatched = (alloc?.workerIds?.length || 0) !== (alloc?.machineIds?.length || 0);

                    return (
                      <div 
                        key={op.id}
                        onClick={() => {
                          handleToggleOperation(Number(op.id));
                          if (!isSelected) {
                             setActiveOperationId(Number(op.id));
                          } else if (isSelected) {
                             // If already selected, clicking again could either deselect or just open drawer?
                             // Let's keep toggle behavior, but if they want to allocate more, they can click a button.
                          }
                        }}
                        className={cn(
                          "p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 relative",
                          isSelected 
                            ? "bg-emerald-500/10 border-emerald-500/50" 
                            : "bg-zinc-950 border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center border shrink-0",
                            isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-white/20 bg-zinc-900"
                          )}>
                            {isSelected && <CheckSquare className="w-3 h-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn("text-sm font-medium truncate", isSelected ? "text-emerald-400" : "text-white/80")}>
                              {(op as any).name}
                            </div>
                            <div className="text-[10px] text-white/40 font-mono">{op.operationCode} | SMV: {(op as any).smv}</div>
                          </div>
                          {isSelected && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveOperationId(Number(op.id)); }}
                              className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/30 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        {isSelected && (
                          <div className="flex items-center justify-between border-t border-emerald-500/20 pt-2 mt-1">
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1 text-emerald-400/80">
                                <Users className="w-3 h-3" /> {alloc.workerIds.length}
                              </div>
                              <div className="flex items-center gap-1 text-blue-400/80">
                                <Cpu className="w-3 h-3" /> {alloc.machineIds.length}
                              </div>
                            </div>
                            {isMismatched && (
                              <ShieldAlert className="w-4 h-4 text-amber-500" title="Workers/Machines mismatch" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {operations.length === 0 && (
                    <div className="col-span-full text-center py-4 text-white/40 text-sm">
                      No operations available in the system.
                    </div>
                  )}
                </div>
                
                {selectedOperations.size === 0 && operations.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Please select at least one operation to define the routing plan.
                  </div>
                )}
              </section>

              {/* Step 2: Segregation */}
              <section className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg"><Layers className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-lg font-bold">2. Bundle Segregation</h2>
                    <p className="text-xs text-white/50">Split {selectedOrder.targetQuantity} items into trackable bundles</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex-1 max-w-sm">
                    <label className="text-sm text-white/70 block mb-2">Number of Bundles to Create</label>
                    <input 
                      type="number" 
                      min="1"
                      max={selectedOrder.targetQuantity}
                      value={bundlesCount}
                      onChange={(e) => setBundlesCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-sm text-blue-400 font-medium mb-1">Generated Bundles</div>
                        <div className="text-2xl font-bold">{bundlesCount}</div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-blue-500/50" />
                      <div>
                        <div className="text-sm text-blue-400 font-medium mb-1">Items per Bundle</div>
                        <div className="text-2xl font-bold">~{Math.floor(selectedOrder.targetQuantity / bundlesCount)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Planning History */}
              <section className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg"><Clock className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-lg font-bold">Planning & Assignment History</h2>
                    <p className="text-xs text-white/50">Tracking logs for {selectedOrder.orderNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {historyData.filter((h: any) => h.bundle?.productionOrderId === Number(selectedOrder.id)).length > 0 ? (
                    historyData
                      .filter((h: any) => h.bundle?.productionOrderId === Number(selectedOrder.id))
                      .slice(0, 5)
                      .map((log: any) => (
                        <div key={log.id} className="p-4 bg-zinc-950 border border-white/5 rounded-xl flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                                Tag: {log.tag?.tagCode || 'N/A'}
                              </span>
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                Bundle: {log.bundle?.bundleNumber}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40">{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="text-white/60">Operation:</span>
                            <span className="text-white font-medium">{log.operation?.name || log.operation?.operationName || 'Unknown'}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm mt-1 bg-white/5 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-emerald-500" />
                              <span className="text-white/80">{log.operator ? `${log.operator.firstName} ${log.operator.lastName}` : 'System Assigned'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-blue-500" />
                              <span className="text-white/80">Assigned Machine</span>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-xl">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No history found for this order. Assignments and tracking logs will appear here once published.
                    </div>
                  )}
                </div>
              </section>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Select an Order</h2>
            <p className="text-white/40 max-w-md">
              Choose a production order from the queue to start smart capacity planning.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
