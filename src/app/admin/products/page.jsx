import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { productsTable, usersTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import ProductManagementClient from "./_components/ProductManagementClient";

const AdminProductsPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  const products = await db
    .select({
      id: productsTable.id,
      title: productsTable.title,
      price: productsTable.price,
      description: productsTable.description,
      category: productsTable.category,
      imageUrl: productsTable.imageUrl,
      fileUrl: productsTable.fileUrl,
      isFeatured: productsTable.isFeatured,
      createdBy: productsTable.createdBy,
      user: {
        name: usersTable.name,
        email: usersTable.email,
        image: usersTable.image,
      },
    })
    .from(productsTable)
    .leftJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
    .orderBy(desc(productsTable.id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Product Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all platform products</p>
      </div>

      <ProductManagementClient products={products} />
    </div>
  );
};

export default AdminProductsPage;
