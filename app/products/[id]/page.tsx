"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct } from "@/lib/shopify";
import { formatPrice, formatDate } from "@/lib/shopify";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Product not found");
      } else {
        setProduct(data.product);
      }

      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/products");
    } else {
      const data = await response.json();
      setError(data.error || "Failed to delete");
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const image = product.images?.[0];
  const variant = product.variants[0];

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/products"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="aspect-square relative bg-gray-100">
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
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Vendor */}
          {product.vendor && (
            <p className="text-blue-600 text-sm mb-1">{product.vendor}</p>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.title}
          </h1>

          {/* Status */}
          <span
            className={`inline-block px-2 py-1 text-xs rounded mb-4 ${
              product.status === "active"
                ? "bg-green-100 text-green-700"
                : product.status === "draft"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {product.status}
          </span>

          {/* Price */}
          <p className="text-2xl font-bold text-gray-900 mb-4">
            {formatPrice(variant?.price || 0)}
            {variant?.compare_at_price && (
              <span className="text-lg text-gray-400 line-through ml-2">
                {formatPrice(variant.compare_at_price)}
              </span>
            )}
          </p>

          {/* Description */}
          {product.body_html && (
            <div
              className="text-gray-600 mb-6"
              dangerouslySetInnerHTML={{ __html: product.body_html }}
            />
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="text-sm text-gray-500 mb-6">
            <p>Created: {formatDate(product.created_at)}</p>
            {product.published_at && (
              <p>Published: {formatDate(product.published_at)}</p>
            )}
          </div>

          {/* Admin Actions */}
          <div className="flex gap-4">
            <Link
              href={`/products/${id}/edit`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Variants Table */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Variants</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm text-gray-600">Variant</th>
              <th className="text-left p-4 text-sm text-gray-600">SKU</th>
              <th className="text-left p-4 text-sm text-gray-600">Price</th>
              <th className="text-left p-4 text-sm text-gray-600">Inventory</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((v) => (
              <tr key={v.id} className="border-t border-gray-100">
                <td className="p-4">{v.title || "Default"}</td>
                <td className="p-4 text-gray-500">{v.sku || "-"}</td>
                <td className="p-4">{formatPrice(v.price)}</td>
                <td className="p-4">
                  <span
                    className={
                      (v.inventory_quantity || 0) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {v.inventory_quantity || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{product.title}&quot;? This cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
