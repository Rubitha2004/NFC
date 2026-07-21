import prisma from '../../../config/prisma';
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export class IotService {
  /**
   * Handles a tag scan event from an IoT terminal.
   * If there is an open log, it closes it (Scan Out).
   * If there is no open log, it opens a new one (Scan In).
   */
  async handleScan(tagCode: string, workerCardId: string, terminalCode: string) {
    return prisma.$transaction(async (tx) => {
      const tag = await tx.bundleTagAssignment.findUnique({
        where: { tagCode }, include: { bundle: { include: { productionOrder: true } } }
      });
      if (!tag || tag.status !== "ASSIGNED" || !tag.bundleId || !tag.bundle) {
        throw new Error("Invalid tag or tag not assigned to an active bundle.");
      }

      const worker = await tx.worker.findUnique({ where: { nfcCardId: workerCardId } });
      if (!worker) throw new Error("Worker ID card not recognized.");

      const terminal = await tx.terminal.findUnique({ where: { terminalCode }, include: { machine: true } });
      if (!terminal?.machine) throw new Error("Terminal not recognized or not mapped to a machine.");

      const assignment = await tx.assignment.findFirst({
        where: { machineId: terminal.machine.id, workerId: worker.id, status: "ACTIVE" },
        include: { operation: true }
      });
      if (!assignment) throw new Error(`Worker not actively assigned to machine ${terminal.machine.machineCode}.`);

      const operation = assignment.operation;

      // Check for open (Scan Out) or closed (Scan In) log
      const openLog = await tx.bundleStageLog.findFirst({
        where: { bundleId: tag.bundle.id, tagId: tag.id, operationId: operation.id, outTime: null }
      });

      if (openLog) {
        // SCAN OUT — close the existing log
        await tx.bundleStageLog.update({ where: { id: openLog.id }, data: { outTime: new Date() } });

        // is this the last operation in the route?
        const maxOrderTask = await tx.productionTask.findFirst({
          where: { productionOrderId: tag.bundle.productionOrderId },
          include: { operation: true },
          orderBy: { operation: { displayOrder: "desc" } }
        });
        const isFinalOperation = maxOrderTask?.operationId === operation.id;

        const updatedBundle = await tx.bundle.update({
          where: { id: tag.bundle.id },
          data: { status: isFinalOperation ? "WAITING" : "IN_PROGRESS" }
        });

        const task = await tx.productionTask.findFirst({
          where: { productionOrderId: tag.bundle.productionOrderId, operationId: operation.id }
        });
        if (task) {
          const newCompletedQty = (task.completedQuantity || 0) + tag.bundle.quantity;
          const newStatus = newCompletedQty >= task.targetQuantity ? "COMPLETED" : "RUNNING";
          await tx.productionTask.update({
            where: { id: task.id },
            data: { completedQuantity: newCompletedQty, status: newStatus }
          });
        }

        websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);
        return {
          action: "SCAN_OUT",
          bundle: tag.bundle.bundleNumber,
          operation: operation.operationName,
          worker: `${worker.firstName} ${worker.lastName}`,
          message: `Bundle ${tag.bundle.bundleNumber} scanned OUT from ${operation.operationName}`,
          movedToQC: isFinalOperation,
        };

      } else {
        // SCAN IN — first enforce sequential gating
        // Find current task to get its sequenceOrder
        const currentTask = await tx.productionTask.findFirst({
          where: { productionOrderId: tag.bundle.productionOrderId, operationId: operation.id }
        });
        const currentSequence = currentTask?.sequenceOrder || 0;

        // Find the previous step (highest sequenceOrder that is less than this task's)
        const prevTask = await tx.productionTask.findFirst({
          where: {
            productionOrderId: tag.bundle.productionOrderId,
            sequenceOrder: { lt: currentSequence, gte: 1 }
          },
          orderBy: { sequenceOrder: 'desc' },
          include: { operation: true }
        });

        if (prevTask) {
          const prevCompletedLog = await tx.bundleStageLog.findFirst({
            where: {
              bundleId: tag.bundle.id,
              operationId: prevTask.operationId,
              outTime: { not: null }
            }
          });
          if (!prevCompletedLog) {
            throw new Error(
              `Sequential gate: This bundle hasn't finished "${prevTask.operation.operationName}" yet. Complete Step ${prevTask.sequenceOrder} first.`
            );
          }
        }

        // Gate passed — create the Scan In log
        await tx.bundleStageLog.create({
          data: {
            bundleId: tag.bundle.id,
            tagId: tag.id,
            operationId: operation.id,
            operatorId: worker.id,
            inTime: new Date()
          }
        });

        const task = await tx.productionTask.findFirst({
          where: { productionOrderId: tag.bundle.productionOrderId, operationId: operation.id }
        });
        if (task && task.status !== "RUNNING") {
          await tx.productionTask.update({ where: { id: task.id }, data: { status: "RUNNING" } });
        }

        const updatedBundle = await tx.bundle.update({
          where: { id: tag.bundle.id },
          data: {
            currentOperationId: operation.id,
            currentMachineId: terminal.machine.id,
            currentWorkerId: worker.id,
            status: "IN_PROGRESS"
          }
        });
        websocketService.publish(WEBSOCKET_EVENTS.BUNDLE_UPDATED, updatedBundle);
        return {
          action: "SCAN_IN",
          bundle: tag.bundle.bundleNumber,
          operation: operation.operationName,
          worker: `${worker.firstName} ${worker.lastName}`,
          message: `Bundle ${tag.bundle.bundleNumber} scanned IN at ${operation.operationName}`,
        };
      }
    });
  }

  /**
   * Fetches valid mock data for testing IoT interactions from the frontend.
   */
  async getDemoData(machineIdentifier: string) {
    const idNum = parseInt(machineIdentifier, 10);
    const machine = await prisma.machine.findFirst({
      where: {
        OR: [
          { machineCode: machineIdentifier },
          ...(isNaN(idNum) ? [] : [{ id: idNum }])
        ]
      },
      include: {
        terminal: true,
        assignments: {
          where: { status: 'ACTIVE' },
          include: { worker: true, operation: true }
        }
      }
    });

    if (!machine) throw new Error("Machine not found");
    if (!machine.terminal) throw new Error("No terminal mapped to this machine.");
    if (machine.assignments.length === 0) throw new Error("No worker assigned to this machine.");

    const assignment = machine.assignments[0];
    const workerCardId = assignment.worker.nfcCardId;
    const terminalCode = machine.terminal.terminalCode;

    // Find an available bundle tag
    // We try to find one that is assigned to a bundle that hasn't completed
    const tag = await prisma.bundleTagAssignment.findFirst({
      where: {
        status: 'ASSIGNED',
        bundleId: { not: null }
      },
      include: { bundle: true }
    });

    if (!tag) throw new Error("No active bundle tags found to simulate a scan.");

    return {
      terminalCode,
      workerCardId,
      tagCode: tag.tagCode,
      bundleNumber: tag.bundle?.bundleNumber,
      workerName: `${assignment.worker.firstName} ${assignment.worker.lastName}`
    };
  }
}

export const iotService = new IotService();
