import { pgTable, serial, text, varchar, decimal, timestamp, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Users Table ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('customer').notNull(), // admin, customer, vendor, seller
  address: text('address'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));

// --- Sellers Table ---
export const sellers = pgTable('sellers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  shopName: varchar('shop_name', { length: 255 }).notNull(),
  verified: boolean('verified').default(false).notNull(),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('10.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Categories Table ---
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  parentId: integer('parent_id'), // For hierarchical categories
  icon: text('icon'),
});

// --- Products Table ---
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  brand: varchar('brand', { length: 255 }),
  status: varchar('status', { length: 50 }).default('draft').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  comparePrice: decimal('compare_price', { precision: 12, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }),
  sku: varchar('sku', { length: 100 }).unique(),
  barcode: varchar('barcode', { length: 100 }),
  stock: integer('stock').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5),
  sellerId: integer('seller_id').references(() => sellers.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  images: jsonb('images').default([]), // Array of image URLs
  isFeatured: boolean('is_featured').default(false),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  bulkPricing: jsonb('bulk_pricing'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  titleIdx: index('title_idx').on(table.title),
  priceIdx: index('price_idx').on(table.price),
  statusIdx: index('status_idx').on(table.status),
}));

// --- Product Variants Table ---
export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(), // e.g., "Red / XL"
  price: decimal('price', { precision: 12, scale: 2 }), // Override base price
  stock: integer('stock').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5),
  sku: varchar('sku', { length: 100 }).unique(),
  barcode: varchar('barcode', { length: 100 }),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  dimensions: jsonb('dimensions'), // { length, width, height }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Variant Options Table ---
export const variantOptions = pgTable('variant_options', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // e.g., "Color", "Size"
  values: jsonb('values').notNull(), // Array of strings: ["Red", "Blue"]
});

// --- Cart Table ---
export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Cart Items Table ---
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id').references(() => cart.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Orders Table ---
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, processing, shipped, delivered, cancelled
  paymentStatus: varchar('payment_status', { length: 50 }).default('unpaid').notNull(), // unpaid, paid, failed, refunded
  shippingAddress: text('shipping_address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- Order Items Table ---
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: decimal('price_at_purchase', { precision: 12, scale: 2 }).notNull(),
});

// --- Reviews Table ---
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Coupons Table ---
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  discountType: varchar('discount_type', { length: 50 }).notNull(), // percentage, fixed_amount
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  expiry: timestamp('expiry').notNull(),
  minOrder: decimal('min_order', { precision: 12, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Relations ---
export const usersRelations = relations(users, ({ one, many }) => ({
  sellerProfile: one(sellers, {
    fields: [users.id],
    references: [sellers.userId],
  }),
  orders: many(orders),
  reviews: many(reviews),
  cart: one(cart, {
    fields: [users.id],
    references: [cart.userId],
  }),
}));

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  user: one(users, {
    fields: [sellers.userId],
    references: [users.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [products.sellerId],
    references: [sellers.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  options: many(variantOptions),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const variantOptionsRelations = relations(variantOptions, ({ one }) => ({
  product: one(products, {
    fields: [variantOptions.productId],
    references: [products.id],
  }),
}));

export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
