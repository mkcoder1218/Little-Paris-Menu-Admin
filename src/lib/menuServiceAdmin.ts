import { adminDb } from "@/lib/firebaseAdmin";
import { MenuItem } from "@/lib/types";

export const fetchItemsAdmin = async (): Promise<MenuItem[]> => {
  try {
    const snapshot = await adminDb.collection("menu").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
  } catch (error) {
    console.error("Error fetching items with admin SDK:", error);
    return [];
  }
};
