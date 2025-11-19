import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { productsTable, usersTable } from "@/configs/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        ...getTableColumns(productsTable),
        user: {
          name: usersTable.name,
          image: usersTable.image,
          email: usersTable.email,
        },
      })
      .from(productsTable)
      .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
      .where(eq(productsTable.isFeatured, true))
      .orderBy(desc(productsTable.id))
      .limit(6);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json([], { status: 500 });
  }
}
