import { Router } from 'express';
import { getSellerShop, uploadProducts, getEarnings, getSellerOrders } from '../controllers/sellers';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/shop', getSellerShop);
router.post('/products', uploadProducts);
router.get('/earnings', getEarnings);
router.get('/orders', getSellerOrders);

export default router;
