"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items when user signs in
  useEffect(() => {
    if (isSignedIn && user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isSignedIn, user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cart");
      setCartItems(response.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!isSignedIn) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (!product || !product.id) {
      toast.error("Invalid product");
      console.error("Invalid product:", product);
      return;
    }

    try {
      console.log("Adding to cart:", product);
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
        toast.success("Item quantity updated in cart");
      } else {
        const response = await axios.post("/api/cart", {
          productId: product.id,
          quantity: 1,
        });
        console.log("Cart response:", response.data);
        // Fetch the updated cart instead of manually updating state
        await fetchCart();
        toast.success("Added to cart successfully");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to add item to cart");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart?id=${cartItemId}`);
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const response = await axios.put("/api/cart", {
        id: cartItemId,
        quantity: newQuantity,
      });
      setCartItems(
        cartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
      // Refresh cart to get accurate state
      await fetchCart();
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart?clearAll=true");
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.price || 0);
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
