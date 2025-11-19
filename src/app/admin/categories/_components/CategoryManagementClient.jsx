"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const CategoryManagementClient = ({ categories: initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put("/api/admin/categories", {
          id: editingId,
          ...formData,
        });
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingId ? { ...cat, ...formData } : cat
          )
        );
        toast.success("Category updated successfully");
        setEditingId(null);
      } else {
        const response = await axios.post("/api/admin/categories", formData);
        setCategories((prev) => [response.data, ...prev]);
        toast.success("Category added successfully");
        setShowAddForm(false);
      }
      setFormData({ name: "", description: "", icon: "" });
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/admin/categories?id=${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setLoading(true);
    try {
      await axios.put("/api/admin/categories", {
        id,
        isActive: !currentStatus,
      });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, isActive: !currentStatus } : cat
        )
      );
      toast.success(`Category ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", icon: "" });
  };

  return (
    <div>
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-orbitron">
            {showAddForm || editingId ? (editingId ? "Edit Category" : "Add New Category") : "Categories"}
          </h3>
          {!showAddForm && !editingId && (
            <Button onClick={() => setShowAddForm(true)} className="font-orbitron">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {(showAddForm || editingId) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <Input
                placeholder="e.g., Electronics, Clothing, Books"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Brief description of this category"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon (emoji or text)</label>
              <Input
                placeholder="📱 or icon name"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="font-orbitron">
                <Check className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Add"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {category.icon && (
                  <span className="text-2xl">{category.icon}</span>
                )}
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
              <Badge variant={category.isActive ? "default" : "outline"}>
              {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4 min-h-10">
              {category.description || "No description"}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(category)}
                disabled={loading}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant={category.isActive ? "outline" : "default"}
                onClick={() => handleToggleActive(category.id, category.isActive)}
                disabled={loading}
              >
                {category.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(category.id)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <p>No categories yet</p>
            <p className="text-sm mt-1">Click Add Category to create your first one</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CategoryManagementClient;
