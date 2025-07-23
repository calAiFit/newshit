"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  image: string;
  category?: string;
}

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch products based on search query
  const searchProducts = async () => {
    try {
      const response = await axios.get(`/api/shop?q=${query}`);
      setProducts(response.data.products);
      setFiltered(response.data.products);
    } catch (err) {
      toast.error("Error fetching products");
    }
  };

  // Filter by category
  useEffect(() => {
    if (!selectedCategory) setFiltered(products);
    else {
      setFiltered(
        products.filter((p) =>
          p.title.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }
  }, [selectedCategory, products]);

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    toast.success(`${product.title} added to cart`);
  };

  // Remove product from cart
  const handleRemoveFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    toast.success("Removed from cart");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🛒 Supplement Shop
      </h1>

      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={searchProducts}>Search</Button>
        <select
          className="border rounded px-2"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="whey">Whey</option>
          <option value="creatine">Creatine</option>
          <option value="pre">Pre-workout</option>
          <option value="vitamins">Vitamins</option>
          <option value="protein">Protein</option>
          <option value="bcaas">BCAAs</option>
          <option value="fatburners">Fat Burners</option>
          <option value="testosterone">Testosterone Boosters</option>
          <option value="multivitamins">Multivitamins</option>
          <option value="greens">Greens</option>
          <option value="omega">Omega-3</option>
          <option value="probiotics">Probiotics</option>
          <option value="sleep">Sleep Aids</option>
          <option value="joint">Joint Support</option>
          <option value="energy">Energy Supplements</option>
          <option value="recovery">Recovery Supplements</option>
          <option value="meal">Meal Replacements</option>
        </select>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded flex gap-4 items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img src={item.image} className="w-16 h-16 object-cover" />
              <div>
                <h3
                  className="font-semibold cursor-pointer"
                  onClick={() => setSelectedProduct(item)}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">ID: {item.id}</p>
              </div>
            </div>
            <Button onClick={() => handleAddToCart(item)}>Add to Cart</Button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">🛍️ My Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border p-3 rounded flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} className="w-12 h-12 object-cover" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">ID: {item.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(index)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setCart([]);
                toast.success("Cart cleared");
              }}
            >
              Clear Cart
            </Button>
          </div>
        )}
      </div>

      {/* Modal for Product Detail */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>
            <img
              src={selectedProduct.image}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold mb-2">
              {selectedProduct.title}
            </h2>
            <p className="text-sm text-gray-600">
              Product ID: {selectedProduct.id}
            </p>
            <p className="mt-2 text-gray-700">
              (You can add nutrition info or product description here.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
