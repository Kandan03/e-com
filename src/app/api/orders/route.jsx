import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { ordersTable, orderItemsTable, productsTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // Get user's orders
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userEmail, userEmail))
      .orderBy(desc(ordersTable.createdAt));

    // Get order items with product details for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select({
            id: orderItemsTable.id,
            quantity: orderItemsTable.quantity,
            price: orderItemsTable.price,
            product: {
              id: productsTable.id,
              title: productsTable.title,
              imageUrl: productsTable.imageUrl,
              description: productsTable.description,
              category: productsTable.category,
              fileUrl: productsTable.fileUrl,
            },
          })
          .from(orderItemsTable)
          .innerJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
          .where(eq(orderItemsTable.orderId, order.id));

        return {
          ...order,
          items,
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
