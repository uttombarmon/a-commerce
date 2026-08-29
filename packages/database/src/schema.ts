import {
  pgTable,
  serial,
  text,
  varchar,
  decimal,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
  PgColumn,
  PgTableWithColumns,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Users Table ---
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash"), // Nullable for OAuth-only users
    role: varchar("role", { length: 50 }).default("customer").notNull(), // admin, customer, vendor, seller
    address: text("address"),
    avatar: text("avatar"),
    emailVerified: timestamp("email_verified"),
    twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
    twoFactorSecret: text("two_factor_secret"),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockedUntil: timestamp("locked_until"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
  }),
);

// --- Addresses Table ---
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zip: varchar("zip", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Sellers Table ---
export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  shopName: varchar("shop_name", { length: 255 }).notNull(),
  verified: boolean("verified").default(false).notNull(),
  commissionRate: decimal("commission_rate", {
    precision: 5,
    scale: 2,
  }).default("10.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Categories Table ---
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: integer("parent_id"), // For hierarchical categories
  icon: text("icon"),
});

// --- Products Table ---
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    brand: varchar("brand", { length: 255 }),
    status: varchar("status", { length: 50 }).default("draft").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    comparePrice: decimal("compare_price", { precision: 12, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 12, scale: 2 }),
    sku: varchar("sku", { length: 100 }).unique(),
    barcode: varchar("barcode", { length: 100 }),
    stock: integer("stock").default(0).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(5),
    sellerId: integer("seller_id")
      .references(() => sellers.id)
      .notNull(),
    categoryId: integer("category_id").references(() => categories.id),
    images: jsonb("images").default([]), // Array of image URLs
    isFeatured: boolean("is_featured").default(false),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    bulkPricing: jsonb("bulk_pricing"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    titleIdx: index("title_idx").on(table.title),
    priceIdx: index("price_idx").on(table.price),
    statusIdx: index("status_idx").on(table.status),
  }),
);

// --- Product Variants Table ---
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Red / XL"
  price: decimal("price", { precision: 12, scale: 2 }), // Override base price
  stock: integer("stock").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  sku: varchar("sku", { length: 100 }).unique(),
  barcode: varchar("barcode", { length: 100 }),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: jsonb("dimensions"), // { length, width, height }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Variant Options Table ---
export const variantOptions = pgTable("variant_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  type: varchar("type", { length: 100 }).notNull(), // e.g., "Color", "Size"
  values: jsonb("values").notNull(), // Array of strings: ["Red", "Blue"]
});

// --- Cart Table ---
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(), // active, abandoned, converted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Cart Items Table ---
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .references(() => cart.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Wishlists Table ---
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Wishlist Items Table ---
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  wishlistId: integer("wishlist_id")
    .references(() => wishlists.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: integer("variant_id").references(() => productVariants.id),
  addedPrice: decimal("added_price", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Product Alerts Table ---
export const productAlerts = pgTable("product_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: integer("variant_id").references(() => productVariants.id),
  type: varchar("type", { length: 50 }).notNull(), // 'price_drop', 'restock'
  notified: boolean("notified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Abandoned Cart Logs Table ---
export const abandonedCartLogs = pgTable("abandoned_cart_logs", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .references(() => cart.id)
    .notNull(),
  emailSentAt: timestamp("email_sent_at").defaultNow().notNull(),
  recovered: boolean("recovered").default(false).notNull(),
});

// --- OAuth Accounts Table ---
export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    provider: varchar("provider", { length: 50 }).notNull(), // google, facebook
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    providerIdx: index("provider_idx").on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

// --- Sessions Table ---
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  refreshToken: text("refresh_token").notNull().unique(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Verification Tokens Table ---
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(), // usually email
    token: text("token").notNull().unique(),
    type: varchar("type", { length: 50 }).notNull(), // 'email_verification', 'password_reset'
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    identifierIdx: index("identifier_idx").on(table.identifier, table.token),
  }),
);

// --- Orders Table ---
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).notNull().default("0"),
  shippingFee: decimal("shipping_fee", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, processing, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 50 })
    .default("unpaid")
    .notNull(), // unpaid, paid, failed, refunded
  paymentMethod: varchar("payment_method", { length: 50 }), // credit_card, bkash, nagad, cod, sslcommerz
  shippingMethod: varchar("shipping_method", { length: 50 }), // standard, express, same_day
  shippingAddress: jsonb("shipping_address").notNull(), // Snapshot of address
  deliveryDate: timestamp("delivery_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Order Items Table ---
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: decimal("price_at_purchase", {
    precision: 12,
    scale: 2,
  }).notNull(),
});

// --- Reviews Table ---
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  pros: text("pros"),
  cons: text("cons"),
  images: jsonb("images").default([]),
  helpfulVotes: integer("helpful_votes").default(0).notNull(),
  verifiedPurchase: boolean("verified_purchase").default(false).notNull(),
  sellerResponse: text("seller_response"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Coupons Table ---
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 50 }).notNull(), // percentage, fixed_amount
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  expiry: timestamp("expiry").notNull(),
  minOrder: decimal("min_order", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  wishlists: many(wishlists),
  productAlerts: many(productAlerts),
  addresses: many(addresses),
  oauthAccounts: many(oauthAccounts),
  sessions: many(sessions),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
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
  wishlistItems: many(wishlistItems),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    cartItems: many(cartItems),
    wishlistItems: many(wishlistItems),
  }),
);

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
  abandonedLog: one(abandonedCartLogs, {
    fields: [cart.id],
    references: [abandonedCartLogs.cartId],
  }),
}));

export const abandonedCartLogsRelations = relations(
  abandonedCartLogs,
  ({ one }) => ({
    cart: one(cart, {
      fields: [abandonedCartLogs.cartId],
      references: [cart.id],
    }),
  }),
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  items: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [wishlistItems.variantId],
    references: [productVariants.id],
  }),
}));

export const productAlertsRelations = relations(productAlerts, ({ one }) => ({
  user: one(users, {
    fields: [productAlerts.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [productAlerts.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productAlerts.variantId],
    references: [productVariants.id],
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

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
