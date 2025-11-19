import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { categoriesTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.isActive, true))
      .orderBy(categoriesTable.name);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json([], { status: 500 });
  }
}
