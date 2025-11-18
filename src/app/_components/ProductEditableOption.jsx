import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartLine, PenBox, Trash2 } from "lucide-react";

const ProductEditableOption = ({ children }) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <ul>
          <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
            <PenBox />
            <span>Edit Product</span>
          </li>
          <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer">
            <ChartLine />
            <span>Analytics</span>
          </li>
          <li className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer text-red-500">
            <Trash2 />
            <span>Delete Product</span>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ProductEditableOption;
