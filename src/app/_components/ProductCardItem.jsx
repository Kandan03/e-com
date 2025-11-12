import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const ProductCardItem = ({ product }) => {
  return (
    <div>
      <Card className="p-3">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-auto object-cover rounded-md"
        />
        <div className="mt-2">
          <h3 className="font-semibold text-lg font-orbitron">{product.name}</h3>
          <p className="mt-1 font-bold">${product.price}</p>
          <div className="flex items-center mt-2 gap-2">
            <Image
              src={product.user.image}
              alt={product.user.name}
              width={40}
              height={40}
              className="w-8 h-8 rounded-full"
            />
            <h2 className="text-sm text-neutral-600">{product.user.name}</h2>
            <Button className="ml-auto font-orbitron">Add to Cart</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductCardItem;
