import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { ordersTable, orderItemsTable, productsTable, cartItemsTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, totalAmount } = await req.json();
    const userEmail = user.primaryEmailAddress.emailAddress;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Check if order already exists
    const existingOrder = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.stripeSessionId, sessionId));

    if (existingOrder.length > 0) {
      return NextResponse.json({
        message: "Order already exists",
        order: existingOrder[0],
      });
    }

    // Get cart items before they're deleted
    const cartItems = await db
      .select({
        id: cartItemsTable.id,
        quantity: cartItemsTable.quantity,
        productId: cartItemsTable.productId,
        product: {
          id: productsTable.id,
          title: productsTable.title,
          price: productsTable.price,
          imageUrl: productsTable.imageUrl,
        },
      })
      .from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.userEmail, userEmail));

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "No cart items found" },
        { status: 400 }
      );
    }

    // Calculate total from cart items
    const calculatedTotal = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );

    // Create order
    const order = await db
      .insert(ordersTable)
      .values({
        userEmail,
        stripeSessionId: sessionId,
        totalAmount: totalAmount || calculatedTotal.toString(),
        status: "completed",
      })
      .returning();

    // Create order items
    await Promise.all(
      cartItems.map((item) =>
        db.insert(orderItemsTable).values({
          orderId: order[0].id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })
      )
    );

    console.log(`Order created: ${order[0].id} for user: ${userEmail}`);

    return NextResponse.json({
      message: "Order created successfully",
      order: order[0],
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order: " + error.message },
      { status: 500 }
    );
  }
}
