import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, User, Factory, Shield, Clock, Package } from "lucide-react";
import { useNotificationStore } from "@/store/notification.store";
import { formatRelativeTime } from "@/shared/utils/date.utils";
import { cn } from "@/lib/utils";
import type { Notification } from "@/shared/types";
import { Button } from "@/components/ui/button";

const typeConfig: Record<Notification["type"], { icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  machine: { icon: Factory, color: "text-orange-500", bg: "bg-orange-500/10" },
  worker: { icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
  production: { icon: Package, color: "text-green-500", bg: "bg-green-500/10" },
  qc: { icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
  attendance: { icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  bundle: { icon: Package, color: "text-cyan-500", bg: "bg-cyan-500/10" },
};

const priorityBar: Record<Notification["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-emerald-500",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "relative flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-l-2",
        notification.isRead ? "border-transparent opacity-70" : "border-primary"
      )}
      onClick={() => markAsRead(notification.id)}
    >
      {/* Priority indicator */}
      <span className={cn("absolute right-3 top-3 w-1.5 h-1.5 rounded-full", priorityBar[notification.priority])} />

      {/* Icon */}
      <div className={cn("flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center", config.bg)}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", !notification.isRead && "text-foreground")}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.description}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-1">{formatRelativeTime(notification.timestamp)}</p>
      </div>

      {!notification.isRead && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      )}
    </motion.div>
  );
}

export function NotificationPanel() {
  const { notifications, isOpen, unreadCount, closePanel, markAllAsRead } = useNotificationStore();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={closePanel}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-14 right-4 z-50 w-80 max-h-[calc(100vh-5rem)] flex flex-col bg-background border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={markAllAsRead}>
                    <CheckCheck className="w-3 h-3" /> All read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closePanel}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/50">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <CheckCheck className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export function NotificationBell() {
  const { unreadCount, togglePanel } = useNotificationStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-lg relative"
      onClick={togglePanel}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </motion.span>
      )}
    </Button>
  );
}
