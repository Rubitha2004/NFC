import type { ProductionOrder } from "../../types/production-order.types";
import { Hash, Building2, PaintBucket, Maximize } from "lucide-react";
import { OrderStatusBadge, OrderPriorityBadge, ProgressBar } from "../ProductionOrderUIHelpers";

export function OrderOverview({ order }: { order: ProductionOrder }) {
  return (
    <div className="p-6 space-y-8">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Customer</span>
          </div>
          <p className="text-lg font-bold text-white">{order.customerName}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Hash className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Style Number</span>
          </div>
          <p className="text-lg font-bold text-white">{order.styleNumber}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <PaintBucket className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Color</span>
          </div>
          <p className="text-lg font-bold text-white">{order.color}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Maximize className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Sizes</span>
          </div>
          <p className="text-lg font-bold text-white">{order.size}</p>
        </div>
      </div>

      {/* Progress Section */}
      <div>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Production Progress</h3>
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-xl space-y-5">
          <ProgressBar target={order.targetQuantity} completed={order.completedQuantity} defective={order.defectiveQuantity} />
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase">Target</p>
              <p className="text-xl font-bold text-white">{order.targetQuantity?.toLocaleString() ?? '0'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400/70 uppercase">Completed</p>
              <p className="text-xl font-bold text-emerald-400">{order.completedQuantity?.toLocaleString() ?? '0'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-rose-400/70 uppercase">Defective</p>
              <p className="text-xl font-bold text-rose-400">{order.defectiveQuantity?.toLocaleString() ?? '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Order Meta</h3>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/5">
            <span className="text-sm text-white/50">Department</span>
            <span className="text-sm text-white font-medium">{order.department}</span>
          </div>
          <div className="flex justify-between items-center p-3 border-b border-white/5">
            <span className="text-sm text-white/50">Priority</span>
            <OrderPriorityBadge priority={order.priority} />
          </div>
          <div className="flex justify-between items-center p-3 border-b border-white/5">
            <span className="text-sm text-white/50">Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex justify-between items-center p-3 border-b border-white/5">
            <span className="text-sm text-white/50">Start Date</span>
            <span className="text-sm text-white font-medium">
              {order.startDate ? new Date(order.startDate).toLocaleDateString() : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 border-b border-white/5">
            <span className="text-sm text-white/50">Due Date</span>
            <span className="text-sm text-white font-medium">
              {order.dueDate ? new Date(order.dueDate).toLocaleDateString() : '-'}
            </span>
          </div>
          {order.remarks && (
            <div className="p-3">
              <span className="text-sm text-white/50 block mb-1">Remarks</span>
              <p className="text-sm text-white/80 bg-black/20 p-2 rounded">{order.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
