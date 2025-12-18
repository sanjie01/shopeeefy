import { prisma } from "./prisma";
import { ShopifyProduct } from "./shopify";
import { generateId } from "./shopify";

// Helper: Convert DB record to ShopifyProduct format
function toShopifyProduct(dbProduct: any): ShopifyProduct {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    body_html: dbProduct.body_html || undefined,
    vendor: dbProduct.vendor || undefined,
    product_type: dbProduct.product_type || undefined,
    handle: dbProduct.handle || undefined,
    status: dbProduct.status as "active" | "draft" | "archived",
    created_at: dbProduct.created_at.toISOString(),
    published_at: dbProduct.published_at?.toISOString() || null,
    tags: dbProduct.tags?.map((t: any) => t.name) || [],
    images: dbProduct.images?.map((img: any) => ({
      id: img.id,
      src: img.src,
      alt: img.alt || undefined,
      width: img.width || undefined,
      height: img.height || undefined,
    })) || [],
    options: dbProduct.options?.map((opt: any) => ({
      id: opt.id,
      name: opt.name,
      values: opt.values.split(",").map((v: string) => v.trim()),
    })) || [],
    variants: dbProduct.variants?.map((v: any) => ({
      id: v.id,
      title: v.title || undefined,
      price: parseFloat(v.price),
      compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
      sku: v.sku || undefined,
      inventory_quantity: v.inventory_quantity,
    })) || [],
  };
}

// Include all relations in queries
const includeAll = {
  variants: true,
  images: true,
  options: true,
  tags: true,
};

// Get all products
export async function getProducts(): Promise<ShopifyProduct[]> {
  const products = await prisma.product.findMany({
    include: includeAll,
    orderBy: { created_at: "desc" },
  });
  return products.map(toShopifyProduct);
}

// Get one product by ID
export async function getProductById(id: string): Promise<ShopifyProduct | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: includeAll,
  });
  return product ? toShopifyProduct(product) : null;
}

// Create a new product
export async function createProduct(
  data: Omit<ShopifyProduct, "id" | "created_at">
): Promise<ShopifyProduct> {
  const product = await prisma.product.create({
    data: {
      title: data.title,
      body_html: data.body_html,
      vendor: data.vendor,
      product_type: data.product_type,
      handle: data.handle,
      status: data.status || "active",
      published_at: data.status === "active" ? new Date() : null,
      // Create related records
      variants: {
        create: data.variants?.map((v) => ({
          title: v.title,
          price: v.price,
          compare_at_price: v.compare_at_price,
          sku: v.sku,
          inventory_quantity: v.inventory_quantity || 0,
        })) || [],
      },
      images: {
        create: data.images?.map((img) => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        })) || [],
      },
      options: {
        create: data.options?.map((opt) => ({
          name: opt.name,
          values: opt.values.join(", "),
        })) || [],
      },
      tags: {
        create: data.tags?.map((tag) => ({
          name: tag,
        })) || [],
      },
    },
    include: includeAll,
  });
  return toShopifyProduct(product);
}

// Update a product
export async function updateProduct(
  id: string,
  data: Partial<ShopifyProduct>
): Promise<ShopifyProduct | null> {
  // Check if product exists
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return null;

  // Update main product fields
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.body_html !== undefined) updateData.body_html = data.body_html;
  if (data.vendor !== undefined) updateData.vendor = data.vendor;
  if (data.product_type !== undefined) updateData.product_type = data.product_type;
  if (data.handle !== undefined) updateData.handle = data.handle;
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === "active" && !existing.published_at) {
      updateData.published_at = new Date();
    }
  }

  // Handle variants update (delete and recreate)
  if (data.variants) {
    await prisma.productVariant.deleteMany({ where: { product_id: id } });
    updateData.variants = {
      create: data.variants.map((v) => ({
        title: v.title,
        price: v.price,
        compare_at_price: v.compare_at_price,
        sku: v.sku,
        inventory_quantity: v.inventory_quantity || 0,
      })),
    };
  }

  // Handle images update
  if (data.images) {
    await prisma.productImage.deleteMany({ where: { product_id: id } });
    updateData.images = {
      create: data.images.map((img) => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
      })),
    };
  }

  // Handle options update
  if (data.options) {
    await prisma.productOption.deleteMany({ where: { product_id: id } });
    updateData.options = {
      create: data.options.map((opt) => ({
        name: opt.name,
        values: opt.values.join(", "),
      })),
    };
  }

  // Handle tags update
  if (data.tags) {
    await prisma.productTag.deleteMany({ where: { product_id: id } });
    updateData.tags = {
      create: data.tags.map((tag) => ({
        name: tag,
      })),
    };
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: includeAll,
  });

  return toShopifyProduct(product);
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Search products by title
export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      title: {
        contains: query,
      },
    },
    include: includeAll,
    orderBy: { created_at: "desc" },
  });
  return products.map(toShopifyProduct);
}

// Filter products by tag
export async function filterByTag(tag: string): Promise<ShopifyProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      tags: {
        some: {
          name: {
            equals: tag,
          },
        },
      },
    },
    include: includeAll,
    orderBy: { created_at: "desc" },
  });
  return products.map(toShopifyProduct);
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const tags = await prisma.productTag.findMany({
    distinct: ["name"],
    select: { name: true },
    orderBy: { name: "asc" },
  });
  return tags.map((t: { name: string }) => t.name);
}
