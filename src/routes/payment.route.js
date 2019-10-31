import express from 'express';
import services from '@services/paymentService';
const router = express.Router();

router.route('/').get(services.createCharges);

export default router;
