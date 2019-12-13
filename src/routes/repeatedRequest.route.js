import express from 'express';
import controller from '@controllers/repeatedRequest.controller';

const router = express.Router();

router.route('/listRepeatedRequest/:id').get(controller.list);
router.route('/getRepeatedRequest/:id').get(controller.getRepeatedRequest);
router.route('/createRepeatedRequest').post(controller.create);
router.route('/updateRepeatedRequest').put(controller.update);

export default router;
