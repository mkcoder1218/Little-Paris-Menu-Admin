"use client";

import { useState, useEffect } from "react";
import { Category } from "@/lib/types";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

// Firebase-backed actions
const categoryCollection = collection(db, "categories");

const fetchCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(categoryCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

const createCategory = async (name: string): Promise<Category> => {
  const docRef = await addDoc(categoryCollection, { name });
  return { id: docRef.id, name };
};

const updateCategoryFirebase = async (id: string, name: string) => {
  const docRef = doc(db, "categories", id);
  await updateDoc(docRef, { name });
};

const deleteCategoryFirebase = async (id: string) => {
  const docRef = doc(db, "categories", id);
  await deleteDoc(docRef);
};

interface CategoryListProps {
  initialCategories?: Category[];
}

export function CategoryList({ initialCategories = [] }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    // Initial load from Firebase if initialCategories empty
    if (!initialCategories.length) {
      fetchCategories().then(setCategories);
    }
  }, [initialCategories]);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    console.log("Adding category:", newCategoryName);
    try {
      const added = await createCategory(newCategoryName);
      console.log("Category added successfully:", added);
      setCategories([...categories, added]); // Optimistic UI update
      setNewCategoryName("");
    } catch (err: any) {
      console.error("Failed to add category:", err);
      alert(`Failed to add category: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    const oldCategories = categories;
    setCategories(categories.filter((c) => c.id !== id));
    try {
      await deleteCategoryFirebase(id);
    } catch (e) {
      setCategories(oldCategories); // rollback if error
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;

    const oldCategories = categories;
    setCategories(
      categories.map((c) => (c.id === editingId ? { ...c, name: editName } : c))
    );
    setEditingId(null);

    try {
      await updateCategoryFirebase(editingId, editName);
    } catch (e) {
      setCategories(oldCategories);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
        <Input
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-full"
        />
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <Button size="icon" variant="ghost" onClick={saveEdit}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-slate-100">
                        {category.name}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEdit(category)}
                        >
                          <Pencil className="h-4 w-4 text-slate-400 hover:text-slate-200" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
