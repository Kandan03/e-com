import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { ticketsTable, ticketMessagesTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("id");

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

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
      .where(eq(ticketsTable.userEmail, userEmail))
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

export async function POST(req) {
  try {
    const data = await req.json();
    const { userEmail, userName, subject, message, priority } = data;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const ticket = await db
      .insert(ticketsTable)
      .values({
        userEmail,
        userName,
        subject,
        priority: priority || "medium",
        status: "open",
      })
      .returning();

    await db.insert(ticketMessagesTable).values({
      ticketId: ticket[0].id,
      senderEmail: userEmail,
      senderName: userName,
      message,
      isAdmin: false,
    });

    return NextResponse.json(ticket[0]);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    const result = await db
      .update(ticketsTable)
      .set({ 
        status,
        updatedAt: new Date(),
      })
      .where(eq(ticketsTable.id, id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
