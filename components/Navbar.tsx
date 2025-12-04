"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Check if link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            Cimanes Catalog
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded ${
                isActive("/") && pathname === "/"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={`px-3 py-2 rounded ${
                isActive("/products")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Products
            </Link>

            <Link
              href="/products/add"
              className={`px-3 py-2 rounded ${
                isActive("/products/add")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Add Product
            </Link>

            <Link
              href="/login"
              className="px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
