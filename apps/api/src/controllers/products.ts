import { Request, Response } from 'express';
import { db, products } from 'database';
import { eq, ilike, or, and, gte, lte } from 'drizzle-orm';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, minPrice, maxPrice, categoryId } = req.query;
    let query = db.select().from(products);
    const filters = [];
    if (search) filters.push(or(ilike(products.title, `%${search}%`), ilike(products.description, `%${search}%`)));
    if (minPrice) filters.push(gte(products.price, minPrice.toString()));
    if (maxPrice) filters.push(lte(products.price, maxPrice.toString()));
    if (categoryId) filters.push(eq(products.categoryId, parseInt(categoryId.toString())));
    const allProducts = await query.where(filters.length ? and(...filters) : undefined);
    res.json({ success: true, data: allProducts });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await db.select().from(products).where(eq(products.id, parseInt(id))).limit(1);
    if (!product.length) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product[0] });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const [newProduct] = await db.insert(products).values({ ...req.body, sellerId: req.user.id }).returning();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const [updatedProduct] = await db.update(products).set({ ...req.body, updatedAt: new Date() }).where(and(eq(products.id, parseInt(id)), eq(products.sellerId, req.user.id))).returning();
    if (!updatedProduct) return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    res.json({ success: true, data: updatedProduct });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.delete(products).where(and(eq(products.id, parseInt(id)), eq(products.sellerId, req.user.id))).returning();
    if (!deleted.length) return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await db.select().from(products).where(eq(products.id, parseInt(id))).limit(1);
    if (!product.length) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await db.select().from(products).where(and(eq(products.categoryId, product[0].categoryId!), eq(products.isFeatured, true))).limit(5);
    res.json({ success: true, data: related });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};
