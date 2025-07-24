"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useAuth, SignIn } from "@clerk/nextjs";

const toast = {
  success: (msg: string) => console.log("Success:", msg),
  error: (msg: string) => console.log("Error:", msg),
};

interface Product {
  id: number;
  title: string;
  image: string;
  category?: string;
}

export default function ShopPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [query, setQuery] = useState("");

  const [filtered, setFiltered] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (!isLoaded) return <Loader />;
  if (!isSignedIn) return <SignIn />;

  const searchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/shop?q=${query}`);
      const results = response.data.products;


      setFiltered(results);
    } catch {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    toast.success(`${product.title} added to cart`);
  };

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    toast.success("Removed from cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 p-6 max-w-7xl mx-auto relative overflow-x-hidden">
      <h1 className="text-4xl font-extrabold mb-10 text-purple-700 text-center md:text-left">
        🛒 Supplement Shop
      </h1>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center md:justify-start">
        <Input
          placeholder="Search supplements..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchProducts();
          }}
          className="w-full md:max-w-sm rounded-lg"
        />
        <Button
          onClick={searchProducts}
          className="rounded-lg px-8 py-3 font-semibold bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600 transition"
        >
          Search
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <div className="text-center mt-24 text-gray-500">
              <p className="text-lg mb-4">No products found for your search.</p>
              <div className="mx-auto w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center opacity-50">
                <span className="text-gray-400 text-4xl">📦</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col relative group cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-transform border border-transparent hover:border-purple-400"
                  onClick={() => setSelectedProduct(item)}
                >
                  {idx % 3 === 0 && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-400 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm select-none pointer-events-none">
                      Popular
                    </span>
                  )}
                  <div className="w-full aspect-square mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-purple-50 border border-purple-100 group-hover:scale-105 transition-transform">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-contain h-4/5 w-4/5"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[48px] hover:text-purple-600">
                    {item.title}
                  </h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-purple-700 font-bold text-base">
                      ₮{item.id.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold py-2 mt-auto shadow-lg hover:from-purple-700 hover:to-indigo-600 transition"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart summary */}
        <aside className="lg:w-96 sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-purple-100 self-start">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-purple-700 text-center">
            🛍️ My Cart
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-100 pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        className="w-14 h-14 object-cover rounded-lg"
                        alt={item.title || 'Cart item'}
                        loading="lazy"
                      />
                      <div>
                        <p className="font-medium text-sm line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">ID: {item.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="text-red-500 hover:underline text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full border-2 border-purple-400 text-purple-700 font-semibold rounded-full px-6 py-2 shadow hover:bg-purple-100 transition"
                onClick={() => {
                  setCart([]);
                  toast.success("Cart cleared");
                }}
              >
                Clear Cart
              </Button>
            </>
          )}
        </aside>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-4 text-3xl font-bold text-gray-400 hover:text-purple-700 transition"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={selectedProduct.image}
              className="w-full h-48 object-cover mb-4 rounded-xl"
              alt={selectedProduct.title || 'Product detail'}
            />
            <h2 className="text-2xl font-bold mb-2 text-purple-700">
              {selectedProduct.title}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Product ID: {selectedProduct.id}
            </p>
            <p className="text-sm text-gray-700">
              This is a detailed product description.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
      `}</style>
    </div>
  );
}
