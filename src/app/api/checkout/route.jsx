import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/configs/stripe";
import { db } from "@/configs/db";
import { cartItemsTable, productsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // Get cart items with product details
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
          description: productsTable.description,
        },
      })
      .from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.userEmail, userEmail));

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          description: item.product.description.substring(0, 100),
          images: [item.product.imageUrl],
        },
        unit_amount: Math.round(parseFloat(item.product.price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: userEmail,
      metadata: {
        userEmail: userEmail,
        cartItems: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
        }))),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session: " + error.message },
      { status: 500 }
    );
  }
}
