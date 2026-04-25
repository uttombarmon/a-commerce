import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getProfile, updateProfile, getAddresses, addAddress, getWishlist } from '../controllers/users';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.get('/wishlist', protect, getWishlist);

export default router;
