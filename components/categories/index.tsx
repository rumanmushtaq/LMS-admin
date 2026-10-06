import React, { useEffect, useState } from "react";
import { Tags, Pencil, Trash2, Plus, FolderOpen } from "lucide-react";
import { categoriesService } from "../../services/categories";
import { AddCategoryModal } from "./AddCategoryModal";
import { CategoryDeleteModal } from "./CategoryDeleteModal";
import { CategorySuccessModal } from "./CategorySuccessModal";

const CategoriesView = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategoryId) return;
    try {
      await categoriesService.delete(selectedCategoryId);
      setSuccessMessage("Category deleted successfully");
      setIsSuccessModalOpen(true);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedCategoryId(null);
    }
  };

  const handleEditClick = (category: any) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
    fetchCategories();
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7047EB]/10 text-[#7047EB]">
            <Tags className="w-5 h-5" />
          </span>
          <h3 className="text-xl font-bold text-gray-800">
            Category Management
          </h3>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7047EB] px-5 py-2.5 font-bold text-white shadow-lg shadow-[#7047EB]/20 transition-all hover:bg-[#5f37d4]"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#ece9f6] bg-white p-4 animate-pulse"
            >
              <div className="h-16 w-16 rounded-full bg-gray-200 mb-3" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#e6e3f0] py-20 text-center">
          <FolderOpen className="w-10 h-10 text-gray-300" />
          <p className="font-semibold text-gray-600">No categories yet</p>
          <p className="text-sm text-gray-400">Add your first category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="group relative rounded-2xl border border-[#ece9f6] bg-white p-4 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-16 w-16 rounded-full object-cover border border-gray-100"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7047EB]/10 text-[#7047EB] font-bold text-xl">
                    {category.title?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h4 className="mt-3 font-bold text-gray-800 truncate" title={category.title}>
                {category.title}
              </h4>

              <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
                <button
                  onClick={() => handleEditClick(category)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(category._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        editingCategory={editingCategory}
      />

      <CategoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />

      <CategorySuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default CategoriesView;
