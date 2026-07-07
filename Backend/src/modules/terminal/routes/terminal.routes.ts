import { Router } from "express";
import { TerminalController } from "../controller/terminal.controller";

const router = Router();
const terminalController = new TerminalController();

router.post("/", terminalController.createTerminal);
router.get("/", terminalController.getAllTerminals);
router.get("/:id", terminalController.getTerminalById);
router.put("/:id", terminalController.updateTerminal);
router.patch("/:id/status", terminalController.changeTerminalStatus);

export default router;
