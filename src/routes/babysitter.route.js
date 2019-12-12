import express from 'express';
import controller from '@controllers/babysitter.controller';

const router = express.Router();

router.route('/').get(controller.list);
router
    .route('/getAllBabysitterWithSchedule/')
    .get(controller.listAllBabysitterWithSchedule);
router.route('/').post(controller.create);
router.route('/:id').get(controller.read);
router
    .route('/readByRequest/:sitterId&:requestId')
    .get(controller.readByRequest);
router.route('/:id').put(controller.update);
router.route('/:id').delete(controller.destroy);

export default router;
