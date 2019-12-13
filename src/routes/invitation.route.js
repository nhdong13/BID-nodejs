import express from 'express';
import controller from '@controllers/invitation.controller';

const router = express.Router();

router.route('/').get(controller.list);
router.route('/sitterInvitation').post(controller.listInvitationBySitterId);
router
    .route('/listByRequestAndStatus/:requestId&:status')
    .get(controller.listByRequestAndStatus);
router
    .route('/listAllRequestInvitation/:requestId')
    .get(controller.listAllRequestInvitation);
router.route('/:requestId').post(controller.create);
router.route('/:id').get(controller.getInvitation);
router.route('/:id').put(controller.update);
router.route('/:id').delete(controller.destroy);

export default router;
