import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { ticketMessagesTable, ticketsTable, usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, message } = await req.json();
    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!ticketId || !message) {
      return NextResponse.json({ error: "Ticket ID and message are required" }, { status: 400 });
    }

    // Check if ticket exists and is not closed
    const ticket = await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, parseInt(ticketId)))
      .limit(1);

    if (!ticket || ticket.length === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket[0].status === "closed") {
      return NextResponse.json({ error: "Cannot reply to a closed ticket" }, { status: 400 });
    }

    const userData = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail))
      .limit(1);

    const isAdmin = userData[0]?.isAdmin || false;

    // Check if user owns the ticket or is admin
    if (!isAdmin && ticket[0].userEmail !== userEmail) {
      return NextResponse.json({ error: "Unauthorized to reply to this ticket" }, { status: 403 });
    }

    const newMessage = await db
      .insert(ticketMessagesTable)
      .values({
        ticketId: parseInt(ticketId),
        senderEmail: userEmail,
        senderName: user.fullName || user.firstName || "User",
        message,
        isAdmin,
      })
      .returning();

    // Update ticket timestamp and status
    // If admin replies, set to in_progress (unless already resolved)
    // If user replies, keep current status or set to open if it was resolved
    const newStatus = isAdmin 
      ? (ticket[0].status === "resolved" ? "resolved" : "in_progress")
      : (ticket[0].status === "resolved" ? "open" : ticket[0].status);

    await db
      .update(ticketsTable)
      .set({ 
        updatedAt: new Date(),
        status: newStatus,
      })
      .where(eq(ticketsTable.id, parseInt(ticketId)));

    return NextResponse.json(newMessage[0]);
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
  }
}
