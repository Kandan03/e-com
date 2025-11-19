import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function checkAdminAuth() {
  const user = await currentUser();
  
  if (!user) {
    return { isAdmin: false, user: null };
  }

  const email = user.primaryEmailAddress?.emailAddress;
  
  if (!email) {
    return { isAdmin: false, user: null };
  }

  try {
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (dbUser.length > 0 && dbUser[0].isAdmin) {
      return { isAdmin: true, user: dbUser[0] };
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
  }

  return { isAdmin: false, user: null };
}
