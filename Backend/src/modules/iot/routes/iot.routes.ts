import { Router } from 'express';
import { IotController } from '../controller/iot.controller';

const router = Router();
const ctrl = new IotController();

router.post('/scan', ctrl.handleScan.bind(ctrl));
router.get('/demo-data/:machineId', ctrl.getDemoData.bind(ctrl));
router.post('/demo-scan/:machineId', ctrl.simulateDemoScan.bind(ctrl));

export default router;
