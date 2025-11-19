"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import ImageUpload from "./_components/ImageUpload";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({});
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onAddProductBtnClick = async () => {
    // Validation
    if (!formData.title || !formData.price || !formData.category || !formData.description || !formData.image) {
      toast("Please fill in all required fields and upload an image", { type: "error" });
      return;
    }

    setLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("image", formData.image);
      if (formData.file) {
        formDataObj.append("file", formData.file);
      }
      formDataObj.append(
        "data",
        JSON.stringify({
          ...formData,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        })
      );

      const result = await axios.post("/api/products", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast("New product added successfully!", { type: "success" });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      toast("Failed to add product. Please try again.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl font-orbitron">Add New Product</h2>
      <p>Start adding product details to sell your item</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5 mt-15">
          <div>
            <h4 className="font-orbitron">Product Title</h4>
            <Input
              name="title"
              placeholder="Product Title"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <h4 className="font-orbitron">Price</h4>
            <Input
              type="number"
              name="price"
              placeholder="Price"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <h4 className="font-orbitron">Category</h4>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.icon && `${category.icon} `}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-orbitron">Description</h4>
            <Textarea
              name="description"
              rows="4"
              placeholder="Description"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
          <Button onClick={onAddProductBtnClick} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Add Product"}
          </Button>
        </div>
        <div className="mt-15">
          <ImageUpload
            value={formData.image}
            onChange={(file) => handleInputChange("image", file)}
          />
          <div>
            <h4 className="font-orbitron">Upload File</h4>
            <Input
              type="file"
              name="file"
              placeholder="Upload File"
              className="w-fit"
              onChange={(e) =>
                handleInputChange(e.target.name, e.target.files[0])
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
