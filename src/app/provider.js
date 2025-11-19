"use client";

import React, { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "./_components/Header";
import { useUser as newUser } from "@clerk/nextjs";
import axios from "axios";
import { CartProvider } from "@/contexts/CartContext";

function Provider({ children }) {
  const { user } = newUser();
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  const syncUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      await axios.post("/api/user", { user: user });
    } catch (error) {
      console.error("Error syncing user data:", error);
    }
  }, [user]);

  useEffect(() => {
    syncUserData();
  }, [syncUserData]);

  return (
    <CartProvider>
      <div>
        {!isAdminRoute && <Header />}
        <div>{children}</div>
      </div>
    </CartProvider>
  );
}

export default Provider;
