import { Router } from "express";
import { WorkerController } from "../controller/worker.controller";

const router = Router();
const controller = new WorkerController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.changeStatus);

export default router;
