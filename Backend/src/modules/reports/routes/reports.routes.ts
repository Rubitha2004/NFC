import { Router } from "express";
import { reportsController } from "../controller/reports.controller";

const router = Router();

router.get("/attendance", reportsController.getAttendance.bind(reportsController));
router.get("/production", reportsController.getProduction.bind(reportsController));
router.get("/workers", reportsController.getWorkers.bind(reportsController));
router.get("/machines", reportsController.getMachines.bind(reportsController));
router.get("/qc", reportsController.getQC.bind(reportsController));
router.get("/bundles", reportsController.getBundles.bind(reportsController));
router.get("/dashboard", reportsController.getDashboard.bind(reportsController));
router.get("/export", reportsController.exportReport.bind(reportsController));

export const reportsRoutes = router;
