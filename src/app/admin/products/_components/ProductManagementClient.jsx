"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Search, Trash2, Eye, Filter, Pencil, Star } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

const ProductManagementClient = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/products?id=${productId}`);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (productId, currentStatus) => {
    setLoading(true);
    try {
      await axios.patch(`/api/products`, {
        id: productId,
        isFeatured: !currentStatus,
      });
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, isFeatured: !currentStatus } : product
        )
      );
      toast.success(`Product ${!currentStatus ? "marked as" : "removed from"} featured`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search products by title or seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>Total Products: {products.length}</span>
          <span>Filtered: {filteredProducts.length}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {product.imageUrl && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.title || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                <Badge>{product.category}</Badge>
              </div>
              <p className="text-xl font-bold text-primary mb-2">${product.price}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
              
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                {product.user?.image && (
                  <Image
                    src={product.user.image}
                    alt={product.user.name || "Seller"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">
                  by {product.user?.name || "Unknown"}
                </span>
                {product.isFeatured && (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-auto" />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={product.isFeatured ? "default" : "outline"}
                  onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                  disabled={loading}
                  className="flex-1"
                >
                  <Star className={`w-4 h-4 mr-1 ${product.isFeatured ? "fill-white" : ""}`} />
                  {product.isFeatured ? "Featured" : "Feature"}
                </Button>
                <Link href={`/store/${product.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/edit-product/${product.id}`}>
                  <Button size="sm" variant="outline">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <p>No products found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductManagementClient;
