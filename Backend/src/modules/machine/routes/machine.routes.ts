import { Router } from "express";
import { MachineController } from "../controller/machine.controller";

const router = Router();
const controller = new MachineController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.changeStatus);

export default router;
