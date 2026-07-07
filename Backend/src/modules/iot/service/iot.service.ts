import prisma from '../../../config/prisma';

export class IotService {
  /**
   * Handles a tag scan event from an IoT terminal.
   * If there is an open log, it closes it (Scan Out).
   * If there is no open log, it opens a new one (Scan In).
   */
  async handleScan(tagCode: string, workerCardId: string, terminalCode: string) {
    // 1. Validate Tag
    const tag = await prisma.bundleTagAssignment.findUnique({
      where: { tagCode },
      include: { bundle: true }
    });
    
    if (!tag) throw new Error("Invalid Tag Code");
    if (tag.status !== "ASSIGNED" || !tag.bundleId || !tag.bundle) {
      throw new Error("This tag is not assigned to any active bundle.");
    }

    // 2. Validate Worker via NFC Card
    const worker = await prisma.worker.findUnique({
      where: { nfcCardId: workerCardId }
    });
    if (!worker) throw new Error("Worker ID card not recognized.");

    // 3. Validate Terminal & Machine
    const terminal = await prisma.terminal.findUnique({
      where: { terminalCode },
      include: { machine: true }
    });
    if (!terminal) throw new Error("Terminal not recognized.");
    if (!terminal.machine) throw new Error("Terminal is not mapped to any machine.");
    
    const machine = terminal.machine;

    // 4. Find Active Assignment to determine Operation
    const assignment = await prisma.assignment.findFirst({
      where: { machineId: machine.id, workerId: worker.id, status: "ACTIVE" },
      include: { operation: true }
    });

    if (!assignment) {
      throw new Error(`Worker ${worker.firstName} is not actively assigned to machine ${machine.machineCode}.`);
    }

    const operation = assignment.operation;

    // 5. Check if there is an open scan for this bundle on this operation
    const openLog = await prisma.bundleStageLog.findFirst({
      where: { 
        bundleId: tag.bundle.id, 
        tagId: tag.id, 
        operationId: operation.id, 
        outTime: null 
      }
    });

    if (openLog) {
      // It's a SCAN OUT
      const closedLog = await prisma.bundleStageLog.update({
        where: { id: openLog.id },
        data: { outTime: new Date() }
      });
      
      // Update bundle status if needed
      return { 
        action: 'SCAN_OUT', 
        message: 'Operation finished', 
        bundle: tag.bundle.bundleNumber, 
        operation: operation.operationName,
        worker: worker.firstName
      };

    } else {
      // It's a SCAN IN
      const newLog = await prisma.bundleStageLog.create({
        data: {
           bundleId: tag.bundle.id,
           tagId: tag.id,
           operationId: operation.id,
           operatorId: worker.id,
           inTime: new Date()
        }
      });
      
      // Update bundle's current state
      await prisma.bundle.update({
        where: { id: tag.bundle.id },
        data: { 
          currentOperationId: operation.id, 
          currentMachineId: machine.id, 
          currentWorkerId: worker.id, 
          status: 'IN_PROGRESS' 
        }
      });
      
      return { 
        action: 'SCAN_IN', 
        message: 'Operation started', 
        bundle: tag.bundle.bundleNumber, 
        operation: operation.operationName,
        worker: worker.firstName
      };
    }
  }
}
