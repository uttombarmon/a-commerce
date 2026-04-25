import { Response } from 'express';
import { db, users, orders, sellers } from 'database';
import { sql, eq } from 'drizzle-orm';

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    const orderCount = await db.select({ count: sql`count(*)` }).from(orders);
    const totalRevenue = await db.select({ total: sql`sum(total)` }).from(orders);
    res.json({ success: true, data: { users: userCount[0].count, orders: orderCount[0].count, revenue: totalRevenue[0].total || 0 } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getUsers = async (req: any, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ success: true, data: allUsers });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    const allOrders = await db.select().from(orders);
    res.json({ success: true, data: allOrders });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const verifySeller = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.params;
    await db.update(sellers).set({ verified: true }).where(eq(sellers.id, parseInt(sellerId)));
    res.json({ success: true, message: 'Seller verified successfully' });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};
