import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from monorepo root BEFORE any other imports happen
dotenv.config({ path: path.join(__dirname, '../../../.env') });
