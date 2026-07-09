import { Router } from "express";
import { FloorController } from "../controller/floor.controller";

const router = Router();
const controller = new FloorController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
