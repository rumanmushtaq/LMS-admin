import { Col, Row, User, Text, Tooltip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { IconButton } from "./hero-banner.styled";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/admin";
import { AddBanner } from "./add-banner";
import { Flex } from "../styles/flex";

interface Props {
  user: any; // Using 'user' since the original render-cell props use this name
  columnKey: string | React.Key;
}

export const RenderCell = ({ user, columnKey }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteHeroBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(user._id);
    }
  };

  switch (columnKey) {
    case "title":
      return (
        <User src={user.imageUrl} name={user.title} css={{ p: 0 }}>
          {user._id}
        </User>
      );
    case "subtitle":
      return (
        <Col>
          <Row>
            <Text b size={14} css={{ tt: "capitalize" }}>
              {user.subtitle}
            </Text>
          </Row>
        </Col>
      );
    case "studentCount":
      return <Text size={14}>{user.studentCount}</Text>;
    case "rating":
      return <Text size={14}>{user.rating}</Text>;
    case "actions":
      return (
        <Row justify="center" align="center">
          <Col css={{ d: "flex" }}>
            <Tooltip content="Edit Banner">
              <AddBanner banner={user} isEdit />
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Tooltip
              content="Delete Banner"
              color="error"
              onClick={handleDelete}
            >
              <IconButton>
                <DeleteIcon fill="#FF0080" />
              </IconButton>
            </Tooltip>
          </Col>
        </Row>
      );
    default:
      return <span>{user[columnKey as string]}</span>;
  }
};
