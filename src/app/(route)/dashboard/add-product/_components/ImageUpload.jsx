"use client";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ImageUpload = ({ onChange, value }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onChange) {
          onChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/10 hover:bg-muted/20 transition-colors">
        {preview ? (
          <div className="relative w-full h-full group">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="w-12 h-12 text-muted-foreground" />
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
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUpload;
