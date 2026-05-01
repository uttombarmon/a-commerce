import { Router } from 'express';
import { register, login, logout, refreshToken, forgotPassword, getMe } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);

export default router;
