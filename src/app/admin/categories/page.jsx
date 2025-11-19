import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { categoriesTable } from "@/configs/schema";
import { desc } from "drizzle-orm";
import CategoryManagementClient from "./_components/CategoryManagementClient";

const CategoriesPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  const categories = await db.select().from(categoriesTable).orderBy(desc(categoriesTable.createdAt));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Category Management</h1>
        <p className="text-gray-600 mt-2">Organize and manage product categories</p>
      </div>

      <CategoryManagementClient categories={categories} />
    </div>
  );
};

export default CategoriesPage;
