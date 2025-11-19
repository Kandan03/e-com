import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { ordersTable } from "@/configs/schema";
import { sql, gte } from "drizzle-orm";

export async function GET() {
  try {
    const { isAdmin } = await checkAdminAuth();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Total revenue and order count
    const [totalStats] = await db
      .select({
        totalRevenue: sql`COALESCE(SUM(CAST(${ordersTable.totalAmount} AS NUMERIC)), 0)`,
        totalOrders: sql`COUNT(*)`,
      })
      .from(ordersTable);

    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayStats] = await db
      .select({
        todayRevenue: sql`COALESCE(SUM(CAST(${ordersTable.totalAmount} AS NUMERIC)), 0)`,
      })
      .from(ordersTable)
      .where(gte(ordersTable.createdAt, today));

    const totalRevenue = Number(totalStats.totalRevenue);
    const totalOrders = Number(totalStats.totalOrders);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      todayRevenue: Number(todayStats.todayRevenue),
    });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return NextResponse.json({ error: "Failed to fetch payment stats" }, { status: 500 });
  }
}
