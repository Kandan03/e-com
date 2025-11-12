import { Button } from "@/components/ui/button";
import React from "react";
import Products from "../ProductData/Products";
import ProductCardItem from "./ProductCardItem";

const ProductsList = () => {
  return (
    <div>
      <h2 className="font-bold text-xl flex justify-between items-center">
        Featured
        <span>
          <Button>View All</Button>
        </span>
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {Products.map((product, index) => (
          <ProductCardItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
