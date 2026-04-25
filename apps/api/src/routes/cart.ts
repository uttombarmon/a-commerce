import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart';

const router = Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/item/:id', protect, updateCartItem);
router.delete('/item/:id', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

export default router;
