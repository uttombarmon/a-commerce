import { Router } from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory } from '../controllers/categories';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);

export default router;
