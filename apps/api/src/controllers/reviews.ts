import { Request, Response } from 'express';
import { db, reviews, users } from 'database';
import { eq } from 'drizzle-orm';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const allReviews = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      user: {
        name: users.name,
        avatar: users.avatar
      }
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, parseInt(productId)));

    res.json({ success: true, data: allReviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req: any, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const [newReview] = await db.insert(reviews).values({
      userId: req.user.id,
      productId,
      rating,
      comment,
    }).returning();

    res.status(201).json({ success: true, data: newReview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteHelpful = async (req: any, res: Response) => {
  // Mock helpful vote logic
  res.json({ success: true, message: 'Review marked as helpful' });
};
