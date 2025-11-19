import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { cartItemsTable, productsTable, usersTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, getTableColumns } from "drizzle-orm";

// GET - Fetch user's cart items
export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json([], { status: 200 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const cartItems = await db
      .select({
        id: cartItemsTable.id,
        quantity: cartItemsTable.quantity,
        productId: cartItemsTable.productId,
        createdAt: cartItemsTable.createdAt,
        product: {
          id: productsTable.id,
          title: productsTable.title,
          price: productsTable.price,
          imageUrl: productsTable.imageUrl,
          category: productsTable.category,
        },
      })
      .from(cartItemsTable)
      .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.userEmail, userEmail));

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error.message, error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Add item to cart
export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const body = await req.json();
    const { productId, quantity = 1 } = body;

    console.log("Add to cart request:", { userEmail, productId, quantity });

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.userEmail, userEmail),
          eq(cartItemsTable.productId, parseInt(productId))
        )
      );

    if (existingItem.length > 0) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + quantity;
      const updated = await db
        .update(cartItemsTable)
        .set({ quantity: newQuantity })
        .where(eq(cartItemsTable.id, existingItem[0].id))
        .returning();

      console.log("Updated cart item:", updated[0]);
      return NextResponse.json(updated[0]);
    }

    // Insert new cart item
    const result = await db
      .insert(cartItemsTable)
      .values({
        userEmail,
        productId: parseInt(productId),
        quantity,
      })
      .returning();

    console.log("Created cart item:", result[0]);
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error adding to cart:", error.message, error);
    return NextResponse.json(
      { error: "Failed to add to cart: " + error.message },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const { id, quantity } = await req.json();

    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: "Cart item ID and quantity are required" },
        { status: 400 }
      );
    }

    const result = await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(
        and(
          eq(cartItemsTable.id, id),
          eq(cartItemsTable.userEmail, userEmail)
        )
      )
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart or clear entire cart
export async function DELETE(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      // Clear entire cart
      await db
        .delete(cartItemsTable)
        .where(eq(cartItemsTable.userEmail, userEmail));

      return NextResponse.json({ message: "Cart cleared successfully" });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Delete specific item
    await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.id, parseInt(id)),
          eq(cartItemsTable.userEmail, userEmail)
        )
      );

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json(
      { error: "Failed to delete from cart" },
      { status: 500 }
    );
  }
}
