import express from 'express';
import controller from '@controllers/auth.controller';

const router = express.Router();

router.route('/login').post(controller.login);
router.route('/checkOtp').post(controller.checkOtp);

export default router;
