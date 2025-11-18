"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import ProductCardItem from "./ProductCardItem";
import axios from "axios";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get("/api/products?limit=8");
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="font-bold text-xl flex justify-between items-center font-orbitron">
        Featured
        <span>
          <Button className="font-orbitron">View All</Button>
        </span>
      </h2>

      {loading && (
        <h2 className="font-medium text-xl mt-10 text-center text-gray-400">
          Loading...
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {products.map((product) => (
          <ProductCardItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
