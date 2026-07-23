import prisma from '../../../config/prisma';
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export interface DemoActivityLogEntry {
  id: string;
  timestamp: string;
  category: 'ATTENDANCE' | 'MACHINE' | 'BUNDLE' | 'SYSTEM';
  eventType: string;
  message: string;
  details?: any;
}

const inMemoryActivityLogs: DemoActivityLogEntry[] = [];
const MAX_LOGS = 100;

export class IotDemoService {
  /**
   * Helper to write timestamped activity logs
   */
  async writeActivity(
    category: 'ATTENDANCE' | 'MACHINE' | 'BUNDLE' | 'SYSTEM',
    eventType: string,
    message: string,
    details?: any
  ): Promise<DemoActivityLogEntry> {
    const entry: DemoActivityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      category,
      eventType,
      message,
      details,
    };

    inMemoryActivityLogs.unshift(entry);
    if (inMemoryActivityLogs.length > MAX_LOGS) {
      inMemoryActivityLogs.pop();
    }

    websocketService.publish('iot.demo.log', entry);
    return entry;
  }

  /**
   * Get recent simulation activity logs
   */
  async getActivityLogs(): Promise<DemoActivityLogEntry[]> {
    return inMemoryActivityLogs;
  }

  /**
   * Get Production Order Workflow Context
   * Loads production orders, tasks, assigned workers, assigned machines, and bundles.
   */
  async getOrderWorkflowContext(productionOrderId?: number) {
    const orders = await prisma.productionOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    if (!productionOrderId && orders.length > 0) {
      const inProgressOrder = orders.find(o => o.status === 'IN_PROGRESS');
      productionOrderId = inProgressOrder ? inProgressOrder.id : orders[0].id;
    }

    if (!productionOrderId) {
      return {
        orders: [],
        selectedOrder: null,
        tasks: [],
        activeAssignments: [],
        operations: [],
        assignedWorkers: [],
        assignedMachines: [],
        bundles: [],
      };
    }

    const selectedOrder = await prisma.productionOrder.findUnique({
      where: { id: productionOrderId },
      include: {
        bundles: { orderBy: { id: 'asc' } },
        productionTasks: {
          include: {
            operation: true,
            worker: { include: { department: true } },
            machine: { include: { department: true } },
            shift: true,
          },
          orderBy: { sequenceOrder: 'asc' },
        },
      },
    });

    if (!selectedOrder) {
      throw new Error('Production order not found');
    }

    // Extract unique operations
    const operationsMap = new Map();
    selectedOrder.productionTasks.forEach((t) => {
      if (t.operation && !operationsMap.has(t.operation.id)) {
        operationsMap.set(t.operation.id, t.operation);
      }
    });

    // Also fetch active assignments to guarantee worker/machine mapping alignment
    const activeAssignments = await prisma.assignment.findMany({
      where: { status: 'ACTIVE' },
      include: {
        worker: { include: { department: true } },
        machine: { include: { department: true } },
        operation: true,
        shift: true,
      }
    });

    return {
      orders,
      selectedOrder,
      tasks: selectedOrder.productionTasks,
      activeAssignments,
      operations: Array.from(operationsMap.values()),
      bundles: selectedOrder.bundles,
    };
  }

  /**
   * Toggle Worker Check-in / Check-out (Present ↔ Absent).
   * Realism rule: If worker checks OUT and has an active assigned machine,
   * automatically transition machine status to idle.
   */
  async toggleWorker(workerId: number) {
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: {
        assignments: { where: { status: 'ACTIVE' }, include: { machine: true, shift: true } },
      },
    });

    if (!worker) throw new Error('Worker not found');

    const latestAttendance = await prisma.attendance.findFirst({
      where: { workerId: worker.id },
      orderBy: { tapTime: 'desc' },
    });

    const isCurrentlyIn = latestAttendance?.attendanceType === 'IN';
    const nextAttendanceType = isCurrentlyIn ? 'OUT' : 'IN';

    const firstAssignment = await prisma.assignment.findFirst({
      where: { workerId: worker.id, status: 'ACTIVE' },
    });

    const firstTerminal = (await prisma.terminal.findFirst({ where: { status: 'ACTIVE' } })) || { id: 1 };
    const firstMachine = (await prisma.machine.findFirst({ where: { status: 'ACTIVE' } })) || { id: 1 };
    const firstShift = (await prisma.shift.findFirst({ where: { status: 'ACTIVE' } })) || { id: 1 };

    const attendanceRecord = await prisma.attendance.create({
      data: {
        workerId: worker.id,
        assignmentId: firstAssignment?.id || 1,
        terminalId: firstTerminal.id,
        machineId: firstAssignment?.machineId || firstMachine.id,
        shiftId: firstAssignment?.shiftId || firstShift.id,
        attendanceType: nextAttendanceType,
        tapTime: new Date(),
      },
    });

    const workerName = `${worker.firstName} ${worker.lastName}`;
    const logMsg = nextAttendanceType === 'IN'
      ? `Worker ${workerName} (${worker.employeeCode}) tapped IN — Present`
      : `Worker ${workerName} (${worker.employeeCode}) tapped OUT — Absent`;

    await this.writeActivity('ATTENDANCE', `WORKER_${nextAttendanceType}`, logMsg, {
      workerId,
      employeeCode: worker.employeeCode,
    });

    websocketService.publish(
      nextAttendanceType === 'IN' ? WEBSOCKET_EVENTS.ATTENDANCE_IN : WEBSOCKET_EVENTS.ATTENDANCE_OUT,
      { workerId, attendance: attendanceRecord }
    );
    websocketService.publish(WEBSOCKET_EVENTS.ATTENDANCE_UPDATED, { workerId });

    let machineAutoIdled = false;
    if (nextAttendanceType === 'OUT' && worker.assignments.length > 0) {
      const assignedMachine = worker.assignments[0].machine;
      if (assignedMachine) {
        await this.toggleMachine(assignedMachine.id, 'idle', `Auto-idled: Worker ${workerName} checked out`);
        machineAutoIdled = true;
      }
    }

    websocketService.publish(WEBSOCKET_EVENTS.DASHBOARD_REFRESH, {});

    return {
      success: true,
      status: nextAttendanceType === 'IN' ? 'PRESENT' : 'ABSENT',
      workerName,
      machineAutoIdled,
      message: logMsg,
    };
  }

  /**
   * Toggle Machine Status (Running ↔ Idle)
   */
  async toggleMachine(machineId: number, targetStatus?: string, reason?: string) {
    const machine = await prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) throw new Error(`Machine ID ${machineId} not found`);

    const isRunning = machine.status === 'ACTIVE' || (machine.status as string) === 'running';
    const nextStatus = targetStatus
      ? targetStatus
      : isRunning
      ? 'idle'
      : 'running';

    const updatedMachine = await prisma.machine.update({
      where: { id: machineId },
      data: {
        status: nextStatus === 'running' || nextStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      },
    });

    const logMsg = reason
      ? `Machine ${machine.machineCode} (${machine.machineName}) set to ${nextStatus.toUpperCase()} (${reason})`
      : `Machine ${machine.machineCode} (${machine.machineName}) set to ${nextStatus.toUpperCase()}`;

    await this.writeActivity('MACHINE', `MACHINE_${nextStatus.toUpperCase()}`, logMsg, {
      machineId,
      machineCode: machine.machineCode,
      status: nextStatus,
    });

    websocketService.publish(
      nextStatus === 'running' ? WEBSOCKET_EVENTS.MACHINE_RUNNING : WEBSOCKET_EVENTS.MACHINE_IDLE,
      updatedMachine
    );
    websocketService.publish(WEBSOCKET_EVENTS.MACHINE_UPDATED, updatedMachine);
    websocketService.publish(WEBSOCKET_EVENTS.DASHBOARD_REFRESH, {});

    return {
      success: true,
      machineId,
      machineCode: machine.machineCode,
      status: nextStatus,
      message: logMsg,
    };
  }

  /**
   * Advance Bundle Progression:
   * Allocated (CREATED) → Started (IN_PROGRESS) → Completed (COMPLETED) → Closed (QC_COMPLETED)
   * Enforces Sequential Gating: Only ONE bundle can be IN_PROGRESS at a time for an order.
   */
  async advanceBundle(bundleId: number) {
    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        productionOrder: { include: { bundles: { orderBy: { id: 'asc' } } } },
      },
    });

    if (!bundle) throw new Error('Bundle not found');

    const siblings = bundle.productionOrder?.bundles || [];
    const currentIndex = siblings.findIndex((b) => b.id === bundleId);

    // Sequential Gating Check: Ensure previous bundle is COMPLETED/QC_COMPLETED before starting this one
    if (currentIndex > 0 && (bundle.status === 'CREATED' || bundle.status === 'WAITING')) {
      const prevBundle = siblings[currentIndex - 1];
      if (prevBundle.status !== 'COMPLETED' && prevBundle.status !== 'QC_COMPLETED') {
        throw new Error(
          `Sequential Gate: Please complete previous Bundle ${prevBundle.bundleNumber} first.`
        );
      }
    }

    const nextStatusMap: Record<string, { status: any; completedQty: number; label: string }> = {
      CREATED: { status: 'IN_PROGRESS', completedQty: Math.floor(bundle.quantity / 2), label: 'Started (In Progress)' },
      WAITING: { status: 'IN_PROGRESS', completedQty: Math.floor(bundle.quantity / 2), label: 'Started (In Progress)' },
      IN_PROGRESS: { status: 'COMPLETED', completedQty: bundle.quantity, label: 'Completed' },
      COMPLETED: { status: 'QC_COMPLETED', completedQty: bundle.quantity, label: 'Closed (Transferred to QC)' },
      QC_PENDING: { status: 'QC_COMPLETED', completedQty: bundle.quantity, label: 'Closed (Transferred to QC)' },
      QC_COMPLETED: { status: 'CREATED', completedQty: 0, label: 'Reset to Allocated' },
    };

    const nextStep = nextStatusMap[bundle.status] || nextStatusMap.CREATED;

    const updatedBundle = await prisma.bundle.update({
      where: { id: bundleId },
      data: {
        status: nextStep.status,
        completedQuantity: nextStep.completedQty,
      },
    });

    const logMsg = `Bundle ${bundle.bundleNumber} advanced to ${nextStep.label} (${nextStep.completedQty}/${bundle.quantity} pcs)`;

    await this.writeActivity('BUNDLE', 'BUNDLE_ADVANCED', logMsg, {
      bundleId,
      bundleNumber: bundle.bundleNumber,
      status: nextStep.status,
    });

    websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);
    websocketService.publish(WEBSOCKET_EVENTS.DASHBOARD_REFRESH, {});

    return {
      success: true,
      bundleId,
      bundleNumber: bundle.bundleNumber,
      status: nextStep.status,
      completedQuantity: nextStep.completedQty,
      totalQuantity: bundle.quantity,
      message: logMsg,
    };
  }

  /**
   * Reset Demo:
   * Resets workers to Absent, machines to Idle, bundles to CREATED, and clears activity logs.
   */
  async resetDemo(productionOrderId?: number) {
    inMemoryActivityLogs.length = 0;

    await prisma.machine.updateMany({
      data: { status: 'INACTIVE' },
    });

    if (productionOrderId) {
      await prisma.bundle.updateMany({
        where: { productionOrderId },
        data: {
          status: 'CREATED',
          completedQuantity: 0,
          currentMachineId: null,
          currentWorkerId: null,
        },
      });
    } else {
      await prisma.bundle.updateMany({
        data: {
          status: 'CREATED',
          completedQuantity: 0,
          currentMachineId: null,
          currentWorkerId: null,
        },
      });
    }

    const activeWorkers = await prisma.worker.findMany({
      where: { status: 'ACTIVE' },
      take: 100,
    });

    const now = new Date();
    for (const worker of activeWorkers) {
      try {
        await prisma.attendance.create({
          data: {
            workerId: worker.id,
            assignmentId: 1,
            terminalId: 1,
            machineId: 1,
            shiftId: 1,
            attendanceType: 'OUT',
            tapTime: now,
          },
        });
      } catch (e) {
        // ignore fallback errors
      }
    }

    const logMsg = 'Order Demo Environment Reset: Workers set to Absent, machines to Idle, bundles to Allocated.';
    await this.writeActivity('SYSTEM', 'DEMO_RESET', logMsg);

    websocketService.publish(WEBSOCKET_EVENTS.DASHBOARD_REFRESH, {});
    websocketService.publish(WEBSOCKET_EVENTS.ATTENDANCE_UPDATED, {});
    websocketService.publish(WEBSOCKET_EVENTS.MACHINE_UPDATED, {});
    websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, {});

    return {
      success: true,
      message: logMsg,
    };
  }
}

export const iotDemoService = new IotDemoService();
