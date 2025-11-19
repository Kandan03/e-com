"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreVerticalIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import ProductEditableOption from "./ProductEditableOption";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const ProductCardItem = ({ product, editable = false, onDelete }) => {
  const { addToCart } = useCart();
  
  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or editable options
    if (e.target.closest('button') || e.target.closest('[data-radix-popper-content-wrapper]')) {
      e.preventDefault();
    }
  };
  
  return (
    <Link href={`/store/${product.id}`} className="block" onClick={handleCardClick}>
      <Card className="p-3">
        {product.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={product.imageUrl}
              alt={product.title || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
        )}
        <div className="mt-2">
          <h3 className="font-semibold text-lg">{product.title}</h3>
          <p className="mt-1 font-bold">${product.price}</p>
          <div className="flex items-center mt-2 gap-2">
            {product.user?.image && (
              <Image
                src={product.user.image}
                alt={product.user.name || "User"}
                width={40}
                height={40}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <h2 className="text-sm text-neutral-600">{product.user?.name}</h2>
            {!editable ? (
              <Button 
                className="ml-auto font-orbitron"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
              >
                <ShoppingCartIcon />
              </Button>
            ) : (
              <div className="ml-auto" onClick={(e) => e.preventDefault()}>
                <ProductEditableOption product={product} onDelete={onDelete}>
                  <MoreVerticalIcon className="w-5 h-5 cursor-pointer" />
                </ProductEditableOption>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCardItem;
