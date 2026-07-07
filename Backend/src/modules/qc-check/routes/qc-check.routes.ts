import { Router } from 'express';
import { QCCheckController } from '../controller/qc-check.controller';

const router = Router();
const ctrl = new QCCheckController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/bundle/:bundleId', ctrl.getByBundle.bind(ctrl));
router.get('/bundle/:bundleId/trail', ctrl.getAccountabilityTrail.bind(ctrl));
router.post('/scan', ctrl.scan.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', ctrl.create.bind(ctrl));

export default router;
