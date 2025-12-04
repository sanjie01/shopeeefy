"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ShopifyProduct } from "@/lib/shopify";

const PRODUCTS_PER_PAGE = 6;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [tags, setTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );

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

      setAllProducts(data.products);

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

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = allProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Handle tag filter
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery("");
    setCurrentPage(1);
    if (tag) {
      router.push(`/products?tag=${encodeURIComponent(tag)}`);
    } else {
      router.push("/products");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedTag) params.set("tag", selectedTag);
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    setCurrentPage(1);
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
      ) : allProducts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 text-gray-500">
          No products found.
        </div>
      ) : (
        <>
          {/* Product Count */}
          <p className="text-sm text-gray-500 mb-4">
            Showing {startIndex + 1}-
            {Math.min(startIndex + PRODUCTS_PER_PAGE, allProducts.length)} of{" "}
            {allProducts.length} products
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
