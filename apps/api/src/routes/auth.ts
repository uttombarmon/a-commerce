import { Router } from 'express';
import { register, login, logout, refreshToken, forgotPassword } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);

export default router;
