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

import { Category } from "./types";

const categoryCollection = collection(db, "categories");

export const addCategory = async (name: string) => {
  const docRef = await addDoc(categoryCollection, { name });
  return docRef.id;
};

export const getCategories = async (): Promise<Category[]> => {
  console.log("Fetching categories from Firestore");
  const snapshot = await getDocs(categoryCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
};

export const updateCategory = async (id: string, name: string) => {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, { name });
};

export const deleteCategory = async (id: string) => {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
};

