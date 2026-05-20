import { Button, Input, Modal, Switch, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Flex } from "../styles/flex";
import { categoriesService } from "../../services/categories";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editingCategory?: any;
}

export const AddCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingCategory,
}: Props) => {
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setTitle(editingCategory.title);
      setIsActive(editingCategory.isActive);
    } else {
      setTitle("");
      setIsActive(true);
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("isActive", String(isActive));
      if (image) {
        formData.append("image", image);
      }

      if (editingCategory) {
        await categoriesService.update(editingCategory._id, formData);
        onSuccess("Category updated successfully");
      } else {
        await categoriesService.create(formData);
        onSuccess("Category created successfully");
      }
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18} b>
          {editingCategory ? "Edit Category" : "Add New Category"}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Flex direction={"column"} css={{ gap: "$10" }}>
          <Input
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Men's Fashion"
          />

          <Flex align={"center"} justify={"between"} css={{ mt: "$5" }}>
            <Text>Category Status (Active/Inactive)</Text>
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Flex>
          <Flex direction={"column"} css={{ gap: "$2" }}>
            <Text size={"$sm"}>Category Image</Text>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {editingCategory?.image && !image && (
              <Text size={"$xs"} color="grey">
                Current image will be kept if none selected.
              </Text>
            )}
          </Flex>
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Close
        </Button>
        <Button auto onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : editingCategory ? "Update" : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
