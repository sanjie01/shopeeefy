# Cimanes Product Catalog

A Shopify-style product catalog built with Next.js and MySQL.

## Features

- ✅ Product listing with search and tag filter
- ✅ Add new products with form validation
- ✅ View product details
- ✅ Edit and delete products
- ✅ MySQL database with Prisma ORM
- ✅ Login and signup pages (Google & Facebook OAuth ready)

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **Prisma 5** - Database ORM
- **MySQL** - Database (XAMPP)
- **react-hook-form** - Form handling
- **zod** - Form validation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up MySQL Database

1. Start **MySQL** in XAMPP Control Panel
2. Open phpMyAdmin at http://localhost/phpmyadmin
3. Create a new database named `shopify`

### 3. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="mysql://root:@localhost:3306/shopify"
```

> Note: Adjust username/password if your MySQL has different credentials.

### 4. Push database schema

```bash
npm run db:push
```

This creates the following tables:
- `products` - Main product info
- `product_variants` - Price, SKU, inventory
- `product_images` - Product images
- `product_options` - Size, Color options
- `product_tags` - Product tags

### 5. Seed sample data (optional)

```bash
npm run db:seed
```

This adds 3 sample products to the database.

### 7. Run the development server

```bash
npm run dev
```

### 8. Open in browser

Go to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Main layout with navbar
│   ├── globals.css           # Global styles
│   ├── products/
│   │   ├── page.tsx          # Product listing
│   │   ├── add/page.tsx      # Add product form
│   │   └── [id]/
│   │       ├── page.tsx      # Product details
│   │       └── edit/page.tsx # Edit product form
│   ├── (auth)/
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Signup page
│   └── api/products/
│       ├── route.ts          # GET and POST products
│       └── [id]/route.ts     # GET, PUT, DELETE single product
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   └── ProductCard.tsx       # Product card component
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── shopify.ts            # Type definitions
│   ├── store.ts              # Database operations (Prisma)
│   └── validation.ts         # Zod validation schema
└── prisma/
    └── schema.prisma         # Database schema
```

## Database Schema

```
┌─────────────────┐
│    products     │
├─────────────────┤
│ id              │
│ title           │
│ body_html       │
│ vendor          │
│ product_type    │
│ status          │
│ created_at      │
│ published_at    │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│variants│ │ images │ │options │ │  tags  │
└────────┘ └────────┘ └────────┘ └────────┘
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/products | Get all products |
| GET | /api/products?search=query | Search products |
| GET | /api/products?tag=tagname | Filter by tag |
| POST | /api/products | Create new product |
| GET | /api/products/[id] | Get single product |
| PUT | /api/products/[id] | Update product |
| DELETE | /api/products/[id] | Delete product |

## Form Validation (Zod)

The product form validates:
- **title** - Required
- **body_html** - Required, minimum 50 characters
- **vendor** - Required
- **price** - Required, must be greater than 0

## NPM Scripts

```bash
# Push schema to database
npm run db:push

# Seed database with sample products
npm run db:seed

# Open Prisma Studio (GUI for database)
npm run db:studio

# Generate Prisma Client
npx prisma generate
```

## Authentication (Optional)

Login and signup pages are ready. To enable Google/Facebook OAuth:

1. Set up OAuth apps in Google Cloud Console and Facebook Developer Portal
2. Add to `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_secret
   FACEBOOK_CLIENT_ID=your_client_id
   FACEBOOK_CLIENT_SECRET=your_secret
   ```
3. Install and configure BetterAuth or NextAuth

## Screenshots

- **Home**: Landing page with links to products
- **Products**: Grid of product cards with search/filter
- **Add Product**: Form with validation
- **Product Detail**: Full product info with edit/delete

---

Built for ITC 130 - Application Development in Emerging Technologies
