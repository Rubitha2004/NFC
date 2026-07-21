import { planningService } from './src/modules/planning/service/planning.service';
import { MachineService } from './src/modules/machine/service/machine.service';
import { WorkerService } from './src/modules/worker/service/worker.service';
import prisma from './src/config/prisma';

async function testLogic() {
  console.log("Starting logic verification...");
  
  // 1. Verify bundle quantities and task target split
  console.log("1. Testing publishPlan...");
  
  try {
    const order = await prisma.productionOrder.findFirst({ where: { status: 'PLANNED' } });
    if (!order) {
      console.log("No planned order found, skipping test 1.");
    } else {
      const activeOps = await prisma.operation.findMany({ take: 2 });
      const worker1 = await prisma.worker.findFirst({ where: { status: 'ACTIVE' } });
      const worker2 = await prisma.worker.findFirst({ where: { status: 'ACTIVE', id: { not: worker1?.id } } });
      const machine1 = await prisma.machine.findFirst({ where: { status: 'ACTIVE' } });
      
      const payload = {
        productionOrderId: order.id,
        bundles: [{ quantity: 0 }, { quantity: order.plannedQuantity }], // One bundle is 0
        operations: [activeOps[0].id],
        assignments: [
          { operationId: activeOps[0].id, workerId: worker1!.id, machineId: machine1!.id },
          { operationId: activeOps[0].id, workerId: worker2!.id, machineId: machine1!.id } // Assigning same machine, should gracefully release 1st worker
        ]
      };
      
      await planningService.publishPlan(payload);
      console.log("PublishPlan successful. Validating tasks...");
      
      const tasks = await prisma.productionTask.findMany({ where: { productionOrderId: order.id, operationId: activeOps[0].id } });
      console.log("Tasks created:", tasks.length);
      console.log("Task 1 Target:", tasks[0].targetQuantity, "Task 2 Target:", tasks[1].targetQuantity);
      
      const bundles = await prisma.bundle.findMany({ where: { productionOrderId: order.id } });
      console.log("Bundles created:", bundles.map(b => b.quantity));
    }
  } catch (e) {
    console.error("Test 1 Failed:", e);
  }
  
  console.log("2. Testing machine inactive status release...");
  try {
    const activeAssignment = await prisma.assignment.findFirst({ where: { status: 'ACTIVE' } });
    if (activeAssignment) {
      const machineService = new MachineService();
      await machineService.changeStatus(activeAssignment.machineId, 'INACTIVE');
      const updatedAssignment = await prisma.assignment.findUnique({ where: { id: activeAssignment.id } });
      console.log("Assignment status after inactive:", updatedAssignment?.status); // Should be COMPLETED
      await machineService.changeStatus(activeAssignment.machineId, 'ACTIVE'); // Revert
    } else {
       console.log("No active assignment found");
    }
  } catch (e) {
    console.error("Test 2 Failed:", e);
  }
  
  console.log("3. Testing worker inactive status release...");
  try {
    const activeAssignment = await prisma.assignment.findFirst({ where: { status: 'ACTIVE' } });
    if (activeAssignment && activeAssignment.workerId) {
      const workerService = new WorkerService();
      await workerService.changeStatus(activeAssignment.workerId, 'INACTIVE');
      const updatedAssignment = await prisma.assignment.findUnique({ where: { id: activeAssignment.id } });
      console.log("Assignment status after inactive:", updatedAssignment?.status); // Should be COMPLETED
      await workerService.changeStatus(activeAssignment.workerId, 'ACTIVE'); // Revert
    } else {
       console.log("No active assignment found");
    }
  } catch (e) {
    console.error("Test 3 Failed:", e);
  }

  console.log("Verification complete.");
}

testLogic().finally(() => prisma.$disconnect());
