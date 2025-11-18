import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreVerticalIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProductCardItem = ({ product, editable = false }) => {
  return (
    <div>
      <Card className="p-3">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.title || "Product"}
            width={300}
            height={300}
            className="w-full h-auto object-cover rounded-md"
          />
        )}
        <div className="mt-2">
          <h3 className="font-semibold text-lg font-orbitron">
            {product.title}
          </h3>
          <p className="mt-1 font-bold">${product.price}</p>
          <div className="flex items-center mt-2 gap-2">
            {product.user?.image && (
              <Image
                src={product.user.image}
                alt={product.user.name || "User"}
                width={40}
                height={40}
                className="w-8 h-8 rounded-full"
              />
            )}
            <h2 className="text-sm text-neutral-600">{product.user?.name}</h2>
            {!editable ? (
              <Button className="ml-auto font-orbitron">Add to Cart</Button>
            ) : (
              <MoreVerticalIcon className="ml-auto" />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductCardItem;
