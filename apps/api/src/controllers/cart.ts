import { Request, Response } from 'express';
import { db, cart, cartItems, products } from 'database';
import { eq, and } from 'drizzle-orm';

export const getCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    let userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    if (!userCart.length) {
      const [newCart] = await db.insert(cart).values({ userId }).returning();
      return res.json({ success: true, data: { ...newCart, items: [] } });
    }
    const items = await db.select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: { id: products.id, title: products.title, price: products.price, images: products.images }
    })
    .from(cartItems).innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, userCart[0].id));
    res.json({ success: true, data: { ...userCart[0], items } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    let userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    const cartId = userCart.length ? userCart[0].id : (await db.insert(cart).values({ userId }).returning())[0].id;

    const existingItem = await db.select().from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))).limit(1);

    if (existingItem.length) {
      await db.update(cartItems).set({ quantity: existingItem[0].quantity + quantity }).where(eq(cartItems.id, existingItem[0].id));
    } else {
      await db.insert(cartItems).values({ cartId, productId, quantity });
    }
    res.json({ success: true, message: 'Item added to cart' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, parseInt(id)));
    res.json({ success: true, message: 'Cart updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(cartItems).where(eq(cartItems.id, parseInt(id)));
    res.json({ success: true, message: 'Item removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req: any, res: Response) => {
  try {
    const userCart = await db.select().from(cart).where(eq(cart.userId, req.user.id)).limit(1);
    if (userCart.length) await db.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
