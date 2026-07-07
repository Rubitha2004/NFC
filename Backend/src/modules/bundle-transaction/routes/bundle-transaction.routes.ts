import { Router } from 'express';
import { BundleTransactionController } from '../controller/bundle-transaction.controller';

const router = Router();
const controller = new BundleTransactionController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.get('/bundle/:bundleId', controller.getByBundle.bind(controller));

export default router;
