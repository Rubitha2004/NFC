import { Router } from "express";
import { ShiftController } from "../controller/shift.controller";

const router = Router();
const controller = new ShiftController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.changeStatus);

export default router;
