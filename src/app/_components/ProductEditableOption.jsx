"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartLine, PenBox, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const ProductEditableOption = ({ children, product, onDelete }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/edit-product/${product.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`/api/products?productId=${product.id}`);
      toast.success("Product deleted successfully");
      if (onDelete) onDelete(product.id);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleAnalytics = () => {
    toast.info("Analytics feature coming soon!");
  };

  return (
    <Popover className="relative">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <ul>
          <li
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
            onClick={handleEdit}
          >
            <PenBox className="w-4 h-4" />
            <span>Edit Product</span>
          </li>
          <li
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
            onClick={handleAnalytics}
          >
            <ChartLine className="w-4 h-4" />
            <span>Analytics</span>
          </li>
          <li
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer text-red-500"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Product</span>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ProductEditableOption;
