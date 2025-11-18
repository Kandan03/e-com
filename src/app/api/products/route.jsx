import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/configs/firebase";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { productsTable, usersTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";

export async function POST(req) {
  try {
    //Get FormData (Fields, Files)
    const formData = await req.formData();
    const image = formData.get("image");
    const file = formData.get("file");
    const data = JSON.parse(formData.get("data"));

    //Save Product Image to Firebase Storage
    const imageName = Date.now() + ".png";
    const storageRef = ref(storage, "file/" + imageName);

    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    //Save Product File/Document to Firebase Storage (if provided)
    let fileUrl = null;
    if (file && file.size > 0) {
      const originalName = file.name;
      const extension = originalName.substring(originalName.lastIndexOf("."));
      const fileName = Date.now().toString() + extension;
      const storageFileRef = ref(storage, "file/" + fileName);
      await uploadBytes(storageFileRef, file);
      fileUrl = await getDownloadURL(storageFileRef);
    }

    //Save FormData along With URL into Database
    const result = await db
      .insert(productsTable)
      .values({
        title: data?.title,
        category: data?.category,
        description: data.description,
        fileUrl: fileUrl,
        imageUrl: imageUrl,
        price: data?.price,
        createdBy: data?.userEmail,
      })
      .returning(productsTable);

    return NextResponse.json(result);
  } catch (e) {
    console.error("Error saving product:", e);
    return NextResponse.json(
      { error: e.message || "Failed to save product" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const limit = searchParams.get("limit");
  const id = searchParams.get("id");

  if (email) {
    const result = await db
      .select({
        ...getTableColumns(productsTable),
        user: {
          name: usersTable.name,
          image: usersTable.image,
        },
      })
      .from(productsTable)
      .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
      .where(eq(productsTable.createdBy, email))
      .orderBy(desc(productsTable.id));
    return NextResponse.json(result);
  }
  if (id) {
    const result = await db
      .select({
        ...getTableColumns(productsTable),
        user: {
          name: usersTable.name,
          image: usersTable.image,
        },
      })
      .from(productsTable)
      .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
      .where(eq(productsTable.id, id))
      .orderBy(desc(productsTable.id));

    return NextResponse.json(result[0] ?? "");
  }

  const result = await db
    .select({
      ...getTableColumns(productsTable),
      user: {
        name: usersTable.name,
        image: usersTable.image,
      },
    })
    .from(productsTable)
    .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
    .orderBy(desc(productsTable.id))
    .limit(Number(limit));

  return NextResponse.json(result);
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const user = await currentUser();
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .delete(productsTable)
      .where(
        and(
          eq(productsTable.id, productId),
          eq(productsTable.createdBy, user.primaryEmailAddress.emailAddress)
        )
      );

    return NextResponse.json({ result: result });
  } catch (e) {
    console.error("Error deleting product:", e);
    return NextResponse.json(
      { error: e.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
