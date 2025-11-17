"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const UserListing = () => {
  const [listing, setListing] = useState([]);
  return (
    <div className="mt-5">
      <h2 className="font-bold text-md font-orbitron flex justify-between items-center">
        Listing
        <Link href="/dashboard/add-product">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </h2>
      <div>
        {listing?.length == 0 && (
          <h2 className="font-medium text-2xl mt-10 text-center text-gray-500">
            No Listing Found
          </h2>
        )}
      </div>
    </div>
  );
};

export default UserListing;
