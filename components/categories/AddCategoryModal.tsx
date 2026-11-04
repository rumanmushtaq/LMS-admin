import { Button, Input, Modal, Switch, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingCategory) {
      setTitle(editingCategory.title);
      setIsActive(editingCategory.isActive);
    } else {
      setTitle("");
      setIsActive(true);
    }
  }, [editingCategory, isOpen]);

  const mutation = useMutation({
    mutationFn: ({ id, formData }: { id?: string; formData: FormData }) =>
      id
        ? categoriesService.update(id, formData)
        : categoriesService.create(formData),
    onSuccess: (saved, { id }) => {
      // Put the saved category into the list right away, then quietly
      // re-sync ["categories"] in the background — the grid never blanks.
      if (saved?._id) {
        queryClient.setQueryData<any[]>(["categories"], (old) =>
          old
            ? id
              ? old.map((c) => (c._id === id ? { ...c, ...saved } : c))
              : [...old, saved]
            : old,
        );
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      onSuccess(
        id ? "Category updated successfully" : "Category created successfully",
      );
      onClose();
    },
    onError: (error) => {
      console.error("Error saving category:", error);
    },
  });
  const isLoading = mutation.isPending;

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("isActive", String(isActive));
    if (image) {
      formData.append("image", image);
    }

    mutation.mutate({ id: editingCategory?._id, formData });
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
