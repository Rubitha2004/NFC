import { Router } from 'express';
import { TagController } from '../controller/tag.controller';

const router = Router();
const ctrl = new TagController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/available', ctrl.getAvailable.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', ctrl.create.bind(ctrl));
router.post('/:id/assign', ctrl.assign.bind(ctrl));
router.post('/:id/release', ctrl.release.bind(ctrl));

export default router;
