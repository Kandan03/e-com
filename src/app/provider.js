"use client";

import React, { useEffect } from "react";
import Header from "./_components/Header";
import { useUser as newUser } from "@clerk/nextjs";
import axios from "axios";

function Provider({ children }) {
  const { user } = newUser();

  const CheckIsNewUser = async () => {
    const result = await axios.post("/api/user", { user: user });
    console.log(result.data);
  };

  useEffect(() => {
    user && CheckIsNewUser();
  }, [user]);

  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}

export default Provider;
