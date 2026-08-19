"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  ChevronDown,
  Search,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

import { useEffect, useCallback, useRef } from "react";
import adminService from "../../services/admin";
import { Spinner } from "@nextui-org/react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  tags?: string[];
  isActive: boolean;
}

export default function ProductTable() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters State
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Search debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search/filter
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchProducts = useCallback(
    async (page: number, limit: number, searchTerm: string, size: string, status: string) => {
      try {
        setLoading(true);
        const isActive =
          status === "active"
            ? true
            : status === "inactive"
              ? false
              : undefined;

        const response = await adminService.getProducts({
          page,
          limit,
          search: searchTerm,
          size: size || undefined,
          isActive,
        });

        if (response && response.success && response.data) {
          const productData = response.data;
          if (Array.isArray(productData.data)) {
            setProducts(productData.data);
            setTotalCount(productData.totalCount);
            setTotalPages(productData.totalPages);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts(currentPage, entriesPerPage, debouncedSearch, selectedSize, selectedStatus);
  }, [
    currentPage,
    entriesPerPage,
    debouncedSearch,
    selectedSize,
    selectedStatus,
    fetchProducts,
  ]);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await adminService.permanentDeleteProduct(productToDelete);
      fetchProducts(currentPage, entriesPerPage, debouncedSearch, selectedSize, selectedStatus);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await adminService.toggleProductStatus(id, !currentStatus);
      fetchProducts(currentPage, entriesPerPage, debouncedSearch, selectedSize, selectedStatus);
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <header className="h-16 bg-white/70 backdrop-blur-md border-b flex items-center justify-between px-6 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-purple-600" />
        </button>

        <h5 className="text-lg font-semibold text-purple-700">Product</h5>

        <button
          onClick={() => router.push("/create-product")}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </header>

      <div className="p-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products by name or description..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white text-gray-600 appearance-none min-w-[120px]"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="SMALL">SMALL</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LARGE">LARGE</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-white text-gray-600 appearance-none min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 flex justify-center">
              <Spinner size="lg" color="secondary" />
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-[#f4f4f5] text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Sizing</th>
                    <th className="p-3 text-left">Tags</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        <Image
                          src={p.images[0] || "/images/placeholder.png"}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover border"
                        />
                      </td>

                      <td className="p-3 font-medium text-gray-800">
                        {p.title}
                      </td>

                      <td className="p-3 text-gray-500 max-w-[200px]">
                        <div
                          className="truncate text-ellipsis overflow-hidden whitespace-nowrap"
                          dangerouslySetInnerHTML={{ __html: p.description }}
                        />
                      </td>

                      <td className="p-3 font-semibold text-purple-600">
                        ${p.price}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes && p.sizes.length > 0 ? (
                            p.sizes.map((size, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-200"
                              >
                                {size}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic text-xs">
                              No sizes
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {p.tags && p.tags.length > 0 ? (
                            p.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic text-xs">
                              No tags
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => toggleStatus(p._id, p.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            p.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => toggleStatus(p._id, p.isActive)}
                          className={`p-2 rounded-lg transition ${
                            p.isActive
                              ? "hover:bg-amber-100 text-amber-600"
                              : "hover:bg-green-100 text-green-600"
                          }`}
                          title={p.isActive ? "Deactivate" : "Activate"}
                        >
                          {p.isActive ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/edit-product/${p._id}`)}
                          className="p-2 rounded-lg hover:bg-purple-100 text-purple-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p._id)}
                          className="p-2 rounded-lg hover:bg-pink-100 text-pink-600"
                          title="Permanent Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-10 text-center text-gray-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {products.length} of {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-600"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
