import express from 'express';
import services from '@services/paymentService';
const router = express.Router();

router.route('/charge').post(services.createCharges);
router.route('/customer').post(services.getCustomer);
router.route('/customer').put(services.createCustomer);

export default router;
