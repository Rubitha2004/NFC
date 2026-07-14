import { useState, useEffect } from "react";
import { format } from "date-fns";
import { History, Table } from "lucide-react";
import api from "@/services/axios";

export function PlanningHistoryTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const { data } = await api.get('/planning/history');
        if (data && data.length > 0) {
          setHistory(data);
        } else {
          // Dummy data for presentation when no IoT scans exist yet
          const dummyData = [
            {
              id: 101,
              createdAt: new Date().toISOString(),
              bundle: { bundleNumber: 'BUN-2026-001', productionOrder: { orderNumber: 'PO-8821' } },
              operation: { operationName: 'Collar Stitching' },
              operator: { firstName: 'Sarah', lastName: 'Connor' },
              tag: { tagCode: 'RFID-A1X9' }
            },
            {
              id: 102,
              createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
              bundle: { bundleNumber: 'BUN-2026-002', productionOrder: { orderNumber: 'PO-8821' } },
              operation: { operationName: 'Sleeve Attachment' },
              operator: { firstName: 'John', lastName: 'Doe' },
              tag: { tagCode: 'RFID-B2Y4' }
            },
            {
              id: 103,
              createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              bundle: { bundleNumber: 'BUN-2026-003', productionOrder: { orderNumber: 'PO-8822' } },
              operation: { operationName: 'Hemming' },
              operator: { firstName: 'Jane', lastName: 'Smith' },
              tag: { tagCode: 'RFID-C3Z5' }
            },
            {
              id: 104,
              createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
              bundle: { bundleNumber: 'BUN-2026-004', productionOrder: { orderNumber: 'PO-8822' } },
              operation: { operationName: 'Quality Check' },
              operator: { firstName: 'Mike', lastName: 'Johnson' },
              tag: { tagCode: 'RFID-D4W6' }
            }
          ];
          setHistory(dummyData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return <div className="text-white/50 p-6 flex justify-center">Loading history...</div>;
  }

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-zinc-800/50 text-white/50 text-xs uppercase font-medium">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Bundle</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Operation</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3">Tag ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/30">No history found</td>
              </tr>
            ) : (
              history.map((h, i) => (
                <tr key={h.id || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{format(new Date(h.createdAt), "MMM d, HH:mm")}</td>
                  <td className="px-4 py-3 font-medium text-emerald-400">{h.bundle?.bundleNumber || "N/A"}</td>
                  <td className="px-4 py-3">{h.bundle?.productionOrder?.orderNumber || "N/A"}</td>
                  <td className="px-4 py-3">{h.operation?.operationName || "N/A"}</td>
                  <td className="px-4 py-3">
                    {h.operator ? `${h.operator.firstName} ${h.operator.lastName}` : "System"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/50">{h.tag?.tagCode || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
