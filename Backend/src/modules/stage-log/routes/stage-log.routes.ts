import { Router } from 'express';
import { StageLogController } from '../controller/stage-log.controller';

const router = Router();
const ctrl = new StageLogController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/bundle/:bundleId', ctrl.getByBundle.bind(ctrl));
router.post('/scan-in', ctrl.scanIn.bind(ctrl));
router.post('/:id/scan-out', ctrl.scanOut.bind(ctrl));

export default router;
