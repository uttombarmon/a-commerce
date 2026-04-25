import { Router } from 'express';
import { getDashboardStats, getUsers, getOrders, verifySeller } from '../controllers/admin';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.post('/sellers/:sellerId/verify', verifySeller);

export default router;
