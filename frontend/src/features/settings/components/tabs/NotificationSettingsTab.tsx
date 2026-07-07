import { Switch } from "@/components/ui/switch";

export function NotificationSettingsTab() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Notification Channels</h2>
        <p className="text-sm text-white/50 mt-1">Configure how and when the system dispatches alerts.</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Email Notifications</h3>
            <p className="text-xs text-white/40 mt-1">Receive daily summaries and critical alerts via email.</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">SMS Notifications</h3>
            <p className="text-xs text-white/40 mt-1">Receive urgent machine breakdown alerts via text message.</p>
          </div>
          <Switch />
        </div>

        <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Push Notifications</h3>
            <p className="text-xs text-white/40 mt-1">Enable browser-level push notifications for real-time events.</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">WebSocket Live Updates</h3>
            <p className="text-xs text-white/40 mt-1">Stream live UI updates for Dashboard and QC events.</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Event Subscriptions</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="att" defaultChecked className="w-4 h-4 rounded border-white/10 bg-zinc-900" />
            <label htmlFor="att" className="text-sm text-white/80 cursor-pointer">Attendance Alerts (Late arrivals, No-shows)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="mch" defaultChecked className="w-4 h-4 rounded border-white/10 bg-zinc-900" />
            <label htmlFor="mch" className="text-sm text-white/80 cursor-pointer">Machine Alerts (Downtime, Maintenance)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="qc" defaultChecked className="w-4 h-4 rounded border-white/10 bg-zinc-900" />
            <label htmlFor="qc" className="text-sm text-white/80 cursor-pointer">QC Alerts (High defect rates, Rework spikes)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
