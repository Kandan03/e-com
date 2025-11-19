import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { ordersTable, orderItemsTable, productsTable, usersTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import OrderManagementClient from "./_components/OrderManagementClient";

const AdminOrdersPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch all orders with user info
  const ordersData = await db
    .select({
      id: ordersTable.id,
      userEmail: ordersTable.userEmail,
      stripeSessionId: ordersTable.stripeSessionId,
      totalAmount: ordersTable.totalAmount,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
      userName: usersTable.name,
      userImage: usersTable.image,
    })
    .from(ordersTable)
    .leftJoin(usersTable, eq(ordersTable.userEmail, usersTable.email))
    .orderBy(desc(ordersTable.createdAt));

  // Fetch order items for all orders
  const orderIds = ordersData.map((order) => order.id);
  const orderItemsData = orderIds.length > 0 
    ? await db
        .select({
          orderId: orderItemsTable.orderId,
          productTitle: productsTable.title,
          productImage: productsTable.imageUrl,
          quantity: orderItemsTable.quantity,
          price: orderItemsTable.price,
        })
        .from(orderItemsTable)
        .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
    : [];

  // Group items by order
  const ordersWithItems = ordersData.map((order) => ({
    ...order,
    items: orderItemsData.filter((item) => item.orderId === order.id),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Order Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all customer orders</p>
      </div>

      <OrderManagementClient orders={ordersWithItems} />
    </div>
  );
};

export default AdminOrdersPage;
