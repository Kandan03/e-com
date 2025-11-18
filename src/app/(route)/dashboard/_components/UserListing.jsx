"use client";

import ProductCardItem from "@/app/_components/ProductCardItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

const UserListing = () => {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

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
    if (isLoaded && user) {
      GetUserProductList();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [GetUserProductList, isLoaded, user]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-bold text-xl font-orbitron">Your Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            {!loading && `${listing.length} product${listing.length !== 1 ? 's' : ''} listed`}
          </p>
        </div>
        <Link href="/dashboard/add-product">
          <Button className="flex items-center gap-2 font-orbitron">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </Link>
      </div>
      <div>
        {listing?.length === 0 && !loading && isLoaded && (
          <div className="text-center py-20 bg-muted/30 rounded-lg">
            <h2 className="font-medium text-2xl mb-2">No Products Yet</h2>
            <p className="text-gray-600 mb-6">
              Start by adding your first product to sell
            </p>
            <Link href="/dashboard/add-product">
              <Button className="font-orbitron">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
          {loading || !isLoaded
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="p-3">
                  <Skeleton className="w-full h-48 rounded-md" />
                  <div className="mt-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/4 mt-2" />
                    <div className="flex items-center mt-2 gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </Card>
              ))
            : listing.map((product) => (
                <ProductCardItem key={product.id} product={product} editable={true} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default UserListing;
