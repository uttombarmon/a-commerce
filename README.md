# ACommerce - Premium Marketplace Scaffold

A production-ready, full-stack e-commerce marketplace scaffold built with Next.js 16, Node.js, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (Turbopack), Tailwind CSS 4, Framer Motion, Lucide Icons, Zustand, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Security**: JWT Authentication, 2FA (OTP/QR), Helmet, CORS, Rate Limiting
- **DevOps**: Docker Compose for Database

## 📁 Project Structure

```bash
├── apps/
│   ├── api/            # Node.js Express Backend
│   └── web/            # Next.js Frontend
├── packages/
│   └── database/       # Drizzle Schema & Migrations
├── docker-compose.yml  # PostgreSQL Configuration
├── package.json        # Monorepo Workspace Root
└── .env.example        # Environment Variables Template
```

## 🛠️ Getting Started

The project is fully dockerized, making it easy to spin up the entire application stack (Frontend, Backend, and Database) with a single command.

### 1. Prerequisites
- Docker & Docker Compose

### 2. Setup Environment Variables
Copy the example environment variables to a new `.env` file in the root directory:
```bash
cp .env.example .env
```

### 3. Run the Application (Docker)
Build and start all the containers:
```bash
docker compose up --build -d
```
*This command will automatically spin up the PostgreSQL database, run the necessary Drizzle database migrations, and start both the Express API and Next.js Web applications.*

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **API Health**: http://localhost:4000/health

### (Optional) Local Development Without Full Docker Stack
If you prefer to run the Node.js apps locally on your host machine for development:

1. **Start the database only**:
   ```bash
   docker compose up postgres -d
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Database Setup**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run seed --workspace=database
   ```
4. **Run Dev Servers**:
   ```bash
   npm run dev
   ```

## 🛡️ Core Middleware (Backend)

- **Auth**: `protect` and `adminOnly` middleware for JWT validation.
- **Error Handling**: Centralized error middleware with structured JSON responses.
- **Rate Limiting**: Protected endpoints limited to 100 requests per 15 minutes.

## 🗄️ Database Schema

The platform includes a comprehensive schema for:
- **Users**: Authentication and role-based access control.
- **Products & Categories**: Catalog management with hierarchical categories.
- **Orders & Items**: Full order tracking and history.
- **Cart**: User cart management.
- **Reviews**: Product rating system.

## 📜 License
MIT
