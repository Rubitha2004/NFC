import { Router } from "express";
import { ProductionOrderController } from "../controller/production-order.controller";

const router = Router();
const controller = new ProductionOrderController();

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.changeStatus);
router.delete("/:id", controller.delete);

export default router;
