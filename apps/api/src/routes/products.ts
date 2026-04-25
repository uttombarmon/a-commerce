import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getRelatedProducts } from '../controllers/products';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/:id/related', getRelatedProducts);

export default router;
