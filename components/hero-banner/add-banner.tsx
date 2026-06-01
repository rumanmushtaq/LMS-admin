import {
  Button,
  Divider,
  Input,
  Modal,
  Text,
  Loading,
  Switch,
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
      videoUrl: "",
      isActive: true,
    },
  });

  const videoUrl = watch("videoUrl");
  const isActive = watch("isActive");

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
      const response = await AdminService.uploadHeroBannerVideo(file);
      setValue("videoUrl", response.data.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Video upload failed");
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
        <Button
          auto
          onClick={handler}
          css={{
            bg: "$primary",
            borderRadius: "12px",
            px: "$12",
            fontWeight: "$bold",
            boxShadow: "$md",
          }}
        >
          + Add New Banner
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
              <Flex css={{ gap: "$10", alignItems: "end" }}>
                <Input
                  {...register("videoUrl")}
                  label="Video URL"
                  bordered
                  fullWidth
                  size="lg"
                  placeholder="Upload a video or enter URL"
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
                  accept="video/*"
                  ref={fileInputRef}
                />
              </Flex>
              {videoUrl && (
                <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}>
                  <video
                    src={videoUrl}
                    controls
                    style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              )}
              <Flex align="center" justify="between" css={{ mt: "$2" }}>
                <Text size={16}>Active Status</Text>
                <Switch
                  checked={isActive}
                  onChange={(e) => setValue("isActive", e.target.checked)}
                />
              </Flex>
            </Flex>
          </Modal.Body>
          <Divider css={{ my: "$5" }} />
          <Modal.Footer css={{ pb: "$8" }}>
            <Button
              auto
              flat
              color="error"
              onClick={closeHandler}
              css={{ borderRadius: "10px" }}
            >
              Cancel
            </Button>
            <Button
              auto
              type="submit"
              disabled={mutation.isPending}
              css={{
                bg: "$primary",
                borderRadius: "10px",
                px: "$10",
              }}
            >
              {mutation.isPending ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Banner"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};
