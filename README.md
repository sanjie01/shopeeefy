# Cimanes Product Catalog

A Shopify-style product catalog built with Next.js and MySQL.

## Features

- Product listing with search and tag filter
- Add, edit, and delete products
- Form validation with Zod
- MySQL database with Prisma ORM

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + MySQL
- react-hook-form + Zod

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up MySQL

1. Start MySQL in XAMPP
2. Create database named `shopify` in phpMyAdmin

### 3. Configure environment

Create `.env` file:

```
DATABASE_URL="mysql://root:@localhost:3306/shopify"
```

### 4. Create tables

```bash
npm run db:push
```

### 5. Seed sample data (optional)

```bash
npm run db:seed
```

### 6. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/products | Get all products |
| POST | /api/products | Create product |
| GET | /api/products/[id] | Get single product |
| PUT | /api/products/[id] | Update product |
| DELETE | /api/products/[id] | Delete product |

## NPM Scripts

```bash
npm run dev        # Start dev server
npm run db:push    # Push schema to database
npm run db:seed    # Seed sample products
npm run db:studio  # Open Prisma Studio
```

---

Built for ITC 130 - Application Development in Emerging Technologies
