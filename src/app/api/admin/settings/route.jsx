import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { siteSettingsTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { isAdmin } = await checkAdminAuth();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const settings = await req.json();

    for (const [key, value] of Object.entries(settings)) {
      const existing = await db
        .select()
        .from(siteSettingsTable)
        .where(eq(siteSettingsTable.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteSettingsTable)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettingsTable.key, key));
      } else {
        await db.insert(siteSettingsTable).values({ key, value });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
