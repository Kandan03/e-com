import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { desc } from "drizzle-orm";
import UserManagementClient from "./_components/UserManagementClient";

const UsersPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">User Management</h1>
        <p className="text-gray-600 mt-2">Manage platform users and permissions</p>
      </div>

      <UserManagementClient users={users} />
    </div>
  );
};

export default UsersPage;
