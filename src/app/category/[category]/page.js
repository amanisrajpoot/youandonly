"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ProductCard from "../../../components/ProductCard";

export default function CategoryPage() {
  const { category } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  // Find the category object (case-insensitive)
  const categoryObj = categories.find(
    (c) => c.name.toLowerCase() === category?.toLowerCase()
  );

  // Filter products by category (unless 'all')
  let filteredProducts = products;
  let pageTitle = "All Products";
  if (category && category !== "all" && categoryObj) {
    filteredProducts = products.filter(
      (p) => p.category_id === categoryObj.id
    );
    pageTitle = categoryObj.name;
  } else if (category && category !== "all" && !categoryObj) {
    filteredProducts = [];
    pageTitle = "Category Not Found";
  }

  // Apply search filter
  const searchLower = search.toLowerCase();
  filteredProducts = filteredProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower))
  );

  // Sorting
  if (sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="bg-[#f7f7fa] min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-8 pb-16 px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar for categories */}
        <aside className="w-full md:w-60 mb-8 md:mb-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-24">
            <div className="font-bold text-amber-700 mb-3 text-lg">Browse Categories</div>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${category === "all" ? "bg-amber-100 text-gray-900 border-amber-300" : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-amber-50"}`}
                  onClick={() => router.push("/category/all")}
                >
                  All
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${categoryObj && cat.id === categoryObj.id ? "bg-amber-100 text-gray-900 border-amber-300" : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-amber-50"}`}
                    onClick={() => router.push(`/category/${cat.name.toLowerCase()}`)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main content */}
        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-3xl font-bold text-amber-700">{pageTitle}</h1>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-400 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-500 w-full sm:w-64"
              />
              {search && (
                <button
                  className="ml-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setSearch("")}
                >
                  Clear
                </button>
              )}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="ml-2 px-4 py-2 border border-gray-400 rounded text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 h-10 min-w-[170px]"
                style={{ minHeight: '40px' }}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-lg py-12">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="mb-4 text-5xl">🔍</div>
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
} 