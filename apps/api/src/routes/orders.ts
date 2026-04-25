import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createOrder, getOrders, getOrderById, cancelOrder, trackOrder } from '../controllers/orders';

const router = Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);
router.get('/:id/track', protect, trackOrder);

export default router;
