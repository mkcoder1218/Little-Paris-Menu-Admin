"use client";

import { useState, useEffect, useRef } from "react";
import { MenuItem, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  Pencil,
  Trash2,
  Plus,
  GripVertical,
  Camera,
  Image,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Imports removed as we switched to server-side upload
import {
  addItemFirebase,
  deleteItemFirebase,
  fetchItems,
  updateItemFirebase,
  updateItemsOrderFirebase,
} from "@/lib/menuService";

import { compressImage } from "@/lib/uploadUtils";

interface ItemListProps {
  categories: Category[];
}

// Sortable Item Component
function SortableItem({
  item,
  categoryName,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  categoryName: string;
  onEdit: (i: MenuItem) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="mb-2 touch-none">
      <Card>
        <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-500 hover:text-slate-300 p-1 hidden sm:block"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="h-14 w-14 sm:h-12 sm:w-12 bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-800 text-slate-600">
                <Image className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate text-slate-100 text-sm sm:text-base">{item.name}</h4>
            <div className="text-xs sm:text-sm text-slate-400 flex flex-wrap gap-1 sm:gap-2 items-center">
              <span className="font-semibold text-slate-200">
                ETB {item.price.toFixed(2)}
              </span>
              <span className="truncate max-w-[80px] sm:max-w-[100px]">{categoryName}</span>
              <span>★ {item.rating}</span>
            </div>
          </div>
          <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
            <Button size="icon" variant="ghost" onClick={() => onEdit(item)} className="h-8 w-8 sm:h-10 sm:w-10">
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 hover:text-slate-200" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 hover:text-red-300" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ItemList({ categories }: ItemListProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageSourceChoice, setShowImageSourceChoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    rating: 5,
    image: "",
    categoryId: categories[0]?.id || "",
  });

  // Load items
  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchItems();
        setItems(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (error) {
        console.error("Failed to load items:", error);
      }
    }
    loadItems();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    try {
      await updateItemsOrderFirebase(newItems);
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // No size validation needed - we compress automatically
    
    setLoading(true);
    try {
      // Compress and convert to base64
      const base64String = await compressImage(file);

      setImagePreview(base64String);
      setFormData({ ...formData, image: base64String });
    } catch (err: any) {
      console.error("Image processing failed", err);
      alert(`Failed to process image: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      rating: 5,
      image: "",
      categoryId: categories[0]?.id || "",
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setImagePreview(item.image || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === undefined || !formData.categoryId) {
      console.error("Validation failed", formData);
      return;
    }
    setLoading(true);
    try {
      console.log("Starting save process...", formData);
      if (editingItem) {
        console.log("Updating existing item:", editingItem.id);
        const updated = { ...editingItem, ...formData } as MenuItem;
        setItems(items.map((i) => (i.id === editingItem.id ? updated : i)));
        await updateItemFirebase(editingItem.id, formData);
        console.log("Item updated successfully");
      } else {
        console.log("Adding new item...");
        const added = await addItemFirebase(formData as Omit<MenuItem, "id">);
        console.log("Item added successfully:", added);
        setItems([...items, added]);
      }
      console.log("Closing modal...");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save item:", err);
      console.error("Error details:", err.message, err.stack);
      alert(`Failed to save item: ${err.message}`);
    } finally {
      console.log("Save process complete");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      setItems(items.filter((i) => i.id !== id));
      await deleteItemFirebase(id);
    } catch (err) {
      console.error("Failed to delete item", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={openAddModal} disabled={categories.length === 0}>
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>
      {categories.length === 0 && (
        <p className="text-red-500 text-sm">Please create categories first.</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              categoryName={
                categories.find((c) => c.id === item.categoryId)?.name ||
                "Unknown"
              }
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Item" : "Add Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-10 sm:h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="flex min-h-[80px] sm:min-h-[100px] w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              placeholder="Enter item description (optional)"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="h-10 sm:h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value),
                  })
                }
                className="h-10 sm:h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="flex h-10 sm:h-11 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            {imagePreview && (
              <div className="w-full h-40 sm:h-48 relative">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: "" });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.setAttribute('capture', 'environment');
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Reuse existing handler
                      handleImageChange({ target: { files: [file] } } as any);
                    }
                  };
                  input.click();
                }}
                className="flex-1 h-10 sm:h-11"
              >
                <Camera className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-sm sm:text-base">Camera</span>
              </Button>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-10 sm:h-11"
              >
                <Image className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-sm sm:text-base">Device</span>
              </Button>
            </div>
            <input
              ref={cameraInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto h-10 sm:h-11"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto h-10 sm:h-11">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
