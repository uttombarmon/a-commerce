import { db } from './index';
import { users, sellers, categories, products, coupons } from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Users
  const [adminUser] = await db.insert(users).values({
    name: 'Admin User',
    email: 'admin@marketplace.com',
    passwordHash: 'hashed_password_here',
    role: 'admin',
  }).returning();

  const [sellerUser] = await db.insert(users).values({
    name: 'John Seller',
    email: 'john@seller.com',
    passwordHash: 'hashed_password_here',
    role: 'seller',
  }).returning();

  const [customerUser] = await db.insert(users).values({
    name: 'Jane Customer',
    email: 'jane@customer.com',
    passwordHash: 'hashed_password_here',
    role: 'customer',
    address: '123 Main St, New York, NY',
  }).returning();

  // 2. Seed Sellers
  const [sellerProfile] = await db.insert(sellers).values({
    userId: sellerUser.id,
    shopName: 'John\'s Tech Shop',
    verified: true,
    commissionRate: '8.50',
  }).returning();

  // 3. Seed Categories
  const [electronics] = await db.insert(categories).values({
    name: 'Electronics',
    slug: 'electronics',
    icon: 'cpu',
  }).returning();

  const [laptops] = await db.insert(categories).values({
    name: 'Laptops',
    slug: 'laptops',
    parentId: electronics.id,
    icon: 'laptop',
  }).returning();

  // 4. Seed Products
  await db.insert(products).values([
    {
      title: 'MacBook Pro 14"',
      slug: 'macbook-pro-14',
      description: 'The most powerful MacBook ever.',
      price: '1999.00',
      comparePrice: '2199.00',
      sku: 'MBP14-001',
      stock: 50,
      sellerId: sellerProfile.id,
      categoryId: laptops.id,
      images: ['https://example.com/mbp14.jpg'],
      isFeatured: true,
    },
    {
      title: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Stunning display and performance.',
      price: '1599.00',
      sku: 'XPS15-001',
      stock: 30,
      sellerId: sellerProfile.id,
      categoryId: laptops.id,
      images: ['https://example.com/xps15.jpg'],
    }
  ]);

  // 5. Seed Coupons
  await db.insert(coupons).values({
    code: 'WELCOME10',
    discountType: 'percentage',
    amount: '10.00',
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minOrder: '100.00',
  });

  console.log('Seeding completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
