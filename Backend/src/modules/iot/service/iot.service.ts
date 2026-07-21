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
          orderBy: { sequenceOrder: "desc" }
        });
        const isFinalOperation = maxOrderTask?.operationId === operation.id;

        const updatedBundle = await tx.bundle.update({
          where: { id: tag.bundle.id },
          data: { 
            status: isFinalOperation ? "WAITING" : "IN_PROGRESS",
            currentMachineId: null,
            currentWorkerId: null,
            currentOperationId: isFinalOperation ? null : tag.bundle.currentOperationId
          }
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
   * Simulates an IoT scan for demo purposes on a specific machine.
   * Picks a bundle tag compatible with the machine's operation and always performs SCAN IN.
   */
  async simulateDemoScan(machineIdentifier: string) {
    const context = await this.resolveDemoMachineContext(machineIdentifier);
    const tag = await this.findDemoTagForOperation(context.assignment.operationId);

    // Close any open stage log for this bundle+operation so handleScan performs SCAN IN
    await prisma.$transaction(async (tx) => {
      const openLog = await tx.bundleStageLog.findFirst({
        where: {
          bundleId: tag.bundleId!,
          operationId: context.assignment.operationId,
          outTime: null,
        },
      });

      if (openLog) {
        await tx.bundleStageLog.update({
          where: { id: openLog.id },
          data: { outTime: new Date() },
        });
        await tx.bundle.update({
          where: { id: tag.bundleId! },
          data: { currentMachineId: null, currentWorkerId: null },
        });
      }
    });

    return this.handleScan(tag.tagCode, context.workerCardId, context.terminalCode);
  }

  /**
   * Fetches valid mock data for testing IoT interactions from the frontend.
   */
  async getDemoData(machineIdentifier: string) {
    const context = await this.resolveDemoMachineContext(machineIdentifier);
    const tag = await this.findDemoTagForOperation(context.assignment.operationId);

    return {
      terminalCode: context.terminalCode,
      workerCardId: context.workerCardId,
      tagCode: tag.tagCode,
      bundleNumber: tag.bundle?.bundleNumber,
      workerName: context.workerName,
    };
  }

  private async resolveDemoMachineContext(machineIdentifier: string) {
    const idNum = parseInt(machineIdentifier, 10);
    const machine = await prisma.machine.findFirst({
      where: {
        OR: [
          { machineCode: machineIdentifier },
          ...(isNaN(idNum) ? [] : [{ id: idNum }]),
        ],
      },
      include: {
        terminal: true,
        assignments: {
          where: { status: "ACTIVE" },
          include: { worker: true, operation: true },
        },
      },
    });

    if (!machine) throw new Error("Machine not found");
    if (!machine.terminal) throw new Error("No terminal mapped to this machine.");
    if (machine.assignments.length === 0) throw new Error("No worker assigned to this machine.");

    const assignment = machine.assignments[0];

    return {
      assignment,
      workerCardId: assignment.worker.nfcCardId,
      terminalCode: machine.terminal.terminalCode,
      workerName: `${assignment.worker.firstName} ${assignment.worker.lastName}`,
    };
  }

  private async findDemoTagForOperation(operationId: number) {
    // 1. Find all active production orders that contain this operation
    const tasks = await prisma.productionTask.findMany({
      where: { operationId },
      select: { productionOrderId: true, sequenceOrder: true },
    });

    if (tasks.length === 0) {
      throw new Error("No production task found for this operation. Cannot simulate scan.");
    }

    const poIds = tasks.map(t => t.productionOrderId);

    // 2. Fetch tags only for these active production orders
    const tags = await prisma.bundleTagAssignment.findMany({
      where: {
        status: "ASSIGNED",
        bundleId: { not: null },
        bundle: {
          productionOrderId: { in: poIds },
          status: { in: ["CREATED", "IN_PROGRESS", "WAITING"] },
        },
      },
      include: { bundle: true },
      take: 50, // limit to first 50 to prevent huge loop
      orderBy: { id: "asc" },
    });

    if (tags.length === 0) {
      throw new Error(
        "No compatible bundle tag found for this machine's operation. Publish a plan with bundles that can scan in at this step."
      );
    }

    const eligible: typeof tags = [];

    for (const tag of tags) {
      if (!tag.bundle) continue;
      const gatePassed = await this.passesSequentialGate(tag.bundle.id, operationId);
      if (!gatePassed) continue;
      eligible.push(tag);
    }

    if (eligible.length === 0) {
      throw new Error(
        "Found bundles for this operation, but they have not completed the previous operations (Sequential Gating). Please scan them in previous steps first."
      );
    }

    // Prefer an idle bundle (not on another machine, no open log at this operation)
    for (const tag of eligible) {
      const openLog = await prisma.bundleStageLog.findFirst({
        where: { bundleId: tag.bundleId!, operationId, outTime: null },
      });
      if (!openLog && tag.bundle?.currentMachineId == null) return tag;
    }

    // Next: bundle with no open log (may be in progress elsewhere)
    for (const tag of eligible) {
      const openLog = await prisma.bundleStageLog.findFirst({
        where: { bundleId: tag.bundleId!, operationId, outTime: null },
      });
      if (!openLog) return tag;
    }

    // Last resort: reuse a tag — simulateDemoScan will close the open log first
    return eligible[0];
  }

  private async passesSequentialGate(bundleId: number, operationId: number) {
    const bundle = await prisma.bundle.findUnique({ where: { id: bundleId } });
    if (!bundle) return false;

    const currentTask = await prisma.productionTask.findFirst({
      where: { productionOrderId: bundle.productionOrderId, operationId },
    });
    const currentSequence = currentTask?.sequenceOrder || 0;

    const prevTask = await prisma.productionTask.findFirst({
      where: {
        productionOrderId: bundle.productionOrderId,
        sequenceOrder: { lt: currentSequence, gte: 1 },
      },
      orderBy: { sequenceOrder: "desc" },
    });

    if (!prevTask) return true;

    const prevCompletedLog = await prisma.bundleStageLog.findFirst({
      where: {
        bundleId,
        operationId: prevTask.operationId,
        outTime: { not: null },
      },
    });

    return !!prevCompletedLog;
  }
}

export const iotService = new IotService();
