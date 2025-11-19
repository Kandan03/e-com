import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserListing from "./_components/UserListing";
import UserPurchases from "./_components/UserPurchases";

export const metadata = {
  title: "Dashboard - Jupiterax",
  description: "Manage your product listings and purchases",
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl font-orbitron">Dashboard</h1>
        <p className="text-gray-600">
          Manage your products, track sales, and view your purchases
        </p>
      </div>
      
      <Tabs defaultValue="listing" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="listing" className="font-orbitron">
            My Products
          </TabsTrigger>
          <TabsTrigger value="purchase" className="font-orbitron">
            My Purchases
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listing" className="mt-6">
          <UserListing />
        </TabsContent>
        <TabsContent value="purchase" className="mt-6">
          <UserPurchases />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
