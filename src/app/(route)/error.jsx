"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-orbitron mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
