import { Col, Row, Text, Tooltip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { IconButton } from "./hero-banner.styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/admin";
import { AddBanner } from "./add-banner";
import { StyledBadge } from "../table/table.styled";

interface Props {
  user: any; // Using 'user' since the original render-cell props use this name
  columnKey: string | React.Key;
}

const ActionsCell = ({ banner }: { banner: any }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteHeroBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(banner._id);
    }
  };

  return (
    <Row justify="center" align="center" css={{ gap: "$5" }}>
      <Col css={{ d: "flex", width: "auto" }}>
        <Tooltip content="Edit Banner" color="primary">
          <AddBanner banner={banner} isEdit />
        </Tooltip>
      </Col>
      <Col css={{ d: "flex", width: "auto" }}>
        <Tooltip content="Delete Banner" color="error">
          <IconButton
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <DeleteIcon fill="#FF0080" />
          </IconButton>
        </Tooltip>
      </Col>
    </Row>
  );
};

export const RenderCell = ({ user: banner, columnKey }: Props) => {
  switch (columnKey) {
    case "videoUrl":
      return (
        <div style={{ borderRadius: "8px", overflow: "hidden", width: "120px", height: "70px", background: "#000" }}>
          {banner.videoUrl ? (
            <video
              src={banner.videoUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              loop
              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
              onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#666", fontSize: "12px" }}>
              No Video
            </div>
          )}
        </div>
      );
    case "isActive":
      return (
        <StyledBadge type={banner.isActive ? "active" : "paused"}>
          {banner.isActive ? "Active" : "Inactive"}
        </StyledBadge>
      );
    case "actions":
      return <ActionsCell banner={banner} />;
    default:
      return <span>{banner[columnKey as string]}</span>;
  }
};
