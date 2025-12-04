import { ShopifyProduct } from "./shopify";
import { generateId } from "./shopify";

// Key for localStorage
const STORAGE_KEY = "products";

// Sample products to start with
const sampleProducts: ShopifyProduct[] = [
  {
    id: "product-1",
    title: "Leather Messenger Bag",
    body_html:
      "A beautiful handcrafted leather messenger bag. Perfect for work or school. Features multiple pockets and adjustable strap.",
    vendor: "Artisan Bags",
    product_type: "Bags",
    tags: ["leather", "bag", "handmade"],
    status: "active",
    variants: [
      {
        id: "variant-1",
        title: "Brown",
        price: 149.99,
        compare_at_price: 199.99,
        sku: "BAG-001",
        inventory_quantity: 10,
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Brown", "Black", "Tan"],
      },
    ],
    images: [
      {
        id: "img-1",
        src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
        alt: "Leather bag front",
      },
      {
        id: "img-1b",
        src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        alt: "Leather bag side",
      },
      {
        id: "img-1c",
        src: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800",
        alt: "Leather bag detail",
      },
    ],
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "product-2",
    title: "Ceramic Coffee Mug",
    body_html:
      "Handmade ceramic mug with a beautiful glazed finish. Holds 12oz of your favorite beverage. Dishwasher and microwave safe.",
    vendor: "Home Ceramics",
    product_type: "Kitchen",
    tags: ["ceramic", "mug", "kitchen"],
    status: "active",
    variants: [
      {
        id: "variant-2",
        title: "White",
        price: 24.99,
        sku: "MUG-001",
        inventory_quantity: 25,
      },
    ],
    images: [
      {
        id: "img-2",
        src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
        alt: "Ceramic mug",
      },
    ],
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "product-3",
    title: "Wireless Headphones",
    body_html:
      "Premium wireless headphones with noise cancellation. 20 hour battery life. Comfortable over-ear design for all day use.",
    vendor: "Tech Audio",
    product_type: "Electronics",
    tags: ["audio", "wireless", "headphones"],
    status: "draft",
    variants: [
      {
        id: "variant-3",
        title: "Black",
        price: 199.99,
        sku: "HP-001",
        inventory_quantity: 0,
      },
    ],
    images: [
      {
        id: "img-3",
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        alt: "Headphones",
      },
    ],
    created_at: new Date().toISOString(),
    published_at: null,
  },
];

// Get all products from localStorage
export function getProducts(): ShopifyProduct[] {
  if (typeof window === "undefined") {
    return sampleProducts;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  // First time - save sample products
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProducts));
  return sampleProducts;
}

// Get one product by ID
export function getProductById(id: string): ShopifyProduct | null {
  const products = getProducts();
  const product = products.find((p) => p.id === id);
  return product || null;
}

// Create a new product
export function createProduct(
  data: Omit<ShopifyProduct, "id" | "created_at">
): ShopifyProduct {
  const products = getProducts();

  const newProduct: ShopifyProduct = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
    published_at: data.status === "active" ? new Date().toISOString() : null,
  };

  products.unshift(newProduct); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  return newProduct;
}

// Update a product
export function updateProduct(
  id: string,
  data: Partial<ShopifyProduct>
): ShopifyProduct | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  const updated = { ...products[index], ...data };
  products[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  return updated;
}

// Delete a product
export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return false; // Nothing was deleted
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Search products by title
export function searchProducts(query: string): ShopifyProduct[] {
  const products = getProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter((p) => p.title.toLowerCase().includes(lowerQuery));
}

// Filter products by tag
export function filterByTag(tag: string): ShopifyProduct[] {
  const products = getProducts();
  const lowerTag = tag.toLowerCase();

  return products.filter((p) =>
    p.tags?.some((t) => t.toLowerCase() === lowerTag)
  );
}

// Get all unique tags
export function getAllTags(): string[] {
  const products = getProducts();
  const tags = new Set<string>();

  products.forEach((p) => {
    p.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
