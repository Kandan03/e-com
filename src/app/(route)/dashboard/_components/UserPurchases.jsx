"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { DownloadIcon, PackageIcon, CalendarIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const UserPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl, productTitle) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
      toast.success(`Downloading ${productTitle}`);
    } else {
      toast.error("No file available for this product");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-lg">
        <PackageIcon className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h3 className="text-2xl font-semibold mb-2">No Purchases Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven&apos;t made any purchases yet. Start exploring products!
        </p>
        <Button asChild className="font-orbitron">
          <a href="/store">Browse Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Order #{order.id}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDate(order.createdAt)}
                </div>
                <div className="font-semibold text-gray-900">
                  ${parseFloat(order.totalAmount).toFixed(2)}
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                  {item.product?.imageUrl && (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">
                    {item.product?.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.product?.category}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      Quantity: {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${parseFloat(item.price).toFixed(2)} each
                    </span>
                  </div>
                </div>

                {item.product?.fileUrl && (
                  <div className="flex items-center">
                    <Button
                      onClick={() =>
                        handleDownload(
                          item.product.fileUrl,
                          item.product.title
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserPurchases;
