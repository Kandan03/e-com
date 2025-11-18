import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { usersTable } from "../../../../configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const { user } = await req.json();

  const userData = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user?.primaryEmailAddress.emailAddress));

  if (userData?.length <= 0) {
    // Create new user
    const result = await db
      .insert(usersTable)
      .values({
        name: user?.fullName,
        email: user?.primaryEmailAddress.emailAddress,
        image: user?.imageUrl,
      })
      .returning(usersTable);
    return NextResponse.json(result[0]);
  } else {
    // Update existing user
    const result = await db
      .update(usersTable)
      .set({
        name: user?.fullName,
        image: user?.imageUrl,
      })
      .where(eq(usersTable.email, user?.primaryEmailAddress.emailAddress))
      .returning(usersTable);
    return NextResponse.json(result[0]);
  }
}
