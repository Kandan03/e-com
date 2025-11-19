"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingCartIcon, 
  TagIcon, 
  ArrowLeft,
  UserIcon,
  StarIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = ({ params }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams["product-id"]);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const result = await axios.get(`/api/products?id=${productId}`);
        setProduct(result.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="w-full h-[400px] lg:h-[600px] rounded-lg" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Button onClick={() => router.push("/store")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/store")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Store
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative w-full aspect-square lg:sticky lg:top-8 rounded-xl overflow-hidden bg-linear-to-br from-purple-100 to-blue-100 shadow-lg">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.title || "Product"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain p-8"
            />
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col gap-5">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Price and Seller Info Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">
                ${product.price}
              </span>
            </div>
            
            {/* Compact Seller Info */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <p className="text-[10px] font-medium text-gray-500">Sold by</p>
              {product.user?.image ? (
                <Image
                  src={product.user.image}
                  alt={product.user.name || "Seller"}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                  {product.user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                  {product.user?.name || "Unknown Seller"}
                </h4>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-semibold text-gray-700">4.8</span>
                  <span className="text-[10px] text-gray-500">(127 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-2">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              size="lg"
              className="w-full font-orbitron text-base h-14 bg-black hover:bg-gray-800 text-white"
              onClick={() => addToCart(product)}
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Product ID</p>
                <p className="font-semibold text-gray-900">#{product.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Category</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {product.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
