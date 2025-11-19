import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/api/adminAuth";

export async function GET() {
  try {
    const { isAdmin } = await checkAdminAuth();
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
