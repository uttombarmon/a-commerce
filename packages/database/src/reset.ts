import { db } from './index';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function main() {
  console.log('Resetting database...');
  await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
  console.log('Database reset completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
