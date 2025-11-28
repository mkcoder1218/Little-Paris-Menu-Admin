import { getCategories } from '@/lib/categoryService'
import { CategoryList } from '@/components/admin/category-list'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Categories</h2>
      </div>
      <CategoryList initialCategories={categories} />
    </div>
  )
}

