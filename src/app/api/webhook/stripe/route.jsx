import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/configs/stripe";
import { db } from "@/configs/db";
import { cartItemsTable, ordersTable, orderItemsTable, productsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment successful:", session.id);

      // Get user email and cart items from metadata
      const userEmail = session.metadata?.userEmail;
      const cartItemsMetadata = session.metadata?.cartItems;

      if (userEmail && cartItemsMetadata) {
        try {
          const cartItemsData = JSON.parse(cartItemsMetadata);
          
          // Get product details for the cart items
          const productIds = cartItemsData.map(item => item.productId);
          const products = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.id, productIds[0])); // This is simplified, you might need to handle multiple IDs

          // Create order
          const order = await db
            .insert(ordersTable)
            .values({
              userEmail,
              stripeSessionId: session.id,
              totalAmount: (session.amount_total / 100).toString(),
              status: "completed",
            })
            .returning();

          // Create order items
          const orderItems = await Promise.all(
            cartItemsData.map(async (item) => {
              const product = await db
                .select()
                .from(productsTable)
                .where(eq(productsTable.id, item.productId));

              if (product.length > 0) {
                return db.insert(orderItemsTable).values({
                  orderId: order[0].id,
                  productId: item.productId,
                  quantity: item.quantity,
                  price: product[0].price,
                });
              }
            })
          );

          // Clear the user's cart after successful payment
          await db
            .delete(cartItemsTable)
            .where(eq(cartItemsTable.userEmail, userEmail));

          console.log(`Order created for user: ${userEmail}, Order ID: ${order[0].id}`);
        } catch (error) {
          console.error("Error processing successful payment:", error);
        }
      }
      break;

    case "checkout.session.expired":
      console.log("Checkout session expired:", event.data.object.id);
      break;

    case "payment_intent.payment_failed":
      console.log("Payment failed:", event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
