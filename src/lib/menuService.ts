// src/lib/menuService.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { MenuItem } from "./types";

const menuCollection = collection(db, "menu");

// Fetch all menu items
export const fetchItems = async (): Promise<MenuItem[]> => {
  console.log("Fetching menu items from Firestore");
  const snapshot = await getDocs(menuCollection);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as MenuItem)
  );
};

// Add new item
export const addItemFirebase = async (
  item: Omit<MenuItem, "id">
): Promise<MenuItem> => {
  // Store the item with base64 image directly
  const docRef = await addDoc(menuCollection, item);
  return { id: docRef.id, ...item };
};

// Update existing item
export const updateItemFirebase = async (
  id: string,
  data: Partial<MenuItem>
) => {
  // Store the updated data with base64 image directly
  const docRef = doc(db, "menu", id);
  await updateDoc(docRef, data);
};

// Delete item
export const deleteItemFirebase = async (id: string) => {
  const docRef = doc(db, "menu", id);
  await deleteDoc(docRef);
};

// Update order of items
export const updateItemsOrderFirebase = async (items: MenuItem[]) => {
  const batch = writeBatch(db);
  items.forEach((item, index) => {
    const docRef = doc(db, "menu", item.id);
    batch.update(docRef, { order: index });
  });
  await batch.commit();
};


