"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

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
          <div className="flex items-center gap-4">
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
                isActive("/products") && !pathname.includes("/add")
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Products
            </Link>

            {/* Only show Add Product if logged in */}
            {isLoggedIn && (
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
            )}

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
