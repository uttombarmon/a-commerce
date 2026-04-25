import { Router } from 'express';
import { initiatePayment, verifyPayment, webhook } from '../controllers/payments';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', webhook);

export default router;
