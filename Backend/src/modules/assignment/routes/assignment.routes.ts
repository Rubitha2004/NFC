import { Router } from "express";
import { AssignmentController } from "../controller/assignment.controller";

const router = Router();
const assignmentController = new AssignmentController();

router.post("/", assignmentController.createAssignment);
router.get("/", assignmentController.getAllAssignments);
router.get("/:id", assignmentController.getAssignmentById);
router.patch("/:id/release", assignmentController.releaseAssignment);
router.put("/:id", assignmentController.updateAssignment);

export default router;
