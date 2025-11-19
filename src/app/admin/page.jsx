import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { Card } from "@/components/ui/card";
import { db } from "@/configs/db";
import { usersTable, productsTable, ordersTable } from "@/configs/schema";
import { sql } from "drizzle-orm";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

const AdminDashboard = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch statistics
  const [usersCount] = await db.select({ count: sql`count(*)` }).from(usersTable);
  const [productsCount] = await db.select({ count: sql`count(*)` }).from(productsTable);
  const [ordersCount] = await db.select({ count: sql`count(*)` }).from(ordersTable);
  const [revenueResult] = await db.select({ total: sql`COALESCE(SUM(CAST(total_amount AS NUMERIC)), 0)` }).from(ordersTable);

  const stats = [
    {
      title: "Total Users",
      value: usersCount.count.toString(),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: productsCount.count.toString(),
      icon: Package,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: ordersCount.count.toString(),
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: `$${Number(revenueResult.total).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your platform's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 font-orbitron">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/users" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold">Manage Users</h4>
              <p className="text-sm text-gray-600">Add, edit, or remove users</p>
            </a>
            <a href="/admin/categories" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold">Manage Categories</h4>
              <p className="text-sm text-gray-600">Organize product categories</p>
            </a>
            <a href="/admin/products" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold">Manage Products</h4>
              <p className="text-sm text-gray-600">Review and moderate products</p>
            </a>
            <a href="/admin/orders" className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold">View Orders</h4>
              <p className="text-sm text-gray-600">Monitor and manage orders</p>
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 font-orbitron">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">System is running smoothly</p>
              <p className="text-xs text-gray-500 mt-1">All services operational</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Database connected</p>
              <p className="text-xs text-gray-500 mt-1">PostgreSQL via Neon</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Payment gateway active</p>
              <p className="text-xs text-gray-500 mt-1">Stripe integration ready</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
