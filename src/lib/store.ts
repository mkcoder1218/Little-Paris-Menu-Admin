import fs from 'fs/promises';
import path from 'path';
import { MenuData } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

export async function getMenuData(): Promise<MenuData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading menu data:", error);
    return { categories: [], items: [] };
  }
}

export async function saveMenuData(data: MenuData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
