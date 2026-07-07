"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBSOCKET_ROOMS = exports.WEBSOCKET_EVENTS = void 0;
exports.WEBSOCKET_EVENTS = {
    // Attendance
    ATTENDANCE_IN: 'attendance.in',
    ATTENDANCE_OUT: 'attendance.out',
    ATTENDANCE_UPDATED: 'attendance.updated',
    // Machine Assignment
    ASSIGNMENT_CREATED: 'assignment.created',
    ASSIGNMENT_UPDATED: 'assignment.updated',
    ASSIGNMENT_RELEASED: 'assignment.released',
    // Bundle
    BUNDLE_CREATED: 'bundle.created',
    BUNDLE_STARTED: 'bundle.started',
    BUNDLE_COMPLETED: 'bundle.completed',
    BUNDLE_TRANSFERRED: 'bundle.transferred',
    BUNDLE_UPDATED: 'bundle.updated',
    // QC
    QC_COMPLETED: 'qc.completed',
    QC_FAILED: 'qc.failed',
    QC_UPDATED: 'qc.updated',
    // Machine
    MACHINE_ONLINE: 'machine.online',
    MACHINE_OFFLINE: 'machine.offline',
    MACHINE_IDLE: 'machine.idle',
    MACHINE_RUNNING: 'machine.running',
    MACHINE_UPDATED: 'machine.updated',
    // Dashboard specific (if requested explicitly by UI)
    DASHBOARD_REFRESH: 'dashboard.refresh',
    DASHBOARD_OVERVIEW_UPDATED: 'dashboard.overview.updated',
    DASHBOARD_LIVEFLOOR_UPDATED: 'dashboard.livefloor.updated',
};
exports.WEBSOCKET_ROOMS = {
    FACTORY: 'factory' // All dashboards join this room
};
