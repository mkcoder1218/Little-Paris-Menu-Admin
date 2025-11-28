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

// Cache for menu items
let itemsCache: MenuItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Fetch all menu items
export const fetchItems = async (): Promise<MenuItem[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (itemsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log("Returning cached menu items");
    return itemsCache;
  }
  
  console.log("Fetching menu items from Firestore");
  const snapshot = await getDocs(menuCollection);
  itemsCache = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as MenuItem)
  );
  cacheTimestamp = now;
  
  return itemsCache;
};

// Add new item
export const addItemFirebase = async (
  item: Omit<MenuItem, "id">
): Promise<MenuItem> => {
  // Store the item with base64 image directly
  const docRef = await addDoc(menuCollection, item);
  // Invalidate cache
  itemsCache = null;
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
  // Invalidate cache
  itemsCache = null;
};

// Delete item
export const deleteItemFirebase = async (id: string) => {
  const docRef = doc(db, "menu", id);
  await deleteDoc(docRef);
  // Invalidate cache
  itemsCache = null;
};

// Update order of items
export const updateItemsOrderFirebase = async (items: MenuItem[]) => {
  const batch = writeBatch(db);
  items.forEach((item, index) => {
    const docRef = doc(db, "menu", item.id);
    batch.update(docRef, { order: index });
  });
  await batch.commit();
  // Invalidate cache
  itemsCache = null;
};

// Manual cache invalidation function
export const invalidateItemsCache = () => {
  itemsCache = null;
  cacheTimestamp = 0;
};

