import prisma from "../../../config/prisma";
import { TaskStatus } from "@prisma/client";
import { CreateTaskDTO, UpdateTaskDTO, PublishPlanDTO } from "../dto/planning.dto";
import { resourceAvailabilityService } from "./resource-availability.service";
import { validateAssignmentInput, validateAssignmentInputBulk } from "../../assignment/service/assignment.service";
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export class PlanningService {
  private async generateUniqueTaskIds(tx: any, count: number): Promise<string[]> {
    const maxTask = await tx.productionTask.findFirst({ orderBy: { id: 'desc' } });
    let nextId = (maxTask?.id || 0) + 1;
    const taskIds = [];
    for (let i = 0; i < count; i++) {
      taskIds.push(`TSK-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${(nextId + i).toString().padStart(4, '0')}`);
    }
    return taskIds;
  }

  private async generateUniqueBundleNumber(tx: any, orderNumber: string): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const count = await tx.bundle.count({ where: { productionOrder: { orderNumber } } });
      const bundleNumber = `${orderNumber}-B${(count + 1).toString().padStart(3, '0')}`;
      const exists = await tx.bundle.findUnique({ where: { bundleNumber } });
      if (!exists) return bundleNumber;
    }
    throw new Error("Could not generate a unique bundle number, please retry");
  }
  async getDashboardMetrics() {
    const totalOrders = await prisma.productionOrder.count();
    const activeOrders = await prisma.productionOrder.count({ where: { status: "IN_PROGRESS" } });
    const completedOrders = await prisma.productionOrder.count({ where: { status: "COMPLETED" } });
    
    const activeBundles = await prisma.bundle.count({ where: { status: "IN_PROGRESS" } });
    const waitingBundles = await prisma.bundle.count({ where: { status: "WAITING" } });

    const totalWorkers = await prisma.worker.count({ where: { status: "ACTIVE" } });
    const busyWorkers = (await prisma.assignment.groupBy({
      by: ["workerId"],
      where: { status: "ACTIVE" }
    })).length;

    const totalMachines = await prisma.machine.count({ where: { status: "ACTIVE" } });
    const busyMachines = (await prisma.assignment.groupBy({
      by: ["machineId"],
      where: { status: "ACTIVE" }
    })).length;

    const pendingTasks = await prisma.productionTask.count({
      where: { status: { in: ["CREATED", "PLANNED"] } }
    });

    return {
      orders: { total: totalOrders, active: activeOrders, completed: completedOrders },
      bundles: { active: activeBundles, waiting: waitingBundles },
      workers: { total: totalWorkers, busy: busyWorkers, available: totalWorkers - busyWorkers },
      machines: { total: totalMachines, busy: busyMachines, available: totalMachines - busyMachines },
      tasks: { pending: pendingTasks }
    };
  }

  async getAllTasks() {
    return prisma.productionTask.findMany({
      include: {
        productionOrder: true,
        operation: true,
        department: true,
        machine: true,
        worker: true,
      },
      orderBy: { priority: "desc" },
    });
  }

  async getTaskById(id: number) {
    return prisma.productionTask.findUnique({
      where: { id },
      include: {
        productionOrder: true,
        operation: true,
        department: true,
        machine: true,
        worker: true,
      },
    });
  }

  async createTask(data: CreateTaskDTO) {
    return prisma.$transaction(async (tx) => {
      const [taskId] = await this.generateUniqueTaskIds(tx, 1);
      
      return tx.productionTask.create({
        data: {
          ...data,
          taskId,
        },
        include: {
          productionOrder: true,
          operation: true,
        },
      });
    });
  }

  async updateTask(id: number, data: UpdateTaskDTO) {
    if (data.status) {
      const task = await prisma.productionTask.findUnique({ where: { id } });
      if (!task) throw new Error("Task not found");
      
      const allowedTransitions: Record<string, string[]> = {
        'CREATED': ['PLANNED', 'ASSIGNED'],
        'PLANNED': ['ASSIGNED', 'CREATED'],
        'ASSIGNED': ['ACCEPTED', 'RUNNING', 'PLANNED'],
        'ACCEPTED': ['RUNNING', 'ASSIGNED'],
        'RUNNING': ['COMPLETED', 'ASSIGNED', 'QC', 'ACCEPTED'],
        'COMPLETED': ['QC', 'TRANSFERRED', 'CLOSED'],
        'QC': ['COMPLETED', 'TRANSFERRED', 'RUNNING'],
        'TRANSFERRED': ['CLOSED'],
        'CLOSED': []
      };

      if (task.status !== data.status) {
         const allowed = allowedTransitions[task.status] || [];
         if (!allowed.includes(data.status)) {
            throw new Error(`Invalid status transition from ${task.status} to ${data.status}`);
         }
      }
    }

    return prisma.productionTask.update({
      where: { id },
      data,
    });
  }

  async getResourceAvailability() {
    const workers = await resourceAvailabilityService.getAvailableWorkers();
    const machines = await resourceAvailabilityService.getAvailableMachines();
    return { workers, machines };
  }

  async runAutoScheduler(taskId: number) {
    const task = await prisma.productionTask.findUnique({
      where: { id: taskId },
      include: { operation: true }
    });

    if (!task) throw new Error("Task not found");

    const availableMachines = await resourceAvailabilityService.getAvailableMachines({ 
      departmentId: task.departmentId 
    });

    const availableWorkers = await resourceAvailabilityService.getAvailableWorkers({ 
      departmentId: task.departmentId, 
      requiredSkillId: task.operation.requiredSkillId 
    });

    // Score workers based on grade, skills, and current load
    const scoredWorkers = availableWorkers.map(w => {
      let score = 0;
      // Base score from grade (A=4, B=3, C=2, D=1)
      const gradeScore = 5 - w.grade.priority;
      score += gradeScore * 10;
      
      // Skill match
      const hasRequiredSkill = w.skills.some(s => s.skillId === task.operation.requiredSkillId);
      if (hasRequiredSkill) score += 50;

      return { worker: w, score };
    }).sort((a, b) => b.score - a.score);

    const bestWorker = scoredWorkers[0]?.worker || null;
    let skillMatch = 0;
    let efficiency = 0;
    
    if (bestWorker) {
      skillMatch = bestWorker.skills.some(s => s.skillId === task.operation.requiredSkillId) ? 100 : 75;
      efficiency = Math.max(50, 100 - (bestWorker.grade.priority * 5));
    }

    const estimatedMinutes = task.estimatedTime;
    const now = new Date();
    const scheduledStart = now;
    const scheduledEnd = new Date(now.getTime() + estimatedMinutes * 60000);

    return {
      taskId: task.id,
      recommendedMachine: availableMachines[0] || null,
      recommendedWorker: bestWorker,
      skillMatch,
      efficiency,
      scheduledStart,
      scheduledEnd,
      estimatedCompletionTime: `${Math.ceil(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`
    };
  }

  async publishPlan(data: PublishPlanDTO) {
    let tagUpdatesToPerform: { tagId: number, bundleId: number }[] = [];
    
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.productionOrder.findUnique({
        where: { id: data.productionOrderId },
        include: { bundles: true }
      });

      if (!order) throw new Error("Production order not found");

      // 1. Generate Bundles if requested
      const newBundles = [];
      if (data.bundles && data.bundles.length > 0) {
        const availableTags = await tx.bundleTagAssignment.findMany({
          where: { status: "AVAILABLE" },
          take: data.bundles.length,
          orderBy: { tagCode: 'asc' }
        });
        
        if (availableTags.length < data.bundles.length) {
          throw new Error(`Not enough available tags in the pool. Need ${data.bundles.length}, but only have ${availableTags.length}. Please register more tags first.`);
        }

        let currentBundleCount = await tx.bundle.count({ where: { productionOrderId: order.id } });
        
        const CHUNK_SIZE = 100;
        for (let i = 0; i < data.bundles.length; i += CHUNK_SIZE) {
          const chunkBundles = data.bundles.slice(i, i + CHUNK_SIZE);
          const chunkTags = availableTags.slice(i, i + CHUNK_SIZE);
          
          const createdChunk = await (tx.bundle as any).createManyAndReturn({
            data: chunkBundles.map(b => {
              currentBundleCount++;
              const bundleNumber = `${order.orderNumber}-B${currentBundleCount.toString().padStart(3, '0')}`;
              return {
                bundleNumber,
                productionOrderId: order.id,
                quantity: Math.max(1, Math.floor(b.quantity)),
                status: "CREATED"
              };
            })
          });
          
          newBundles.push(...createdChunk);
          
          tagUpdatesToPerform.push(...createdChunk.map((bundle: any, idx: number) => ({
            tagId: chunkTags[idx].id,
            bundleId: bundle.id
          })));
        }
      }

      // 2. Create Assignments (Activate for IoT) with safety
      let defaultShiftId = undefined;
      if (data.assignments.some(a => !a.shiftId)) {
        const activeShift = await tx.shift.findFirst({ where: { status: "ACTIVE" } });
        if (activeShift) defaultShiftId = activeShift.id;
      }

      const createdAssignments = [];
      if (data.assignments && data.assignments.length > 0) {
        const machineIds = data.assignments.map(a => a.machineId);
        const workerIds = data.assignments.map(a => a.workerId);
        
        await Promise.all([
          tx.assignment.updateMany({
            where: { machineId: { in: machineIds }, status: 'ACTIVE' },
            data: { status: 'COMPLETED', releasedAt: new Date() }
          }),
          tx.assignment.updateMany({
            where: { workerId: { in: workerIds }, status: 'ACTIVE' },
            data: { status: 'COMPLETED', releasedAt: new Date() }
          })
        ]);

        const validAssignments = data.assignments.filter(a => a.roomId !== undefined && a.rowIndex !== undefined && a.positionIndex !== undefined);
        
        if (validAssignments.length > 0) {
           // Deduplicate to ensure no seat is claimed twice and no machine is moved twice
           const machineMap = new Map();
           for (const a of validAssignments) {
              machineMap.set(a.machineId, a);
           }
           
           const seatMap = new Map();
           for (const a of Array.from(machineMap.values())) {
              const seatKey = `${a.roomId}-${a.rowIndex}-${a.positionIndex}`;
              // If multiple machines aim for the same seat, the last one wins
              seatMap.set(seatKey, a);
           }
           
           // We only care about the latest intended location for each seat
           const finalUpdates = Array.from(seatMap.values());
           
           const clearPromises = finalUpdates.map(a => 
             tx.machine.updateMany({
                where: {
                  roomId: a.roomId,
                  rowIndex: a.rowIndex,
                  positionIndex: a.positionIndex
                },
                data: {
                  roomId: null,
                  rowIndex: null,
                  positionIndex: null
                }
             })
           );
           await Promise.all(clearPromises);

           const machineUpdatePromises = finalUpdates.map(a => 
             tx.machine.update({
               where: { id: a.machineId },
               data: { roomId: a.roomId, rowIndex: a.rowIndex, positionIndex: a.positionIndex }
             })
           );
           await Promise.all(machineUpdatePromises);
        }

        const assignmentData = data.assignments.map(a => ({
          operationId: a.operationId,
          workerId: a.workerId,
          machineId: a.machineId,
          shiftId: a.shiftId || defaultShiftId!,
          status: "ACTIVE" as const,
          assignedBy: "System Planner"
        }));

        // Validate all assignments in bulk to prevent N+1 query performance bottleneck
        await validateAssignmentInputBulk(tx, assignmentData);
        
        await tx.assignment.createMany({ data: assignmentData });
        // Prisma doesn't return created records for createMany in older versions, so we just add the count
        createdAssignments.push(...assignmentData);
      }

      // 2.5 Create Production Tasks for the Planning Board
      if (data.operations && data.operations.length > 0) {
        const defaultDept = await tx.department.findFirst();
        const deptId = defaultDept?.id || 1;
        
        let totalTasksNeeded = 0;
        data.operations.forEach(opId => {
          const assignmentsForOp = data.assignments.filter(a => a.operationId === opId);
          totalTasksNeeded += Math.max(1, assignmentsForOp.length);
        });
        
        const generatedTaskIds = await this.generateUniqueTaskIds(tx, totalTasksNeeded);
        let idIndex = 0;
        
        const taskData = [];
        
        for (const opId of data.operations) {
          const assignmentsForOp = data.assignments.filter(a => a.operationId === opId);
          const op = await tx.operation.findUnique({ where: { id: opId } });
          const estimatedTime = op ? Math.ceil(order.plannedQuantity * op.standardMinuteValue) : 60;

          if (assignmentsForOp.length > 0) {
            for (const assignment of assignmentsForOp) {
              const taskId = generatedTaskIds[idIndex++];
              const splitQuantity = Math.max(1, Math.ceil(order.plannedQuantity / assignmentsForOp.length));
              const splitTime = Math.max(1, Math.ceil(estimatedTime / assignmentsForOp.length));
              
              taskData.push({
                taskId,
                productionOrderId: order.id,
                operationId: opId,
                departmentId: deptId,
                machineId: assignment.machineId,
                workerId: assignment.workerId,
                shiftId: assignment.shiftId || defaultShiftId,
                targetQuantity: splitQuantity,
                estimatedTime: splitTime,
                status: "ASSIGNED" as const,
                priority: order.priority
              });
            }
          } else {
            const taskId = generatedTaskIds[idIndex++];
            taskData.push({
                taskId,
                productionOrderId: order.id,
                operationId: opId,
                departmentId: deptId,
                targetQuantity: order.plannedQuantity,
                estimatedTime,
                status: "PLANNED" as const,
                priority: order.priority
            });
          }
        }
        
        if (taskData.length > 0) {
          await tx.productionTask.createMany({ data: taskData });
        }
      }

      // 2.6 Write the step order back to the Operations for sequential gating
      if (data.operationOrder && data.operationOrder.length > 0) {
        const opUpdates = data.operationOrder.map(opOrder => 
          tx.operation.update({
            where: { id: opOrder.operationId },
            data: { displayOrder: opOrder.stepOrder }
          })
        );
        await Promise.all(opUpdates);
      }

      // 3. Mark Production Order as IN_PROGRESS or PLANNED
      if (order.status === "PLANNED") {
        await tx.productionOrder.update({
          where: { id: order.id },
          data: { status: "IN_PROGRESS" }
        });
      }

      return {
        success: true,
        message: "Plan published successfully to IoT terminals",
        bundlesCreated: newBundles.length,
        assignmentsCreated: createdAssignments.length,
        createdAssignments: createdAssignments
      };
    }, { timeout: 30000, isolationLevel: 'Serializable' });

    // After successful transaction, quickly perform all tag updates concurrently using pool connections
    if (tagUpdatesToPerform.length > 0) {
      const CHUNK_SIZE = 100;
      for (let i = 0; i < tagUpdatesToPerform.length; i += CHUNK_SIZE) {
        const chunk = tagUpdatesToPerform.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(update => 
          prisma.bundleTagAssignment.update({
            where: { id: update.tagId },
            data: {
              bundleId: update.bundleId,
              status: "ASSIGNED",
              assignedAt: new Date(),
              releasedAt: null,
              assignedBy: "System Planner"
            }
          })
        ));
      }
    }

    if (result.createdAssignments && result.createdAssignments.length > 0) {
      result.createdAssignments.forEach((assignment: any) => {
        websocketService.publish(WEBSOCKET_EVENTS.ASSIGNMENT_CREATED, assignment);
      });
      // Remove it from the final result sent to the client to save bandwidth
      delete (result as any).createdAssignments;
    }
    
    return result;
  }

  async getHistory() {
    return prisma.bundleStageLog.findMany({
      include: {
        bundle: {
          include: { productionOrder: true }
        },
        tag: true,
        operation: true,
        operator: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }

  /** Phase 3 — Per-operation live bundle tracker */
  async getOpenBundlesForOperation(operationId: number) {
    const openLogs = await prisma.bundleStageLog.findMany({
      where: { operationId, outTime: null },
      include: {
        bundle: {
          include: {
            productionOrder: true,
            tagAssignments: { where: { status: 'ASSIGNED' }, take: 1 },
          }
        },
        tag: true,
        operator: true,
      },
      orderBy: { inTime: 'asc' },
    });
    return openLogs;
  }

  async getTerminals() {
    return prisma.terminal.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { terminalCode: 'asc' }
    });
  }
}

export const planningService = new PlanningService();