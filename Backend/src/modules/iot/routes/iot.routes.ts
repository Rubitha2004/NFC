import { Router } from 'express';
import { IotController } from '../controller/iot.controller';

const router = Router();
const ctrl = new IotController();

router.post('/scan', ctrl.handleScan.bind(ctrl));

export default router;
