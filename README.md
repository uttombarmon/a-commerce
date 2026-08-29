# ACommerce - Premium Marketplace Scaffold

A modern, production-ready full-stack e-commerce marketplace monorepo built with Next.js 16, Node.js Express, PostgreSQL, and Drizzle ORM.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack, Standalone Output), Tailwind CSS 4, Framer Motion, Lucide Icons, Zustand, Recharts
- **Backend**: Node.js, Express, TypeScript, Zod, Cookie-Parser, Helmet, CORS, Rate Limiting
- **Database & ORM**: PostgreSQL 15, Drizzle ORM, Drizzle Kit
- **Package Manager**: pnpm Monorepo Workspaces
- **DevOps & Containers**: Docker, Multi-stage Dockerfiles, Docker Compose with automated migrations & health checks

---

## 📁 Project Structure

```text
├── apps/
│   ├── api/            # Express TypeScript REST API (Port 4000)
│   └── web/            # Next.js App Router Frontend (Port 3000)
├── packages/
│   └── database/       # Shared Drizzle Schema, Migrations & Seeds
├── Dockerfile.api      # Multi-stage Dockerfile for API & DB Setup
├── Dockerfile.web      # Multi-stage Dockerfile for Next.js Standalone
├── docker-compose.yml  # PostgreSQL, DB migration, API & Web orchestration
├── package.json        # Monorepo Workspace Root Scripts
├── pnpm-workspace.yaml # pnpm Workspace Configuration
└── .env.example        # Environment Variables Template
```

---

## 🛠️ Getting Started

### 1. Prerequisites

- **Node.js**: >= 20.x
- **pnpm**: >= 9.x (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker & Docker Compose** (for containerized deployment or local PostgreSQL)

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Ensure the database name and credentials match your setup:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/marketplace
JWT_SECRET=your_jwt_secret_change_me
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 🐳 Running with Docker (Recommended)

To build and spin up the complete stack with a single command:

```bash
docker compose up --build -d
```

### What Docker Compose handles automatically:

1. **`postgres`**: Starts PostgreSQL 15 database container with automated healthcheck.
2. **`db-setup`**: Waits for PostgreSQL to be healthy, then automatically runs schema push (`pnpm db:push`).
3. **`api`**: Starts the Express backend on port `4000` after migrations succeed.
4. **`web`**: Starts the optimized standalone Next.js frontend on port `3000`.

### Service URLs:

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **API Base**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **API Health Check**: [http://localhost:4000/health](http://localhost:4000/health)

To view logs:

```bash
docker compose logs -f
```

To stop containers:

```bash
docker compose down
```

---

## 💻 Local Development (Host Machine)

If you prefer developing directly on your host machine:

### 1. Start PostgreSQL Database

```bash
docker compose up postgres -d
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup & Seed Database

```bash
# Push schema to PostgreSQL
pnpm db:push

# (Optional) Seed sample users, sellers, categories, and products
pnpm db:seed
```

### 4. Start Development Servers

```bash
pnpm dev
```

This runs both the Express API and Next.js frontend concurrently in watch mode.

---

## 📜 Monorepo Workspace Scripts

| Script             | Command                               | Description                                    |
| :----------------- | :------------------------------------ | :--------------------------------------------- |
| `pnpm dev`         | `concurrently ...`                    | Start both API & Web in development watch mode |
| `pnpm build`       | `pnpm -r --if-present run build`      | Build all packages (`database`, `api`, `web`)  |
| `pnpm lint`        | `pnpm -r --if-present run lint`       | Run linters across workspace                   |
| `pnpm db:generate` | `pnpm --filter database run generate` | Generate Drizzle migrations                    |
| `pnpm db:push`     | `pnpm --filter database run push`     | Push schema changes directly to PostgreSQL     |
| `pnpm db:seed`     | `pnpm --filter database run seed`     | Seed demo data into the database               |
| `pnpm db:reset`    | `pnpm --filter database run reset`    | Reset and clear public schema                  |
| `pnpm db:studio`   | `pnpm --filter database run studio`   | Launch Drizzle Studio web GUI                  |

---

## 🔑 Demo Seed Accounts

When running `pnpm db:seed`, the following accounts are provisioned:

| Role         | Email                   | Password      |
| :----------- | :---------------------- | :------------ |
| **Admin**    | `admin@marketplace.com` | `password123` |
| **Seller**   | `john@seller.com`       | `password123` |
| **Customer** | `jane@customer.com`     | `password123` |

---

## 🛡️ Security & Architecture

- **JWT Authentication**: Access tokens with short TTL and HttpOnly refresh tokens.
- **Role-Based Access Control**: `protect` and `adminOnly` route middleware.
- **Centralized Error Handling**: Structured error responses across all endpoints.
- **Rate Limiting**: Configured for API protection against brute-force attacks.
- **Standalone Next.js**: Minimal Docker image size with Next.js standalone output tracing.

---

## 📜 License

MIT
