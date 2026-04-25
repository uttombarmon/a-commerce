import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getProductReviews, addReview, voteHelpful } from '../controllers/reviews';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, addReview);
router.post('/:id/vote', protect, voteHelpful);

export default router;
