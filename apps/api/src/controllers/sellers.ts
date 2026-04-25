import { Response } from 'express';
import { db, sellers, products, orders, orderItems } from 'database';
import { eq, and, sql } from 'drizzle-orm';

export const getSellerShop = async (req: any, res: Response) => {
  try {
    const [shop] = await db.select().from(sellers).where(eq(sellers.userId, req.user.id)).limit(1);
    if (!shop) return res.status(404).json({ success: false, message: 'Seller profile not found' });
    const sellerProducts = await db.select().from(products).where(eq(products.sellerId, shop.id));
    res.json({ success: true, data: { shop, products: sellerProducts } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const uploadProducts = async (req: any, res: Response) => {
  try {
    const [shop] = await db.select().from(sellers).where(eq(sellers.userId, req.user.id)).limit(1);
    if (!shop) return res.status(404).json({ success: false, message: 'Seller profile not found' });
    
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const newProducts = await db.insert(products).values(items.map((item: any) => ({ ...item, sellerId: shop.id }))).returning();
    res.status(201).json({ success: true, data: newProducts });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getEarnings = async (req: any, res: Response) => {
  try {
    const [shop] = await db.select().from(sellers).where(eq(sellers.userId, req.user.id)).limit(1);
    if (!shop) return res.status(404).json({ success: false, message: 'Seller profile not found' });
    
    // Calculate earnings based on orderItems belonging to seller's products
    const earnings = await db.select({ total: sql`sum(${orderItems.priceAtPurchase} * ${orderItems.quantity})` })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.sellerId, shop.id));
      
    res.json({ success: true, data: { totalEarnings: earnings[0].total || 0 } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getSellerOrders = async (req: any, res: Response) => {
  try {
    const [shop] = await db.select().from(sellers).where(eq(sellers.userId, req.user.id)).limit(1);
    if (!shop) return res.status(404).json({ success: false, message: 'Seller profile not found' });
    
    // Get orders containing seller's products
    const sellerOrders = await db.select({ orderId: orders.id, total: orders.total, status: orders.status })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.sellerId, shop.id))
      .groupBy(orders.id);
      
    res.json({ success: true, data: sellerOrders });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};
