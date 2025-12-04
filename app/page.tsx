import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Cimanes Catalog
      </h1>

      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        A simple product catalog management system. Add, edit, and manage your
        products with ease.
      </p>

      <div className="flex gap-4 justify-center">
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>

        <Link
          href="/products/add"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          Add Product
        </Link>
      </div>
    </div>
  );
}
