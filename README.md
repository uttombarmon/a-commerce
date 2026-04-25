# ACommerce - Premium Marketplace Scaffold

A production-ready, full-stack e-commerce marketplace scaffold built with Next.js 16, Node.js, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (Turbopack), Tailwind CSS 4, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Security**: JWT Authentication, Helmet, CORS, Rate Limiting
- **DevOps**: Docker Compose for Database

## 📁 Project Structure

\`\`\`
├── apps/
│   ├── api/            # Node.js Express Backend
│   └── web/            # Next.js Frontend
├── packages/
│   ├── database/       # Drizzle Schema & Migrations
│   └── shared/         # Shared Types and Utils
├── docker-compose.yml  # PostgreSQL Configuration
├── package.json        # Monorepo Workspace Root
└── .env.example        # Environment Variables Template
\`\`\`

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 2. Setup Environment Variables
Copy the example environment variables to a new \`.env\` file in the root:
\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Start the Database
Spin up the PostgreSQL container:
\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Install Dependencies
Install all packages from the root directory:
\`\`\`bash
npm install
\`\`\`

### 5. Database Setup
Generate and push the schema to the database:
\`\`\`bash
npm run db:generate
npm run db:push
\`\`\`

### 6. Run the Application
Start both the API and Web applications in development mode:
\`\`\`bash
npm run dev
\`\`\`

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **API Health**: http://localhost:4000/health

## 🛡️ Core Middleware (Backend)

- **Auth**: \`protect\` and \`adminOnly\` middleware for JWT validation.
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
