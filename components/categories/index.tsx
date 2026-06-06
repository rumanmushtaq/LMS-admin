import { Button, Input, Table, Tooltip, User } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Flex } from "../styles/flex";
import { Box } from "../styles/box";
import { EditIcon } from "../icons/table/edit-icon";
import { DeleteIcon } from "../icons/table/delete-icon";
import { CategoryIcon } from "../icons/sidebar/category-icon";
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
    <Flex
      css={{
        mt: "$5",
        px: "$6",
        "@sm": { mt: "$10", px: "$16" },
      }}
      justify={"center"}
      direction={"column"}
    >
      <Flex justify="between" align="center" css={{ mb: "$8" }}>
        <Flex align="center" css={{ gap: "$5" }}>
          <CategoryIcon />
          <Box as="h3" css={{ m: 0 }}>
            Category Management
          </Box>
        </Flex>
        <Button auto onClick={handleAddClick}>
          Add Category
        </Button>
      </Flex>

      <Table
        aria-label="Category table"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <Table.Header>
          <Table.Column>CATEGORY</Table.Column>
          <Table.Column>STATUS</Table.Column>
          <Table.Column>ACTIONS</Table.Column>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category._id}>
              <Table.Cell>
                <User
                  src={category.image}
                  name={category.title}
                  css={{ p: 0 }}
                />
              </Table.Cell>
              <Table.Cell>
                <Box
                  as="span"
                  css={{
                    borderRadius: "$xs",
                    px: "$3",
                    py: "$1",
                    fontSize: "$xs",
                    fontWeight: "$bold",
                    bg: category.isActive ? "$successLight" : "$errorLight",
                    color: category.isActive ? "$success" : "$error",
                  }}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Box>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" css={{ gap: "$5" }}>
                  <Tooltip content="Edit category">
                    <button onClick={() => handleEditClick(category)}>
                      <EditIcon size={20} fill="#979797" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete category" color="error">
                    <button onClick={() => handleDeleteClick(category._id)}>
                      <DeleteIcon size={20} fill="#FF0080" />
                    </button>
                  </Tooltip>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

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
    </Flex>
  );
};

export default CategoriesView;
