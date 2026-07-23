import { Router } from 'express';
import { IotController } from '../controller/iot.controller';
import { iotDemoController } from '../controller/iot-demo.controller';

const router = Router();
const ctrl = new IotController();

// Existing production endpoints
router.post('/scan', ctrl.handleScan.bind(ctrl));
router.get('/demo-data/:machineId', ctrl.getDemoData.bind(ctrl));
router.post('/demo-scan/:machineId', ctrl.simulateDemoScan.bind(ctrl));

// Dedicated Order-Driven IoT Demo Module endpoints (/api/v1/iot/demo/*)
router.get('/demo/context', iotDemoController.getContext.bind(iotDemoController));
router.post('/demo/worker/toggle', iotDemoController.toggleWorker.bind(iotDemoController));
router.post('/demo/machine/toggle', iotDemoController.toggleMachine.bind(iotDemoController));
router.post('/demo/bundle/advance', iotDemoController.advanceBundle.bind(iotDemoController));
router.post('/demo/reset', iotDemoController.resetDemo.bind(iotDemoController));
router.get('/demo/logs', iotDemoController.getActivityLogs.bind(iotDemoController));

export default router;
