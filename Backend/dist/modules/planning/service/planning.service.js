"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningService = exports.PlanningService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class PlanningService {
    async getDashboardMetrics() {
        const totalOrders = await prisma_1.default.productionOrder.count();
        const activeOrders = await prisma_1.default.productionOrder.count({ where: { status: "IN_PROGRESS" } });
        const completedOrders = await prisma_1.default.productionOrder.count({ where: { status: "COMPLETED" } });
        const activeBundles = await prisma_1.default.bundle.count({ where: { status: "IN_PROGRESS" } });
        const waitingBundles = await prisma_1.default.bundle.count({ where: { status: "WAITING" } });
        const totalWorkers = await prisma_1.default.worker.count({ where: { status: "ACTIVE" } });
        const busyWorkers = (await prisma_1.default.assignment.groupBy({
            by: ["workerId"],
            where: { status: "ACTIVE" }
        })).length;
        const totalMachines = await prisma_1.default.machine.count({ where: { status: "ACTIVE" } });
        const busyMachines = (await prisma_1.default.assignment.groupBy({
            by: ["machineId"],
            where: { status: "ACTIVE" }
        })).length;
        const pendingTasks = await prisma_1.default.productionTask.count({
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
        return prisma_1.default.productionTask.findMany({
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
    async getTaskById(id) {
        return prisma_1.default.productionTask.findUnique({
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
    async createTask(data) {
        const count = await prisma_1.default.productionTask.count();
        const taskId = `TSK-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(count + 1).toString().padStart(4, '0')}`;
        return prisma_1.default.productionTask.create({
            data: {
                ...data,
                taskId,
            },
            include: {
                productionOrder: true,
                operation: true,
            },
        });
    }
    async updateTask(id, data) {
        return prisma_1.default.productionTask.update({
            where: { id },
            data,
        });
    }
    async getResourceAvailability() {
        const workers = await prisma_1.default.worker.findMany({
            where: { status: "ACTIVE" },
            include: {
                assignments: { where: { status: "ACTIVE" } },
                skills: { include: { skill: true } },
                grade: true,
                department: true
            }
        });
        const machines = await prisma_1.default.machine.findMany({
            where: { status: "ACTIVE" },
            include: {
                assignments: { where: { status: "ACTIVE" } },
                machineType: true,
                department: true
            }
        });
        return { workers, machines };
    }
    async runAutoScheduler(taskId) {
        const task = await prisma_1.default.productionTask.findUnique({
            where: { id: taskId },
            include: { operation: true }
        });
        if (!task)
            throw new Error("Task not found");
        const availableMachines = await prisma_1.default.machine.findMany({
            where: {
                status: "ACTIVE",
                departmentId: task.departmentId,
                assignments: { none: { status: "ACTIVE" } }
            },
            take: 1
        });
        const availableWorkers = await prisma_1.default.worker.findMany({
            where: {
                status: "ACTIVE",
                departmentId: task.departmentId,
                assignments: { none: { status: "ACTIVE" } }
            },
            take: 1
        });
        return {
            recommendedMachine: availableMachines[0] || null,
            recommendedWorker: availableWorkers[0] || null,
            skillMatch: 95,
            efficiency: 92,
            estimatedCompletionTime: `${Math.ceil(task.estimatedTime / 60)}h ${task.estimatedTime % 60}m`
        };
    }
    async publishPlan(data) {
        const order = await prisma_1.default.productionOrder.findUnique({
            where: { id: data.productionOrderId },
            include: { bundles: true }
        });
        if (!order)
            throw new Error("Production order not found");
        // 1. Generate Bundles if requested
        const newBundles = [];
        if (data.bundles && data.bundles.length > 0) {
            let nextBundleIndex = order.bundles.length + 1;
            for (const b of data.bundles) {
                const bundleNumber = `${order.orderNumber}-B${nextBundleIndex.toString().padStart(3, '0')}`;
                newBundles.push({
                    bundleNumber,
                    productionOrderId: order.id,
                    quantity: b.quantity,
                    status: "CREATED"
                });
                nextBundleIndex++;
            }
            if (newBundles.length > 0) {
                await prisma_1.default.bundle.createMany({
                    data: newBundles
                });
            }
        }
        // 2. Create Assignments (Activate for IoT)
        let defaultShiftId = undefined;
        if (data.assignments.some(a => !a.shiftId)) {
            const activeShift = await prisma_1.default.shift.findFirst({ where: { status: "ACTIVE" } });
            if (activeShift)
                defaultShiftId = activeShift.id;
        }
        const assignmentsToCreate = data.assignments.map(a => {
            const shiftId = a.shiftId || defaultShiftId;
            if (!shiftId)
                throw new Error("No active shift found for assignment");
            return {
                operationId: a.operationId,
                workerId: a.workerId,
                machineId: a.machineId,
                shiftId: shiftId,
                status: "ACTIVE",
                assignedBy: "System Planner"
            };
        });
        if (assignmentsToCreate.length > 0) {
            // In a real app we might want to close existing assignments for these workers/machines first
            // But for simplicity in the unified planner, we'll just create new active assignments.
            await prisma_1.default.assignment.createMany({
                data: assignmentsToCreate
            });
        }
        // 3. Mark Production Order as IN_PROGRESS
        if (order.status === "PLANNED") {
            await prisma_1.default.productionOrder.update({
                where: { id: order.id },
                data: { status: "IN_PROGRESS" }
            });
        }
        return {
            success: true,
            message: "Plan published successfully to IoT terminals",
            bundlesCreated: newBundles.length,
            assignmentsCreated: assignmentsToCreate.length
        };
    }
}
exports.PlanningService = PlanningService;
exports.planningService = new PlanningService();
