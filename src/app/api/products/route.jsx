import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../configs/firebase";
import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { productsTable } from "../../../../configs/schema";

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
    return NextResponse.json({ error: e.message || "Failed to save product" }, { status: 500 });
  }
}
