"use client";

import ProductCardItem from "@/app/_components/ProductCardItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Explore() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get("/api/products?limit=100");
        setProducts(result.data);
        setFilteredProducts(result.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  return (
    <div className="px-10 md:px-32 lg:px-48 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron mb-2">Explore Products</h1>
        <p className="text-gray-600 mb-6">
          Discover amazing digital products from creators worldwide
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6"
          />
        </div>
      </div>

      {/* Products Grid */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-medium text-gray-400">
            {searchQuery ? "No products found" : "No products available"}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="p-3">
                <Skeleton className="w-full h-48 rounded-md" />
                <div className="mt-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/4 mt-2" />
                  <div className="flex items-center mt-2 gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </Card>
            ))
          : filteredProducts.map((product) => (
              <ProductCardItem key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
}