import type { AuditLogEntry } from "../../types/settings.types";

const MOCK_LOGS: AuditLogEntry[] = [
  { id: "al_1", timestamp: "2026-07-04T09:12:33Z", user: "Admin (James Smith)", action: "Settings Updated", details: "Changed Session Timeout from 30 to 60 mins." },
  { id: "al_2", timestamp: "2026-07-04T08:45:11Z", user: "System", action: "Automated Backup", details: "Completed AWS S3 snapshot erp_dump_2026_07_04.sql" },
  { id: "al_3", timestamp: "2026-07-03T14:22:05Z", user: "HR (Linda Johnson)", action: "User Created", details: "Provisioned new account for EMP-2085 (Machine Operator)." },
  { id: "al_4", timestamp: "2026-07-03T11:05:42Z", user: "Admin (James Smith)", action: "Role Modified", details: "Assigned 'Supervisor' role to EMP-1044." },
  { id: "al_5", timestamp: "2026-07-02T16:55:00Z", user: "Integration Engine", action: "Hardware Sync", details: "IoT Gateway re-authenticated successfully." },
  { id: "al_6", timestamp: "2026-07-01T09:00:12Z", user: "Admin (James Smith)", action: "Settings Updated", details: "Enabled Strict Password Policy." },
];

export function AuditLogsTab() {
  return (
    <div className="max-w-5xl space-y-8 h-full flex flex-col pb-10">
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-white">System Audit Logs</h2>
        <p className="text-sm text-white/50 mt-1">Immutable ledger of administrative actions and system configuration changes.</p>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden flex-1 flex flex-col">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 border-b border-white/5 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Actor</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Event Action</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-4 text-xs font-mono text-white/50 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString(undefined, { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-blue-400 whitespace-nowrap">{log.user}</td>
                <td className="px-4 py-4 text-sm font-bold text-white whitespace-nowrap">{log.action}</td>
                <td className="px-4 py-4 text-sm text-white/70">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
