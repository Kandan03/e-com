"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Activity } from "lucide-react";
import axios from "axios";

const PaymentsClient = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const response = await axios.get("/api/admin/payments");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
      description: "All-time earnings",
    },
    {
      title: "Total Transactions",
      value: stats.totalOrders.toString(),
      icon: CreditCard,
      color: "bg-blue-500",
      description: "Completed orders",
    },
    {
      title: "Average Order Value",
      value: `$${Number(stats.averageOrderValue).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-purple-500",
      description: "Per transaction",
    },
    {
      title: "Today's Revenue",
      value: `$${Number(stats.todayRevenue).toFixed(2)}`,
      icon: Activity,
      color: "bg-orange-500",
      description: "Last 24 hours",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 font-orbitron">Payment Gateway</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Stripe</p>
                <p className="text-sm text-gray-600">Payment processor</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Integration Status</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Checkout sessions enabled
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Webhook configured
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Payment intents active
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 font-orbitron">Revenue Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Platform Fee (Example)</p>
              <p className="text-2xl font-bold">5%</p>
              <p className="text-xs text-gray-500 mt-1">Commission per transaction</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Net Revenue</p>
              <p className="text-2xl font-bold">
                ${(Number(stats.totalRevenue) * 0.95).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">After platform fees</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
              <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsClient;
