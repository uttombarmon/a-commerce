import { Request, Response } from 'express';
import { db, categories } from 'database';
import { eq } from 'drizzle-orm';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories);
    const tree = allCategories.filter(c => !c.parentId).map(parent => ({
      ...parent,
      children: allCategories.filter(c => c.parentId === parent.id)
    }));
    res.json({ success: true, data: tree });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await db.select().from(categories).where(eq(categories.id, parseInt(id))).limit(1);
    if (!category.length) return res.status(404).json({ success: false, message: 'Category not found' });
    const children = await db.select().from(categories).where(eq(categories.parentId, category[0].id));
    res.json({ success: true, data: { ...category[0], children } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const [newCategory] = await db.insert(categories).values(req.body).returning();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updatedCategory] = await db.update(categories).set(req.body).where(eq(categories.id, parseInt(id))).returning();
    if (!updatedCategory) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: updatedCategory });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};
