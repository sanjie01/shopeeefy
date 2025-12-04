import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  createProduct,
  searchProducts,
  filterByTag,
} from "@/lib/store";
import { productSchema } from "@/lib/validation";

// GET /api/products
// Get all products, with optional search and tag filter
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");

  let products;

  if (search) {
    products = searchProducts(search);
  } else if (tag) {
    products = filterByTag(tag);
  } else {
    products = getProducts();
  }

  return NextResponse.json({ products });
}

// POST /api/products
// Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with zod
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // Build options array if provided
    const options = [];
    if (data.option_name && data.option_values) {
      options.push({
        name: data.option_name,
        values: data.option_values.split(",").map((v) => v.trim()),
      });
    }

    // Convert form data to product format
    const product = createProduct({
      title: data.title,
      body_html: data.body_html,
      vendor: data.vendor,
      product_type: data.product_type || "",
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      status: data.status,
      images: data.image_url ? [{ src: data.image_url }] : [],
      options: options.length > 0 ? options : undefined,
      variants: [
        {
          title: "Default",
          price: parseFloat(data.price),
          sku: data.sku || "",
          inventory_quantity: data.inventory ? parseInt(data.inventory) : 0,
        },
      ],
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
