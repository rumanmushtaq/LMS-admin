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
} from "lucide-react";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  status: boolean;
}

const PRODUCTS: Product[] = [
  { id: 1, image: "/images/tshirt-blue.png", title: "Classic Blue T-Shirt", description: "Comfortable and lightweight blue T-shirt.", price: 22.99, sizes: ["S","M","L","XL"], status: true },
  { id: 2, image: "/images/tshirt-red.png", title: "Classic Red T-Shirt", description: "Comfortable and lightweight red T-shirt.", price: 18.99, sizes: ["S","M","L","XL"], status: true },
  { id: 3, image: "/images/tshirt-white.png", title: "Classic White T-Shirt", description: "Comfortable and lightweight white T-shirt.", price: 18.99, sizes: ["S","M","L","XL"], status: true },
  { id: 4, image: "/images/tshirt-white2.png", title: "Stylish White T-Shirt", description: "Bright stylish white T-shirt.", price: 21.99, sizes: ["S","M","L","XL"], status: true },
  { id: 5, image: "/images/tshirt-blue.png", title: "Ocean Blue T-Shirt", description: "Cool ocean blue casual t-shirt.", price: 24.99, sizes: ["S","M","L"], status: true },
  { id: 6, image: "/images/tshirt-white.png", title: "Premium White Tee", description: "Premium quality white cotton tee.", price: 29.99, sizes: ["M","L","XL"], status: false },
];

export default function ProductTable() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"title" | "description" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [statusMap, setStatusMap] = useState(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.status]))
  );

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    if (sortField) {
      list = [...list].sort((a, b) => {
        const va = a[sortField].toLowerCase();
        const vb = b[sortField].toLowerCase();
        return sortDir === "asc"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      });
    }

    return list;
  }, [search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / entriesPerPage);

  const paginatedData = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );
  }, [filtered, currentPage, entriesPerPage]);

  const toggleSort = (field: "title" | "description") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
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

        <h5 className="text-lg font-semibold text-purple-700">
          Product 
        </h5>

        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </header>

      <div className="p-6">

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-400 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => toggleSort("title")}
                >
                  Title
                </th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td className="p-3">{p.id}</td>

                  <td className="p-3">
                    <img
                      src={p.image}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                  </td>

                  <td className="p-3 font-medium text-gray-800">
                    {p.title}
                  </td>

                  <td className="p-3 text-gray-500">
                    {p.description}
                  </td>

                  <td className="p-3 font-semibold text-purple-600">
                    ${p.price}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        setStatusMap((prev) => ({
                          ...prev,
                          [p.id]: !prev[p.id],
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        statusMap[p.id]
                          ? "bg-green-100 text-green-600"
                          : "bg-pink-100 text-pink-600"
                      }`}
                    >
                      {statusMap[p.id] ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-purple-100 text-purple-600">
                      <Pencil size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-pink-100 text-pink-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {paginatedData.length} of {filtered.length}
          </p>

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
      </div>
    </div>
  );
}