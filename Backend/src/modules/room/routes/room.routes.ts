import { Router } from "express";
import { RoomController } from "../controller/room.controller";

const router = Router();
const controller = new RoomController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
