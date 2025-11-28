import DishUploadForm from "@/components/admin/DishUploadForm";

export default function AddDishPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Upload new dishes to the menu</p>
        </div>
        <DishUploadForm />
      </div>
    </div>
  );
}
