import { ItemList } from "@/components/admin/item-list";
import { getCategoriesAdmin } from "@/lib/categoryServiceAdmin";
import { fetchItemsAdmin } from "@/lib/menuServiceAdmin";

export const dynamic = 'force-dynamic';

export default async function ItemsPage() {
  const items = await fetchItemsAdmin();
  const categories = await getCategoriesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">
          Menu Items
        </h2>
      </div>
      <ItemList categories={categories} />
    </div>
  );
}

