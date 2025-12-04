// Type definitions from the exam requirements
// These follow the Shopify product schema

export type ProductID = string;

export interface ShopifyImage {
  id?: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ShopifyOption {
  id?: string;
  name: string;
  values: string[];
}

export interface ShopifyVariant {
  id?: string;
  sku?: string;
  title?: string;
  price: number;
  compare_at_price?: number | null;
  inventory_quantity?: number;
  requires_shipping?: boolean;
  taxable?: boolean;
  option_values?: string[];
}

export interface ShopifyProduct {
  id: ProductID;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[];
  images?: ShopifyImage[];
  options?: ShopifyOption[];
  variants: ShopifyVariant[];
  created_at: string;
  published_at?: string | null;
  handle?: string;
  status?: "active" | "draft" | "archived";
}

// Simple helper to generate unique IDs
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

// Format price as currency
export function formatPrice(price: number): string {
  return "$" + price.toFixed(2);
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
