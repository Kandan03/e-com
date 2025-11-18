"use client";

import ProductCardItem from "@/app/_components/ProductCardItem";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

const UserListing = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const GetUserProductList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    setLoading(true);
    try {
      const result = await axios.get(
        "/api/products?email=" + user.primaryEmailAddress.emailAddress
      );
      setListing(result.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    GetUserProductList();
  }, [GetUserProductList]);

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
        {listing?.length === 0 && !loading && (
          <h2 className="font-medium text-2xl mt-10 text-center text-gray-300">
            No Listing Found
          </h2>
        )}

        {loading && (
          <h2 className="font-medium text-xl mt-10 text-center text-gray-400">
            Loading...
          </h2>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
          {listing.map((product) => (
            <ProductCardItem key={product.id} product={product} editable={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListing;
