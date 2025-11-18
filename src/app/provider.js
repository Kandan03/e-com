"use client";

import React, { useEffect, useCallback } from "react";
import Header from "./_components/Header";
import { useUser as newUser } from "@clerk/nextjs";
import axios from "axios";

function Provider({ children }) {
  const { user } = newUser();

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
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}

export default Provider;
