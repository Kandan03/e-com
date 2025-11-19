import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { ticketsTable, ticketMessagesTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { isAdmin } = await checkAdminAuth();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("id");

    if (ticketId) {
      const ticket = await db
        .select()
        .from(ticketsTable)
        .where(eq(ticketsTable.id, parseInt(ticketId)))
        .limit(1);

      if (ticket.length === 0) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      const messages = await db
        .select()
        .from(ticketMessagesTable)
        .where(eq(ticketMessagesTable.ticketId, parseInt(ticketId)))
        .orderBy(ticketMessagesTable.createdAt);

      return NextResponse.json({ ...ticket[0], messages });
    }

    const tickets = await db
      .select()
      .from(ticketsTable)
      .orderBy(desc(ticketsTable.updatedAt));

    const ticketsWithMessages = await Promise.all(
      tickets.map(async (ticket) => {
        const messages = await db
          .select()
          .from(ticketMessagesTable)
          .where(eq(ticketMessagesTable.ticketId, ticket.id))
          .orderBy(ticketMessagesTable.createdAt);
        
        return { ...ticket, messages };
      })
    );

    return NextResponse.json(ticketsWithMessages);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
