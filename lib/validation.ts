import { z } from "zod";

// Zod schema for product form validation
// Based on exam requirements

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),

  body_html: z
    .string()
    .min(50, "Description must be at least 50 characters"),

  vendor: z.string().min(1, "Vendor is required"),

  product_type: z.string().optional(),

  tags: z.string().optional(), // Comma separated, we'll split later

  image_url: z.string().optional(), // Single image URL for simplicity

  status: z.enum(["active", "draft", "archived"]),

  // Variant fields
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => parseFloat(val) > 0, "Price must be greater than 0"),

  sku: z.string().optional(),

  inventory: z.string().optional(),
});

// Type for our form data
export type ProductFormData = z.infer<typeof productSchema>;
