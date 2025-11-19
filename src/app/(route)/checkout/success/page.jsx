"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (sessionId && !hasProcessed.current) {
      hasProcessed.current = true;
      
      const processOrder = async () => {
        try {
          // Create the order in database
          await axios.post("/api/orders/create", {
            sessionId,
          });
          
          // Clear the cart after order is created
          await clearCart();
        } catch (error) {
          console.error("Error processing order:", error);
        } finally {
          setLoading(false);
        }
      };
      
      processOrder();
    } else if (!sessionId) {
      setTimeout(() => setLoading(false), 0);
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-6" />
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="p-8 text-center">
        <CheckCircle2 className="w-24 h-24 mx-auto text-green-600 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-orbitron">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className="text-gray-600 mb-8">
          You will receive an email confirmation shortly.
        </p>
        
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/store">
            <Button size="lg" className="font-orbitron">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              View My Products
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

const CheckoutSuccess = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-6" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccess;
