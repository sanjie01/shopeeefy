"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ShopifyProduct } from "@/lib/shopify";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [tags, setTags] = useState<string[]>([]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      // Build URL with search params
      let url = "/api/products";
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      } else if (selectedTag) {
        url += `?tag=${encodeURIComponent(selectedTag)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setProducts(data.products);

      // Get all tags from products
      const allTags = new Set<string>();
      data.products.forEach((p: ShopifyProduct) => {
        p.tags?.forEach((tag) => allTags.add(tag));
      });
      setTags(Array.from(allTags).sort());

      setLoading(false);
    }

    fetchProducts();
  }, [searchQuery, selectedTag]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Handle tag filter
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery("");
    if (tag) {
      router.push(`/products?tag=${encodeURIComponent(tag)}`);
    } else {
      router.push("/products");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    router.push("/products");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </form>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => handleTagChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Clear Button */}
          {(searchQuery || selectedTag) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 text-gray-500">
          No products found.
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
