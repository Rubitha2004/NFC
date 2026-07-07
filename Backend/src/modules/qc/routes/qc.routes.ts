import { Router } from 'express';
import { QCController } from '../controller/qc.controller';

const router = Router();
const controller = new QCController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));

export default router;
