import { create } from "zustand";
import type { Notification } from "@/shared/types";

// Demo notifications used until real WebSocket events arrive
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Machine Offline",
    description: "Machine M-042 went offline at Station 7",
    type: "machine",
    priority: "high",
    isRead: false,
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "2",
    title: "Worker Absent",
    description: "John Doe (EMP-1023) has not clocked in for Morning Shift",
    type: "worker",
    priority: "medium",
    isRead: false,
    timestamp: new Date(Date.now() - 22 * 60000),
  },
  {
    id: "3",
    title: "Production Target Completed",
    description: "Order #PO-2024-041 has reached 100% completion",
    type: "production",
    priority: "low",
    isRead: false,
    timestamp: new Date(Date.now() - 60 * 60000),
  },
  {
    id: "4",
    title: "QC Failed",
    description: "Bundle B-0089 rejected – 14 defective pieces in Operation: Stitching",
    type: "qc",
    priority: "high",
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
  },
  {
    id: "5",
    title: "Attendance Updated",
    description: "Worker Sarah Lee clocked out early from Shift A",
    type: "attendance",
    priority: "medium",
    isRead: true,
    timestamp: new Date(Date.now() - 3 * 60 * 60000),
  },
  {
    id: "6",
    title: "Bundle Completed",
    description: "Bundle B-0091 has been successfully completed and sent to QC",
    type: "bundle",
    priority: "low",
    isRead: true,
    timestamp: new Date(Date.now() - 5 * 60 * 60000),
  },
];

interface NotificationState {
  notifications: Notification[];
  isOpen: boolean;
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  togglePanel: () => void;
  closePanel: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  isOpen: false,
  unreadCount: DEMO_NOTIFICATIONS.filter((n) => !n.isRead).length,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.isRead).length };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),
}));
