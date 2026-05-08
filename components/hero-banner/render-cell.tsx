import { Col, Row, User, Text, Tooltip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { IconButton } from "./hero-banner.styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/admin";
import { AddBanner } from "./add-banner";
import { Flex } from "../styles/flex";
import { Star } from "lucide-react";

interface Props {
  user: any; // Using 'user' since the original render-cell props use this name
  columnKey: string | React.Key;
}

export const RenderCell = ({ user: banner, columnKey }: Props) => {
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

  switch (columnKey) {
    case "title":
      return (
        <User
          src={banner.imageUrl}
          name={banner.title}
          description={banner._id}
          css={{ p: 0 }}
          squared
        />
      );
    case "subtitle":
      return (
        <Col>
          <Row>
            <Text b size={14} css={{ lineHeight: "$md", maxW: "250px" }}>
              {banner.subtitle}
            </Text>
          </Row>
        </Col>
      );
    case "studentCount":
      return (
        <Text size={14} css={{ fontWeight: "$semibold", color: "$accents7" }}>
          {banner.studentCount} Students
        </Text>
      );
    case "rating":
      return (
        <Flex align="center" css={{ gap: "$2" }}>
          <Star className="w-4 h-4 text-warning" fill="currentColor" />
          <Text size={14} b>
            {banner.rating}
          </Text>
        </Flex>
      );
    case "actions":
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
    default:
      return <span>{banner[columnKey as string]}</span>;
  }
};
