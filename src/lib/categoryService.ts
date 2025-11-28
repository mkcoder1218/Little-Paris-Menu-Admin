// src/lib/categoryService.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const categoryCollection = collection(db, "categories");

// Cache for categories
let categoriesCache: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const addCategory = async (name: string) => {
  const docRef = await addDoc(categoryCollection, { name });
  // Invalidate cache
  categoriesCache = null;
  return docRef.id;
};

export const getCategories = async () => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log("Returning cached categories");
    return categoriesCache;
  }
  
  console.log("Fetching categories from Firestore");
  const snapshot = await getDocs(categoryCollection);
  categoriesCache = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  cacheTimestamp = now;
  
  return categoriesCache;
};

export const updateCategory = async (id: string, name: string) => {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, { name });
  // Invalidate cache
  categoriesCache = null;
};

export const deleteCategory = async (id: string) => {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
  // Invalidate cache
  categoriesCache = null;
};

// Manual cache invalidation function
export const invalidateCategoriesCache = () => {
  categoriesCache = null;
  cacheTimestamp = 0;
};
