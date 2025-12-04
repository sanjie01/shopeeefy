"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "@/lib/validation";
import { ShopifyProduct } from "@/lib/shopify";
import Link from "next/link";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Setup form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Fetch product and fill form
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Product not found");
        setLoading(false);
        return;
      }

      const product: ShopifyProduct = data.product;

      // Fill form with existing data
      reset({
        title: product.title,
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_type: product.product_type || "",
        tags: product.tags?.join(", ") || "",
        image_url: product.images?.[0]?.src || "",
        status: product.status || "draft",
        option_name: product.options?.[0]?.name || "",
        option_values: product.options?.[0]?.values.join(", ") || "",
        price: product.variants[0]?.price.toString() || "",
        sku: product.variants[0]?.sku || "",
        inventory: product.variants[0]?.inventory_quantity?.toString() || "0",
      });

      setLoading(false);
    }

    fetchProduct();
  }, [id, reset]);

  // Handle form submit
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Build options array if provided
      const options = [];
      if (data.option_name && data.option_values) {
        options.push({
          name: data.option_name,
          values: data.option_values.split(",").map((v) => v.trim()),
        });
      }

      // Build update data
      const updateData = {
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
      };

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to update product");
        return;
      }

      router.push(`/products/${id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  // Error state (product not found)
  if (error && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg border border-gray-200 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("body_html")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.body_html && (
            <p className="text-red-500 text-sm mt-1">
              {errors.body_html.message}
            </p>
          )}
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("vendor")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.vendor && (
            <p className="text-red-500 text-sm mt-1">{errors.vendor.message}</p>
          )}
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type
          </label>
          <input
            type="text"
            {...register("product_type")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-gray-400 text-xs">(comma separated)</span>
          </label>
          <input
            type="text"
            {...register("tags")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            {...register("image_url")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <hr className="my-6" />

        {/* Options Section */}
        <h2 className="text-lg font-semibold text-gray-900">
          Options <span className="text-gray-400 text-sm font-normal">(optional)</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Option Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Option Name
            </label>
            <input
              type="text"
              {...register("option_name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., Size, Color"
            />
          </div>

          {/* Option Values */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Option Values
            </label>
            <input
              type="text"
              {...register("option_values")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., S, M, L, XL"
            />
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold text-gray-900">Variant / Pricing</h2>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="text"
              {...register("price")}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            {...register("sku")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Inventory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inventory Quantity
          </label>
          <input
            type="number"
            {...register("inventory")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          <Link
            href={`/products/${id}`}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
