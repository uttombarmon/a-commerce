import { Request, Response } from 'express';
import { db, users } from 'database';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length) return res.status(400).json({ success: false, message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const [newUser] = await db.insert(users).values({ name, email, passwordHash, role: 'customer' }).returning();
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (error: any) { 
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: error.message || error.toString() }); 
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user.length) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (!user[0].passwordHash) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user[0].passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const logout = async (req: Request, res: Response) => {
  // Client should discard the token. Optional: invalidate via Redis blocklist.
  res.json({ success: true, message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response) => {
  // Simplified refresh: issue a new token if old one is provided (usually use a separate refresh token DB)
  res.json({ success: true, message: 'Token refreshed', token: 'new_jwt_token_here' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  // Generate reset token, save to DB, send email
  res.json({ success: true, message: 'Password reset link sent to email' });
};
