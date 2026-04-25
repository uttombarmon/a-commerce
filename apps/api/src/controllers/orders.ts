import { Response } from 'express';
import { db, cart, cartItems, orders, orderItems, products } from 'database';
import { eq, and } from 'drizzle-orm';

export const createOrder = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { shippingAddress } = req.body;
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    if (!userCart.length) return res.status(400).json({ message: 'Cart not found' });
    const items = await db.select({ productId: cartItems.productId, quantity: cartItems.quantity, price: products.price, stock: products.stock })
      .from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(eq(cartItems.cartId, userCart[0].id));
    if (!items.length) return res.status(400).json({ message: 'Cart is empty' });
    let total = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    const order = await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values({ userId, total: total.toString(), shippingAddress, status: 'pending' }).returning();
      await tx.insert(orderItems).values(items.map(item => ({ orderId: newOrder.id, productId: item.productId, quantity: item.quantity, priceAtPurchase: item.price })));
      for (const item of items) await tx.update(products).set({ stock: item.stock - item.quantity }).where(eq(products.id, item.productId));
      await tx.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));
      return newOrder;
    });
    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, req.user.id));
    res.json({ success: true, data: userOrders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const [order] = await db.select().from(orders).where(and(eq(orders.id, parseInt(id)), eq(orders.userId, req.user.id))).limit(1);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const items = await db.select({ id: orderItems.id, quantity: orderItems.quantity, price: orderItems.priceAtPurchase, product: { title: products.title, images: products.images } })
      .from(orderItems).innerJoin(products, eq(orderItems.productId, products.id)).where(eq(orderItems.orderId, order.id));
    res.json({ success: true, data: { ...order, items } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await db.update(orders).set({ status: 'cancelled' }).where(and(eq(orders.id, parseInt(id)), eq(orders.userId, req.user.id), eq(orders.status, 'pending')));
    res.json({ success: true, message: 'Order cancelled' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const [order] = await db.select({ status: orders.status }).from(orders).where(and(eq(orders.id, parseInt(id)), eq(orders.userId, req.user.id))).limit(1);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Mock tracking steps based on status
    const steps = [
      { status: 'pending', completed: true },
      { status: 'processing', completed: order.status !== 'pending' && order.status !== 'cancelled' },
      { status: 'shipped', completed: order.status === 'shipped' || order.status === 'delivered' },
      { status: 'delivered', completed: order.status === 'delivered' }
    ];
    
    res.json({ success: true, data: { status: order.status, tracking: steps } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
