"use client";

import Link from "next/link";
import Image from "next/image";
import { ShopifyProduct } from "@/lib/shopify";
import { formatPrice, formatDate } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get first image or use placeholder
  const image = product.images?.[0];

  // Get first variant price
  const price = product.variants[0]?.price || 0;

  // Get total inventory
  const inventory = product.variants.reduce(
    (total, v) => total + (v.inventory_quantity || 0),
    0
  );

  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="h-48 bg-gray-100 relative">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-1 text-xs rounded ${
            product.status === "active"
              ? "bg-green-100 text-green-700"
              : product.status === "draft"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {product.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Vendor */}
        {product.vendor && (
          <p className="text-xs text-blue-600 mb-1">{product.vendor}</p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <p className="text-xs text-gray-500 mb-3">
          {product.published_at
            ? `Published: ${formatDate(product.published_at)}`
            : `Created: ${formatDate(product.created_at)}`}
        </p>

        {/* Price and Inventory */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          <span
            className={`text-sm ${
              inventory > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {inventory > 0 ? `${inventory} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
