import {
  Button,
  Divider,
  Input,
  Modal,
  Text,
  Loading,
} from "@nextui-org/react";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Flex } from "../styles/flex";
import AdminService from "../../services/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "./hero-banner.styled";
import { EditIcon } from "../icons/table/edit-icon";

interface AddBannerProps {
  banner?: any;
  isEdit?: boolean;
}

export const AddBanner = ({ banner, isEdit }: AddBannerProps) => {
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: banner || {
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      trustedText: "",
      studentCount: "",
      rating: "",
    },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (isEdit && banner) {
      reset(banner);
    }
  }, [isEdit, banner, reset]);

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    if (!isEdit) reset();
  };

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEdit
        ? AdminService.updateHeroBanner(banner._id, data)
        : AdminService.createHeroBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
      closeHandler();
    },
  });

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await AdminService.uploadHeroBannerImage(file);
      setValue("imageUrl", response.data.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div>
      {isEdit ? (
        <IconButton onClick={handler}>
          <EditIcon size={20} fill="#979797" />
        </IconButton>
      ) : (
        <Button auto onClick={handler}>
          Add Hero Banner
        </Button>
      )}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header css={{ justifyContent: "start" }}>
          <Text id="modal-title" h4>
            {isEdit ? "Edit Hero Banner" : "Add New Hero Banner"}
          </Text>
        </Modal.Header>
        <Divider css={{ my: "$5" }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body css={{ py: "$10" }}>
            <Flex direction="column" css={{ gap: "$8" }}>
              <Input
                {...register("title")}
                label="Title"
                bordered
                fullWidth
                size="lg"
                placeholder="Banner Title"
              />
              <Input
                {...register("subtitle")}
                label="Subtitle"
                bordered
                fullWidth
                size="lg"
                placeholder="Banner Subtitle"
              />
              <Input
                {...register("description")}
                label="Description"
                bordered
                fullWidth
                size="lg"
                placeholder="Banner Description"
              />
              <Flex css={{ gap: "$10", alignItems: "end" }}>
                <Input
                  {...register("imageUrl")}
                  label="Image URL"
                  bordered
                  fullWidth
                  size="lg"
                  placeholder="Upload an image or enter URL"
                  readOnly
                />
                <Button
                  auto
                  css={{ mb: "$2" }}
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loading type="points" color="currentColor" size="sm" />
                  ) : (
                    "Upload"
                  )}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  hidden
                  onChange={onFileUpload}
                  accept="image/*"
                  ref={fileInputRef}
                />
              </Flex>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              <Flex css={{ gap: "$10" }}>
                <Input
                  {...register("studentCount")}
                  label="Student Count"
                  bordered
                  fullWidth
                  size="lg"
                  placeholder="e.g. 1000+"
                />
                <Input
                  {...register("rating")}
                  label="Rating"
                  bordered
                  fullWidth
                  size="lg"
                  placeholder="e.g. 4.8"
                />
              </Flex>
              <Input
                {...register("trustedText")}
                label="Trusted Text"
                bordered
                fullWidth
                size="lg"
                placeholder="Trusted by over 15K Users..."
              />
            </Flex>
          </Modal.Body>
          <Divider css={{ my: "$5" }} />
          <Modal.Footer>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button auto type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : isEdit ? (
                "Update Banner"
              ) : (
                "Add Banner"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};
