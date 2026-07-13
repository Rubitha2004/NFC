import { Router } from 'express';
import { MachineTypeController } from '../controller/machine-type.controller';

const router = Router();
const controller = new MachineTypeController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
