# ITC 130 - APPLICATION DEVELOPMENT IN EMERGING TECHNOLOGIES - EXAM

## DAVAO ORIENTAL STATE UNIVERSITY
A university of excellence, innovation, and inclusion
Republic of the Philippines

---

## I. INSTRUCTIONS

- Create a typed, functional Next.js + TypeScript project that implements a small Shopify-style product catalog and admin features.
- The project must be functional locally, well-typed, and pushed to GitHub. Use the App Router.

---

## II. PROJECT SETUP / FEATURES

### Technical Requirements:
- Next.js (latest) with the App Router and TypeScript.
- Tailwind CSS for styling and responsive layout.
- Use react-hook-form + zod for type-safe form validation.
- Implement persistence as:
  - **Default**: in-memory store + /api/products API routes + localStorage for dev persistence.
  - **Optional**: Prisma + a SQL DB (instructions included).
- Provide clear TypeScript interfaces that follow Shopify product schema conventions.
- Provide a basic navbar and responsive product cards (thumbnail image, title, vendor, price, created/published date).
- Push the final project to GitHub with a README explaining how to run it.
- Implement user login and signup using BetterAuth or NextAuth. Enable the Google and Facebook login.

---

## Pages & Routes (App Router)

### 1. /products (GET)
- Displays a paginated list of products.
- Each card shows: thumbnail, title, vendor, price (lowest variant), published/created date, and link to details.
- Support filtering by tag and search by title.

### 2. /products/add (GET/POST page)
- Form (client-side) to create a product.
- Uses react-hook-form + zod schema.
- Allows adding:
  - **title** (required)
  - **description** (min 50 chars)
  - **vendor** (required)
  - **product_type** (optional)
  - **tags** (comma separated)
  - **images** (upload or paste URL — for dev, accept URLs or pick static images)
  - **options** (e.g., Size, Color)
  - **variants** (at least one variant with price > 0)
- On submit, POST to /api/products with strongly typed body; display error handling.

### 3. /products/[id]
- Shows full product details: images carousel, description (render HTML or sanitized), variants table, inventory, SKU, tags, vendor, created/published dates.
- Admin controls: Edit, Delete (calls PUT/DELETE to /api/products/[id]).

### 4. Optional: /collections or /admin pages (extra credit).

---

## Type Definitions (Given)
```typescript
// lib/shopify.ts
export type ProductID = string;

export interface ShopifyImage {
  id?: string;
  src: string; // URL or local path
  alt?: string;
  width?: number;
  height?: number;
}

export interface ShopifyOption {
  id?: string;
  name: string; // e.g., "Size", "Color"
  values: string[]; // e.g., ["S", "M", "L"]
}

export interface ShopifyVariant {
  id?: string;
  sku?: string;
  title?: string; // e.g., "Blue / M"
  price: number; // In decimal (e.g., 19.99)
  compare_at_price?: number | null;
  inventory_quantity?: number;
  requires_shipping?: boolean;
  taxable?: boolean;
  option_values?: string[]; // Variant values corresponding to options' order
}

export interface ShopifyProduct {
  id: ProductID;
  title: string;
  body_html?: string; // Description, potentially HTML
  vendor?: string; // Brand / vendor
  product_type?: string;
  tags?: string[]; // Categories / tags
  images?: ShopifyImage[];
  options?: ShopifyOption[];
  variants: ShopifyVariant[];
  created_at: string; // ISO date string
  published_at?: string | null;
  handle?: string; // Slug
  status?: 'active' | 'draft' | 'archived';
}
```

---

## III. ASSESSMENT CRITERIA

### Grading Rubric (100 pts)

| Category | Points | Description |
|----------|--------|-------------|
| **Project Setup & Structure** | 10 | App Router used, TypeScript enabled, Tailwind installed, README + scripts included. |
| **Type Definitions** | 10 | ShopifyProduct, ShopifyVariant, ShopifyOption, ShopifyImage typed and used. |
| **Product Pages** | 20 | /products, /products/add, /products/[id] implemented and typed. |
| **Product Add Page Validation** | 15 | Form uses react-hook-form + zod, validates required rules, submits to API. |
| **API Routes** | 10 | /api/products and /api/products/[id] with typed responses and validation. |
| **Rendering & Linking** | 10 | Product listing, detail page, linking, error handling. |
| **Styling & Responsiveness** | 10 | Navbar present, Tailwind used, mobile responsive layout. |
| **Bonus** | 5 | Optional: Prisma + DB, import/export Shopify JSON, unit tests, collections. |

**Total: 100 points + 5 bonus points**

---

## Key Features Checklist

### Must Have:
- ✅ Next.js App Router with TypeScript
- ✅ Tailwind CSS styling
- ✅ react-hook-form + zod validation
- ✅ In-memory store + localStorage
- ✅ BetterAuth or NextAuth (Google + Facebook)
- ✅ Product listing with pagination
- ✅ Product add form with validation
- ✅ Product detail page with edit/delete
- ✅ API routes (/api/products and /api/products/[id])
- ✅ Filtering by tag and search by title
- ✅ Responsive navbar and product cards
- ✅ GitHub repository with README

### Optional (Bonus):
- ⭐ Prisma + SQL Database
- ⭐ Collections page
- ⭐ Admin pages
- ⭐ Import/Export Shopify JSON
- ⭐ Unit tests

---

## API Routes Required

### GET /api/products
- Returns list of products
- Supports query params: ?search=query&tag=tagname&page=1

### POST /api/products
- Creates new product
- Validates with zod schema
- Returns created product

### GET /api/products/[id]
- Returns single product by ID

### PUT /api/products/[id]
- Updates product by ID
- Validates with zod schema

### DELETE /api/products/[id]
- Deletes product by ID
- Returns success response

---

## Form Validation Rules (Zod Schema)

- **title**: Required, string, min 1 character
- **description**: Required, string, min 50 characters
- **vendor**: Required, string, min 1 character
- **product_type**: Optional, string
- **tags**: Optional, array of strings (comma-separated input)
- **images**: Optional, array of image objects with src (URL)
- **options**: Optional, array of option objects (name + values array)
- **variants**: Required, array with at least 1 variant
  - Each variant must have price > 0
  - Price is a number (decimal)
  - Optional fields: sku, title, inventory_quantity, etc.

---

## Authentication Requirements

Using **BetterAuth** or **NextAuth**:
- Implement login page
- Implement signup page
- Enable Google OAuth provider
- Enable Facebook OAuth provider
- Protect admin routes (add, edit, delete)
- Show user info in navbar when logged in

---

## README.md Requirements

Include:
1. Project title and description
2. Features implemented
3. Tech stack used
4. Installation instructions
5. How to run locally
6. Environment variables needed
7. API endpoints documentation
8. Screenshots (optional)
9. Bonus features implemented (if any)

Example:
```markdown
# Shopify Product Catalog

## Installation
npm install

## Run Development Server
npm run dev

## Environment Variables
Create .env.local with:
- GOOGLE_CLIENT_ID=your_id
- GOOGLE_CLIENT_SECRET=your_secret
- FACEBOOK_CLIENT_ID=your_id
- FACEBOOK_CLIENT_SECRET=your_secret

## Features
- Product listing with search and filter
- Add/Edit/Delete products
- Form validation with zod
- Authentication with Google and Facebook
```

---

## Submission Checklist

Before submitting:
- [ ] All pages render without errors
- [ ] TypeScript has no errors (npm run build passes)
- [ ] Forms validate correctly
- [ ] API routes work with proper types
- [ ] Authentication works (Google + Facebook)
- [ ] Responsive on mobile and desktop
- [ ] Code pushed to GitHub
- [ ] README.md is complete and clear
- [ ] Can run locally with npm install && npm run dev

---

**Panel: JOHN RAY D. PAULIN**