import { adminDb } from "@/lib/firebaseAdmin";
import { Category } from "@/lib/types";

export const getCategoriesAdmin = async (): Promise<Category[]> => {
  try {
    const snapshot = await adminDb.collection("categories").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories with admin SDK:", error);
    return [];
  }
};
