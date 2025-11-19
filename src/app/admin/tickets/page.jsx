import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { ticketsTable, ticketMessagesTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import TicketManagementClient from "./_components/TicketManagementClient";

const AdminTicketsPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch all tickets
  const tickets = await db
    .select()
    .from(ticketsTable)
    .orderBy(desc(ticketsTable.updatedAt));

  // Fetch messages for each ticket
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Ticket Management</h1>
        <p className="text-gray-600 mt-2">Manage customer support tickets and conversations</p>
      </div>

      <TicketManagementClient tickets={ticketsWithMessages} />
    </div>
  );
};

export default AdminTicketsPage;
