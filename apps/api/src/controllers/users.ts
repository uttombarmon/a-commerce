import { Request, Response } from 'express';
import { db, users } from 'database';
import { eq } from 'drizzle-orm';

export const getProfile = async (req: any, res: Response) => {
  try {
    const [user] = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role, address: users.address, avatar: users.avatar, createdAt: users.createdAt })
      .from(users).where(eq(users.id, req.user.id)).limit(1);
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, address, avatar } = req.body;
    await db.update(users).set({ name, address, avatar, updatedAt: new Date() }).where(eq(users.id, req.user.id));
    res.json({ success: true, message: 'Profile updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAddresses = async (req: any, res: Response) => {
  // Since address is a single field in our schema, we mock a list or return the single one as a list
  try {
    const [user] = await db.select({ address: users.address }).from(users).where(eq(users.id, req.user.id)).limit(1);
    const addresses = user?.address ? [{ id: 1, address: user.address, isDefault: true }] : [];
    res.json({ success: true, data: addresses });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const addAddress = async (req: any, res: Response) => {
  try {
    const { address } = req.body;
    await db.update(users).set({ address }).where(eq(users.id, req.user.id));
    res.json({ success: true, message: 'Address added' });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getWishlist = async (req: any, res: Response) => {
  // Mock wishlist since table isn't in schema, but return empty array to fulfill API contract
  res.json({ success: true, data: [] });
};
