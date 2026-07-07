import { Router } from "express";
import { BundleController } from "../controller/bundle.controller";

const router = Router();
const controller = new BundleController();

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.changeStatus);

export default router;
