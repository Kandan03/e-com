"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import ProductCardItem from "./ProductCardItem";
import axios from "axios";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await axios.get("/api/products/featured");
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
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
          : products.map((product) => (
              <ProductCardItem key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
};

export default ProductsList;
