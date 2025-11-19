"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

const EditProduct = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const productId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState("");

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

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products?id=${productId}`);
      const productData = response.data;
      
      setFormData({
        title: productData.title,
        price: productData.price,
        category: productData.category,
        description: productData.description,
      });
      
      setImagePreview(productData.imageUrl);
      setExistingFileUrl(productData.fileUrl || "");
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async () => {
    // Validation
    if (!formData.title || !formData.price || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const formDataToSend = new FormData();
      
      // Add image if new one is selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      
      // Add file if new one is selected
      if (file) {
        formDataToSend.append("file", file);
      }

      // Add form data
      formDataToSend.append(
        "data",
        JSON.stringify({
          ...formData,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          productId: productId,
        })
      );

      await axios.put("/api/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-xl font-orbitron">Edit Product</h2>
      <p>Update your product information</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5 mt-15">
          <div>
            <h4 className="font-orbitron">Product Title</h4>
            <Input
              name="title"
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <h4 className="font-orbitron">Price</h4>
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
          <div>
            <h4 className="font-orbitron">Category</h4>
            <Select
              value={formData.category}
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
              value={formData.description}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
          <Button onClick={handleUpdateProduct} disabled={saving}>
            {saving ? <Loader2Icon className="animate-spin" /> : "Update Product"}
          </Button>
        </div>
        <div className="mt-15">
          <div className="space-y-4">
            <div className="relative w-full h-64 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/10 hover:bg-muted/20 transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Click to upload image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                </label>
              )}
            </div>

            <Input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="cursor-pointer"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500">
              {imageFile ? "New image selected" : "Leave empty to keep existing image"}
            </p>
          </div>
          
          <div className="mt-4">
            <h4 className="font-orbitron">Upload File</h4>
            <Input
              type="file"
              name="file"
              placeholder="Upload File"
              className="w-fit"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <p className="text-sm text-gray-500 mt-2">
              {file ? `New file: ${file.name}` : existingFileUrl ? "Existing file attached" : "No file attached"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
