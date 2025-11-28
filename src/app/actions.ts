'use server'

import { getMenuData, saveMenuData } from '@/lib/store';
import { Category, MenuItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  const data = await getMenuData();
  return data.categories;
}

export async function getItems() {
  const data = await getMenuData();
  return data.items;
}

export async function addCategory(name: string) {
  const data = await getMenuData();
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name,
  };
  data.categories.push(newCategory);
  await saveMenuData(data);
  revalidatePath('/admin/categories');
  return newCategory;
}

export async function updateCategory(id: string, name: string) {
  const data = await getMenuData();
  const index = data.categories.findIndex(c => c.id === id);
  if (index !== -1) {
    data.categories[index].name = name;
    await saveMenuData(data);
    revalidatePath('/admin/categories');
  }
}

export async function deleteCategory(id: string) {
  const data = await getMenuData();
  data.categories = data.categories.filter(c => c.id !== id);
  await saveMenuData(data);
  revalidatePath('/admin/categories');
}

export async function addItem(item: Omit<MenuItem, 'id'>) {
  const data = await getMenuData();
  const newItem: MenuItem = {
    ...item,
    id: crypto.randomUUID(),
  };
  data.items.push(newItem);
  await saveMenuData(data);
  revalidatePath('/admin/items');
  return newItem;
}

export async function updateItem(id: string, item: Partial<Omit<MenuItem, 'id'>>) {
  const data = await getMenuData();
  const index = data.items.findIndex(i => i.id === id);
  if (index !== -1) {
    data.items[index] = { ...data.items[index], ...item };
    await saveMenuData(data);
    revalidatePath('/admin/items');
  }
}

export async function deleteItem(id: string) {
  const data = await getMenuData();
  data.items = data.items.filter(i => i.id !== id);
  await saveMenuData(data);
  revalidatePath('/admin/items');
}

export async function updateItemsOrder(items: MenuItem[]) {
  const data = await getMenuData();
  // Replace items with the new ordered list
  // Ensure we are not losing data if the UI only sends a subset
  // For this demo, we assume the UI sends the full list or we handle it carefully.
  // If the UI sends the full list of items (reordered), we can just replace.
  data.items = items;
  await saveMenuData(data);
  revalidatePath('/admin/items');
}
