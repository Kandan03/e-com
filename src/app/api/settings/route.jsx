import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { siteSettingsTable } from "@/configs/schema";

export async function GET() {
  try {
    const settings = await db.select().from(siteSettingsTable);

    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
