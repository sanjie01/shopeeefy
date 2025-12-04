# Cimanes Product Catalog

A simple Shopify-style product catalog built with Next.js.

## Features

- ✅ Product listing with search and tag filter
- ✅ Add new products with form validation
- ✅ View product details
- ✅ Edit and delete products
- ✅ Login and signup pages (Google & Facebook OAuth ready)

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **react-hook-form** - Form handling
- **zod** - Form validation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Open in browser

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
└── lib/
    ├── shopify.ts            # Type definitions
    ├── store.ts              # In-memory data store
    └── validation.ts         # Zod validation schema
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

## Data Storage

Products are stored in localStorage for persistence during development. The store includes sample products to start with.

## Authentication (Optional)

Login and signup pages are ready. To enable Google/Facebook OAuth:

1. Set up OAuth apps in Google Cloud Console and Facebook Developer Portal
2. Create `.env.local` file:
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
