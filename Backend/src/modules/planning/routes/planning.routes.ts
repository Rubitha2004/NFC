import { Router } from "express";
import { planningController } from "../controller/planning.controller";

const router = Router();

router.get("/dashboard", planningController.getDashboardMetrics);
router.get("/resources", planningController.getResourceAvailability);
router.get("/tasks", planningController.getAllTasks);
router.post("/tasks", planningController.createTask);
router.get("/tasks/:id", planningController.getTaskById);
router.patch("/tasks/:id", planningController.updateTask);
router.post("/scheduler/auto/:id", planningController.runAutoScheduler);
router.post("/publish", planningController.publishPlan);
router.get("/history", planningController.getHistory);

export const planningRoutes = router;
